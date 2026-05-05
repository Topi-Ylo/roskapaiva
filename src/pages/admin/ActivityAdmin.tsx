import { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';
import { AdminPageHeader, GhostButton, inputClass } from '../../components/admin/admin-ui';

interface AuditRow {
  id: number;
  user_email: string | null;
  table_name: string;
  record_id: string | null;
  action: 'insert' | 'update' | 'delete';
  changes: unknown;
  created_at: string;
}

const PAGE = 50;
const ACTIONS = ['', 'insert', 'update', 'delete'] as const;

export default function ActivityAdmin() {
  const [items, setItems] = useState<AuditRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterTable, setFilterTable] = useState('');
  const [filterAction, setFilterAction] = useState<string>('');
  const [page, setPage] = useState(0);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    if (!supabase) return;
    let cancelled = false;
    const load = async () => {
      setLoading(true);
      let q = supabase!.from('audit_log').select('*', { count: 'exact' }).order('id', { ascending: false });
      if (filterTable) q = q.eq('table_name', filterTable);
      if (filterAction) q = q.eq('action', filterAction);
      q = q.range(page * PAGE, page * PAGE + PAGE - 1);
      const { data, count, error } = await q;
      if (cancelled) return;
      if (!error) {
        setItems((data ?? []) as AuditRow[]);
        setTotal(count ?? 0);
      }
      setLoading(false);
    };
    load();
    return () => { cancelled = true; };
  }, [filterTable, filterAction, page]);

  const tableOptions = [
    'past_events', 'timeline_entries', 'social_media_collabs', 'media_posts',
    'press_images', 'partners', 'services', 'site_settings',
  ];

  const fmtTime = (s: string) => new Date(s).toLocaleString('fi-FI');

  const summarise = (row: AuditRow): string => {
    if (row.action === 'delete') return 'Poistettu';
    if (row.action === 'insert') return 'Luotu';
    if (row.action === 'update' && row.changes && typeof row.changes === 'object') {
      const c = row.changes as { old?: Record<string, unknown>; new?: Record<string, unknown> };
      if (c.old && c.new) {
        const changed = Object.keys(c.new).filter(
          (k) => JSON.stringify(c.new![k]) !== JSON.stringify(c.old![k]) && k !== 'updated_at'
        );
        if (changed.length === 0) return 'Päivitetty (ei muutoksia)';
        return `Muutetut kentät: ${changed.slice(0, 4).join(', ')}${changed.length > 4 ? '…' : ''}`;
      }
    }
    return row.action;
  };

  return (
    <div className="mx-auto max-w-5xl">
      <AdminPageHeader eyebrow="Loki" title="Toimintaloki" />

      <div className="rounded-lg border border-cream/10 bg-forest-deep p-4 md:p-6">
        <div className="grid gap-3 md:grid-cols-[1fr,1fr,auto]">
          <div>
            <span className="text-xs uppercase tracking-widest text-cream/55">Taulu</span>
            <select value={filterTable} onChange={(e) => { setFilterTable(e.target.value); setPage(0); }} className={`${inputClass} mt-1`}>
              <option value="">Kaikki</option>
              {tableOptions.map((t) => <option key={t} value={t}>{t}</option>)}
            </select>
          </div>
          <div>
            <span className="text-xs uppercase tracking-widest text-cream/55">Toiminta</span>
            <select value={filterAction} onChange={(e) => { setFilterAction(e.target.value); setPage(0); }} className={`${inputClass} mt-1`}>
              {ACTIONS.map((a) => <option key={a || 'all'} value={a}>{a || 'Kaikki'}</option>)}
            </select>
          </div>
          <div className="self-end">
            <GhostButton onClick={() => { setFilterTable(''); setFilterAction(''); setPage(0); }}>Tyhjennä</GhostButton>
          </div>
        </div>
      </div>

      <div className="mt-6 rounded-lg border border-cream/10 bg-forest-deep">
        {loading ? (
          <p className="p-6 text-cream/60">Ladataan…</p>
        ) : items.length === 0 ? (
          <p className="p-6 text-cream/60">Ei lokimerkintöjä.</p>
        ) : (
          <ul className="divide-y divide-cream/10">
            {items.map((row) => {
              const actionColor =
                row.action === 'insert' ? 'text-emerald-300' :
                row.action === 'delete' ? 'text-red-300' : 'text-amber';
              return (
                <li key={row.id} className="p-4 md:p-5">
                  <div className="flex flex-wrap items-baseline gap-3">
                    <span className={`font-display text-sm uppercase tracking-widest ${actionColor}`}>{row.action}</span>
                    <span className="font-display text-base text-cream">{row.table_name}</span>
                    {row.record_id && <span className="text-xs text-cream/45">id: {row.record_id.slice(0, 8)}…</span>}
                    <span className="ml-auto text-xs text-cream/40">{fmtTime(row.created_at)}</span>
                  </div>
                  <p className="mt-1 text-sm text-cream/75">{summarise(row)}</p>
                  <p className="mt-1 text-xs text-cream/45">{row.user_email ?? 'system'}</p>
                </li>
              );
            })}
          </ul>
        )}

        {total > PAGE && (
          <div className="flex items-center justify-between border-t border-cream/10 p-4">
            <span className="text-xs text-cream/55">Sivu {page + 1} / {Math.ceil(total / PAGE)}</span>
            <div className="flex gap-2">
              <GhostButton onClick={() => setPage((p) => Math.max(0, p - 1))} disabled={page === 0}>Edellinen</GhostButton>
              <GhostButton onClick={() => setPage((p) => p + 1)} disabled={(page + 1) * PAGE >= total}>Seuraava</GhostButton>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
