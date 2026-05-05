import { useEffect, useState } from 'react';
import { supabase, SUPABASE_CONFIGURED } from '../lib/supabase';

export interface SiteSettings {
  contact_email: string | null;
  contact_phone: string | null;
  instagram_url: string | null;
  tiktok_url: string | null;
  youtube_url: string | null;
  next_event_date: string | null;
  next_event_location: string | null;
  petition_url: string | null;
  petition_open: boolean;
  mediakortti_pdf_url: string | null;
  press_zip_url: string | null;
}

const FALLBACK: SiteSettings = {
  contact_email: 'eino@roskapaiva.com',
  contact_phone: '+358 45 673 2109',
  instagram_url: 'https://instagram.com/roskapaiva',
  tiktok_url: null,
  youtube_url: null,
  next_event_date: '5.9.2026',
  next_event_location: 'Helsinki',
  petition_url: null,
  petition_open: false,
  mediakortti_pdf_url: null,
  press_zip_url: null,
};

export function useSiteSettings(): SiteSettings {
  const [settings, setSettings] = useState<SiteSettings>(FALLBACK);

  useEffect(() => {
    if (!SUPABASE_CONFIGURED || !supabase) return;
    let cancelled = false;
    supabase
      .from('site_settings')
      .select('*')
      .eq('id', 1)
      .maybeSingle()
      .then(({ data }) => {
        if (cancelled || !data) return;
        setSettings({ ...FALLBACK, ...(data as SiteSettings) });
      });
    return () => { cancelled = true; };
  }, []);

  return settings;
}
