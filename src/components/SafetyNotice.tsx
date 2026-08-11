import { SAFETY_POINTS, SAFETY_TITLE } from '../lib/faq';

/**
 * The safety card, shared by the FAQ and the '26 page.
 *
 * Deliberately not CMS-driven: it is referenced from more than one place and
 * from the sign-up flow, and none of those should be able to end up pointing at
 * an empty box.
 */
export default function SafetyNotice({ className = '' }: { className?: string }) {
  return (
    <aside
      className={`border border-amber/25 bg-amber/5 p-6 md:p-8 ${className}`}
      aria-labelledby="turvallisuus"
    >
      <p id="turvallisuus" className="eyebrow text-amber">
        {SAFETY_TITLE}
      </p>
      <ul className="mt-5 space-y-3">
        {SAFETY_POINTS.map((point) => (
          <li key={point} className="flex gap-3 text-sm leading-relaxed text-cream/80">
            <span aria-hidden="true" className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-amber" />
            <span>{point}</span>
          </li>
        ))}
      </ul>
    </aside>
  );
}
