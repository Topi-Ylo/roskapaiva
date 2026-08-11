import { useEffect, useMemo, useRef, useState } from 'react';
import {
  MUNICIPALITIES_BY_REGION,
  OTHER_MUNICIPALITY,
  searchMunicipalities,
  type Municipality,
} from '../../lib/finnishMunicipalities';

interface Props {
  value: string;
  onChange: (name: string) => void;
  required?: boolean;
  placeholder?: string;
  /** Rendered above the field by the caller; used here for the accessible name. */
  label?: string;
}

/**
 * Municipality picker: type to search, or browse by region.
 *
 * A plain <select> with 308 options is unusable — on a phone it is a scroll
 * wheel three hundred entries long, and on a desktop it is an unsorted wall.
 * Browsing is grouped by region so the list is short at every step, and typing
 * skips the hierarchy entirely for anyone who knows their own municipality.
 *
 * Search ignores case and diacritics, so "jarvenpaa" finds Järvenpää — nobody
 * reaches for ä on a hurried phone.
 */
export default function MunicipalityPicker({
  value,
  onChange,
  required,
  placeholder = 'Hae tai selaa maakunnittain',
  label = 'Paikkakunta',
}: Props) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [active, setActive] = useState(0);
  const boxRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLUListElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const results = useMemo(() => (query ? searchMunicipalities(query) : []), [query]);

  /** Flat list of what is currently selectable, for keyboard navigation. */
  const flat = useMemo<Municipality[]>(
    () => (query ? results : MUNICIPALITIES_BY_REGION.flatMap((g) => g.items)),
    [query, results]
  );

  useEffect(() => setActive(0), [query]);

  // Close on an outside click. Escape is handled on the input itself so it does
  // not swallow the key from the surrounding modal when the list is shut.
  useEffect(() => {
    if (!open) return;
    const onDown = (e: MouseEvent) => {
      if (boxRef.current && !boxRef.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', onDown);
    return () => document.removeEventListener('mousedown', onDown);
  }, [open]);

  useEffect(() => {
    if (!open || !listRef.current) return;
    listRef.current.querySelector('[data-active="true"]')?.scrollIntoView({ block: 'nearest' });
  }, [active, open]);

  const choose = (name: string) => {
    onChange(name);
    setQuery('');
    setOpen(false);
    inputRef.current?.blur();
  };

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      if (open) {
        e.stopPropagation();
        setOpen(false);
      }
      return;
    }
    if (!open && (e.key === 'ArrowDown' || e.key === 'Enter')) {
      setOpen(true);
      e.preventDefault();
      return;
    }
    if (!open) return;
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setActive((i) => Math.min(i + 1, flat.length - 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setActive((i) => Math.max(i - 1, 0));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (flat[active]) choose(flat[active].name);
    }
  };

  // text-base on phones: iOS zooms the page for anything under 16px.
  const fieldCls =
    'w-full h-12 rounded border border-cream/20 bg-forest-night/60 px-4 pr-10 text-base sm:text-sm ' +
    'text-cream placeholder:text-cream/35 focus:border-amber focus:outline-none';

  let index = -1;

  return (
    <div ref={boxRef} className="relative">
      {/* The real value for form validation. The visible input is a search box,
          so it must not be the thing that carries required. */}
      <input type="text" value={value} required={required} readOnly tabIndex={-1}
        aria-hidden="true" className="pointer-events-none absolute h-0 w-0 opacity-0"
        onChange={() => {}} />

      <input
        ref={inputRef}
        type="text"
        role="combobox"
        aria-expanded={open}
        aria-controls="municipality-list"
        aria-autocomplete="list"
        aria-label={label}
        autoComplete="off"
        className={fieldCls}
        placeholder={value || placeholder}
        value={open ? query : value}
        onFocus={() => setOpen(true)}
        onClick={() => setOpen(true)}
        onChange={(e) => {
          setQuery(e.target.value);
          setOpen(true);
        }}
        onKeyDown={onKeyDown}
      />
      <svg
        aria-hidden="true" width="12" height="12" viewBox="0 0 16 16" fill="none"
        className="pointer-events-none absolute right-4 top-6 -translate-y-1/2 text-cream/50"
      >
        <path d="M3 6l5 5 5-5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
      </svg>

      {open && (
        <ul
          id="municipality-list"
          ref={listRef}
          role="listbox"
          className="no-scrollbar absolute z-20 mt-1 max-h-72 w-full overflow-y-auto rounded border border-cream/20 bg-forest-deep shadow-2xl"
        >
          {query && results.length === 0 && (
            <li className="px-4 py-3 text-sm text-cream/45">
              Ei osumia. Voit valita “{OTHER_MUNICIPALITY}”.
            </li>
          )}

          {query
            ? results.map((m) => {
                index += 1;
                const i = index;
                return (
                  <Option
                    key={m.name}
                    m={m}
                    showRegion
                    isActive={i === active}
                    onPick={() => choose(m.name)}
                    onHover={() => setActive(i)}
                  />
                );
              })
            : MUNICIPALITIES_BY_REGION.map((group) => (
                <li key={group.region}>
                  <p className="sticky top-0 z-10 bg-forest-deep px-4 py-2 text-[11px] font-semibold uppercase tracking-widest text-amber/80">
                    {group.region}
                  </p>
                  <ul>
                    {group.items.map((m) => {
                      index += 1;
                      const i = index;
                      return (
                        <Option
                          key={m.name}
                          m={m}
                          isActive={i === active}
                          onPick={() => choose(m.name)}
                          onHover={() => setActive(i)}
                        />
                      );
                    })}
                  </ul>
                </li>
              ))}

          <li>
            <button
              type="button"
              onMouseDown={(e) => e.preventDefault()}
              onClick={() => choose(OTHER_MUNICIPALITY)}
              className="flex min-h-[44px] w-full items-center border-t border-cream/10 px-4 text-left text-sm text-cream/60 transition hover:bg-cream/5 hover:text-cream"
            >
              {OTHER_MUNICIPALITY}
            </button>
          </li>
        </ul>
      )}
    </div>
  );
}

function Option({
  m, isActive, showRegion, onPick, onHover,
}: {
  m: Municipality;
  isActive: boolean;
  showRegion?: boolean;
  onPick: () => void;
  onHover: () => void;
}) {
  return (
    <li role="option" aria-selected={isActive} data-active={isActive}>
      <button
        type="button"
        // mousedown would blur the input and close the list before the click
        // ever lands.
        onMouseDown={(e) => e.preventDefault()}
        onClick={onPick}
        onMouseEnter={onHover}
        className={`flex min-h-[44px] w-full items-center justify-between gap-3 px-4 text-left text-sm transition ${
          isActive ? 'bg-amber/15 text-cream' : 'text-cream/80 hover:bg-cream/5'
        }`}
      >
        <span>{m.name}</span>
        {showRegion && <span className="shrink-0 text-xs text-cream/40">{m.region}</span>}
      </button>
    </li>
  );
}
