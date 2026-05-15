# ROWGOLD — Luxury Jewelry & Accessories E-Commerce

Ultra-premium luxury jewelry & accessories store with a black-and-gold aesthetic, animated splash screen, full catalog, cart, checkout, and admin panel.

## Run & Operate

- `pnpm --filter @workspace/api-server run dev` — run the API server (port 5000)
- `pnpm run typecheck` — full typecheck across all packages
- `pnpm run build` — typecheck + build all packages
- `pnpm --filter @workspace/api-spec run codegen` — regenerate API hooks and Zod schemas from the OpenAPI spec
- `pnpm --filter @workspace/db run push` — push DB schema changes (dev only)
- `pnpm --filter @workspace/scripts run seed` — seed the database with sample products/categories
- Required env: `DATABASE_URL` — Postgres connection string

## Stack

- pnpm workspaces, Node.js 24, TypeScript 5.9
- Frontend: React + Vite + Wouter + TanStack Query + Framer Motion
- API: Express 5
- DB: PostgreSQL + Drizzle ORM
- Validation: Zod (`zod/v4`), `drizzle-zod`
- API codegen: Orval (from OpenAPI spec)
- Build: esbuild (CJS bundle)

## Where things live

- `artifacts/rowgold/` — React + Vite SPA frontend (main app)
- `artifacts/api-server/` — Express API backend
- `lib/db/src/schema/` — DB schema (products, categories, users, orders, cart)
- `lib/api-client-react/` — Generated React Query hooks
- `lib/api-zod/` — Generated Zod validation schemas
- `scripts/src/seed.ts` — Database seeder
- `artifacts/rowgold/vercel.json` — SPA deployment config for Vercel

## Architecture decisions

- Session-based cart/auth via `x-session-id` header (stored in localStorage) — no cookies needed
- Auth uses SHA-256 with a salt, in-memory session map keyed by session ID
- API routes: `/api/products`, `/api/categories`, `/api/cart`, `/api/orders`, `/api/auth/*`, `/api/catalog/featured`, `/api/catalog/stats`
- All pages use Cormorant Garamond serif font for headings, Inter for body
- Black (#080808) background, gold (#d4af37) accent throughout

## Product

- **Splash Screen** — animated logo reveal with gold particles and progress bar
- **Home** — hero section, featured products grid, category grid, trust badges, brand statement
- **Catalog** — searchable/filterable product grid with category tabs and sorting
- **Product Detail** — image gallery, quantity selector, add to cart, related products
- **Cart** — live cart with quantity controls, summary, checkout CTA
- **Checkout** — address form + payment method selection, order creation
- **Orders** — order history with status badges
- **Login / Register** — gold-themed auth forms
- **Admin Panel** — dashboard stats, product management (CRUD), order list
- **404** — luxury-styled not-found page

## User preferences

- Language: Spanish (UI text in Spanish)
- Theme: Ultra-premium black and gold, no light mode
- Font: Cormorant Garamond (headings) + Inter (body)
- Logo: attached_assets/WhatsApp_Image_2026-05-14_at_9.43.54_PM_1778817269857.jpeg

## Gotchas

- Always rebuild libs before typechecking API server: `pnpm run typecheck:libs` first
- `pnpm --filter @workspace/db run push` before seeding after schema changes
- Auth `/api/auth/me` correctly returns 401 when unauthenticated — handled gracefully
- Cart uses `x-session-id` header, session ID generated/stored in localStorage

## Pointers

- See the `pnpm-workspace` skill for workspace structure, TypeScript setup, and package details
