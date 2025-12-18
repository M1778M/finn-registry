# AGENT.md - Finn Registry Development Guide

## 1. Project Overview
**Finn Registry** is the official package registry for the Fin programming language. It serves two purposes:
1.  **API:** A backend for the `finn` CLI tool to resolve package URLs and versions.
2.  **Website:** A public-facing UI (like crates.io or npmjs.com) for users to discover packages.

## 2. Tech Stack (Strict)
*   **Runtime:** Cloudflare Workers (Assets Mode).
*   **Backend Framework:** [Hono](https://hono.dev/) (located in `worker/index.ts`).
*   **Database:** Cloudflare D1 (SQLite).
*   **Frontend:** React + Vite + TypeScript.
*   **Styling:** Tailwind CSS v4 (using `@tailwindcss/postcss`).
*   **Icons:** `lucide-react`.
*   **Config:** `wrangler.jsonc` (JSONC format).

## 3. Architecture
This is a **Monolith** deployed to Cloudflare Pages.
*   **Frontend:** Source in `src/`. Builds to `dist/`.
*   **Backend:** Source in `worker/index.ts`.
*   **Routing:** Cloudflare handles routing. Requests to `/api/*` hit the Worker. All other requests serve static assets from `dist/` (SPA fallback).

## 4. Current State
*   **Database:** `packages` table exists. `users` and `versions` tables defined in `schema.sql` but need logic implementation.
*   **API:**
    *   `GET /api/search`: Working.
    *   `GET /api/packages/:name`: Working (increments downloads).
    *   `POST /api/packages`: Basic implementation (needs Auth).
*   **Frontend:**
    *   Home Page (Search + Hero).
    *   Package Detail Page (Install command + Metadata).

## 5. Tasks for Frontend/Fullstack Agent

### A. Backend Tasks (Hono + D1)
1.  **Authentication (GitHub OAuth):**
    *   Implement `GET /api/auth/github` and callback.
    *   Store user sessions (JWT or D1 session table).
    *   Link GitHub ID to `users` table.
2.  **Publishing Logic:**
    *   Secure `POST /api/packages` so only the owner (via API Token) can update it.
    *   Implement `POST /api/versions` to handle new releases (parsing `finn.toml` from the payload).
3.  **Documentation API:**
    *   Fetch `README.md` content from the package's GitHub repo URL and serve it via the API (cached).

### B. Frontend Tasks (React)
1.  **User Dashboard:**
    *   `/account`: Show API Token (for CLI login) and list of owned packages.
2.  **Markdown Rendering:**
    *   Render the README content on the Package Detail page using `react-markdown`.
3.  **Documentation Section:**
    *   Build out the `/docs` route with guides on how to use the `finn` CLI.

### C. Styling Guidelines
*   **Theme:** "Developer Dark". Background `#09090b`, Surface `#18181b`, Primary `#6366f1` (Indigo).
*   **Font:** Inter (Sans), JetBrains Mono (Code).
*   **Components:** Keep it modular. Use `lucide-react` for consistency.

## 6. Quality Assurance & CI/CD

### Testing
*   **Frontend:** Set up **Vitest** + **React Testing Library**. Ensure components render without crashing.
*   **Backend:** Use `cloudflare:test` or Hono's testing helpers to mock D1 and test API endpoints.
*   **Requirement:** Create a `test` script in `package.json` that runs both.

### CI/CD
*   Workflow is located at `.github/workflows/deploy.yml`.
*   **Rule:** The build (`npm run build`) MUST pass before deployment.
*   **Database:** Schema changes must be applied via `wrangler d1 execute ... --remote` manually or via a migration workflow (preferred).

## 7. Development Commands
*   **Install:** `npm install`
*   **Run Local (Full Stack):** `npm run pages:dev` (Runs Vite + Wrangler + D1).
*   **Build:** `npm run build`.
*   **Database Reset (Local):** `npx wrangler d1 execute finn-db --local --file=./schema.sql`.

## 8. Critical Constraints
1.  **Do NOT create a `functions/` directory.** We are using `worker/index.ts` defined in `wrangler.jsonc`.
2.  **Do NOT use `npm run dev`.** Use `npm run pages:dev` to ensure the API and Database work.
3.  **Tailwind v4:** Do not try to use `tailwind.config.js` for core config; use CSS variables in `index.css` where possible, or strictly follow v4 migration guides.
