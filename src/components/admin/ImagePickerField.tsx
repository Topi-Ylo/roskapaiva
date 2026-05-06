import { useEffect, useRef, useState, type ChangeEvent, type DragEvent } from 'react';
import { supabase } from '../../lib/supabase';
import { uploadToStorage, compressImage } from '../../lib/storage';
import { Field, inputClass } from './admin-ui';

interface LibraryImage {
  id: string;
  url: string;
  label: string | null;
}

interface Props {
  label: string;
  value: string;
  onChange: (url: string) => void;
  required?: boolean;
  hint?: string;
  placeholder?: string;
}

/**
 * Image input that supports either pasting a URL or picking from the
 * Kuvakirjasto. The library picker also accepts uploads (button or drag-and-
 * drop) — uploaded files are compressed, stored in the media bucket, added to
 * `image_library`, and then selectable just like any other library image.
 */
export default function ImagePickerField({
  label,
  value,
  onChange,
  required,
  hint,
  placeholder,
}: Props) {
  const [pickerOpen, setPickerOpen] = useState(false);

  return (
    <>
      <Field label={label} hint={hint}>
        <div className="flex flex-col gap-3">
          <div className="flex flex-col gap-2 sm:flex-row">
            <input
              type="url"
              value={value}
              onChange={(e) => onChange(e.target.value)}
              required={required}
              placeholder={placeholder ?? 'https://...'}
              className={`${inputClass} flex-1`}
            />
            <button
              type="button"
              onClick={() => setPickerOpen(true)}
              className="rounded-md border border-amber/60 px-4 py-2.5 text-xs font-semibold uppercase tracking-widest text-amber transition hover:bg-amber/10"
            >
              Valitse kirjastosta
            </button>
          </div>
          {value && (
            <div className="h-32 w-auto self-start overflow-hidden rounded border border-cream/10 bg-forest-night">
              <img
                src={value}
                alt=""
                className="h-full w-auto object-cover"
                loading="lazy"
              />
            </div>
          )}
        </div>
      </Field>
      {pickerOpen && (
        <ImageLibraryPicker
          onSelect={(url) => {
            onChange(url);
            setPickerOpen(false);
          }}
          onClose={() => setPickerOpen(false)}
        />
      )}
    </>
  );
}

function ImageLibraryPicker({
  onSelect,
  onClose,
}: {
  onSelect: (url: string) => void;
  onClose: () => void;
}) {
  const [items, setItems] = useState<LibraryImage[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [dragOver, setDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const fetchItems = async () => {
    if (!supabase) {
      setLoading(false);
      return;
    }
    const { data } = await supabase
      .from('image_library')
      .select('id, url, label')
      .order('created_at', { ascending: false });
    setItems((data ?? []) as LibraryImage[]);
    setLoading(false);
  };

  useEffect(() => {
    let cancelled = false;
    (async () => {
      if (cancelled) return;
      await fetchItems();
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  // Close on Escape.
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [onClose]);

  // Upload a list of files: compress each, push to storage, insert into
  // image_library, and refresh the grid. Returns the URL of the first
  // successfully uploaded file (so the caller can auto-select it).
  const handleUploads = async (files: FileList | File[]) => {
    if (!supabase) {
      setUploadError('Supabase ei ole konfiguroitu.');
      return null;
    }
    const list = Array.from(files).filter((f) => f.type.startsWith('image/'));
    if (list.length === 0) {
      setUploadError('Vain kuvatiedostot kelpaavat.');
      return null;
    }
    setUploading(true);
    setUploadError(null);
    let firstUrl: string | null = null;
    try {
      for (const raw of list) {
        const file = await compressImage(raw);
        const { url, path } = await uploadToStorage(file, 'library/');
        const { error: insertErr } = await supabase.from('image_library').insert({
          url,
          label: raw.name.replace(/\.[^.]+$/, ''),
          uploaded: true,
          storage_path: path,
          size_bytes: file.size,
        });
        if (insertErr) throw insertErr;
        if (!firstUrl) firstUrl = url;
      }
      await fetchItems();
      return firstUrl;
    } catch (err) {
      setUploadError(err instanceof Error ? err.message : String(err));
      return null;
    } finally {
      setUploading(false);
    }
  };

  const onPickerFiles = async (e: ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    const url = await handleUploads(files);
    if (fileInputRef.current) fileInputRef.current.value = '';
    if (url) onSelect(url); // single click → upload + auto-select first
  };

  const onDragEnter = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.dataTransfer?.types.includes('Files')) setDragOver(true);
  };
  const onDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  };
  const onDragLeave = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    // Only clear when the cursor actually leaves the modal, not when it moves
    // between child elements.
    if (e.currentTarget === e.target) setDragOver(false);
  };
  const onDrop = async (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setDragOver(false);
    const files = e.dataTransfer?.files;
    if (!files || files.length === 0) return;
    const url = await handleUploads(files);
    if (url) onSelect(url);
  };

  const filtered = search
    ? items.filter((i) => {
        const q = search.toLowerCase();
        return (
          (i.label ?? '').toLowerCase().includes(q) ||
          i.url.toLowerCase().includes(q)
        );
      })
    : items;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-forest-night/80 p-4 backdrop-blur"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
    >
      <div
        className={`relative flex max-h-[88vh] w-full max-w-5xl flex-col overflow-hidden rounded-lg border bg-forest-deep transition ${
          dragOver ? 'border-amber ring-2 ring-amber/40' : 'border-cream/10'
        }`}
        onClick={(e) => e.stopPropagation()}
        onDragEnter={onDragEnter}
        onDragOver={onDragOver}
        onDragLeave={onDragLeave}
        onDrop={onDrop}
      >
        <div className="flex items-center justify-between gap-3 border-b border-cream/10 p-5">
          <p className="font-display text-xl text-cream">Valitse kuvakirjastosta</p>
          <button
            type="button"
            onClick={onClose}
            aria-label="Sulje"
            className="text-cream/60 transition hover:text-cream"
          >
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="6" y1="6" x2="18" y2="18" />
              <line x1="6" y1="18" x2="18" y2="6" />
            </svg>
          </button>
        </div>

        <div className="flex flex-col gap-3 border-b border-cream/10 p-5 sm:flex-row sm:items-center">
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Hae otsakkeesta tai URL:sta…"
            className={`${inputClass} flex-1`}
            autoFocus
          />
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            multiple
            onChange={onPickerFiles}
            className="hidden"
          />
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            disabled={uploading}
            className="rounded-md border border-amber/60 px-4 py-2.5 text-xs font-semibold uppercase tracking-widest text-amber transition hover:bg-amber/10 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {uploading ? 'Ladataan…' : 'Lataa uusi kuva'}
          </button>
        </div>

        {uploadError && (
          <div className="border-b border-red-500/30 bg-red-500/10 px-5 py-3 text-sm text-red-300">
            {uploadError}
          </div>
        )}

        <div className="relative flex-1 overflow-y-auto p-5">
          {loading ? (
            <p className="text-cream/60">Ladataan…</p>
          ) : filtered.length === 0 ? (
            <p className="text-cream/60">
              {items.length === 0
                ? 'Kirjasto on tyhjä. Vedä kuva tähän tai paina "Lataa uusi kuva".'
                : 'Ei hakua vastaavia kuvia.'}
            </p>
          ) : (
            <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
              {filtered.map((img) => (
                <li key={img.id}>
                  <button
                    type="button"
                    onClick={() => onSelect(img.url)}
                    className="group block w-full overflow-hidden rounded border border-cream/10 transition hover:border-amber"
                  >
                    <div className="aspect-[4/3] overflow-hidden bg-forest-night">
                      <img
                        src={img.url}
                        alt={img.label ?? ''}
                        loading="lazy"
                        className="h-full w-full object-cover transition group-hover:scale-105"
                      />
                    </div>
                    <p className="truncate p-2 text-left text-xs text-cream/80 group-hover:text-amber">
                      {img.label ?? '(ei otsaketta)'}
                    </p>
                  </button>
                </li>
              ))}
            </ul>
          )}

          {dragOver && (
            <div className="pointer-events-none absolute inset-0 flex items-center justify-center bg-forest-night/80">
              <p className="font-display text-2xl text-amber">Pudota kuva tähän</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
