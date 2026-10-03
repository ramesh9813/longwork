import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './AppWorkspace.css';

export default function AppWorkspace() {
  const { user, loading, login, logout } = useAuth();

  return (
    <div className="workspace">
      <header className="workspace-topbar">
        <Link to="/" className="workspace-brand">
          longwork
        </Link>
        <span className="workspace-route">/app</span>
        {loading ? null : user ? (
          <button onClick={logout} className="workspace-auth-btn">
            Sign out ({user.displayName || user.email})
          </button>
        ) : (
          <button onClick={login} className="workspace-auth-btn">
            Sign in with Google
          </button>
        )}
      </header>

      <div className="workspace-panes">
        <aside className="pane pane-gallery" aria-label="Gallery">
          <h2>Gallery</h2>
          <p className="pane-hint">Saved layouts and templates will appear here.</p>
          <ul className="pane-list">
            <li>Template 1</li>
            <li>Template 2</li>
            <li>Template 3</li>
          </ul>
        </aside>

        <main className="pane pane-plan" aria-label="Plan">
          <h2>Plan</h2>
          <p className="pane-hint">Your active work plan goes here.</p>
          <div className="plan-canvas">Plan canvas</div>
        </main>

        <aside className="pane pane-customize" aria-label="Customize">
          <h2>Customize</h2>
          <p className="pane-hint">Controls</p>
          <label className="pane-field">
            Theme
            <select>
              <option>Light</option>
              <option>Dark</option>
            </select>
          </label>
        </aside>
      </div>
    </div>
  );
}
