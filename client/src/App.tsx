import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import './App.css';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

interface Health {
  status: string;
  uptime: number;
  timestamp: string;
  firebase: string;
}

function App() {
  const { user, idToken, loading, error, login, logout } = useAuth();
  const [health, setHealth] = useState<Health | null>(null);
  const [healthError, setHealthError] = useState<string | null>(null);
  const [profile, setProfile] = useState<unknown>(null);

  useEffect(() => {
    fetch(`${API_URL}/api/health`)
      .then((r) => (r.ok ? r.json() : Promise.reject(new Error(`HTTP ${r.status}`))))
      .then(setHealth)
      .catch((e: Error) => setHealthError(e.message));
  }, []);

  useEffect(() => {
    if (!idToken) {
      setProfile(null);
      return;
    }
    fetch(`${API_URL}/api/me`, {
      headers: { Authorization: `Bearer ${idToken}` },
    })
      .then((r) => (r.ok ? r.json() : Promise.reject(new Error(`HTTP ${r.status}`))))
      .then(setProfile)
      .catch((e: Error) => setProfile({ error: e.message }));
  }, [idToken]);

  return (
    <div className="app">
      <h1>longwork</h1>
      <p>
        React + TypeScript frontend + Express + Firebase backend — <Link to="/app">Open /app</Link>
      </p>

      <div className="card">
        <h2>Sign in</h2>
        {loading ? (
          <p>Loading…</p>
        ) : user ? (
          <div>
            <p>
              Signed in as <strong>{user.displayName || user.email}</strong>
              {user.photoURL && (
                <img
                  src={user.photoURL}
                  alt=""
                  width={28}
                  height={28}
                  style={{ borderRadius: '50%', marginLeft: 8, verticalAlign: 'middle' }}
                />
              )}
            </p>
            <button onClick={logout}>Sign out</button>
          </div>
        ) : (
          <div>
            <button onClick={login}>Sign in with Google</button>
            {error && <p className="error">{error}</p>}
          </div>
        )}
      </div>

      {user && (
        <div className="card">
          <h2>Verified backend profile</h2>
          <pre>{profile ? JSON.stringify(profile, null, 2) : 'Verifying token…'}</pre>
        </div>
      )}

      <div className="card">
        <h2>Backend status</h2>
        {health ? (
          <pre>{JSON.stringify(health, null, 2)}</pre>
        ) : healthError ? (
          <p className="error">Backend not reachable: {healthError}</p>
        ) : (
          <p>Connecting to {API_URL}…</p>
        )}
      </div>
    </div>
  );
}

export default App;
