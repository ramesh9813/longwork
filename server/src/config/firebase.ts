import admin from 'firebase-admin';
import dotenv from 'dotenv';

dotenv.config();

let initialized = false;

export function initFirebase(): boolean {
  if (initialized) return true;
  if (admin.apps.length > 0) {
    initialized = true;
    return true;
  }

  try {
    // 1) Raw JSON from env (best for Render)
    if (process.env.FIREBASE_SERVICE_ACCOUNT_JSON) {
      const creds = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_JSON);
      admin.initializeApp({
        credential: admin.credential.cert(creds),
      });
      initialized = true;
      console.log('Firebase Admin initialized from FIREBASE_SERVICE_ACCOUNT_JSON');
      return true;
    }

    // 2) Individual env vars (Render dashboard friendly)
    if (
      process.env.FIREBASE_PROJECT_ID &&
      process.env.FIREBASE_CLIENT_EMAIL &&
      process.env.FIREBASE_PRIVATE_KEY
    ) {
      admin.initializeApp({
        credential: admin.credential.cert({
          projectId: process.env.FIREBASE_PROJECT_ID,
          clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
          privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'),
        } as admin.ServiceAccount),
      });
      initialized = true;
      console.log('Firebase Admin initialized from individual env vars');
      return true;
    }

    // 3) Local file via GOOGLE_APPLICATION_CREDENTIALS
    if (process.env.GOOGLE_APPLICATION_CREDENTIALS) {
      admin.initializeApp({
        credential: admin.credential.applicationDefault(),
      });
      initialized = true;
      console.log('Firebase Admin initialized from GOOGLE_APPLICATION_CREDENTIALS');
      return true;
    }

    console.warn('Firebase Admin NOT initialized: no credentials found. Running without Firebase.');
    return false;
  } catch (err) {
    console.error('Firebase Admin init failed:', err);
    return false;
  }
}

export const isFirebaseReady = () => initialized;
export { admin };
