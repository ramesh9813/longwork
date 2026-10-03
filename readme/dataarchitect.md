# longwork — data architecture

## Today (implemented)
- **No application database.** The only persisted user data lives in
  **Firebase Authentication** (Firebase project `longwork`): Google-provider
  user records (`uid`, email, display name, photo URL).
- **Stateless auth**: the client holds the Firebase ID token in memory
  (`AuthContext`: `user`, `idToken`); every protected backend call sends it as
  `Authorization: Bearer <token>`, and the server verifies it fresh with
  `admin.auth().verifyIdToken()` on each request. No sessions, cookies, or
  server-side user store.
- **Service credentials**: one service account,
  `firebase-adminsdk@longwork.iam.gserviceaccount.com`, whose key is stored
  only in local `server/serviceAccountKey.json` (gitignored) and the Render
  env var `FIREBASE_SERVICE_ACCOUNT_JSON`. Web app identity:
  `1:133027039403:web:518658133a2613b50a4fee` (`longwork web`).

## Next (planned — Layerbase Postgres)
- Layerbase CLI (`lbase`, v2.0.1) is installed; cloud Postgres **not yet
  provisioned or wired**. Planned steps:
  1. `lbase login` (or `LAYERBASE_API_KEY`), `lbase cloud create … --engine postgresql`.
  2. Store the connection string as `DATABASE_URL` on the `longworkapi`
     Render service (never in git).
  3. Add a `pg` pool in `server/` (e.g. `server/src/config/db.ts`), keyed off
     `DATABASE_URL` with SSL, and fail-soft when unset (same pattern as
     Firebase init today).
- **Keying rule**: Firebase `uid` is the canonical user key — any future table
  carrying user data references `firebase_uid TEXT` (unique), never email
  (emails change; uids don't).
- **Future write paths** (when needed): Gallery templates, Plan items, and
  Customize settings per `firebase_uid`; reads for `/api/me`-style routes keep
  verifying the ID token first, then scope all queries by the verified `uid`.
- **Backups/migrations**: via `lbase` (`backup`, `branch`, `promote`/`migrate`);
  schema changes as versioned SQL in the repo (to be added when the DB lands).
