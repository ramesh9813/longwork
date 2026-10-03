import { useEffect, useState } from 'react';
import './App.css';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

interface Health {
  status: string;
  uptime: number;
  timestamp: string;
  firebase: string;
}

function App() {
  const [health, setHealth] = useState<Health | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch(`${API_URL}/api/health`)
      .then((r) => (r.ok ? r.json() : Promise.reject(new Error(`HTTP ${r.status}`))))
      .then(setHealth)
      .catch((e: Error) => setError(e.message));
  }, []);

  return (
    <div className="app">
      <h1>longwork</h1>
      <p>React + TypeScript frontend + Express + Firebase backend</p>

      <div className="card">
        <h2>Backend status</h2>
        {health ? (
          <pre>{JSON.stringify(health, null, 2)}</pre>
        ) : error ? (
          <p className="error">Backend not reachable: {error}</p>
        ) : (
          <p>Connecting to {API_URL}…</p>
        )}
      </div>
    </div>
  );
}

export default App;
