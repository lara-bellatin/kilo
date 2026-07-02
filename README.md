# Kilo

Nutrition tracking PWA. Multi-user, mobile-first. Each user loads their own plan and tracks daily meals + ISAK measurements.

**Stack:** Next.js (App Router) + TypeScript, Supabase (Postgres/Auth/RLS), Tailwind + shadcn/ui, TanStack Query, PWA.

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
