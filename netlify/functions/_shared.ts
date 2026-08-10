import { createClient, type SupabaseClient } from '@supabase/supabase-js';

/**
 * Service-role Supabase client. Used only inside Netlify Functions, never in
 * the browser: it bypasses RLS so it can read organiser contact details and
 * flip a submission's status.
 */
export function adminClient(): SupabaseClient {
  const url = process.env.SUPABASE_URL ?? process.env.VITE_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) {
    throw new Error(
      'Puuttuvat ympäristömuuttujat: SUPABASE_URL ja SUPABASE_SERVICE_ROLE_KEY vaaditaan.'
    );
  }
  return createClient(url, key, { auth: { persistSession: false } });
}

export const ADMIN_EMAIL = process.env.ADMIN_EMAIL ?? 'eino@roskapaiva.com';
/** Must be a domain verified in Resend. */
export const FROM_EMAIL = process.env.RESEND_FROM ?? 'Roskapäivä <no-reply@roskapaiva.fi>';
export const SITE_URL = process.env.SITE_URL ?? 'https://roskapaiva.fi';

export interface CommunityEventRow {
  id: string;
  organizer_name: string;
  organizer_email: string;
  city: string;
  event_date: string;
  start_time: string | null;
  duration_minutes: number;
  description: string;
  image_url: string | null;
  status: string;
  approval_token: string;
}

const MONTHS_FI = [
  'tammikuuta', 'helmikuuta', 'maaliskuuta', 'huhtikuuta', 'toukokuuta', 'kesäkuuta',
  'heinäkuuta', 'elokuuta', 'syyskuuta', 'lokakuuta', 'marraskuuta', 'joulukuuta',
];

export function formatDate(iso: string): string {
  const [y, m, d] = iso.split('-').map(Number);
  if (!y || !m || !d) return iso;
  return `${d}. ${MONTHS_FI[m - 1]} ${y}`;
}

export function formatTime(t: string | null): string {
  if (!t) return '';
  const [h, min] = t.split(':');
  return `${Number(h)}.${min ?? '00'}`;
}

export function formatDuration(minutes: number): string {
  if (minutes >= 480) return 'Koko päivä';
  const h = minutes / 60;
  return Number.isInteger(h) ? `${h} h` : `${String(h).replace('.', ',')} h`;
}

/** Minimal HTML escaping for values interpolated into the e-mails. */
export function esc(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

/**
 * As esc(), but keeps the organiser's line breaks. Uses <br> rather than
 * white-space:pre-line because Outlook renders with the Word engine, which
 * ignores the property.
 */
export function escMultiline(s: string): string {
  return esc(s).replace(/\r\n?|\n/g, '<br>');
}

/** Shared shell so both e-mails look like the site. */
export function layout(title: string, body: string): string {
  return `<!doctype html><html lang="fi"><body style="margin:0;padding:0;background:#0B160F;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#0B160F;padding:32px 16px;">
    <tr><td align="center">
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:560px;background:#13241A;border:1px solid rgba(244,241,232,0.12);">
        <tr><td style="padding:32px 32px 8px;">
          <p style="margin:0;font:600 11px/1 Inter,Arial,sans-serif;letter-spacing:0.28em;text-transform:uppercase;color:#C9A227;">Roskapäivä</p>
          <h1 style="margin:16px 0 0;font:700 28px/1.15 Georgia,serif;color:#F4F1E8;">${title}</h1>
        </td></tr>
        <tr><td style="padding:8px 32px 32px;font:400 15px/1.6 Inter,Arial,sans-serif;color:rgba(244,241,232,0.82);">
          ${body}
        </td></tr>
      </table>
      <p style="margin:16px 0 0;font:400 12px/1.5 Inter,Arial,sans-serif;color:rgba(244,241,232,0.35);">roskapaiva.fi</p>
    </td></tr>
  </table></body></html>`;
}

export function detailsTable(e: CommunityEventRow): string {
  const rows: [string, string][] = [
    ['Paikkakunta', esc(e.city)],
    ['Päivämäärä', formatDate(e.event_date)],
    ['Kellonaika', e.start_time ? `klo ${formatTime(e.start_time)}` : 'ei ilmoitettu'],
    ['Kesto', formatDuration(e.duration_minutes)],
    ['Kuvaus', escMultiline(e.description)],
    ['Ilmoittaja', `${esc(e.organizer_name)} (${esc(e.organizer_email)})`],
  ];
  return `<table role="presentation" cellpadding="0" cellspacing="0" width="100%" style="margin:20px 0;border-top:1px solid rgba(244,241,232,0.12);">
    ${rows
      .map(
        ([k, v]) =>
          `<tr><td style="padding:10px 0 10px;border-bottom:1px solid rgba(244,241,232,0.08);font:600 11px/1.4 Inter,Arial,sans-serif;letter-spacing:0.16em;text-transform:uppercase;color:rgba(244,241,232,0.45);width:38%;vertical-align:top;">${k}</td>
           <td style="padding:10px 0;border-bottom:1px solid rgba(244,241,232,0.08);font:400 15px/1.5 Inter,Arial,sans-serif;color:#F4F1E8;">${v}</td></tr>`
      )
      .join('')}
  </table>`;
}

export function button(href: string, label: string, primary = true): string {
  const bg = primary ? '#C9A227' : 'transparent';
  const color = primary ? '#0B160F' : '#F4F1E8';
  const border = primary ? '#C9A227' : 'rgba(244,241,232,0.4)';
  return `<a href="${href}" style="display:inline-block;margin:0 8px 8px 0;padding:13px 26px;background:${bg};border:1px solid ${border};color:${color};font:600 11px/1 Inter,Arial,sans-serif;letter-spacing:0.18em;text-transform:uppercase;text-decoration:none;">${label}</a>`;
}
