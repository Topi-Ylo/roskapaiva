-- 0009 event content: CMS-driven schedule + program for the 5.9.2026 event tab.
--
-- Adds two content tables that mirror the conventions of past_events:
-- public read of published rows, admin full access, updated_at + audit triggers.
--   event_schedule — the day's time slots (also feeds the hero subtitle)
--   event_program  — the "Ohjelmassa" list

create table if not exists public.event_schedule (
  id          uuid primary key default gen_random_uuid(),
  slot_time   text not null,
  label       text not null,
  place       text not null,
  area        text,
  body        text,
  image_url   text,
  sort_order  int default 0,
  published   boolean default true,
  created_at  timestamptz default now(),
  updated_at  timestamptz default now()
);

create table if not exists public.event_program (
  id          uuid primary key default gen_random_uuid(),
  label       text not null,
  sort_order  int default 0,
  published   boolean default true,
  created_at  timestamptz default now(),
  updated_at  timestamptz default now()
);

-- updated_at + audit triggers (reuse the functions from 0001_initial_schema)
do $$ declare t text;
begin
  for t in select unnest(array['event_schedule','event_program']) loop
    execute format(
      'drop trigger if exists %I_updated_at on public.%I; '
      'create trigger %I_updated_at before update on public.%I '
      'for each row execute function public.set_updated_at();',
      t, t, t, t);
    execute format(
      'drop trigger if exists audit_%I on public.%I; '
      'create trigger audit_%I after insert or update or delete on public.%I '
      'for each row execute function public.audit_changes();',
      t, t, t, t);
  end loop;
end $$;

-- Row Level Security
alter table public.event_schedule enable row level security;
alter table public.event_program  enable row level security;

do $$ declare t text;
begin
  for t in select unnest(array['event_schedule','event_program']) loop
    execute format('drop policy if exists "public_read_%s" on public.%I;', t, t);
    execute format('create policy "public_read_%s" on public.%I for select using (published = true);', t, t);
    execute format('drop policy if exists "admins_all_%s" on public.%I;', t, t);
    execute format('create policy "admins_all_%s" on public.%I for all using (public.is_admin()) with check (public.is_admin());', t, t);
  end loop;
end $$;

-- Seed schedule (only when the table is still empty, so re-runs don't duplicate)
insert into public.event_schedule (slot_time, label, place, area, body, image_url, sort_order)
select * from (values
  ('11–14', 'Siivoustapahtuma', 'Karhupuisto', 'Helsinki',
   'Kerätään yhdessä roskat puistosta ja lähikortteleista. Hanskat ja säkit löytyvät paikan päältä, joten mukaan pääsee ilman varusteita. Tule porukalla tai yksin, kaikki ovat tervetulleita.',
   'https://www.mustankorkea.fi/wp-content/uploads/2024/09/roskapaiva-4.jpg', 10),
  ('14–16.30', 'Afterpartyt', 'Kohde Helsinki', 'Kivenheiton päässä Karhupuistosta',
   'Siirrytään juhlimaan tehtyä työtä. Luvassa puheita, livemusiikkia, kahvilaa ja rentoa meininkiä hyvässä seurassa. Tapahtuma on osallistujille ilmainen, kiitos sponsorien.',
   'https://uula.fi/wp-content/uploads/2024/11/roskapaiva-kalliolla.webp', 20)
) as v(slot_time, label, place, area, body, image_url, sort_order)
where not exists (select 1 from public.event_schedule);

-- Seed program
insert into public.event_program (label, sort_order)
select * from (values
  ('Puheita ja inspiraatiota', 10),
  ('Livemusiikkia', 20),
  ('Yritysten pop-up-näyttelyitä', 30),
  ('Lasten ohjelmaa', 40),
  ('Kahvila', 50),
  ('Rentoutumisalueita', 60)
) as v(label, sort_order)
where not exists (select 1 from public.event_program);
