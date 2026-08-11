import type { Handler } from '@netlify/functions';
import { adminClient } from './_shared';

/**
 * The opt-out behind every bulk e-mail.
 *
 * Deliberately does its work on GET. That breaks the usual rule about GET being
 * side-effect free, but an unsubscribe link has to work from a mail client with
 * one click and no JavaScript — and the alternative, a page with a button, is
 * exactly the friction that makes people hit "report spam" instead.
 *
 * Answers the same way whether or not the token matched. A token that reveals
 * whether an address is on the list would be a small enumeration oracle, and
 * there is nothing useful for the reader to do differently either way.
 */
function page(title: string, body: string): string {
  return `<!doctype html><html lang="fi"><head><meta charset="utf-8">
  <meta name="viewport" content="width=device-width,initial-scale=1">
  <meta name="robots" content="noindex">
  <title>${title} — Roskapäivä</title></head>
  <body style="margin:0;background:#0B160F;font:400 16px/1.6 -apple-system,Segoe UI,Inter,Arial,sans-serif;color:#F4F1E8;">
    <div style="max-width:520px;margin:0 auto;padding:80px 24px;">
      <p style="margin:0;font:600 11px/1 Inter,Arial,sans-serif;letter-spacing:0.28em;text-transform:uppercase;color:#C9A227;">Roskapäivä</p>
      <h1 style="margin:20px 0 0;font:700 30px/1.2 Georgia,serif;">${title}</h1>
      <p style="margin:20px 0 0;color:rgba(244,241,232,0.75);">${body}</p>
      <p style="margin:32px 0 0;"><a href="https://roskapaiva.fi" style="color:#C9A227;">roskapaiva.fi</a></p>
    </div>
  </body></html>`;
}

const html = (statusCode: number, body: string) => ({
  statusCode,
  headers: { 'Content-Type': 'text/html; charset=utf-8' },
  body,
});

export const handler: Handler = async (event) => {
  const token = event.queryStringParameters?.t;

  const done = html(
    200,
    page(
      'Olet poistunut postituslistalta',
      'Emme lähetä sinulle enää Roskapäivän tiedotteita. Tapahtumasi säilyy kartalla ' +
        'normaalisti. Jos haluat poistaa myös tapahtumatietosi, laita viesti osoitteeseen ' +
        '<a href="mailto:eino@roskapaiva.com" style="color:#C9A227;">eino@roskapaiva.com</a>.'
    )
  );

  if (!token) return done;

  try {
    const supabase = adminClient();
    // The function resolves the token to an address and records the opt-out;
    // the address itself never travels in the link.
    await supabase.rpc('record_email_optout', { p_token: token });
  } catch (err) {
    console.error('unsubscribe epäonnistui', err);
    return html(
      500,
      page(
        'Jokin meni pieleen',
        'Peruutusta ei saatu tallennettua. Lähetä viesti osoitteeseen ' +
          '<a href="mailto:eino@roskapaiva.com" style="color:#C9A227;">eino@roskapaiva.com</a>, ' +
          'niin poistamme sinut listalta käsin.'
      )
    );
  }

  return done;
};
