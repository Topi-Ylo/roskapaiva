import { useEffect, useState, type FormEvent } from 'react';
import { supabase } from '../../lib/supabase';
import {
  AdminPageHeader, DangerButton, Field, GhostButton, PrimaryButton,
  inputClass, textareaClass,
} from '../../components/admin/admin-ui';
import { FALLBACK_FAQ } from '../../lib/faq';

interface Item {
  id: string;
  question: string;
  answer: string;
  sort_order: number;
  published: boolean;
}

interface FormState {
  question: string;
  answer: string;
  sort_order: number;
  published: boolean;
}

const EMPTY: FormState = { question: '', answer: '', sort_order: 0, published: true };

export default function FaqAdmin() {
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<FormState>(EMPTY);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const refresh = async () => {
    if (!supabase) return;
    setLoading(true);
    const { data, error } = await supabase.from('faq_items').select('*').order('sort_order');
    if (error) setError(error.message);
    setItems((data ?? []) as Item[]);
    setLoading(false);
  };
  useEffect(() => { refresh(); }, []);

  const startNew = () => { setEditingId(null); setForm(EMPTY); setError(null); };
  const startEdit = (it: Item) => {
    setEditingId(it.id);
    setForm({
      question: it.question, answer: it.answer,
      sort_order: it.sort_order, published: it.published,
    });
    setError(null); window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  /**
   * The page falls back to the bundled copy while this table is empty, so the
   * FAQ is never blank. This lifts that copy into the database in one go, which
   * is the only sane way to get thirteen answers in without retyping them.
   */
  const seedFromFallback = async () => {
    if (!supabase) return;
    if (!confirm(`Lisätäänkö ${FALLBACK_FAQ.length} valmista kysymystä? Voit muokata niitä tämän jälkeen vapaasti.`)) return;
    setBusy(true); setError(null);
    const { error } = await supabase.from('faq_items').insert(
      FALLBACK_FAQ.map((f, i) => ({
        question: f.question, answer: f.answer, sort_order: i, published: true,
      }))
    );
    setBusy(false);
    if (error) { setError(error.message); return; }
    await refresh();
  };

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!supabase) return;
    setBusy(true); setError(null);
    const payload = {
      question: form.question.trim(),
      answer: form.answer.trim(),
      sort_order: Number(form.sort_order) || 0,
      published: form.published,
    };
    const { error } = editingId
      ? await supabase.from('faq_items').update(payload).eq('id', editingId)
      : await supabase.from('faq_items').insert(payload);
    setBusy(false);
    if (error) { setError(error.message); return; }
    setForm(EMPTY); setEditingId(null); await refresh();
  };

  const onDelete = async (it: Item) => {
    if (!supabase) return;
    if (!confirm(`Poistetaanko "${it.question}"?`)) return;
    const { error } = await supabase.from('faq_items').delete().eq('id', it.id);
    if (error) { alert(error.message); return; }
    if (editingId === it.id) { setEditingId(null); setForm(EMPTY); }
    await refresh();
  };

  return (
    <div className="mx-auto max-w-5xl">
      <AdminPageHeader
        eyebrow="Sisältö"
        title="Usein kysytyt kysymykset"
        actions={editingId ? <GhostButton onClick={startNew}>Uusi kysymys</GhostButton> : null}
      />

      <p className="mb-6 text-sm leading-relaxed text-cream/55">
        Nämä vastaukset kertovat, kuka vastaa mistäkin kartan tapahtumasta. Vastaukset
        vakuutuksesta ja järjestäjän vastuusta kannattaa tarkistuttaa ennen muokkaamista.
      </p>

      <form onSubmit={onSubmit} className="rounded-lg border border-cream/10 bg-forest-deep p-6 md:p-8">
        <p className="font-display text-xl text-cream">
          {editingId ? 'Muokkaa kysymystä' : 'Uusi kysymys'}
        </p>
        <div className="mt-5 grid gap-4 md:grid-cols-2">
          <div className="md:col-span-2">
            <Field label="Kysymys">
              <input
                required
                value={form.question}
                onChange={(e) => setForm({ ...form, question: e.target.value })}
                className={inputClass}
                placeholder="Tarvitseeko omiin talkoisiin lupia?"
              />
            </Field>
          </div>
          <div className="md:col-span-2">
            <Field label="Vastaus" hint="Rivinvaihdot säilyvät">
              <textarea
                required
                rows={7}
                value={form.answer}
                onChange={(e) => setForm({ ...form, answer: e.target.value })}
                className={textareaClass}
              />
            </Field>
          </div>
          <Field label="Järjestys">
            <input
              type="number"
              value={form.sort_order}
              onChange={(e) => setForm({ ...form, sort_order: Number(e.target.value) })}
              className={inputClass}
            />
          </Field>
          <label className="flex items-center gap-3">
            <input
              type="checkbox"
              checked={form.published}
              onChange={(e) => setForm({ ...form, published: e.target.checked })}
              className="h-4 w-4 accent-amber"
            />
            <span className="text-sm text-cream/80">Julkaistu</span>
          </label>
        </div>
        {error && <p className="mt-4 text-sm text-red-400">{error}</p>}
        <div className="mt-6 flex flex-wrap gap-3">
          <PrimaryButton type="submit" disabled={busy}>
            {busy ? 'Tallennetaan…' : editingId ? 'Tallenna' : 'Lisää'}
          </PrimaryButton>
          {editingId && <GhostButton type="button" onClick={startNew}>Peruuta</GhostButton>}
        </div>
      </form>

      <div className="mt-12">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <p className="font-display text-xl text-cream">Kysymykset ({items.length})</p>
          {!loading && items.length === 0 && (
            <GhostButton onClick={seedFromFallback} disabled={busy}>
              Tuo {FALLBACK_FAQ.length} valmista kysymystä
            </GhostButton>
          )}
        </div>

        {loading ? (
          <p className="mt-4 text-cream/60">Ladataan…</p>
        ) : items.length === 0 ? (
          <p className="mt-4 text-sm leading-relaxed text-cream/60">
            Tietokannassa ei ole vielä kysymyksiä, joten sivu näyttää koodiin tallennetun
            vakiosisällön. Tuo se yllä olevalla painikkeella, niin voit muokata vastauksia täällä.
          </p>
        ) : (
          <ul className="mt-4 space-y-3">
            {items.map((it) => (
              <li key={it.id} className="flex flex-col gap-4 rounded-lg border border-cream/10 bg-forest-deep p-4 md:flex-row md:items-start">
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-display text-lg text-cream">{it.question}</span>
                    {!it.published && (
                      <span className="rounded-full bg-cream/10 px-2 py-0.5 text-[10px] uppercase tracking-widest text-cream/55">
                        luonnos
                      </span>
                    )}
                  </div>
                  <p className="mt-1 whitespace-pre-line text-sm text-cream/70">{it.answer}</p>
                  <p className="mt-1 text-xs text-cream/40">Järjestys: {it.sort_order}</p>
                </div>
                <div className="flex gap-2">
                  <GhostButton onClick={() => startEdit(it)}>Muokkaa</GhostButton>
                  <DangerButton onClick={() => onDelete(it)}>Poista</DangerButton>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
