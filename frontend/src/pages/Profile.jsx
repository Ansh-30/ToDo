import { useAuth } from '../context/AuthContext';
import { useEffect, useState } from 'react';
import { getTodoSummary } from '../services/todoService';
import Sidebar from '../components/Sidebar';
import StatCard from '../components/StatCard';

function Profile() {
  const { user } = useAuth();
  const [summary, setSummary] = useState({ total: 0, completed: 0, pending: 0 });

  useEffect(() => {
    const load = async () => {
      try {
        const data = await getTodoSummary();
        setSummary(data);
      } catch (error) {
        console.error(error);
      }
    };
    load();
  }, []);

  return (
    <div className="dashboard-grid">
      <Sidebar activeFilter="all" setActiveFilter={() => {}} stats={summary} />
      <main className="dashboard-main profile-view">
        <div className="page-card glass-card">
          <h2>Your profile</h2>
          <p>Account details and progress summary for your productive workflow.</p>
          <div className="profile-grid">
            <div className="profile-item">
              <span>Name</span>
              <strong>{user?.name}</strong>
            </div>
            <div className="profile-item">
              <span>Email</span>
              <strong>{user?.email}</strong>
            </div>
            <div className="profile-item">
              <span>Joined</span>
              <strong>{new Date(user?.createdAt || Date.now()).toLocaleDateString()}</strong>
            </div>
          </div>
        </div>

        <section className="dashboard-grid-cards profile-stats">
          <StatCard title="Total tasks" value={summary.total} accent="purple" />
          <StatCard title="Completed" value={summary.completed} accent="blue" />
          <StatCard title="Pending" value={summary.pending} accent="soft" />
        </section>
      </main>
    </div>
  );
}

export default Profile;
