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
| `bun run db:studio` | Prisma Studio |

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

## Deploy (Vercel)

Set the same env vars on Vercel. Use the Neon **production** branch for `DATABASE_URL` / `DIRECT_URL`, and set `AUTH_URL` to the production URL.
