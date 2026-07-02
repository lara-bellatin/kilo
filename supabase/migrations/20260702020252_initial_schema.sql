-- =============================================================
-- Kilo — initial schema
-- =============================================================

-- Enums
create type day_type as enum ('descanso', 'entreno', 'doble_entreno');
create type section_type as enum ('comida', 'suplemento');
create type food_unit as enum (
  'g', 'ml', 'taza', 'unidad', 'cda', 'cdta',
  'scoop', 'rebanada', 'lata', 'tab', 'porcion'
);
create type weight_basis as enum ('crudo', 'cocido');

-- -------------------------------------------------------------
-- Perfiles (extiende auth.users de Supabase)
-- -------------------------------------------------------------
create table profiles (
  id          uuid primary key references auth.users on delete cascade,
  name        text not null,
  height_cm   numeric,
  created_at  timestamptz not null default now()
);

-- Trigger: crear perfil al registrarse
create function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id, name)
  values (new.id, coalesce(new.raw_user_meta_data ->> 'name', new.email));
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- -------------------------------------------------------------
-- Plan
-- -------------------------------------------------------------
create table plans (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid not null references profiles on delete cascade,
  title       text not null,
  base_kcal   int,
  protein_g   int,
  carbs_g     int,
  fat_g       int,
  tags        text[] not null default '{}',
  notes       text,
  is_active   boolean not null default true,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

create unique index one_active_plan_per_user
  on plans (user_id) where is_active;

create table plan_day_targets (
  plan_id          uuid not null references plans on delete cascade,
  day_type         day_type not null,
  kcal_adjustment  int not null default 0,
  water_liters     numeric,
  primary key (plan_id, day_type)
);

create table plan_sections (
  id            uuid primary key default gen_random_uuid(),
  plan_id       uuid not null references plans on delete cascade,
  label         text not null,
  section_type  section_type not null default 'comida',
  icon          text,
  notes         text,
  visible_when  day_type[],   -- null = siempre visible
  repeat_when   day_type[],   -- null = nunca se repite
  sort_order    int not null default 0
);

create table option_groups (
  id          uuid primary key default gen_random_uuid(),
  section_id  uuid not null references plan_sections on delete cascade,
  label       text not null,
  pick_count  int not null default 1,
  sort_order  int not null default 0
);

create table food_options (
  id          uuid primary key default gen_random_uuid(),
  group_id    uuid not null references option_groups on delete cascade,
  label       text,
  notes       text,
  sort_order  int not null default 0,
  is_active   boolean not null default true
);

create table option_components (
  id            uuid primary key default gen_random_uuid(),
  option_id     uuid not null references food_options on delete cascade,
  quantity      numeric not null,
  unit          food_unit not null,
  description   text not null,
  weight_basis  weight_basis,   -- null = no aplica
  sort_order    int not null default 0
);

-- -------------------------------------------------------------
-- Tracking diario
-- -------------------------------------------------------------
create table day_logs (
  id            uuid primary key default gen_random_uuid(),
  user_id       uuid not null references profiles on delete cascade,
  date          date not null,
  day_type      day_type not null default 'descanso',
  water_liters  numeric,
  notes         text,
  created_at    timestamptz not null default now(),
  unique (user_id, date)
);

create table log_entries (
  id           uuid primary key default gen_random_uuid(),
  day_log_id   uuid not null references day_logs on delete cascade,
  option_id    uuid not null references food_options on delete restrict,
  occurrence   int not null default 1,
  servings     numeric not null default 1,
  created_at   timestamptz not null default now(),
  unique (day_log_id, option_id, occurrence)
);

-- -------------------------------------------------------------
-- Mediciones (ISAK)
-- -------------------------------------------------------------
create table measurements (
  id                uuid primary key default gen_random_uuid(),
  user_id           uuid not null references profiles on delete cascade,
  measured_at       date not null,
  weight_kg         numeric,
  -- Pliegues (mm)
  tricipital        numeric,
  bicipital         numeric,
  subescapular      numeric,
  cresta_iliaca     numeric,
  supraespinal      numeric,
  abdominal_mm      numeric,
  muslo_medio_mm    numeric,
  pantorrilla_mm    numeric,
  -- Perímetros (cm)
  brazo_relajado    numeric,
  brazo_flexionado  numeric,
  cintura           numeric,
  cadera            numeric,
  muslo_medio_cm    numeric,
  pantorrilla_cm    numeric,
  notes             text,
  created_at        timestamptz not null default now()
);

create index measurements_user_date on measurements (user_id, measured_at);

-- -------------------------------------------------------------
-- Contenido global
-- -------------------------------------------------------------
create table global_tips (
  id          uuid primary key default gen_random_uuid(),
  category    text not null,   -- 'salsas' | 'bebidas' | 'fuera_de_casa' | 'frutos_secos'
                               -- | 'porciones_fruta' | 'lineamientos' | 'suplementacion'
  title       text not null,
  body        text not null,   -- markdown
  sort_order  int not null default 0
);

-- =============================================================
-- RLS
-- =============================================================
alter table profiles          enable row level security;
alter table plans             enable row level security;
alter table plan_day_targets  enable row level security;
alter table plan_sections     enable row level security;
alter table option_groups     enable row level security;
alter table food_options      enable row level security;
alter table option_components enable row level security;
alter table day_logs          enable row level security;
alter table log_entries       enable row level security;
alter table measurements      enable row level security;
alter table global_tips       enable row level security;

-- Perfiles: cada quien el suyo
create policy "own profile" on profiles
  for all using (id = auth.uid()) with check (id = auth.uid());

-- Tablas con user_id directo
create policy "own plans" on plans
  for all using (user_id = auth.uid()) with check (user_id = auth.uid());

create policy "own day_logs" on day_logs
  for all using (user_id = auth.uid()) with check (user_id = auth.uid());

create policy "own measurements" on measurements
  for all using (user_id = auth.uid()) with check (user_id = auth.uid());

-- Tablas anidadas: ownership vía el plan / day_log
create policy "own plan_day_targets" on plan_day_targets
  for all using (
    exists (select 1 from plans p where p.id = plan_id and p.user_id = auth.uid())
  ) with check (
    exists (select 1 from plans p where p.id = plan_id and p.user_id = auth.uid())
  );

create policy "own plan_sections" on plan_sections
  for all using (
    exists (select 1 from plans p where p.id = plan_id and p.user_id = auth.uid())
  ) with check (
    exists (select 1 from plans p where p.id = plan_id and p.user_id = auth.uid())
  );

create policy "own option_groups" on option_groups
  for all using (
    exists (
      select 1 from plan_sections s
      join plans p on p.id = s.plan_id
      where s.id = section_id and p.user_id = auth.uid()
    )
  ) with check (
    exists (
      select 1 from plan_sections s
      join plans p on p.id = s.plan_id
      where s.id = section_id and p.user_id = auth.uid()
    )
  );

create policy "own food_options" on food_options
  for all using (
    exists (
      select 1 from option_groups g
      join plan_sections s on s.id = g.section_id
      join plans p on p.id = s.plan_id
      where g.id = group_id and p.user_id = auth.uid()
    )
  ) with check (
    exists (
      select 1 from option_groups g
      join plan_sections s on s.id = g.section_id
      join plans p on p.id = s.plan_id
      where g.id = group_id and p.user_id = auth.uid()
    )
  );

create policy "own option_components" on option_components
  for all using (
    exists (
      select 1 from food_options o
      join option_groups g on g.id = o.group_id
      join plan_sections s on s.id = g.section_id
      join plans p on p.id = s.plan_id
      where o.id = option_id and p.user_id = auth.uid()
    )
  ) with check (
    exists (
      select 1 from food_options o
      join option_groups g on g.id = o.group_id
      join plan_sections s on s.id = g.section_id
      join plans p on p.id = s.plan_id
      where o.id = option_id and p.user_id = auth.uid()
    )
  );

create policy "own log_entries" on log_entries
  for all using (
    exists (select 1 from day_logs d where d.id = day_log_id and d.user_id = auth.uid())
  ) with check (
    exists (select 1 from day_logs d where d.id = day_log_id and d.user_id = auth.uid())
  );

-- Tips globales: lectura para todo usuario autenticado, sin escritura desde la app
create policy "read tips" on global_tips
  for select using (auth.role() = 'authenticated');
