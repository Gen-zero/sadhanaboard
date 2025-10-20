<!-- Copilot instructions for contributors and AI agents -->
# SaadhanaBoard — Copilot instructions

This file contains concise, project-specific guidance to help an AI coding agent become productive quickly in this repository.

Key points (read first):
- Frontend: React + TypeScript + Vite (root `package.json`, `vite.config.ts`, `src/`).
- Backend: Node.js + Express (CommonJS) living under `backend/` (`backend/package.json`, `backend/server.js`).
- Database: PostgreSQL via `pg` and raw SQL queries (`backend/config/db.js`, `backend/utils/initDb.js`).
- Static/uploads: backend serves `backend/uploads` at `/uploads`.

Important files to open first
- `package.json` (root): scripts and overall dependencies.
- `vite.config.ts`: dev server port (8080), alias `@` -> `src`.
- `backend/server.js`: route wiring and middleware. Example endpoints mounted:
  - `/api/auth` (authController / `AuthService`)
  - `/api/books`, `/api/sadhanas`, `/api/profile`, `/api/admin/*`
- `backend/config/db.js`: Postgres Pool and environment fallbacks.
- `backend/utils/initDb.js`: canonical SQL schema and how DB is initialized.
- `backend/services/*.js`: business logic uses parameterized SQL via `db.query(sql, params)` (no ORM).
- `src/main.tsx`, `src/App.tsx`, `src/services/*`: frontend entry, app wiring, and service layer.
- `scripts/move-assets.js`: run by `postinstall` and `npm run build` — moving static assets matters for production builds.

Dev workflows (commands)
Note: examples below are intended for PowerShell (Windows). The root `package.json` exposes helpful scripts.

Install all deps (root):
```powershell
npm install
```

Install backend deps and start backend in dev mode:
```powershell
npm run backend:install   # runs `cd backend && npm install`
npm run backend:dev       # runs `cd backend && npm run dev` => nodemon server.js
```

Start frontend dev server:
```powershell
npm run dev               # runs vite (vite.config.ts sets port 8080)
# Access frontend: http://localhost:8080
```

Initialize or re-create database schema (one-shot):
```powershell
node backend/utils/initDb.js
```

Build for production (frontend):
```powershell
npm run build             # runs assets:move, tsc -b, vite build
npm run preview           # serve the production build locally
```

Project-specific conventions and gotchas
- Mixed module systems: root `package.json` has "type": "module" while `backend/` uses CommonJS (`require/module.exports`). When modifying backend files, prefer CommonJS unless you update backend's package.json.
- Database access: code uses raw SQL with parameterized queries (`$1`, `$2`). Follow that pattern — don't introduce an ORM without a repo-wide plan.
- Auth: JWT is issued in `backend/services/authService.js` (look for `JWT_SECRET` env var). Many controllers expect token-based auth; inspect `backend/middleware/auth.js` when adding protected routes.
- Static uploads: Backend serves `backend/uploads` as `/uploads`. Upload-related routes use `multer` (check `backend/routes/*` and controllers like `bookController.js`).
- Assets movement: `scripts/move-assets.js` is run during `postinstall` and `build`. If you add new static files, account for this script.
- Frontend path alias: imports use `@/` to refer to `src/` per `vite.config.ts` (e.g., `import X from '@/components/X'`).

Data flow and architecture summary
- Frontend (React + TS) calls REST endpoints under `/api/*` on the backend (e.g., `/api/auth`, `/api/books`, `/api/sadhanas`).
- Backend controllers (under `backend/controllers/`) are thin: they validate inputs and call `backend/services/*` for business logic. Services run SQL via `backend/config/db.js`.
- DB schema is defined and maintained in `backend/utils/initDb.js`. There are Supabase-style migrations in `supabase/` but runtime initialization uses `initDb.js`.

Examples to reference when coding
- Add a new endpoint: follow pattern in `backend/server.js` and `controllers/*`:
  - create route in `backend/routes/yourRoute.js`
  - wire it in `backend/server.js` with `app.use('/api/your', yourRoute)`
  - implement controller under `backend/controllers/YourController.js` and service under `backend/services/YourService.js` using `db.query(sql, params)`.
- Example authentication flow: `backend/controllers/authController.js` -> `backend/services/authService.js` (register/login -> generate JWT).

Integration points & external dependencies
- PostgreSQL (local): `DB_HOST`, `DB_PORT`, `DB_NAME`, `DB_USER`, `DB_PASSWORD` (see `backend/config/db.js`).
- JWT: `JWT_SECRET` (see `backend/services/authService.js`). Code provides sensible defaults but set real secrets in `backend/.env`.
- File storage: local `backend/uploads`; spiritual books may use `storage_url` and `is_storage_file` in the DB schema.
- There are references to Claude AI in `README.md` (search the codebase for `Claude` or `AI` to find integration points). If adding cloud AI keys, keep them in secrets and follow repo patterns for env usage.

Quick checklist for PRs by an AI agent
- Run `npm run lint` and `npm run build` locally (or at least the parts you change).
- If backend schema changes, add migration SQL to `backend/utils/initDb.js` and document the manual `node backend/utils/initDb.js` step.
- Maintain CommonJS in backend unless you update `backend/package.json`.
- Preserve `scripts/move-assets.js` behavior for static assets.

Where I might be wrong / what I couldn't infer
- Exact API contract shapes for every endpoint — inspect `backend/controllers` and `src/services` when generating client calls.
- Any CI or deployment pipeline settings (no `.github/workflows` found in this scan).

If anything here is unclear or incomplete, tell me which area to expand (e.g., add more endpoint examples, document `scripts/move-assets.js` steps, or enumerate `src/services/*` call signatures).
