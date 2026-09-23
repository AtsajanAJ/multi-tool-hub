# Plan.md — Multi-Tool Hub

> This document tells the AI agent what the project plan is, broken into clear phases
> so development can proceed step by step.
> Module 1: **QR Code Generator**, with future modules to follow.

## Project Overview

A modular monolith web app that bundles multiple internal tools/modules into one system.

- First module: **URL → QR Code Generator** (using the free goqr.me API)
- Designed so new modules can be added later without refactoring the core structure
- Internal company tool — requires login to use

**Stack:** Next.js (JavaScript) + Neon Postgres + Prisma + Tailwind CSS + shadcn/ui + NextAuth + Zod + Vercel

---



## Phase 0 — Project Setup

- [x] Create Next.js project (App Router, TypeScript)
- [x] Set up ESLint + Prettier
- [x] Install Tailwind CSS
- [x] Install and init shadcn/ui
- [x] Create Git repo, set up `.gitignore` (including `.env*`)
- [x] Create Neon Postgres database (dev + prod branch)
- [x] Install Prisma, connect to Neon connection string via `.env`
- [x] Set up Vercel project, link Git repo, configure environment variables on Vercel
- [x] Deploy a "Hello World" page to Vercel to verify the pipeline works

**Definition of done:** Opening the Vercel URL shows a blank page built successfully from the repo.

---



## Phase 1 — Core Infrastructure (shared across all modules)

- [ ] Design the modular folder structure (see `agent.md` for details)
- [ ] Create base Prisma schema: `User`, `Session`, `Account` (for NextAuth)
- [ ] Set up NextAuth (Credentials provider as the default)
- [ ] Build Login / Logout pages
- [ ] Add middleware to protect pages that require login
- [ ] Set up shared Zod validation utils
- [ ] Build the main layout (Navbar, Sidebar for switching between future modules)

**Definition of done:** User can log in and see an empty dashboard with a sidebar reserved for modules.

---



## Phase 2 — Module: QR Code Generator



### 2.1 Database

- [ ] Add Prisma model `QrCode`:
  - `id`, `url` (input), `imageUrl` (or cached image), `createdBy` (userId), `createdAt`
- [ ] Run migration (`prisma migrate dev`)



### 2.2 Backend (API Route)

- [ ] Create `POST /api/qr/generate`
  - Accept `url` in the request body, validate with Zod (must be a valid URL)
  - Call `https://api.qrserver.com/v1/create-qr-code/?data=...`
  - Save the record to the DB (`QrCode` table)
  - Return the generated QR image URL
- [ ] Create `GET /api/qr/history` — fetch QR generation history for the logged-in user



### 2.3 Frontend

- [ ] `/qr` page — URL input form + Generate button
- [ ] Display the generated QR image + a download button
- [ ] Display a history table of previously generated QR codes (shadcn/ui Table)
- [ ] Loading state / error state (invalid URL, API downtime, etc.)

**Definition of done:** Entering a URL produces a real QR code; history is saved and displayed correctly.

---



## Phase 3 — Polish & QA

- [ ] Verify responsive design on mobile
- [ ] Handle all edge cases (empty URL, malformed URL, free-API downtime/rate limit)
- [ ] Write a README with local dev setup instructions
- [ ] Basic security review (validate all inputs, prevent XSS from user-entered URLs)

---



## Phase 4 — Deployment

- [ ] Configure all environment variables on Vercel (DATABASE_URL, NEXTAUTH_SECRET, NEXTAUTH_URL)
- [ ] Deploy to production
- [ ] Full end-to-end test on production

---



## Backlog — Future Modules (not started)

Ideas for upcoming modules (add more over time):

- [ ] Module: Incident notification system (integrate with existing system)
- [ ] Module: Uptime Kuma dashboard integration
- [ ] Other modules as requirements come up

> **Note for the AI agent:** Complete phases in order. Do not skip Phase 0–1 to jump to Phase 2 — Phase 2 depends on the infrastructure built in Phase 1 (auth, DB connection, layout).

