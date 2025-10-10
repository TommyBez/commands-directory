<!-- a280bead-a700-43bb-8708-7398a8a90948 0183b9e8-3363-4a94-b611-11418e84c185 -->
# Implementation Plan — Cursor Commands Explorer (Next.js + Clerk + Drizzle + Neon)

## Architecture & Stack

- Next.js (App Router) for UI and Route Handlers (API)
- Clerk for authentication (SSR + route protection)
- Drizzle ORM with Neon Postgres (HTTP driver) for data access
- Hosted on Vercel (app) + Neon (DB)
- Use pnpm for all scripts [[memory:2582683]]
- TypeScript strict; avoid the `any` type across code [[memory:2600892]]

## Data Model (Drizzle, Postgres)

- tables
  - commands: id (uuid), slug (text unique), title, description, syntax, os (enum[]), editor_mode (enum), level (enum), context (text), media_url, created_at, updated_at; indexes on (title, slug), GIN on tags/fts
  - categories: id (uuid), name, slug (unique), description
  - command_tags: id (uuid), name (unique), slug (unique)
  - command_tag_map: command_id, tag_id (composite PK)
  - bookmarks: user_id (text Clerk id), command_id, created_at; unique (user_id, command_id)
  - notes: id (uuid), user_id, command_id, content, created_at, updated_at
  - reports: id (uuid), user_id nullable, command_id, kind (enum: incorrect|outdated|other), message, status (enum: open|triaged|resolved), created_at
  - user_profiles: user_id (text Clerk id PK), onboarding_dismissed_at timestamptz nullable
- schema location: `db/schema/*.ts`
- migrations directory: `drizzle/`

## Environment & Config

- `.env.local` (dev) / Vercel env vars (prod):
  - CLERK_PUBLISHABLE_KEY, CLERK_SECRET_KEY
  - DATABASE_URL (Neon)
- Files to add
  - `drizzle.config.ts`
  - `db/index.ts` (Neon HTTP + drizzle)
  - `db/schema/*.ts`
  - `middleware.ts` (Clerk)

Minimal DB bootstrap examples:

```ts
// db/index.ts
import { drizzle } from 'drizzle-orm/neon-http';
import { neon } from '@neondatabase/serverless';

const sql = neon(process.env.DATABASE_URL!);
export const db = drizzle(sql);
```

```ts

// drizzle.config.ts

import { defineConfig } from 'drizzle-kit';

export default defineConfig({

schema: './db/schema',

out: './drizzle',

dialect: 'postgresql',

dbCredentials: { url: process.env.DATABASE_URL! },

});

````

## Authentication (Clerk)
- Wrap app with `ClerkProvider` in `app/layout.tsx`
- Add sign-in/up pages: `app/sign-in/[[...sign-in]]/page.tsx`, `app/sign-up/[[...sign-up]]/page.tsx`
- Protect routes needing auth via `middleware.ts` and server checks in API handlers
- Use `auth()`/`currentUser()` in server actions/route handlers to fetch `userId`

Simple middleware:
```ts
// middleware.ts
import { authMiddleware } from '@clerk/nextjs';
export default authMiddleware({
  publicRoutes: ['/', '/commands', '/api/commands', '/api/commands/(.*)'],
});
export const config = { matcher: ['/((?!.+\.[\w]+$|_next).*)', '/', '/(api)(.*)'] };
````

## API Routes (App Router)

- `app/api/commands/route.ts`
  - GET list with search & filters: `?q=&os=&mode=&level=&category=&tag=&page=&limit=`
  - POST (admin/seed-only) to create
- `app/api/commands/[slug]/route.ts`: GET detail by slug
- `app/api/bookmarks/route.ts`: GET user bookmarks, POST add, DELETE remove (auth required)
- `app/api/notes/route.ts`: GET/POST/PUT/DELETE notes (auth required)
- `app/api/reports/route.ts`: POST create report; GET (admin moderation later)
- `app/api/export/route.ts`: GET CSV/JSON of query results (public)

Search strategy (phase 1):

- SQL ILIKE on title/description/syntax with trigram or fts index later
- Optional: materialized fts column for future improvement

## UI Routes & Screens

- `app/page.tsx`: Home + prominent search bar, featured categories, keyboard navigation
- `app/commands/page.tsx`: Results + advanced filters (OS, modifiers, mode, user level, category, tags)
- `app/commands/[slug]/page.tsx`: Detail (syntax, context, related commands, media, copy button, bookmark)
- `app/favorites/page.tsx` (auth): Bookmarked commands
- Auth pages from Clerk; `app/user/page.tsx` can show profile and notes

## Features Mapping to PRD

- Command search & discovery: typeahead (client) hitting `/api/commands` with debounced q
- Category browsing: server-render categories and counts
- Advanced filtering: multi-select filters, persisted in URL query params
- Command details & usage: detail page with copy-to-clipboard, related commands by tags/category
- Bookmark/favorite: star toggle; unique constraint enforces de-dup
- Onboarding walkthrough: first-visit modal; persist dismissal to `user_profiles`
- Community feedback: report form on detail page -> `/api/reports`
- Share: canonical slug URLs; copy link button
- Export: CSV/JSON via `/api/export`

## Testing & Quality

- Playwright E2E (headless by default) [[memory:2598017]]; generate/extend tests with the Playwright MCP tool [[memory:2577444]]
- Biome/ESLint for lint/format; strict TypeScript, no `any` [[memory:2600892]]
- Seed script for local dev to load baseline commands

## Deployment & Ops

- Deploy app on Vercel, connect environment variables
- Neon project (production + branch for preview); run Drizzle migrations during deploy
- Optional: Clerk webhooks to clean up per-user data on deletion

---

## Initial File/Folder Additions

- `db/index.ts`, `db/schema/*.ts`
- `drizzle.config.ts`, `drizzle/` (migrations)
- `app/api/...` route handlers listed above
- `app/sign-in/...`, `app/sign-up/...` (Clerk)
- `middleware.ts`

## Scripts (pnpm) [[memory:2582683]]

- `pnpm db:generate` → drizzle-kit generate
- `pnpm db:migrate` → drizzle-kit migrate
- `pnpm db:seed` → run a small seed script
- `pnpm test:e2e` → Playwright in headless mode

## Risks / Next Steps

- Search relevance may require full-text tuning; start simple, iterate
- Media hosting (gifs/video) can use static or external links initially
- Admin editing UI is out-of-scope per PRD; seed + moderation later

### To-dos

- [ ] Integrate Clerk, provider in layout, middleware, auth pages
- [ ] Add Drizzle + Neon config; create db connection file
- [ ] Define Drizzle schemas for commands, categories, tags, bookmarks, notes
- [ ] Generate and run initial Drizzle migrations on Neon
- [ ] Create simple seed script to load baseline commands
- [ ] Implement /api/commands list/detail with search & filters
- [ ] Implement /api/bookmarks CRUD (auth)
- [ ] Implement /api/notes CRUD (auth)
- [ ] Implement /api/reports create + list (basic)
- [ ] Build home page with typeahead search and featured categories
- [ ] Build commands list with filters synced to URL
- [ ] Build command detail with copy, related, bookmark toggle
- [ ] Build favorites page showing user bookmarks (auth)
- [ ] Implement first-visit onboarding modal and persistence
- [ ] Add /api/export and copy-link UI
- [ ] Add Playwright headless E2E covering core flows