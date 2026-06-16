# ROWGOLD — Luxury Jewelry & Accessories E-Commerce

Ultra-premium luxury jewelry & accessories store with a black-and-gold aesthetic, animated splash screen, full catalog, cart, checkout, and admin panel.

## Run & Operate

- `npm run dev:client` — run the frontend (Vite, port 25397)
- `npm run dev:server` — run the API server (tsx watch, port 8080)
- `npm run build` — build both client and server for production
- `npm run start` — run production server (`dist/server.js`)
- `npm run db:push` — push DB schema changes (dev only)
- Required env: `DATABASE_URL` — Postgres connection string

## Stack

- **Single npm project** — flat monolith, no workspace packages
- Frontend: React + Vite + Wouter + TanStack Query + Framer Motion (`client/`)
- API: Express 5 (`server/`)
- DB: PostgreSQL + Drizzle ORM
- Validation: Zod
- Build: Vite (client) + esbuild (server → `dist/server.js`)
- Deploy: Dockerfile + railway.toml (Railway / Render / any Docker host)

## Where things live

- `client/` — React + Vite SPA frontend
  - `client/src/lib/api.ts` — all API hooks (useQuery/useMutation wrappers)
  - `client/src/contexts/` — CartContext, AuthContext
  - `client/src/pages/` — all pages
  - `client/src/components/` — Navbar, Footer, UI components
  - `client/vite.config.ts` — Vite config (proxies /api → port 8080 in dev)
- `server/` — Express API backend
  - `server/index.ts` — entry point (serves API + static in prod)
  - `server/routes/` — auth, products, cart, orders, reviews
  - `server/db/` — Drizzle schema + db client
- `dist/` — production output (`dist/public/` = React build, `dist/server.js` = bundled API)
- `Dockerfile` — multi-stage Docker build for deployment
- `railway.toml` — Railway deployment config
- `drizzle.config.ts` — Drizzle Kit config

## Architecture decisions

- Session-based cart/auth via `x-session-id` header (stored in localStorage) — no cookies needed
- Auth uses SHA-256 with a salt, in-memory session map keyed by session ID
- API routes: `/api/products`, `/api/categories`, `/api/cart`, `/api/orders`, `/api/auth/*`, `/api/catalog/featured`, `/api/catalog/stats`
- All pages use Cormorant Garamond serif font for headings, Inter for body
- Black (#080808) background, gold (#d4af37) accent throughout
- Production: Express serves `dist/public/` as static files + handles all `/api/*` routes

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

- Auth `/api/auth/me` correctly returns 401 when unauthenticated — handled gracefully
- Cart uses `x-session-id` header, session ID generated/stored in localStorage
- In Replit dev, Vite proxies `/api/*` to `localhost:8080` (set in `client/vite.config.ts`)
- After schema changes: `npm run db:push` then restart the API server workflow

## Deployment

```bash
# Railway / Render / any Docker host:
docker build -t rowgold .
docker run -p 3000:3000 -e DATABASE_URL=... rowgold
```

The Dockerfile:
1. Builds the React client → `dist/public/`
2. Bundles the Express server → `dist/server.js`
3. Runs `node dist/server.js` which serves both API and static files
