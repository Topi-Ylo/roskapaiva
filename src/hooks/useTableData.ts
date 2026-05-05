import { useEffect, useState } from 'react';
import { supabase, SUPABASE_CONFIGURED } from '../lib/supabase';
import { useAuth } from '../lib/auth';
import { usePreview } from '../lib/preview';

interface Options {
  orderBy?: string;
  ascending?: boolean;
  /** If true, filter by published=true UNLESS an admin has enabled preview mode. */
  publishedOnly?: boolean;
}

interface State<T> {
  data: T[] | null;
  loading: boolean;
  error: string | null;
}

export function useTableData<T = unknown>(table: string, opts: Options = {}): State<T> {
  const { orderBy = 'sort_order', ascending = true, publishedOnly = true } = opts;
  const { isAdmin } = useAuth();
  const { enabled: previewEnabled } = usePreview();
  const [state, setState] = useState<State<T>>({ data: null, loading: true, error: null });

  // When admin is logged in AND preview is on, skip the published filter.
  const showDrafts = isAdmin && previewEnabled;

  useEffect(() => {
    if (!SUPABASE_CONFIGURED || !supabase) {
      setState({ data: null, loading: false, error: null });
      return;
    }

    let cancelled = false;

    async function load() {
      let q = supabase!.from(table).select('*').order(orderBy, { ascending });
      if (publishedOnly && !showDrafts) q = q.eq('published', true);
      const { data, error } = await q;
      if (cancelled) return;
      if (error) setState({ data: null, loading: false, error: error.message });
      else setState({ data: (data ?? []) as T[], loading: false, error: null });
    }

    load();
    return () => { cancelled = true; };
  }, [table, orderBy, ascending, publishedOnly, showDrafts]);

  return state;
}
