-- 0031: actually take the purge function away from anon.
--
-- 0030 tried to do this with "revoke all ... from public", which was not enough.
-- Supabase installs ALTER DEFAULT PRIVILEGES granting EXECUTE on new functions
-- in the public schema to anon and authenticated by name. Revoking from PUBLIC
-- removes the implicit grant and leaves the named ones untouched, so
-- purge_expired_personal_data() — SECURITY DEFINER, and it deletes rows — stayed
-- callable by anyone holding the anon key, which ships in the site bundle.
--
-- Nothing was lost: the function only removes data already past its retention
-- window, and on the day this was found nothing had reached one, so every call
-- returned zeros. It would not have stayed harmless once rows began ageing out.
--
-- email_daily_remaining() in 0030 named anon in its revoke and was never
-- affected. That difference is the whole lesson: name the roles.

revoke all on function public.purge_expired_personal_data() from public, anon, authenticated;

-- record_email_optout() keeps its grant to anon on purpose: an unsubscribe link
-- has to work for a logged-out reader holding nothing but a token, and the
-- function only ever writes that token's own address to the opt-out list.
