import { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';
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
 * Kuvakirjasto. Used across every admin form that has an image-URL field
 * so admins don't have to copy/paste between tabs.
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

  useEffect(() => {
    if (!supabase) {
      setLoading(false);
      return;
    }
    let cancelled = false;
    supabase
      .from('image_library')
      .select('id, url, label')
      .order('created_at', { ascending: false })
      .then(({ data }) => {
        if (cancelled) return;
        setItems((data ?? []) as LibraryImage[]);
        setLoading(false);
      });
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
        className="relative flex max-h-[88vh] w-full max-w-5xl flex-col overflow-hidden rounded-lg border border-cream/10 bg-forest-deep"
        onClick={(e) => e.stopPropagation()}
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
        <div className="border-b border-cream/10 p-5">
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Hae otsakkeesta tai URL:sta…"
            className={inputClass}
            autoFocus
          />
        </div>
        <div className="flex-1 overflow-y-auto p-5">
          {loading ? (
            <p className="text-cream/60">Ladataan…</p>
          ) : filtered.length === 0 ? (
            <p className="text-cream/60">
              {items.length === 0
                ? 'Kirjasto on tyhjä. Lataa kuvia ensin Kuvakirjastoon.'
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
        </div>
      </div>
    </div>
  );
}
