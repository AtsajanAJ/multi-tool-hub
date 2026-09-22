# Rule.md — Multi-Tool Hub

> Rules for the AI agent writing code in this project: what's allowed, what's forbidden,
> and a running log of common mistakes to avoid repeating.

## ❌ Never Do This

1. **Never commit `.env` files or any secrets to Git** — check `.gitignore` before every commit
2. **Never hardcode API keys, database connection strings, or secrets in code** — always use environment variables
3. **Never modify `prisma/schema.prisma` and run a migration without asking first** — especially when dropping columns/tables that already contain data; always confirm first
4. **Never push directly to the `main` branch** — work in a feature branch and open a PR
5. **Never delete a migration file that has already been applied to production**
6. **Never put business logic directly inside an API route handler** — it must live in `lib/modules/<module>/service.js` (see `agent.md`)
7. **Never import code directly across modules** (e.g. the qr module importing from the incident module) — if something truly needs to be shared, move it to the shared layer (`/lib`)
8. **Never trust client input without server-side validation** — every API route must validate with a Zod schema, even if the frontend already validated it
9. **Never call an external API (e.g. goqr.me) without error handling / timeout** — always wrap it in try-catch with a fallback message

## ✅ Allowed / Encouraged

1. Add new modules freely, following the pattern defined in `agent.md`
2. Add new components to `/components/shared` when they're genuinely reused across multiple modules
3. Write the Zod schema before implementing an API route (schema-first)
4. Ask the user for clarification when a requirement is unclear, rather than guessing and building it anyway
5. Run `npx prisma migrate dev` to create a new migration whenever the schema changes (never edit the DB directly through the Neon console)

## 🔒 Security

- Every URL a user submits (for QR generation) must be validated as a proper URL before being sent to the external API
- Sanitize output before rendering, to prevent XSS (especially when displaying user-entered URLs back on the page)
- Every page except `/login` must go through the auth middleware
- Add basic rate limiting on `/api/qr/generate` (to prevent abuse hammering the free external API)

## 🧭 Coding Conventions

- Use JavaScript (not TypeScript), per the chosen stack
- File/folder names: `kebab-case`; component names: `PascalCase`; function/variable names: `camelCase`
- Use async/await instead of `.then()` chains
- Commit message format: `[module] short description of what changed`, e.g. `[qr] add generate endpoint`

## ⚠️ Common Mistakes (log these as they happen)

> Keep adding to this section every time a recurring issue comes up during development.

- (No entries yet — add real issues here as they're discovered during development)

---

**Note:** If the agent is unsure whether an action conflicts with any of these rules, it should stop and ask the user first, rather than proceeding and having to fix it later.
