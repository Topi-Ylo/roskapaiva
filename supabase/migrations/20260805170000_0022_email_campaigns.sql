-- 0022 bulk e-mail to event organisers (thank-you notes and the like).
--
-- RESEND FREE TIER LIMITS, which shape this whole design:
--   * ~2 requests/second sustained. The sender paces itself well under that.
--   * 100 e-mails per DAY. This is the binding constraint: one campaign to more
--     than 100 organisers cannot go out in a single day.
--   * 3000 e-mails per month.
--
-- Consequences baked in here:
--   * A campaign is a set of per-recipient rows, each independently pending /
--     sent / failed. Sending is therefore resumable: the function processes a
--     slice per invocation, so a Netlify timeout never loses progress and a
--     campaign larger than the daily cap simply continues tomorrow.
--   * `unique (campaign_id, email)` makes double-sending impossible even if the
--     admin clicks send twice or a retry overlaps.
--   * The daily allowance is counted from `sent_at` across all campaigns, so
--     the cap holds even when several campaigns run on the same day.

create table if not exists public.email_campaigns (
  id          uuid primary key default gen_random_uuid(),
  subject     text not null,
  body        text not null,
  -- which organisers were snapshotted into email_sends when this was prepared
  audience    text not null default 'approved'
                check (audience in ('approved', 'all')),
  status      text not null default 'draft'
                check (status in ('draft', 'sending', 'sent', 'failed')),
  created_by  uuid references auth.users(id),
  created_at  timestamptz default now(),
  updated_at  timestamptz default now()
);

create table if not exists public.email_sends (
  id           uuid primary key default gen_random_uuid(),
  campaign_id  uuid not null references public.email_campaigns(id) on delete cascade,
  email        text not null,
  recipient_name text,
  status       text not null default 'pending'
                 check (status in ('pending', 'sent', 'failed')),
  error        text,
  sent_at      timestamptz,
  created_at   timestamptz default now(),
  unique (campaign_id, email)
);

create index if not exists email_sends_pending_idx
  on public.email_sends (campaign_id, status);
create index if not exists email_sends_sent_at_idx
  on public.email_sends (sent_at) where status = 'sent';

drop trigger if exists email_campaigns_updated_at on public.email_campaigns;
create trigger email_campaigns_updated_at before update on public.email_campaigns
  for each row execute function public.set_updated_at();

alter table public.email_campaigns enable row level security;
alter table public.email_sends     enable row level security;

-- Admin only, both tables. Nothing here is ever public: these rows hold
-- organisers' e-mail addresses.
drop policy if exists "admins_all_email_campaigns" on public.email_campaigns;
create policy "admins_all_email_campaigns" on public.email_campaigns
  for all using (public.is_admin()) with check (public.is_admin());

drop policy if exists "admins_all_email_sends" on public.email_sends;
create policy "admins_all_email_sends" on public.email_sends
  for all using (public.is_admin()) with check (public.is_admin());

/**
 * How many sends are still allowed today, against Resend's 100/day free tier
 * cap. Counted over a rolling 24 hours, which is the conservative reading.
 */
create or replace function public.email_daily_remaining()
returns int
language sql security definer stable
as $$
  select greatest(
    0,
    100 - (
      select count(*)::int from public.email_sends
      where status = 'sent' and sent_at > now() - interval '24 hours'
    )
  );
$$;

grant execute on function public.email_daily_remaining() to authenticated;
