import { initializeApp, getApps, type FirebaseApp } from 'firebase/app';
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  signOut as firebaseSignOut,
  onAuthStateChanged,
  type Auth,
  type User,
} from 'firebase/auth';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

let app: FirebaseApp | null = null;
let auth: Auth | null = null;

export function getFirebaseApp(): FirebaseApp | null {
  if (!firebaseConfig.apiKey) {
    console.warn('Firebase web config missing, skipping init');
    return null;
  }
  if (!app) {
    app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
  }
  return app;
}

export function getFirebaseAuth(): Auth | null {
  const fbApp = getFirebaseApp();
  if (!fbApp) return null;
  if (!auth) auth = getAuth(fbApp);
  return auth;
}

const googleProvider = new GoogleAuthProvider();
// Always show account chooser (lets users switch Google accounts)
googleProvider.setCustomParameters({ prompt: 'select_account' });

export async function signInWithGoogle(): Promise<User> {
  const fbAuth = getFirebaseAuth();
  if (!fbAuth) throw new Error('Firebase is not configured');
  const result = await signInWithPopup(fbAuth, googleProvider);
  return result.user;
}

export async function signOut(): Promise<void> {
  const fbAuth = getFirebaseAuth();
  if (fbAuth) await firebaseSignOut(fbAuth);
}

export { onAuthStateChanged };
export type { User };
