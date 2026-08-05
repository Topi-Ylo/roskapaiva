import type { Handler } from '@netlify/functions';
import { Resend } from 'resend';
import {
  FROM_EMAIL,
  SITE_URL,
  adminClient,
  button,
  esc,
  layout,
  type CommunityEventRow,
} from './_shared';

/**
 * Target of the approve / reject links in Eino's notification e-mail.
 * The approval_token is rotated after a successful action, so each link works
 * once and a forwarded e-mail cannot be replayed.
 */

function page(title: string, message: string, tone: 'ok' | 'warn' = 'ok'): string {
  const accent = tone === 'ok' ? '#C9A227' : 'rgba(244,241,232,0.6)';
  return `<!doctype html><html lang="fi"><head><meta charset="utf-8">
  <meta name="viewport" content="width=device-width,initial-scale=1">
  <title>${title} · Roskapäivä</title></head>
  <body style="margin:0;min-height:100vh;display:flex;align-items:center;justify-content:center;background:#0B160F;font-family:Inter,system-ui,sans-serif;padding:24px;">
    <div style="max-width:460px;text-align:center;">
      <p style="margin:0;font-size:11px;font-weight:600;letter-spacing:0.28em;text-transform:uppercase;color:${accent};">Roskapäivä</p>
      <h1 style="margin:20px 0 0;font-family:Georgia,serif;font-size:34px;line-height:1.15;color:#F4F1E8;">${title}</h1>
      <p style="margin:18px 0 28px;font-size:15px;line-height:1.6;color:rgba(244,241,232,0.7);">${message}</p>
      <a href="${SITE_URL}/admin/community-events" style="display:inline-block;padding:13px 26px;background:#C9A227;color:#0B160F;font-size:11px;font-weight:600;letter-spacing:0.18em;text-transform:uppercase;text-decoration:none;">Avaa hallinta</a>
    </div>
  </body></html>`;
}

const html = (statusCode: number, body: string) => ({
  statusCode,
  headers: { 'Content-Type': 'text/html; charset=utf-8' },
  body,
});

export const handler: Handler = async (event) => {
  const { id, token, action } = event.queryStringParameters ?? {};

  if (!id || !token || (action !== 'approve' && action !== 'reject')) {
    return html(400, page('Virheellinen linkki', 'Linkki on puutteellinen tai vanhentunut.', 'warn'));
  }

  try {
    const supabase = adminClient();
    const { data, error } = await supabase
      .from('community_events')
      .select('*')
      .eq('id', id)
      .single();

    if (error || !data) {
      return html(404, page('Tapahtumaa ei löytynyt', 'Ilmoitus on saatettu poistaa.', 'warn'));
    }

    const ev = data as CommunityEventRow;

    if (ev.approval_token !== token) {
      return html(
        403,
        page(
          'Linkki on jo käytetty',
          'Tämä hyväksymislinkki on vanhentunut. Voit hoitaa asian hallinnassa.',
          'warn'
        )
      );
    }

    const status = action === 'approve' ? 'approved' : 'rejected';
    const { error: updateError } = await supabase
      .from('community_events')
      // Rotating the token invalidates the links in the e-mail.
      .update({ status, approval_token: crypto.randomUUID() })
      .eq('id', id);

    if (updateError) {
      return html(500, page('Jokin meni pieleen', esc(updateError.message), 'warn'));
    }

    // Tell the organiser their event is live. Never block the response on it.
    if (status === 'approved' && process.env.RESEND_API_KEY) {
      try {
        await new Resend(process.env.RESEND_API_KEY).emails.send({
          from: FROM_EMAIL,
          to: ev.organizer_email,
          subject: 'Roskapäivä-tapahtumasi on nyt kartalla',
          html: layout(
            'Tapahtumasi on julkaistu',
            `<p style="margin:0 0 4px;">Hei ${esc(ev.organizer_name)},</p>
             <p style="margin:12px 0 20px;">tapahtumasi <strong style="color:#F4F1E8;">${esc(
               ev.description
             )}</strong> paikkakunnalla ${esc(
               ev.city
             )} on hyväksytty ja näkyy nyt valtakunnallisella kartalla. Kiitos että olet mukana.</p>
             ${button(`${SITE_URL}/5-9-2026#kartta`, 'Katso kartalta')}`
          ),
        });
      } catch (mailErr) {
        console.error('Hyväksymisviestin lähetys epäonnistui', mailErr);
      }
    }

    return html(
      200,
      status === 'approved'
        ? page(
            'Tapahtuma julkaistu',
            `${esc(ev.city)}: ${esc(ev.description)} näkyy nyt kartalla. Ilmoittajalle lähetettiin vahvistus.`
          )
        : page(
            'Tapahtuma hylätty',
            `${esc(ev.city)}: ${esc(ev.description)} jätettiin julkaisematta. Ilmoittajalle ei lähetetty viestiä.`,
            'warn'
          )
    );
  } catch (err) {
    console.error('approve-event epäonnistui', err);
    return html(500, page('Jokin meni pieleen', 'Yritä uudelleen hallinnan kautta.', 'warn'));
  }
};
