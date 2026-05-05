import type { ReactNode } from 'react';

export function AdminPageHeader({
  eyebrow,
  title,
  actions,
}: {
  eyebrow: string;
  title: string;
  actions?: ReactNode;
}) {
  return (
    <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
      <div>
        <p className="eyebrow text-amber">{eyebrow}</p>
        <h1 className="font-display mt-3 text-3xl text-cream md:text-4xl">{title}</h1>
      </div>
      {actions && <div className="flex items-center gap-2">{actions}</div>}
    </div>
  );
}

export function Field({
  label,
  hint,
  children,
}: {
  label: string;
  hint?: string;
  children: ReactNode;
}) {
  return (
    <label className="block">
      <span className="block text-xs font-semibold uppercase tracking-widest text-cream/60">
        {label}
      </span>
      {hint && <span className="mt-1 block text-xs text-cream/40">{hint}</span>}
      <div className="mt-2">{children}</div>
    </label>
  );
}

export const inputClass =
  'w-full rounded-md border border-cream/15 bg-forest-night px-4 py-2.5 text-cream placeholder:text-cream/40 focus:border-amber focus:outline-none';

export const textareaClass = inputClass + ' min-h-[100px] resize-y';

export function PrimaryButton({
  children,
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      {...props}
      className={`rounded-full bg-amber px-5 py-2 text-xs font-semibold uppercase tracking-widest text-forest-night transition hover:bg-amber-light disabled:cursor-not-allowed disabled:opacity-50 ${
        props.className ?? ''
      }`}
    >
      {children}
    </button>
  );
}

export function GhostButton({
  children,
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      {...props}
      className={`rounded-full border border-cream/30 px-5 py-2 text-xs font-semibold uppercase tracking-widest text-cream transition hover:border-amber hover:text-amber ${
        props.className ?? ''
      }`}
    >
      {children}
    </button>
  );
}

export function DangerButton({
  children,
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      {...props}
      className={`rounded-full border border-red-500/40 px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-red-300 transition hover:border-red-500 hover:text-red-200 ${
        props.className ?? ''
      }`}
    >
      {children}
    </button>
  );
}
