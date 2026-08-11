-- 0029: usein kysytyt kysymykset.
--
-- The FAQ carries the load of explaining who actually runs each event on the
-- map, what a local organiser is responsible for, and how to take part safely.
-- Eino will keep refining that wording, so it belongs in the CMS rather than in
-- the bundle — same shape as every other content table here: sort_order,
-- published, updated_at, audit trigger, public read of published rows only.
--
-- The code ships a full fallback copy, so the page is never blank if the table
-- is empty or unreachable. Seeding is left to the admin UI on purpose: seeding
-- here would fight the fallback and make it unclear which copy is authoritative.

create table if not exists public.faq_items (
  id          uuid primary key default gen_random_uuid(),
  question    text not null check (char_length(question) <= 300),
  answer      text not null check (char_length(answer) <= 4000),
  sort_order  int default 0,
  published   boolean default true,
  created_at  timestamptz default now(),
  updated_at  timestamptz default now()
);

create index if not exists faq_items_sort_idx on public.faq_items (sort_order);

drop trigger if exists faq_items_updated_at on public.faq_items;
create trigger faq_items_updated_at before update on public.faq_items
  for each row execute function public.set_updated_at();

drop trigger if exists audit_faq_items on public.faq_items;
create trigger audit_faq_items after insert or update or delete on public.faq_items
  for each row execute function public.audit_changes();

alter table public.faq_items enable row level security;

drop policy if exists "public_read_faq_items" on public.faq_items;
create policy "public_read_faq_items" on public.faq_items
  for select using (published = true);

drop policy if exists "admins_all_faq_items" on public.faq_items;
create policy "admins_all_faq_items" on public.faq_items
  for all using (public.is_admin()) with check (public.is_admin());
