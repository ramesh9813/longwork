# longwork — project description

## What it is
**longwork** is a full-stack TypeScript monorepo for running extremely long tasks.
It has a React frontend and an Express backend in one GitHub repo
(`ramesh9813/longwork`, branch `main`), deployed as two Render services
with Firebase-based Google authentication.

## Live URLs
| Part     | URL                                | Render service              |
|----------|------------------------------------|-----------------------------|
| Frontend | https://longwork.onrender.com      | static site `longwork`      |
| Backend  | https://longworkapi.onrender.com   | web service `longworkapi`   |

Both services auto-deploy on every push to `main`.

## Stack
- **Client** (`client/`): React 18 + TypeScript + Vite 5, `react-router-dom`,
  Firebase Web SDK (`firebase`). Build: `tsc -b && vite build`, publish `dist`.
- **Server** (`server/`): Express 4 + TypeScript, `helmet` / `cors` / `morgan` /
  `dotenv`, Firebase Admin SDK (`firebase-admin`). Build: `tsc`, start:
  `node dist/index.js`. Health check: `GET /health`.
- **Auth**: Firebase project `longwork`, Google sign-in. Client signs in with
  `signInWithPopup`, keeps the user in `AuthContext`, and calls the backend
  with the Firebase ID token (`Authorization: Bearer <token>`). The backend
  verifies the token with `admin.auth().verifyIdToken()` — no sessions stored.
- **Infra as code**: `render.yaml` blueprint (backend + frontend + SPA rewrite
  `/* → /index.html`).

## Routes
- Client: `/` (home, sign-in, backend status), `/app` (three-pane workspace:
  **Gallery 25% / Plan 60% / Customize 15%**).
- Server: `GET /`, `GET /health` (Render), `GET /api/health` (+ `/firebase`),
  `GET /api/me` (protected — returns the verified Firebase user).

## Current state
- Auth code, login UI, and token verification are deployed and verified
  (`/api/health` reports `"firebase": "connected"`).
- Two manual Firebase Console steps remain: enable the **Google** sign-in
  provider and add `longwork.onrender.com` to **Authorized domains**.
- No application database yet — Layerbase Postgres is planned (CLI installed,
  connection not wired). See `dataarchitect.md`.
