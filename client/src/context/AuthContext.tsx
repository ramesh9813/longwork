import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import {
  getFirebaseAuth,
  onAuthStateChanged,
  signInWithGoogle,
  signOut,
  type User,
} from '../config/firebase';

interface AuthContextValue {
  user: User | null;
  idToken: string | null;
  loading: boolean;
  error: string | null;
  login: () => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue>({
  user: null,
  idToken: null,
  loading: true,
  error: null,
  login: async () => {},
  logout: async () => {},
});

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [idToken, setIdToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const auth = getFirebaseAuth();
    if (!auth) {
      setLoading(false);
      return;
    }
    const unsub = onAuthStateChanged(auth, async (u) => {
      setUser(u);
      setIdToken(u ? await u.getIdToken() : null);
      setLoading(false);
    });
    return unsub;
  }, []);

  const login = async () => {
    setError(null);
    try {
      const u = await signInWithGoogle();
      setUser(u);
      setIdToken(await u.getIdToken());
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Sign-in failed');
    }
  };

  const logout = async () => {
    setError(null);
    await signOut();
    setUser(null);
    setIdToken(null);
  };

  return (
    <AuthContext.Provider value={{ user, idToken, loading, error, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
