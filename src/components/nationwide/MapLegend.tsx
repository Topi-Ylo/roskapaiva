import { PIN_IMAGE } from './FinlandMap';

interface Props {
  showPublic: boolean;
  showPrivate: boolean;
  publicCount: number;
  privateCount: number;
  onToggle: (kind: 'public' | 'private') => void;
}

/** A small pin drawn the same way the map draws it, so the key cannot drift. */
function PinSwatch({ isPublic }: { isPublic: boolean }) {
  return (
    <span
      className="flex shrink-0 items-center justify-center overflow-hidden rounded-full bg-forest-night"
      style={{
        width: 26,
        height: 26,
        boxSizing: 'border-box',
        // Border on the wrapper, invert on the image: a CSS filter would
        // otherwise flip the dark ring light. Same reasoning as the marker.
        border: isPublic ? '3px solid #0B160F' : '2px solid rgba(11,22,15,0.5)',
      }}
    >
      <img
        src={PIN_IMAGE}
        alt=""
        className="block h-full w-full"
        style={isPublic ? { filter: 'invert(1)' } : undefined}
      />
    </span>
  );
}

/**
 * Doubles as a key and a filter: it explains what the two pin styles mean, and
 * clicking a row hides that kind from both the map and the list.
 */
export default function MapLegend({
  showPublic,
  showPrivate,
  publicCount,
  privateCount,
  onToggle,
}: Props) {
  const rows = [
    { kind: 'public' as const, on: showPublic, count: publicCount, label: 'Avoin tapahtuma' },
    { kind: 'private' as const, on: showPrivate, count: privateCount, label: 'Oma siivous' },
  ];

  return (
    <div className="absolute right-3 top-3 z-[400] rounded-lg border border-forest-night/15 bg-cream/95 p-1.5 shadow-lg backdrop-blur-sm">
      {rows.map((r) => (
        <button
          key={r.kind}
          type="button"
          onClick={() => onToggle(r.kind)}
          aria-pressed={r.on}
          title={r.on ? `Piilota: ${r.label}` : `Näytä: ${r.label}`}
          className={`flex min-h-[44px] w-full items-center gap-2.5 rounded px-2 py-1.5 text-left transition hover:bg-forest-night/5 sm:min-h-0 ${
            r.on ? '' : 'opacity-40'
          }`}
        >
          <PinSwatch isPublic={r.kind === 'public'} />
          <span className="flex-1 text-xs font-semibold text-forest-night">{r.label}</span>
          <span className="text-xs tabular-nums text-forest-night/50">{r.count}</span>
        </button>
      ))}
    </div>
  );
}
