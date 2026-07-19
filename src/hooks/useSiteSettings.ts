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
  /** Roskapäivä '26 page copy. Paragraphs separated by a blank line. */
  event_hero_body: string | null;
  event_program_title: string | null;
  event_program_body: string | null;
  /** Headline act shown above the hero image. */
  event_headliner: string | null;
  /** Photo shown in the hero's right column (the headliner's picture). */
  event_headliner_image: string | null;
}

export const EVENT_HERO_BODY_FALLBACK = `Kerätään yhdessä, juhlitaan tehtyä työtä ja tehdään Helsingistä vähän siistimpi. Voit osallistua myös kotiseudullasi: kerää roskia oman matkasi varrelta ja jaa kuva tunnisteella #roskapäivä2026

Roskapäivä-tapahtumaa järjestävät vuosittain Roskapäivän Eino sekä Sergio Cleaning Angelsilta. Tapahtuman tavoitteena on tuoda ihmiset yhteen tekemään konkreettisia ympäristötekoja rennossa ja yhteisöllisessä hengessä. Jokainen kerätty roska on askel kohti puhtaampaa ympäristöä – ja samalla mahdollisuus inspiroida yhä useampia pitämään yhdessä huolta luonnostamme.`;

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
  event_hero_body: EVENT_HERO_BODY_FALLBACK,
  event_program_title: 'Enemmän kuin siivous.',
  event_program_body:
    'Ulkona tapahtuvan siivouksen lomassa nautitaan inspiroivista puheista, livemusiikista, yritysten pop-up-näyttelystä, lasten aktiviteeteista, kahvilasta ja rentoutumisalueesta. Roskapäivä on juhla puhtaamman ympäristön puolesta.',
  event_headliner: 'Jaakko Kulta',
  event_headliner_image: null,
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
