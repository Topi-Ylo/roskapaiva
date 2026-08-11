import type { Handler } from '@netlify/functions';
import { Resend } from 'resend';
import { FROM_EMAIL, SITE_URL, adminClient, esc, layout } from './_shared';

/**
 * Sends one slice of a bulk campaign, then reports what is left.
 *
 * RESEND FREE TIER: ~2 requests/second, 100 e-mails per day, 3000 per month.
 * This function therefore:
 *   * paces itself at PACE_MS between sends, comfortably under the rate limit;
 *   * never sends more than the remaining daily allowance, which the database
 *     computes across every campaign, not just this one;
 *   * processes at most BATCH_SIZE per invocation so it finishes well inside
 *     Netlify's function timeout.
 *
 * The caller re-invokes until `remaining` reaches zero. Because each recipient
 * row is marked individually, an interrupted run simply resumes.
 */

/** Recipients per invocation. BATCH_SIZE * PACE_MS must stay under the timeout. */
const BATCH_SIZE = 20;
/** Gap between sends, ~4/second. */
const PACE_MS = 250;

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

/** Visible opt-out, in the body as well as the header: mail clients honour the
 *  header, people look for the link. */
function unsubscribeFooter(url: string): string {
  return `<p style="margin:28px 0 0;padding-top:16px;border-top:1px solid rgba(244,241,232,0.12);font:400 12px/1.5 Inter,Arial,sans-serif;color:rgba(244,241,232,0.4);">
    Saat tämän viestin, koska ilmoitit tapahtuman Roskapäivän kartalle.
    <a href="${url}" style="color:rgba(244,241,232,0.6);">Poistu postituslistalta</a>.
  </p>`;
}

/** Plain text from the admin, rendered into the site's e-mail shell. */
function renderBody(body: string, name: string | null): string {
  const greeting = name ? `<p style="margin:0 0 16px;">Hei ${esc(name)},</p>` : '';
  const paragraphs = body
    .split(/\n\n+/)
    .map((p) => p.trim())
    .filter(Boolean)
    .map((p) => `<p style="margin:0 0 16px;">${esc(p).replace(/\n/g, '<br>')}</p>`)
    .join('');
  return greeting + paragraphs;
}

export const handler: Handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    return { statusCode: 500, body: JSON.stringify({ error: 'RESEND_API_KEY puuttuu.' }) };
  }

  let campaignId: string | undefined;
  try {
    campaignId = JSON.parse(event.body ?? '{}').campaignId;
  } catch {
    return { statusCode: 400, body: JSON.stringify({ error: 'Virheellinen pyyntö.' }) };
  }
  if (!campaignId) {
    return { statusCode: 400, body: JSON.stringify({ error: 'campaignId puuttuu.' }) };
  }

  try {
    const supabase = adminClient();

    // This endpoint can send mail to every organiser we hold, so it is only
    // ever available to a signed-in admin. The caller's own access token is
    // verified, then checked against the admins table.
    const token = (event.headers.authorization ?? '').replace(/^Bearer\s+/i, '');
    if (!token) return { statusCode: 401, body: JSON.stringify({ error: 'Kirjautuminen vaaditaan.' }) };

    const { data: userData, error: userError } = await supabase.auth.getUser(token);
    if (userError || !userData?.user) {
      return { statusCode: 401, body: JSON.stringify({ error: 'Istunto ei kelpaa.' }) };
    }
    const { data: adminRow } = await supabase
      .from('admins')
      .select('user_id')
      .eq('user_id', userData.user.id)
      .maybeSingle();
    if (!adminRow) {
      return { statusCode: 403, body: JSON.stringify({ error: 'Vain ylläpitäjille.' }) };
    }

    const { data: campaign, error: campaignError } = await supabase
      .from('email_campaigns')
      .select('*')
      .eq('id', campaignId)
      .single();
    if (campaignError || !campaign) {
      return { statusCode: 404, body: JSON.stringify({ error: 'Kampanjaa ei löytynyt.' }) };
    }

    // Daily allowance is shared across campaigns, so ask the database.
    const { data: remainingToday } = await supabase.rpc('email_daily_remaining');
    const allowance = Math.max(0, Number(remainingToday ?? 0));

    if (allowance === 0) {
      const { count } = await supabase
        .from('email_sends')
        .select('id', { count: 'exact', head: true })
        .eq('campaign_id', campaignId)
        .eq('status', 'pending');
      return {
        statusCode: 200,
        body: JSON.stringify({
          sent: 0,
          failed: 0,
          remaining: count ?? 0,
          dailyRemaining: 0,
          note: 'Päivän 100 viestin raja täynnä. Jatka huomenna.',
        }),
      };
    }

    const take = Math.min(BATCH_SIZE, allowance);
    const { data: batch } = await supabase
      .from('email_sends')
      .select('id, email, recipient_name, unsubscribe_token')
      .eq('campaign_id', campaignId)
      .eq('status', 'pending')
      .limit(take);

    let rows = batch ?? [];

    // Opt-outs are honoured at send time, not at audience-build time. A campaign
    // prepared last week must not mail someone who unsubscribed yesterday.
    if (rows.length) {
      const { data: optedOut } = await supabase
        .from('email_optouts')
        .select('email')
        .in('email', rows.map((r) => r.email.toLowerCase()));
      const blocked = new Set((optedOut ?? []).map((o: { email: string }) => o.email));
      const skipped = rows.filter((r) => blocked.has(r.email.toLowerCase()));
      if (skipped.length) {
        // Marked failed rather than left pending, so the campaign can finish
        // instead of retrying an address that will never be mailed.
        await supabase
          .from('email_sends')
          .update({ status: 'failed', error: 'Vastaanottaja on poistunut postituslistalta' })
          .in('id', skipped.map((r) => r.id));
        rows = rows.filter((r) => !blocked.has(r.email.toLowerCase()));
      }
    }

    if (rows.length === 0) {
      await supabase.from('email_campaigns').update({ status: 'sent' }).eq('id', campaignId);
      return {
        statusCode: 200,
        body: JSON.stringify({ sent: 0, failed: 0, remaining: 0, dailyRemaining: allowance }),
      };
    }

    await supabase.from('email_campaigns').update({ status: 'sending' }).eq('id', campaignId);

    const resend = new Resend(apiKey);
    let sent = 0;
    let failed = 0;

    for (const [i, row] of rows.entries()) {
      if (i > 0) await sleep(PACE_MS);
      try {
        const unsubscribeUrl =
          `${SITE_URL}/.netlify/functions/unsubscribe?t=${row.unsubscribe_token}`;
        await resend.emails.send({
          from: FROM_EMAIL,
          to: row.email,
          subject: campaign.subject,
          html: layout(
            esc(campaign.subject),
            renderBody(campaign.body, row.recipient_name) + unsubscribeFooter(unsubscribeUrl)
          ),
          headers: {
            // Lets Gmail and Outlook show their own one-click unsubscribe, which
            // is what keeps bulk mail out of the spam folder.
            'List-Unsubscribe': `<${unsubscribeUrl}>`,
            'List-Unsubscribe-Post': 'List-Unsubscribe=One-Click',
          },
        });
        await supabase
          .from('email_sends')
          .update({ status: 'sent', sent_at: new Date().toISOString(), error: null })
          .eq('id', row.id);
        sent += 1;
      } catch (err) {
        await supabase
          .from('email_sends')
          .update({ status: 'failed', error: err instanceof Error ? err.message : 'virhe' })
          .eq('id', row.id);
        failed += 1;
      }
    }

    const { count: stillPending } = await supabase
      .from('email_sends')
      .select('id', { count: 'exact', head: true })
      .eq('campaign_id', campaignId)
      .eq('status', 'pending');

    if ((stillPending ?? 0) === 0) {
      await supabase.from('email_campaigns').update({ status: 'sent' }).eq('id', campaignId);
    }

    const { data: nowRemaining } = await supabase.rpc('email_daily_remaining');

    return {
      statusCode: 200,
      body: JSON.stringify({
        sent,
        failed,
        remaining: stillPending ?? 0,
        dailyRemaining: Math.max(0, Number(nowRemaining ?? 0)),
      }),
    };
  } catch (err) {
    console.error('send-campaign epäonnistui', err);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: err instanceof Error ? err.message : 'virhe' }),
    };
  }
};
