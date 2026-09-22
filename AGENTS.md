# Agent.md — Multi-Tool Hub

> This document tells the AI agent what this project is, what architecture it follows,
> and how to think when adding new code so the system can scale in the future.

## What This Project Is

**Multi-Tool Hub** is an internal web app that bundles multiple tools/modules into one system.
It starts with the first module: **URL → QR Code Generator**.

Core idea: the system must be designed so **new modules can keep being added**
without breaking existing ones. Today it's a QR generator; tomorrow it might be
an incident dashboard, a reporting tool, or something else.

---

## Tech Stack

| Layer         | Technology                       |
| ------------- | -------------------------------- |
| Framework     | Next.js (App Router, JavaScript) |
| Database      | Neon (Serverless Postgres)       |
| ORM           | Prisma                           |
| Styling       | Tailwind CSS                     |
| UI Components | shadcn/ui                        |
| Auth          | NextAuth.js                      |
| Validation    | Zod                              |
| Hosting       | Vercel                           |

---

## Architecture

### Approach: Modular Monolith

Every module runs inside the same Next.js app (simple to deploy, easy to maintain for a small team),
but each module's code is **clearly separated by folder** so that:

1. New modules can be added without touching other modules' code
2. If a module outgrows the monolith, it can later be extracted into its own service (microservice) by moving the whole folder out, with minimal changes to the internal logic

### Folder Structure

```
/app
  /(auth)
    /login
    /logout
  /(dashboard)
    /qr                 ← QR module pages
    /[future-module]    ← future modules go here
  /api
    /qr
      /generate/route.js
      /history/route.js
    /auth
      /[...nextauth]/route.js

/lib
  /modules
    /qr
      service.js         ← business logic (calls the goqr.me API, etc.)
      validation.js       ← Zod schemas specific to this module
    /[future-module]/
      service.js
      validation.js
  /db.js                  ← Prisma client (singleton)
  /auth.js                ← NextAuth config

/prisma
  schema.prisma           ← all module models live here (separated by comments per section)

/components
  /ui                     ← shadcn/ui components
  /shared                 ← components shared across modules (Navbar, Sidebar)
  /qr                     ← components specific to the QR module
```

### Key Principles

1. **API route handlers (`/api/.../route.js`) must stay thin** — just receive the request, validate with Zod, call `service.js`, and return the response. No business logic here.
2. **All business logic lives in `lib/modules/<module>/service.js`** — so it's easy to test and extract later.
3. **One Prisma schema, shared across all modules** — but name models clearly per module (e.g. `QrCode`, `Incident`) and use comments to separate sections.
4. **Modules must not import from each other directly** — if logic truly needs to be shared, move it into `/lib` (the shared layer) instead.

---

## Scaling Strategy

- **More modules:** add a new folder under `/app/(dashboard)/[module]` and `/lib/modules/[module]` following the existing pattern — no need to touch other modules' files.
- **More traffic:** Vercel + Neon serverless auto-scale to a reasonable degree with no extra work.
- **A module outgrows the monolith:** move the logic in `lib/modules/<module>` into a separate service (e.g. a standalone API service), and have Next.js call it over HTTP instead of importing it directly.
- **Heavy/async work:** if a module needs heavy processing or background jobs, add a queue (e.g. Inngest or BullMQ+Redis) only when actually needed — don't add it preemptively.

---

## Example Data Flow (QR Module)

```
User enters a URL on the /qr page
  → Frontend calls POST /api/qr/generate (basic client-side validation with Zod)
  → API route validates again with Zod (server-side — never trust the client)
  → Calls lib/modules/qr/service.js
  → service.js calls the goqr.me API and saves the record via Prisma
  → Returns the result (QR image URL) to be displayed on the frontend
```
