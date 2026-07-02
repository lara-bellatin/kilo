-- =============================================================
-- Kilo — free entries (entradas fuera del plan)
-- =============================================================
--
-- Registro honesto de comidas que no pertenecen al plan
-- (ej. almuerzo en restaurante). No cuenta para el "escoge N"
-- de ningún grupo.
-- =============================================================

create table free_entries (
  id          uuid primary key default gen_random_uuid(),
  day_log_id  uuid not null references day_logs on delete cascade,
  section_id  uuid references plan_sections on delete set null,
  description text not null,
  quantity    numeric,
  unit        food_unit,
  notes       text,
  created_at  timestamptz not null default now()
);

create index free_entries_day on free_entries (day_log_id);

alter table free_entries enable row level security;

create policy "own free_entries" on free_entries
  for all using (
    exists (select 1 from day_logs d where d.id = day_log_id and d.user_id = auth.uid())
  ) with check (
    exists (select 1 from day_logs d where d.id = day_log_id and d.user_id = auth.uid())
  );
