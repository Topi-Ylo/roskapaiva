-- 0028: the organiser's declaration, and marketing consent.
--
-- Roskapäivä runs the Helsinki main event; everything else on the map is put on
-- by someone local, and Roskapäivä's liability cover does not extend to it.
-- Before a sign-up is accepted the organiser now confirms they understand that.
--
-- Three columns rather than a boolean:
--
--   terms_accepted_at   when it was agreed
--   terms_version       WHICH wording was agreed to. The text will keep being
--                       refined, and a record of assent is worthless if you
--                       cannot show what was assented to. The version string
--                       lives next to the text itself in src/lib/organizerTerms.ts
--                       so the two cannot drift apart.
--   marketing_consent_at  separate, optional, and never pre-ticked. Processing
--                       a submission rests on legitimate interest; sending
--                       someone unrelated news later is direct marketing and
--                       needs its own consent. Null means never consented.
--
-- Enforcement is a RESTRICTIVE policy rather than an edit to the existing
-- permissive one. Restrictive policies are AND-ed with the rest, so this cannot
-- accidentally loosen the checks in 0018/0023, and a crafted request that skips
-- the browser still cannot insert without the declaration.
--
-- Scoped to anon deliberately: admins insert through admins_all_community_events
-- and are not declaring anything on a third party's behalf when they add the
-- Kallio main event by hand.
--
-- Not published. community_events_public lists its columns explicitly (0027),
-- and these are not among them.

alter table public.community_events
  add column if not exists terms_accepted_at   timestamptz,
  add column if not exists terms_version       text
    check (terms_version is null or char_length(terms_version) <= 40),
  add column if not exists marketing_consent_at timestamptz;

drop policy if exists "public_submissions_require_terms" on public.community_events;
create policy "public_submissions_require_terms" on public.community_events
  as restrictive
  for insert to anon
  with check (
    terms_accepted_at is not null
    and terms_version is not null
  );
