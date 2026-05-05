import { createClient, type SupabaseClient } from '@supabase/supabase-js';

const url = import.meta.env.VITE_SUPABASE_URL as string | undefined;
const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined;

/**
 * True when Supabase env vars are present. The public site falls back to
 * its hardcoded content arrays when this is false, so the site keeps working
 * even before the project is wired up.
 */
export const SUPABASE_CONFIGURED = Boolean(url && anonKey);

export const supabase: SupabaseClient | null = SUPABASE_CONFIGURED
  ? createClient(url as string, anonKey as string, {
      auth: { persistSession: true, autoRefreshToken: true, detectSessionInUrl: true },
    })
  : null;
