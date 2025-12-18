# Project knowledge

Finn Registry - Official package registry for the Fin programming language. Serves as both an API for the `finn` CLI and a public web UI for package discovery.

## Quickstart
- Setup: `npm install`
- Dev: `npm run dev` (Vite + Wrangler + D1 local)
- Build: `npm run build` (runs `tsc -b && vite build`)
- Lint: `npm run lint`
- Deploy: `npm run deploy` (builds then `wrangler deploy`)
- DB Reset (local): `npx wrangler d1 execute finn-db --local --file=./schema.sql`

## Architecture
- **Monolith** on Cloudflare Workers (Assets Mode)
- Frontend: `src/` → React + Vite + TypeScript + Tailwind v4
- Backend: `worker/index.ts` → Hono framework
- Database: Cloudflare D1 (SQLite), schema in `schema.sql`
- Auth: GitHub OAuth with httpOnly cookie sessions stored in D1
- Config: `wrangler.jsonc` (JSONC format)
- Routing: `/api/*` → Worker, everything else → SPA from `dist/`

## Authentication
- GitHub OAuth flow: `/api/auth/github` → GitHub → `/api/auth/callback`
- Sessions stored in D1 `sessions` table with 30-day expiry
- API tokens for CLI auth stored in `users.api_token`
- Frontend uses AuthContext (`src/contexts/AuthContext.tsx`)
- Protected routes redirect to `/login` if unauthenticated
- Set secrets: `wrangler secret put GITHUB_CLIENT_SECRET`

## Key directories
- `src/pages/` - React page components (Home, PackageDetail)
- `worker/` - Hono backend API
- `.github/workflows/` - CI/CD (deploy.yml)

## Conventions
- Styling: Tailwind CSS v4 via `@tailwindcss/postcss`
- Icons: `lucide-react` only
- Theme: Dark mode (`#09090b` bg, `#18181b` surface, `#6366f1` primary/indigo)
- Fonts: Inter (sans), JetBrains Mono (code)

## Things to avoid
- Do NOT create a `functions/` directory - use `worker/index.ts`
- Do NOT use `tailwind.config.js` for core config - Tailwind v4 uses CSS variables in `index.css`
- Do NOT cast as `any` type
