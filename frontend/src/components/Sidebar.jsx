import { NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function Sidebar({ activeFilter, setActiveFilter, stats }) {
  const { user, logout } = useAuth();

  return (
    <aside className="sidebar-panel">
      <div className="brand-block">
        <div className="brand-mark">PH</div>
        <div>
          <h1>Productive Hive</h1>
          <p>Organize smartly, finish beautifully.</p>
        </div>
      </div>

      <nav className="nav-links">
        <button className={activeFilter === 'all' ? 'active' : ''} onClick={() => setActiveFilter('all')}>
          All Tasks
        </button>
        <button className={activeFilter === 'completed' ? 'active' : ''} onClick={() => setActiveFilter('completed')}>
          Completed
        </button>
        <button className={activeFilter === 'pending' ? 'active' : ''} onClick={() => setActiveFilter('pending')}>
          Pending
        </button>
      </nav>

      <div className="profile-card">
        <p className="profile-label">Logged in as</p>
        <h2>{user?.name}</h2>
        <span>{user?.email}</span>
      </div>

      <div className="summary-block">
        <div>
          <span>Total</span>
          <strong>{stats.total}</strong>
        </div>
        <div>
          <span>Done</span>
          <strong>{stats.completed}</strong>
        </div>
        <div>
          <span>Pending</span>
          <strong>{stats.pending}</strong>
        </div>
      </div>

      <div className="sidebar-footer">
        <NavLink to="/profile">Profile</NavLink>
        <button className="ghost-button" onClick={logout}>
          Sign Out
        </button>
      </div>
    </aside>
  );
}

export default Sidebar;
