# Multi-Tool Hub

Internal modular tools in one Next.js app. First module: **URL → QR Code Generator**.

**Stack:** Next.js (App Router, TypeScript) · Neon Postgres · Prisma 7 · Tailwind CSS · shadcn/ui · Auth.js · Zod · Vercel

## Local setup

### 1. Install

```bash
bun install
```

### 2. Environment

Copy `.env.example` to `.env` and fill in real values (never commit `.env`):

```env
DATABASE_URL="postgresql://USER:PASSWORD@HOST-pooler/neondb?sslmode=require"
DIRECT_URL="postgresql://USER:PASSWORD@HOST/neondb?sslmode=require"
AUTH_SECRET="generate-with-bunx-auth-secret"
AUTH_URL="http://localhost:3000"
```

- `DATABASE_URL` — Neon **pooled** (`-pooler`) connection, used by the app
- `DIRECT_URL` — Neon **direct** connection, used by Prisma migrate
- `AUTH_SECRET` — `bunx auth secret` or `openssl rand -base64 32`

### 3. Database client

```bash
bunx prisma generate
bunx prisma migrate deploy
```

### 4. Seed an admin user (optional)

```bash
bun scripts/seed-admin.ts
```

Default: `admin@example.com` / `password123` — change this in real use.

### 5. Run

```bash
bun run dev
```

Open [http://localhost:3000](http://localhost:3000) → sign in → **QR Codes**.

## Scripts

| Command | Purpose |
|---|---|
| `bun run dev` | Dev server |
| `bun run build` | Prisma generate + Next build |
| `bun run lint` | ESLint |
| `bun run format` | Prettier |
| `bun run db:migrate` | Apply migrations (`prisma migrate deploy`) |
| `bun run db:status` | Check migration status (dev) |
| `bun run db:status:prod` | Check migration status (production) |
| `bun run db:studio` | Prisma Studio |
| `bun run db:seed` | Create the local admin user |

## Project layout

```
src/app/(auth)          Login / logout
src/app/(dashboard)     App shell + module pages
src/app/api/qr          Thin QR API routes
src/lib/modules/qr      QR validation + service
src/lib/validations     Shared Zod helpers
src/components/shared   Navbar / sidebar
src/components/qr       QR UI
```

API routes stay thin: validate with Zod, call `lib/modules/<module>/service.ts`, return JSON.

## Dev vs production env

| File | Used for | Git |
|---|---|---|
| `.env` | Local / Neon **dev** branch | ignored |
| `.env.production` | Neon **production** branch (migrate / seed) | ignored |
| `.env.example` / `.env.production.example` | Templates only | committed |

```bash
# first time
copy .env.production.example .env.production
```

Put production Neon URLs in `.env.production`, then:

```bash
bun run db:migrate:prod
bun run db:seed:prod
```

Local `bun run dev` and `bun run db:migrate` still use `.env` (dev).

## Deploy (Vercel)

Copy the **same** production values onto Vercel (Production environment): `DATABASE_URL`, `DIRECT_URL`, `AUTH_SECRET`, `AUTH_URL`.

