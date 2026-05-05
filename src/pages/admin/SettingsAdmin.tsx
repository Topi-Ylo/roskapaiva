import { useEffect, useState, type FormEvent, type ChangeEvent } from 'react';
import { supabase } from '../../lib/supabase';
import { uploadToStorage } from '../../lib/storage';
import {
  AdminPageHeader, Field, GhostButton, PrimaryButton, inputClass,
} from '../../components/admin/admin-ui';

interface Settings {
  id: number;
  contact_email: string | null;
  contact_phone: string | null;
  instagram_url: string | null;
  tiktok_url: string | null;
  youtube_url: string | null;
  next_event_date: string | null;
  next_event_location: string | null;
  petition_url: string | null;
  petition_open: boolean;
  mediakortti_pdf_url: string | null;
  press_zip_url: string | null;
}

export default function SettingsAdmin() {
  const [form, setForm] = useState<Settings | null>(null);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [info, setInfo] = useState<string | null>(null);
  const [uploadingPdf, setUploadingPdf] = useState(false);
  const [uploadingZip, setUploadingZip] = useState(false);

  const onUploadPdf = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !form) return;
    setUploadingPdf(true); setError(null);
    try {
      const { url } = await uploadToStorage(file, 'mediakortti/');
      setForm({ ...form, mediakortti_pdf_url: url });
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
    } finally {
      setUploadingPdf(false);
      e.target.value = '';
    }
  };

  const onUploadZip = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !form) return;
    setUploadingZip(true); setError(null);
    try {
      const { url } = await uploadToStorage(file, 'press/');
      setForm({ ...form, press_zip_url: url });
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
    } finally {
      setUploadingZip(false);
      e.target.value = '';
    }
  };

  useEffect(() => {
    if (!supabase) return;
    supabase.from('site_settings').select('*').eq('id', 1).maybeSingle().then(({ data, error }) => {
      if (error) setError(error.message);
      setForm((data ?? { id: 1 }) as Settings);
      setLoading(false);
    });
  }, []);

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!supabase || !form) return;
    setBusy(true); setError(null); setInfo(null);
    const { error } = await supabase.from('site_settings').upsert({ ...form, id: 1 }, { onConflict: 'id' });
    setBusy(false);
    if (error) setError(error.message);
    else setInfo('Tallennettu.');
  };

  if (loading || !form) {
    return <p className="text-cream/60">Ladataan…</p>;
  }

  const set = <K extends keyof Settings>(k: K, v: Settings[K]) => setForm({ ...form, [k]: v });

  return (
    <div className="mx-auto max-w-3xl">
      <AdminPageHeader eyebrow="Asetukset" title="Sivuston asetukset" />

      <form onSubmit={onSubmit} className="rounded-lg border border-cream/10 bg-forest-deep p-6 md:p-8">
        <p className="font-display text-xl text-cream">Yhteystiedot</p>
        <div className="mt-5 grid gap-4 md:grid-cols-2">
          <Field label="Sähköposti"><input type="email" value={form.contact_email ?? ''} onChange={(e) => set('contact_email', e.target.value)} className={inputClass} /></Field>
          <Field label="Puhelin"><input type="tel" value={form.contact_phone ?? ''} onChange={(e) => set('contact_phone', e.target.value)} className={inputClass} /></Field>
          <Field label="Instagram"><input type="url" value={form.instagram_url ?? ''} onChange={(e) => set('instagram_url', e.target.value)} className={inputClass} /></Field>
          <Field label="TikTok"><input type="url" value={form.tiktok_url ?? ''} onChange={(e) => set('tiktok_url', e.target.value)} className={inputClass} /></Field>
          <Field label="YouTube"><input type="url" value={form.youtube_url ?? ''} onChange={(e) => set('youtube_url', e.target.value)} className={inputClass} /></Field>
        </div>

        <p className="font-display mt-10 text-xl text-cream">Seuraava tapahtuma</p>
        <div className="mt-5 grid gap-4 md:grid-cols-2">
          <Field label="Päivämäärä" hint="esim. 5.9.2026"><input value={form.next_event_date ?? ''} onChange={(e) => set('next_event_date', e.target.value)} className={inputClass} /></Field>
          <Field label="Paikka"><input value={form.next_event_location ?? ''} onChange={(e) => set('next_event_location', e.target.value)} className={inputClass} /></Field>
        </div>

        <p className="font-display mt-10 text-xl text-cream">Kansalaisaloite</p>
        <div className="mt-5 grid gap-4 md:grid-cols-2">
          <Field label="Aloitteen URL" hint="kansalaisaloite.fi-linkki"><input type="url" value={form.petition_url ?? ''} onChange={(e) => set('petition_url', e.target.value)} className={inputClass} /></Field>
          <label className="flex items-center gap-3 self-end"><input type="checkbox" checked={form.petition_open} onChange={(e) => set('petition_open', e.target.checked)} className="h-4 w-4 accent-amber" /><span className="text-sm text-cream/80">Aloite avoinna allekirjoitukselle</span></label>
        </div>

        <p className="font-display mt-10 text-xl text-cream">Lehdistölle</p>
        <div className="mt-5 space-y-5">
          <div className="grid gap-3 md:grid-cols-[1fr,auto] md:items-end">
            <Field label="Mediakortti (PDF) URL"><input type="url" value={form.mediakortti_pdf_url ?? ''} onChange={(e) => set('mediakortti_pdf_url', e.target.value)} className={inputClass} /></Field>
            <label className="inline-flex">
              <input type="file" accept="application/pdf" onChange={onUploadPdf} className="hidden" />
              <GhostButton type="button" onClick={(e) => (e.currentTarget.previousElementSibling as HTMLInputElement)?.click()}>{uploadingPdf ? 'Ladataan…' : 'Lataa uusi PDF'}</GhostButton>
            </label>
          </div>
          <div className="grid gap-3 md:grid-cols-[1fr,auto] md:items-end">
            <Field label="Lehdistökuvat (.zip) URL"><input type="url" value={form.press_zip_url ?? ''} onChange={(e) => set('press_zip_url', e.target.value)} className={inputClass} /></Field>
            <label className="inline-flex">
              <input type="file" accept=".zip,application/zip,application/x-zip-compressed" onChange={onUploadZip} className="hidden" />
              <GhostButton type="button" onClick={(e) => (e.currentTarget.previousElementSibling as HTMLInputElement)?.click()}>{uploadingZip ? 'Ladataan…' : 'Lataa uusi .zip'}</GhostButton>
            </label>
          </div>
        </div>

        {error && <p className="mt-6 text-sm text-red-400">{error}</p>}
        {info && <p className="mt-6 text-sm text-amber-light">{info}</p>}

        <div className="mt-8">
          <PrimaryButton type="submit" disabled={busy}>{busy ? 'Tallennetaan…' : 'Tallenna asetukset'}</PrimaryButton>
        </div>
      </form>
    </div>
  );
}
