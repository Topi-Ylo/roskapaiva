import { useEffect, useRef, useState, type FormEvent, type ChangeEvent } from 'react';
import { supabase } from '../../lib/supabase';
import { uploadToStorage, deleteFromStorage, compressImage } from '../../lib/storage';
import {
  AdminPageHeader, DangerButton, Field, GhostButton, PrimaryButton, inputClass,
} from '../../components/admin/admin-ui';

interface LibraryImage {
  id: string;
  url: string;
  label: string | null;
  alt_text: string | null;
  uploaded: boolean;
  storage_path: string | null;
  created_at: string;
}

export default function ImageLibraryAdmin() {
  const [items, setItems] = useState<LibraryImage[]>([]);
  const [loading, setLoading] = useState(true);
  const [url, setUrl] = useState('');
  const [label, setLabel] = useState('');
  const [busy, setBusy] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const fileInput = useRef<HTMLInputElement>(null);

  const refresh = async () => {
    if (!supabase) return;
    setLoading(true);
    const { data, error } = await supabase
      .from('image_library').select('*').order('created_at', { ascending: false });
    if (error) setError(error.message);
    setItems((data ?? []) as LibraryImage[]);
    setLoading(false);
  };
  useEffect(() => { refresh(); }, []);

  const onAddUrl = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!supabase) return;
    setBusy(true); setError(null);
    const { error } = await supabase.from('image_library').insert({
      url: url.trim(),
      label: label.trim() || null,
      uploaded: false,
    });
    setBusy(false);
    if (error) { setError(error.message); return; }
    setUrl(''); setLabel(''); await refresh();
  };

  const onUpload = async (e: ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || !files.length || !supabase) return;
    setUploading(true); setError(null);

    try {
      for (const rawFile of Array.from(files)) {
        // Compress images before upload to keep page-load weight down.
        // Non-image files (or already-small images) pass through unchanged.
        const file = await compressImage(rawFile);
        const { url, path } = await uploadToStorage(file, 'library/');
        const { error: insertErr } = await supabase.from('image_library').insert({
          url,
          label: rawFile.name.replace(/\.[^.]+$/, ''),
          uploaded: true,
          storage_path: path,
          size_bytes: file.size,
        });
        if (insertErr) throw insertErr;
      }
      if (fileInput.current) fileInput.current.value = '';
      await refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
    } finally {
      setUploading(false);
    }
  };

  const onCopy = async (img: LibraryImage) => {
    try {
      await navigator.clipboard.writeText(img.url);
      setCopiedId(img.id);
      setTimeout(() => {
        setCopiedId((curr) => (curr === img.id ? null : curr));
      }, 1500);
    } catch {
      /* clipboard blocked; nothing to do */
    }
  };

  const onDelete = async (img: LibraryImage) => {
    if (!supabase) return;
    if (!confirm('Poistetaanko kuva kirjastosta?')) return;
    if (img.uploaded && img.storage_path) {
      await deleteFromStorage(img.storage_path);
    }
    const { error } = await supabase.from('image_library').delete().eq('id', img.id);
    if (error) { alert(error.message); return; }
    await refresh();
  };

  const filtered = search
    ? items.filter((i) => (i.label ?? '').toLowerCase().includes(search.toLowerCase()) || i.url.toLowerCase().includes(search.toLowerCase()))
    : items;

  return (
    <div className="mx-auto max-w-5xl">
      <AdminPageHeader eyebrow="Sisältö" title="Kuvakirjasto" />

      <div className="grid gap-6 md:grid-cols-2">
        {/* Upload card */}
        <div className="rounded-lg border border-cream/10 bg-forest-deep p-6 md:p-8">
          <p className="font-display text-xl text-cream">Lataa kuva</p>
          <p className="mt-2 text-sm text-cream/65">
            Tallennetaan suoraan Supabase-storageen. Kuvat tiivistetään automaattisesti (max 2000 px, JPEG).
          </p>
          <input
            ref={fileInput}
            type="file"
            accept="image/*"
            multiple
            onChange={onUpload}
            className="mt-5 block w-full text-sm text-cream/80 file:mr-4 file:cursor-pointer file:rounded-full file:border-0 file:bg-amber file:px-5 file:py-2 file:text-xs file:font-semibold file:uppercase file:tracking-widest file:text-forest-night hover:file:bg-amber-light"
          />
          {uploading && <p className="mt-3 text-sm text-amber-light">Ladataan…</p>}
        </div>

        {/* URL card */}
        <form onSubmit={onAddUrl} className="rounded-lg border border-cream/10 bg-forest-deep p-6 md:p-8">
          <p className="font-display text-xl text-cream">Tai liitä URL</p>
          <p className="mt-2 text-sm text-cream/65">Käytä jo verkossa olevaa kuvaa.</p>
          <div className="mt-5 grid gap-4">
            <Field label="Kuva-URL"><input required type="url" value={url} onChange={(e) => setUrl(e.target.value)} className={inputClass} placeholder="https://i.imgur.com/..." /></Field>
            <Field label="Otsake"><input value={label} onChange={(e) => setLabel(e.target.value)} className={inputClass} /></Field>
            <PrimaryButton type="submit" disabled={busy}>{busy ? '…' : 'Lisää'}</PrimaryButton>
          </div>
        </form>
      </div>

      {error && <p className="mt-6 text-sm text-red-400">{error}</p>}

      <div className="mt-10">
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <p className="font-display text-xl text-cream">Kuvat ({filtered.length})</p>
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Hae otsakkeesta tai URL:sta…"
            className={`md:w-64 ${inputClass}`}
          />
        </div>

        {loading ? <p className="mt-4 text-cream/60">Ladataan…</p> : filtered.length === 0 ? <p className="mt-4 text-cream/60">Ei kuvia.</p> : (
          <ul className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map((img) => (
              <li key={img.id} className="flex flex-col gap-3 rounded-lg border border-cream/10 bg-forest-deep p-3">
                <div className="aspect-[4/3] overflow-hidden rounded bg-forest-night">
                  <img src={img.url} alt={img.alt_text ?? ''} className="h-full w-full object-cover" loading="lazy" />
                </div>
                <div className="flex items-center justify-between gap-2">
                  <p className="text-sm text-cream truncate">{img.label ?? '(ei otsaketta)'}</p>
                  {img.uploaded && <span className="rounded-full bg-amber/15 px-2 py-0.5 text-[10px] uppercase tracking-widest text-amber/80">tallennettu</span>}
                </div>
                <p className="truncate text-xs text-cream/40">{img.url}</p>
                <div className="flex gap-2">
                  <GhostButton onClick={() => onCopy(img)}>{copiedId === img.id ? 'Kopioitu' : 'Kopioi URL'}</GhostButton>
                  <DangerButton onClick={() => onDelete(img)}>Poista</DangerButton>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
