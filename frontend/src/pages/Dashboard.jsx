import { useEffect, useMemo, useState } from 'react';
import { Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { useAuth } from '../context/AuthContext';
import Sidebar from '../components/Sidebar';
import StatCard from '../components/StatCard';
import TodoCard from '../components/TodoCard';
import TodoForm from '../components/TodoForm';
import Toast from '../components/Toast';
import SkeletonCard from '../components/SkeletonCard';
import { createTodo, deleteTodo, getTodoSummary, getTodos, updateTodo } from '../services/todoService';

ChartJS.register(ArcElement, Tooltip, Legend);

function Dashboard() {
  const { token } = useAuth();
  const [todos, setTodos] = useState([]);
  const [stats, setStats] = useState({ total: 0, completed: 0, pending: 0, completionRate: 0 });
  const [activeFilter, setActiveFilter] = useState('all');
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [formVisible, setFormVisible] = useState(false);
  const [editingTodo, setEditingTodo] = useState(null);
  const [toast, setToast] = useState({ message: '', type: '' });

  const loadData = async () => {
    setLoading(true);
    try {
      const [{ todos: list }, summary] = await Promise.all([getTodos(), getTodoSummary()]);
      setTodos(list);
      setStats(summary);
    } catch (error) {
      setToast({ message: error.response?.data?.message || 'Unable to load tasks.', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) loadData();
  }, [token]);

  const filteredTodos = useMemo(() => {
    return todos
      .filter((todo) => {
        if (activeFilter === 'completed') return todo.completed;
        if (activeFilter === 'pending') return !todo.completed;
        return true;
      })
      .filter((todo) => todo.title.toLowerCase().includes(search.toLowerCase()) || todo.description?.toLowerCase().includes(search.toLowerCase()));
  }, [todos, activeFilter, search]);

  const chartData = {
    labels: ['Completed', 'Pending'],
    datasets: [
      {
        data: [stats.completed, stats.pending],
        backgroundColor: ['#5b77f7', '#7b6cf7', '#d3d1fa'],
        borderWidth: 0,
      },
    ],
  };

  const handleSave = async (payload) => {
    try {
      if (editingTodo) {
        const { todo } = await updateTodo(editingTodo._id, { ...payload, completed: editingTodo.completed });
        setTodos((prev) => prev.map((item) => (item._id === todo._id ? todo : item)));
        setToast({ message: 'Task updated successfully.', type: 'success' });
      } else {
        const { todo } = await createTodo(payload);
        setTodos((prev) => [todo, ...prev]);
        setToast({ message: 'Task added to your board.', type: 'success' });
      }
      setFormVisible(false);
      setEditingTodo(null);
      const summary = await getTodoSummary();
      setStats(summary);
    } catch (error) {
      setToast({ message: error.response?.data?.message || 'Unable to save task.', type: 'error' });
    }
  };

  const handleToggle = async (todo) => {
    try {
      const { todo: updated } = await updateTodo(todo._id, { completed: !todo.completed });
      setTodos((prev) => prev.map((item) => (item._id === updated._id ? updated : item)));
      setStats(await getTodoSummary());
      setToast({ message: updated.completed ? 'Nice work! Task completed.' : 'Task marked incomplete.', type: 'success' });
    } catch (error) {
      setToast({ message: 'Unable to update task status.', type: 'error' });
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteTodo(id);
      setTodos((prev) => prev.filter((item) => item._id !== id));
      setStats(await getTodoSummary());
      setToast({ message: 'Task removed from your board.', type: 'success' });
    } catch (error) {
      setToast({ message: 'Unable to delete task.', type: 'error' });
    }
  };

  const openEditor = (todo) => {
    setEditingTodo(todo);
    setFormVisible(true);
  };

  const resetForm = () => {
    setEditingTodo(null);
    setFormVisible(false);
  };

  return (
    <div className="dashboard-grid">
      <Sidebar activeFilter={activeFilter} setActiveFilter={setActiveFilter} stats={stats} />

      <main className="dashboard-main">
        <div className="dashboard-header">
          <div>
            <span className="eyebrow">Today’s focus</span>
            <h1>Task management with clear progress insights.</h1>
          </div>
          <button className="primary-button" onClick={() => setFormVisible(true)}>
            + Add task
          </button>
        </div>

        <div className="board-topbar">
          <div className="search-box">
            <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search tasks, labels or notes" />
          </div>
          <div className="progress-banner">
            <div>
              <span>Completion rate</span>
              <strong>{stats.completionRate}%</strong>
            </div>
            <div className="status-pill">{stats.completionRate === 100 ? 'All tasks completed 🎉' : 'Keep going'}</div>
          </div>
        </div>

        <section className="dashboard-grid-cards">
          <StatCard title="Total tasks" value={stats.total} accent="purple" />
          <StatCard title="Completed" value={stats.completed} accent="blue" />
          <StatCard title="Pending" value={stats.pending} accent="soft" />
          <div className="chart-card glass-card">
            <div className="chart-header">
              <span>Completion breakdown</span>
              <strong>{stats.completed} done</strong>
            </div>
            <Doughnut data={chartData} options={{ plugins: { legend: { position: 'bottom' } }, cutout: '70%' }} />
          </div>
        </section>

        <section className="task-board glass-card">
          <div className="board-header">
            <div>
              <h2>My tasks</h2>
              <p>{filteredTodos.length} items found</p>
            </div>
            <span>{activeFilter === 'all' ? 'Browse all active tasks' : `Filtered by ${activeFilter}`}</span>
          </div>

          {loading ? (
            <div className="skeleton-grid">
              <SkeletonCard />
              <SkeletonCard />
              <SkeletonCard />
            </div>
          ) : filteredTodos.length ? (
            <div className="todo-grid">
              {filteredTodos.map((todo) => (
                <TodoCard key={todo._id} todo={todo} onToggle={handleToggle} onEdit={openEditor} onDelete={handleDelete} />
              ))}
            </div>
          ) : (
            <div className="empty-state">
              <h3>Nothing waiting here</h3>
              <p>Try adding a new task to see your progress chart come alive.</p>
              <button className="secondary-button" onClick={() => setFormVisible(true)}>
                Add first task
              </button>
            </div>
          )}
        </section>
      </main>

      {formVisible && <TodoForm onSubmit={handleSave} editing={editingTodo} onClose={resetForm} />}
      <Toast message={toast.message} type={toast.type} onClose={() => setToast({ message: '', type: '' })} />
    </div>
  );
}

export default Dashboard;
