-- 0030: retention, unsubscribe, and rotating the exposed approval tokens.
--
-- The privacy notice published in 0028's release makes three promises. This
-- migration is what makes them true rather than aspirational.

-- ─────────────────────────────────────────────────────────────────────────────
-- 1. Unsubscribe
-- ─────────────────────────────────────────────────────────────────────────────
-- Every marketing e-mail must carry a working opt-out, and honouring it has to
-- be automatic rather than Eino remembering. Opt-outs are keyed by address, not
-- by row: one person may have signed up several events and unsubscribing once
-- must cover all of them.

create table if not exists public.email_optouts (
  email      text primary key,
  source     text,
  created_at timestamptz default now()
);

alter table public.email_optouts enable row level security;

drop policy if exists "admins_all_email_optouts" on public.email_optouts;
create policy "admins_all_email_optouts" on public.email_optouts
  for all using (public.is_admin()) with check (public.is_admin());

-- The token lives on the send row rather than on the organiser, so each e-mail
-- carries its own random link. Nothing to guess and nothing to enumerate, and
-- no new shared secret to configure in Netlify.
alter table public.email_sends
  add column if not exists unsubscribe_token uuid not null default gen_random_uuid();

create index if not exists email_sends_unsubscribe_idx
  on public.email_sends (unsubscribe_token);

-- Not every campaign is marketing. A thank-you to the people who ran an event
-- rests on legitimate interest; news about next year does not. Without this
-- distinction, gating on consent would either block the thank-you or wave the
-- marketing through.
alter table public.email_campaigns
  add column if not exists kind text not null default 'event'
    check (kind in ('event', 'marketing'));

/**
 * Records an opt-out from the token in a sent e-mail. SECURITY DEFINER so the
 * unsubscribe link works for someone who is not logged in and holds no key,
 * which is the entire point of an unsubscribe link.
 *
 * Returns true when a token matched. Idempotent: clicking twice is not an error.
 */
create or replace function public.record_email_optout(p_token uuid)
returns boolean
language plpgsql security definer
as $$
declare
  v_email text;
begin
  select email into v_email from public.email_sends where unsubscribe_token = p_token;
  if v_email is null then
    return false;
  end if;
  insert into public.email_optouts (email, source)
  values (lower(v_email), 'unsubscribe-link')
  on conflict (email) do nothing;
  return true;
end;
$$;

revoke all on function public.record_email_optout(uuid) from public;
grant execute on function public.record_email_optout(uuid) to anon, authenticated;

-- ─────────────────────────────────────────────────────────────────────────────
-- 2. Retention
-- ─────────────────────────────────────────────────────────────────────────────
-- The notice commits to: rejected submissions gone within 90 days, organiser
-- contact details gone or anonymised within 12 months of the event, statistics
-- kept without personal data.
--
-- organizer_email has to become nullable for the anonymisation to be possible.
-- New submissions are unaffected: the insert policy still requires a valid
-- address, and a null would fail its length check.
alter table public.community_events alter column organizer_email drop not null;

/**
 * Applies the retention promises. Returns what it did, so the scheduled caller
 * can log something meaningful rather than a bare 200.
 *
 * organizer_name is deliberately kept: it is published on the map as the credit
 * for who ran the event, and removing it would rewrite the public record. What
 * goes is the contact detail and the private location — the things nobody needs
 * a year later.
 */
create or replace function public.purge_expired_personal_data()
returns jsonb
language plpgsql security definer
as $$
declare
  v_rejected int;
  v_anonymised int;
  v_sends int;
begin
  delete from public.community_events
  where status = 'rejected'
    and created_at < now() - interval '90 days';
  get diagnostics v_rejected = row_count;

  update public.community_events
  set organizer_email = null,
      address         = null,
      district        = null,
      admin_note      = null
  where event_date < (current_date - interval '12 months')
    and organizer_email is not null;
  get diagnostics v_anonymised = row_count;

  -- Send rows hold the same addresses; keeping them would undo the above.
  delete from public.email_sends
  where created_at < now() - interval '12 months';
  get diagnostics v_sends = row_count;

  return jsonb_build_object(
    'rejected_deleted', v_rejected,
    'organisers_anonymised', v_anonymised,
    'send_rows_deleted', v_sends
  );
end;
$$;

revoke all on function public.purge_expired_personal_data() from public;
-- service role only; the scheduled function calls it and nobody else needs to.

-- ─────────────────────────────────────────────────────────────────────────────
-- 3. Tighten a function grant
-- ─────────────────────────────────────────────────────────────────────────────
-- 0022 granted email_daily_remaining() to authenticated, but Postgres also
-- grants EXECUTE to PUBLIC by default, so anon could call it and read back how
-- many e-mails Roskapäivä had sent in the last 24 hours. Small, but free to
-- close and nobody outside the admin has any use for it.

revoke execute on function public.email_daily_remaining() from public, anon;
grant execute on function public.email_daily_remaining() to authenticated;

-- ─────────────────────────────────────────────────────────────────────────────
-- 4. Rotate the approval tokens
-- ─────────────────────────────────────────────────────────────────────────────
-- Before 0027, approved rows were readable by anon, so every current token has
-- been publicly visible. Rotating invalidates them.
--
-- Approve / reject links already sitting in Eino's inbox stop working. That is
-- the intended effect; the admin does the same job.
update public.community_events set approval_token = gen_random_uuid();
