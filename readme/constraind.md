# longwork — constraints

## Naming
- Client (frontend) URL must be a **single word**: no numbers, no symbols.
  Chosen: `longwork.onrender.com` (verified free before creation; fallback was
  `larger.onrender.com`). Backend follows the same rule: `longworkapi.onrender.com`
  (exact slugs, no Render auto-suffix).
- Firebase project display name and ID are both `longwork`.
- One GitHub repo (`ramesh9813/longwork`) hosts both `client/` and `server/`.

## Secrets (never commit)
- `.env` files, `serviceAccountKey.json` / `*serviceAccount*.json`,
  `*-key.json`, `application_default_credentials.json` are gitignored at
  root, `client/`, and `server/` level. Only `.env.example` files are committed.
- Exception: Firebase **web** config (`VITE_FIREBASE_*`) is public by design
  (it ships in the client bundle) — it lives in gitignored local `.env` files
  and as Render env vars, not hardcoded in source.
- Backend reads Admin credentials from `FIREBASE_SERVICE_ACCOUNT_JSON`
  (Render env var) or local `GOOGLE_APPLICATION_CREDENTIALS` file.

## Platform limits
- Render **free** plan, region **Oregon**; backend health check is `GET /health`.
- `VITE_*` vars are baked in at frontend **build** time — changing one needs a
  rebuild/redeploy, not just a restart.
- Client-side routing (`/app`) needs the SPA rewrite `/* → /index.html` on the
  static site (set via API; `render.yaml` routes only apply to Blueprint deploys).
- Firebase Google sign-in needs two Console actions no CLI can do: enable the
  **Google provider** and add `longwork.onrender.com` to **Authorized domains**.

## Local dev environment limits (this workspace is on sdcard)
- The sdcard filesystem has **no exec and no symlinks**: `npm install` must use
  `--ignore-scripts`, native binaries (esbuild/vite) cannot run here, and npm
  workspaces (symlinks) are not used — root scripts use `npm --prefix`.
- Server dev uses `nodemon` + `ts-node` (pure JS) instead of `tsx` for this reason.
- Typecheck via the local TypeScript binaries; client uses `tsc -b` (project
  references). Full `vite build` / `vite dev` must run on internal storage or CI.
