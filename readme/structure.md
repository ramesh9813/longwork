# longwork — structure

## Repo tree (single git repo, `main`)
```
longwork/
├── client/                  # React + TS + Vite frontend
│   ├── index.html
│   ├── vite.config.ts       # dev proxy /api → localhost:5000
│   ├── tsconfig.json + tsconfig.node.json
│   ├── .env / .env.example  # VITE_API_URL, VITE_FIREBASE_* (gitignored real one)
│   └── src/
│       ├── main.tsx         # AuthProvider + BrowserRouter (/, /app)
│       ├── App.tsx          # home: sign-in, profile, backend status
│       ├── pages/AppWorkspace.tsx (+ .css)  # /app: Gallery 25 / Plan 60 / Customize 15
│       ├── context/AuthContext.tsx           # user, idToken, login, logout
│       ├── config/firebase.ts                # app init, Google provider, helpers
│       └── index.css / App.css / vite-env.d.ts
├── server/                  # Express + TS backend
│   ├── tsconfig.json
│   ├── .env / .env.example  # PORT, CLIENT_URL, GOOGLE_APPLICATION_CREDENTIALS
│   ├── serviceAccountKey.json            # LOCAL ONLY, gitignored
│   └── src/
│       ├── index.ts         # helmet/cors/morgan, /, /health, /api/*, 404
│       ├── routes/health.ts # GET /api/health (+ /firebase)
│       ├── middleware/requireAuth.ts     # Bearer → verifyIdToken → req.firebaseUser
│       └── config/firebase.ts            # Admin init (JSON env / vars / file)
├── readme/                  # this documentation (description/constraind/structure/dataarchitect)
├── render.yaml              # Render blueprint (both services, SPA rewrite)
├── package.json             # root orchestrator (concurrently, --prefix scripts)
└── .gitignore               # node_modules, .env, *serviceAccount*.json, dist, …
```

## Request flow (authenticated call)
```
Browser (/app) → signInWithPopup(Google) → Firebase Auth → ID token
  → fetch longworkapi.onrender.com/api/me (Authorization: Bearer <token>)
  → requireAuth → admin.auth().verifyIdToken() → { uid, email, name, picture }
```

## Render services
- `longworkapi` (`srv-db0b3vvavr4c73etridg`): web_service, node, `rootDir: server`,
  build `npm install && npm run build`, start `npm run start`,
  `healthCheckPath: /health`, env `PORT=10000`, `CLIENT_URL`,
  `FIREBASE_SERVICE_ACCOUNT_JSON`.
- `longwork` (`srv-db0b43e0tbcc73f2oru0`): static_site, `rootDir: client`,
  build `npm install && npm run build`, publish `dist`, env `VITE_API_URL`,
  `VITE_FIREBASE_*`, rewrite `/* → /index.html` (set via API, id `rdr-…`).

## Root scripts
`dev` (both), `dev:server`, `dev:client`, `build`, `build:server`,
`build:client`, `start` (server), `typecheck`, `install:all` (all with
`--ignore-scripts` for this sdcard workspace).
