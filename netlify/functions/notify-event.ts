import type { Handler } from '@netlify/functions';
import { Resend } from 'resend';
import {
  ADMIN_EMAIL,
  FROM_EMAIL,
  SITE_URL,
  adminClient,
  button,
  detailsTable,
  esc,
  layout,
  type CommunityEventRow,
} from './_shared';

/**
 * Called right after a volunteer submits the sign-up form. Sends Eino the
 * submission with approve / reject links, and the volunteer a confirmation.
 * The row already exists at this point, so any mail failure is logged and
 * reported without losing the sign-up.
 */
export const handler: Handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  let id: string | undefined;
  try {
    id = JSON.parse(event.body ?? '{}').id;
  } catch {
    return { statusCode: 400, body: 'Virheellinen pyyntö' };
  }
  if (!id) return { statusCode: 400, body: 'id puuttuu' };

  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    console.error('RESEND_API_KEY puuttuu, sähköposteja ei lähetetty');
    return { statusCode: 200, body: JSON.stringify({ ok: false, reason: 'no-api-key' }) };
  }

  try {
    const supabase = adminClient();
    const { data, error } = await supabase
      .from('community_events')
      .select('*')
      .eq('id', id)
      .single();

    if (error || !data) {
      return { statusCode: 404, body: 'Tapahtumaa ei löytynyt' };
    }
    const ev = data as CommunityEventRow;
    const resend = new Resend(apiKey);

    const base = `${SITE_URL}/.netlify/functions/approve-event?id=${ev.id}&token=${ev.approval_token}`;

    // 1. Eino: the submission plus one-click approve / reject.
    await resend.emails.send({
      from: FROM_EMAIL,
      to: ADMIN_EMAIL,
      replyTo: ev.organizer_email,
      subject: `Uusi Roskapäivä-tapahtuma: ${ev.city}`,
      html: layout(
        'Uusi tapahtumailmoitus',
        `<p style="margin:0 0 4px;">${esc(ev.organizer_name)} ilmoitti tapahtuman paikkakunnalla ${esc(ev.city)}.</p>
         ${detailsTable(ev)}
         ${
           ev.image_url
             ? `<img src="${esc(ev.image_url)}" alt="" style="width:100%;max-width:496px;border:1px solid rgba(244,241,232,0.12);margin:0 0 20px;">`
             : ''
         }
         <p style="margin:0 0 16px;">Hyväksy tapahtuma julkaistavaksi kartalle, tai avaa se hallinnassa muokataksesi tietoja ennen julkaisua.</p>
         <p style="margin:0;">
           ${button(`${base}&action=approve`, 'Hyväksy ja julkaise')}
           ${button(`${base}&action=reject`, 'Hylkää', false)}
         </p>
         <p style="margin:20px 0 0;font-size:13px;color:rgba(244,241,232,0.5);">
           Muokkaa tietoja: <a href="${SITE_URL}/admin/community-events" style="color:#C9A227;">hallinta</a>
         </p>`
      ),
    });

    // 2. Volunteer: confirmation that it arrived.
    await resend.emails.send({
      from: FROM_EMAIL,
      to: ev.organizer_email,
      replyTo: ADMIN_EMAIL,
      subject: 'Kiitos! Roskapäivä-ilmoituksesi on vastaanotettu',
      html: layout(
        'Kiitos ilmoituksesta',
        `<p style="margin:0 0 4px;">Hei ${esc(ev.organizer_name)},</p>
         <p style="margin:12px 0 0;">kiitos että järjestät oman Roskapäivä-tapahtuman. Ilmoituksesi on vastaanotettu ja se odottaa hyväksyntää. Kun tapahtuma on hyväksytty, se ilmestyy valtakunnalliselle kartalle osoitteessa roskapaiva.fi.</p>
         ${detailsTable(ev)}
         <p style="margin:0 0 16px;">Jos tiedoissa on korjattavaa, vastaa tähän viestiin.</p>
         ${button(`${SITE_URL}/5-9-2026#kartta`, 'Katso kartta')}`
      ),
    });

    return { statusCode: 200, body: JSON.stringify({ ok: true }) };
  } catch (err) {
    console.error('notify-event epäonnistui', err);
    return {
      statusCode: 500,
      body: JSON.stringify({ ok: false, error: err instanceof Error ? err.message : 'virhe' }),
    };
  }
};
