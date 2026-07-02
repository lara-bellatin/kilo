# Kilo

Nutrition tracking PWA. Multi-user, mobile-first. Each user loads their own plan and tracks daily meals + ISAK measurements.

**Stack:** Next.js (App Router) + TypeScript, Supabase (Postgres/Auth/RLS), Tailwind + custom primitives, TanStack Query, PWA.

**Package manager:** [bun](https://bun.sh). Do not use npm/pnpm/yarn.

## Setup

```bash
bun install
cp .env.example .env.local  # fill in the Supabase URL + anon key
```

## Development

```bash
bun run dev
```

Open <http://localhost:3000>.

## Database

Migrations live in `supabase/migrations/`. Never edit the schema by hand — always create a migration.

```bash
bun run db:new <name>   # create a new migration
bun run db:push         # apply pending migrations to the linked project
bun run db:reset        # reset the local db and re-run all migrations
bun run db:types        # regenerate src/types/database.ts (run after every migration)
```

To link this repo to a Supabase project:

```bash
supabase link --project-ref <ref>
```

## Deploy (Vercel)

Vercel autodetecta Next.js y usa bun gracias al `bun.lockb` commiteado.

**Env vars a configurar en Vercel** (Settings → Environment Variables, para
Production + Preview + Development):

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`

**Supabase Dashboard** (Authentication → URL Configuration):

- **Site URL**: la URL de producción (ej. `https://kilo.vercel.app` o dominio
  custom). Es la URL a la que apuntan los links de confirmación de email.
- **Redirect URLs**: agregar `https://kilo.vercel.app/**` (o el dominio final).
- **Email confirmation** (Auth → Providers → Email): decidir si se requiere.
  Si se desactiva, el flujo es signup → login directo.

Los cambios de dominio en Supabase hay que hacerlos también si se agrega un
custom domain en Vercel más adelante.
