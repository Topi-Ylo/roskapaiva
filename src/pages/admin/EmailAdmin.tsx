import { useCallback, useEffect, useMemo, useState, type FormEvent } from 'react';
import { supabase } from '../../lib/supabase';
import {
  AdminPageHeader,
  DangerButton,
  Field,
  GhostButton,
  PrimaryButton,
  inputClass,
  selectClass,
  textareaClass,
} from '../../components/admin/admin-ui';

/**
 * Bulk e-mail to event organisers.
 *
 * RESEND FREE TIER: ~2 requests/second, 100 e-mails per day, 3000 per month.
 * The daily cap is the one that bites, so the page states the remaining
 * allowance up front and warns before a campaign that cannot finish today.
 * Sending is resumable: the function marks each recipient individually, and
 * this page keeps calling it until nothing is pending.
 */

const DAILY_CAP = 100;

type Audience = 'approved' | 'all';

interface Organizer {
  organizer_email: string;
  organizer_name: string;
  status: string;
}

interface Campaign {
  id: string;
  subject: string;
  body: string;
  audience: Audience;
  status: string;
  created_at: string;
}

interface Progress {
  total: number;
  sent: number;
  failed: number;
  remaining: number;
  note?: string;
}

export default function EmailAdmin() {
  const [organizers, setOrganizers] = useState<Organizer[]>([]);
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [counts, setCounts] = useState<Record<string, { sent: number; pending: number; failed: number }>>({});
  const [dailyRemaining, setDailyRemaining] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);

  const [subject, setSubject] = useState('');
  const [body, setBody] = useState('');
  const [audience, setAudience] = useState<Audience>('approved');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [info, setInfo] = useState<string | null>(null);
  const [progress, setProgress] = useState<Progress | null>(null);
  const [showList, setShowList] = useState(false);

  const refresh = useCallback(async () => {
    if (!supabase) return;
    setLoading(true);

    const [{ data: evs }, { data: cs }, { data: remaining }, { data: sends }] = await Promise.all([
      supabase.from('community_events').select('organizer_email, organizer_name, status'),
      supabase.from('email_campaigns').select('*').order('created_at', { ascending: false }),
      supabase.rpc('email_daily_remaining'),
      supabase.from('email_sends').select('campaign_id, status'),
    ]);

    setOrganizers((evs ?? []) as Organizer[]);
    setCampaigns((cs ?? []) as Campaign[]);
    setDailyRemaining(remaining == null ? null : Number(remaining));

    const tally: Record<string, { sent: number; pending: number; failed: number }> = {};
    (sends ?? []).forEach((s: { campaign_id: string; status: string }) => {
      tally[s.campaign_id] ??= { sent: 0, pending: 0, failed: 0 };
      if (s.status === 'sent') tally[s.campaign_id].sent += 1;
      else if (s.status === 'failed') tally[s.campaign_id].failed += 1;
      else tally[s.campaign_id].pending += 1;
    });
    setCounts(tally);
    setLoading(false);
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  /** Unique addresses for the chosen audience, newest name wins. */
  const recipients = useMemo(() => {
    const pool = audience === 'approved'
      ? organizers.filter((o) => o.status === 'approved')
      : organizers;
    const byEmail = new Map<string, string>();
    pool.forEach((o) => {
      const email = (o.organizer_email ?? '').trim().toLowerCase();
      if (email) byEmail.set(email, o.organizer_name);
    });
    return [...byEmail.entries()].map(([email, name]) => ({ email, name }));
  }, [organizers, audience]);

  const overDailyCap = recipients.length > DAILY_CAP;
  const overRemaining = dailyRemaining !== null && recipients.length > dailyRemaining;

  const send = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!supabase) return;
    if (recipients.length === 0) {
      setError('Ei vastaanottajia valitulla rajauksella.');
      return;
    }
    if (
      !confirm(
        `Lähetetään "${subject}" ${recipients.length} vastaanottajalle. Jatketaanko?`
      )
    ) {
      return;
    }

    setBusy(true);
    setError(null);
    setInfo(null);
    setProgress({ total: recipients.length, sent: 0, failed: 0, remaining: recipients.length });

    try {
      const { data: session } = await supabase.auth.getSession();
      const token = session.session?.access_token;
      if (!token) throw new Error('Istunto puuttuu. Kirjaudu uudelleen.');

      const { data: campaign, error: cErr } = await supabase
        .from('email_campaigns')
        .insert({
          subject: subject.trim(),
          body: body.trim(),
          audience,
          created_by: session.session?.user.id ?? null,
        })
        .select('id')
        .single();
      if (cErr || !campaign) throw new Error(cErr?.message ?? 'Kampanjan luonti epäonnistui.');

      // Snapshot the audience, so later sign-ups do not join a campaign midway.
      const { error: rErr } = await supabase.from('email_sends').insert(
        recipients.map((r) => ({
          campaign_id: campaign.id,
          email: r.email,
          recipient_name: r.name,
        }))
      );
      if (rErr) throw new Error(rErr.message);

      // Drive the function until nothing is pending or the day's cap is hit.
      let guard = 0;
      for (;;) {
        guard += 1;
        if (guard > 200) throw new Error('Lähetys keskeytettiin varmuuden vuoksi.');

        const res = await fetch('/.netlify/functions/send-campaign', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
          body: JSON.stringify({ campaignId: campaign.id }),
        });
        const json = await res.json();
        if (!res.ok) throw new Error(json.error ?? 'Lähetys epäonnistui.');

        setProgress((p) => ({
          total: p?.total ?? recipients.length,
          sent: (p?.sent ?? 0) + (json.sent ?? 0),
          failed: (p?.failed ?? 0) + (json.failed ?? 0),
          remaining: json.remaining ?? 0,
          note: json.note,
        }));

        if (json.remaining === 0) {
          setInfo('Kampanja lähetetty.');
          break;
        }
        if (json.dailyRemaining === 0) {
          setInfo(
            `Päivän ${DAILY_CAP} viestin raja tuli täyteen. ${json.remaining} viestiä jäi jonoon, ` +
              'jatka huomenna Jatka-painikkeella.'
          );
          break;
        }
      }

      setSubject('');
      setBody('');
      await refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Lähetys epäonnistui.');
    } finally {
      setBusy(false);
    }
  };

  /** Resume a campaign that stopped at the daily cap. */
  const resume = async (id: string) => {
    if (!supabase) return;
    setBusy(true);
    setError(null);
    setInfo(null);
    try {
      const { data: session } = await supabase.auth.getSession();
      const token = session.session?.access_token;
      if (!token) throw new Error('Istunto puuttuu.');
      for (;;) {
        const res = await fetch('/.netlify/functions/send-campaign', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
          body: JSON.stringify({ campaignId: id }),
        });
        const json = await res.json();
        if (!res.ok) throw new Error(json.error ?? 'Lähetys epäonnistui.');
        if (json.remaining === 0) { setInfo('Kampanja lähetetty.'); break; }
        if (json.dailyRemaining === 0) {
          setInfo(`Päivän raja täynnä, ${json.remaining} jäi jonoon.`);
          break;
        }
      }
      await refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Lähetys epäonnistui.');
    } finally {
      setBusy(false);
    }
  };

  const removeCampaign = async (c: Campaign) => {
    if (!supabase) return;
    if (!confirm(`Poistetaanko kampanja "${c.subject}"? Lähetettyjä viestejä ei voi perua.`)) return;
    await supabase.from('email_campaigns').delete().eq('id', c.id);
    await refresh();
  };

  const copyList = async () => {
    await navigator.clipboard.writeText(recipients.map((r) => r.email).join(', '));
    setInfo('Osoitteet kopioitu leikepöydälle.');
  };

  return (
    <div className="mx-auto max-w-5xl">
      <AdminPageHeader eyebrow="Viestintä" title="Joukkoposti" />

      {/* Allowance */}
      <div className="rounded-lg border border-cream/10 bg-forest-deep p-6">
        <div className="flex flex-wrap items-baseline justify-between gap-4">
          <div>
            <p className="font-display text-2xl text-cream">Vastaanottajat</p>
            <p className="mt-1 text-sm text-cream/55">
              Tapahtumien ilmoittajat, sähköpostit yhdistettynä.
            </p>
          </div>
          <div className="text-right">
            <p className="font-display text-3xl text-amber">{recipients.length}</p>
            <p className="eyebrow text-cream/45">osoitetta</p>
          </div>
        </div>

        <div className="mt-5 flex flex-wrap items-center gap-3">
          <select
            value={audience}
            onChange={(e) => setAudience(e.target.value as Audience)}
            className={`${selectClass} max-w-xs`}
          >
            <option value="approved">Vain julkaistut tapahtumat</option>
            <option value="all">Kaikki ilmoittajat</option>
          </select>
          <GhostButton onClick={() => setShowList((v) => !v)}>
            {showList ? 'Piilota lista' : 'Näytä lista'}
          </GhostButton>
          <GhostButton onClick={copyList}>Kopioi osoitteet</GhostButton>
          <span className="text-sm text-cream/55">
            Päivän kiintiötä jäljellä:{' '}
            <span className={dailyRemaining === 0 ? 'text-red-400' : 'text-cream'}>
              {dailyRemaining ?? '–'} / {DAILY_CAP}
            </span>
          </span>
        </div>

        {showList && (
          <div className="no-scrollbar mt-4 max-h-64 overflow-y-auto rounded border border-cream/10">
            {recipients.length === 0 ? (
              <p className="p-4 text-sm text-cream/45">Ei vastaanottajia.</p>
            ) : (
              <ul className="divide-y divide-cream/10">
                {recipients.map((r) => (
                  <li key={r.email} className="flex items-center justify-between px-4 py-2 text-sm">
                    <span className="text-cream/85">{r.email}</span>
                    <span className="text-cream/40">{r.name}</span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}
      </div>

      {/* Rate limit warnings */}
      {overDailyCap && (
        <div className="mt-4 rounded-lg border border-amber/50 bg-amber/10 p-5">
          <p className="font-display text-lg text-amber">
            Yli {DAILY_CAP} vastaanottajaa ({recipients.length})
          </p>
          <p className="mt-2 text-sm leading-relaxed text-cream/80">
            Resendin ilmaisversio lähettää enintään {DAILY_CAP} viestiä vuorokaudessa. Lähetys
            etenee niin pitkälle kuin kiintiö riittää ja pysähtyy itsestään. Loput lähtevät, kun
            jatkat kampanjaa huomenna. Nopeampaan tarvitaan Resendin maksullinen taso.
          </p>
        </div>
      )}
      {!overDailyCap && overRemaining && (
        <div className="mt-4 rounded-lg border border-amber/40 bg-amber/5 p-5">
          <p className="text-sm leading-relaxed text-cream/80">
            Vastaanottajia on {recipients.length}, mutta päivän kiintiöstä on jäljellä vain{' '}
            {dailyRemaining}. Lähetys pysähtyy kiintiöön ja jatkuu huomenna.
          </p>
        </div>
      )}

      {/* Compose */}
      <form onSubmit={send} className="mt-8 rounded-lg border border-cream/10 bg-forest-deep p-6 md:p-8">
        <p className="font-display text-xl text-cream">Uusi viesti</p>
        <div className="mt-5 grid gap-4">
          <Field label="Aihe">
            <input
              required
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              className={inputClass}
              placeholder="Kiitos Roskapäivästä 2026"
            />
          </Field>
          <Field label="Viesti" hint="Tyhjä rivi aloittaa uuden kappaleen. Alkuun tulee automaattisesti 'Hei [nimi],'">
            <textarea
              required
              value={body}
              onChange={(e) => setBody(e.target.value)}
              className={`${textareaClass} min-h-[200px]`}
              placeholder={'Kiitos että järjestit oman Roskapäivä-tapahtumasi.\n\nYhdessä keräsimme...'}
            />
          </Field>
        </div>

        {error && <p className="mt-4 text-sm text-red-400">{error}</p>}
        {info && <p className="mt-4 text-sm text-amber-light">{info}</p>}

        {progress && (
          <div className="mt-5 rounded border border-cream/10 bg-forest-night p-4">
            <div className="flex justify-between text-sm text-cream/70">
              <span>
                Lähetetty {progress.sent} / {progress.total}
                {progress.failed > 0 && ` · epäonnistui ${progress.failed}`}
              </span>
              <span>{progress.remaining} jonossa</span>
            </div>
            <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-cream/10">
              <div
                className="h-full bg-amber transition-all"
                style={{
                  width: `${progress.total ? Math.round((progress.sent / progress.total) * 100) : 0}%`,
                }}
              />
            </div>
            {progress.note && <p className="mt-2 text-xs text-cream/50">{progress.note}</p>}
          </div>
        )}

        <div className="mt-6">
          <PrimaryButton type="submit" disabled={busy || recipients.length === 0}>
            {busy ? 'Lähetetään…' : `Lähetä ${recipients.length} vastaanottajalle`}
          </PrimaryButton>
        </div>
      </form>

      {/* History */}
      <div className="mt-12">
        <p className="font-display text-xl text-cream">Lähetetyt ({campaigns.length})</p>
        {loading ? (
          <p className="mt-4 text-cream/60">Ladataan…</p>
        ) : campaigns.length === 0 ? (
          <p className="mt-4 text-cream/60">Ei vielä kampanjoita.</p>
        ) : (
          <ul className="mt-4 space-y-3">
            {campaigns.map((c) => {
              const t = counts[c.id] ?? { sent: 0, pending: 0, failed: 0 };
              return (
                <li
                  key={c.id}
                  className="flex flex-col gap-3 rounded-lg border border-cream/10 bg-forest-deep p-4 md:flex-row md:items-center"
                >
                  <div className="min-w-0 flex-1">
                    <p className="font-display text-lg text-cream">{c.subject}</p>
                    <p className="mt-1 text-xs text-cream/45">
                      {new Date(c.created_at).toLocaleString('fi-FI')} ·{' '}
                      {c.audience === 'approved' ? 'julkaistut' : 'kaikki'}
                    </p>
                    <p className="mt-1 text-xs text-cream/60">
                      Lähetetty {t.sent}
                      {t.pending > 0 && ` · jonossa ${t.pending}`}
                      {t.failed > 0 && ` · epäonnistui ${t.failed}`}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    {t.pending > 0 && (
                      <PrimaryButton onClick={() => resume(c.id)} disabled={busy}>
                        Jatka
                      </PrimaryButton>
                    )}
                    <DangerButton onClick={() => removeCampaign(c)}>Poista</DangerButton>
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </div>
  );
}
