import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function Register() {
  const navigate = useNavigate();
  const { register } = useAuth();
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!form.name || !form.email || !form.password) {
      setError('Please provide name, email and password.');
      return;
    }

    try {
      setLoading(true);
      await register(form);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Unable to create account.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="auth-page">
      <section className="auth-panel glass-card">
        <div className="auth-intro">
          <span>Get started</span>
          <h1>Create your workspace</h1>
          <p>Start tracking your tasks, deadlines, and progress with a polished dashboard experience.</p>
        </div>

        <form className="auth-form" onSubmit={handleSubmit}>
          <label>
            Your name
            <input type="text" name="name" value={form.name} onChange={handleChange} placeholder="Ava Stanley" />
          </label>
          <label>
            Email address
            <input type="email" name="email" value={form.email} onChange={handleChange} placeholder="you@example.com" />
          </label>
          <label>
            Password
            <input type="password" name="password" value={form.password} onChange={handleChange} placeholder="Strong password" />
          </label>

          {error ? <p className="form-error">{error}</p> : null}

          <button className="primary-button" type="submit" disabled={loading}>
            {loading ? 'Creating account...' : 'Create account'}
          </button>
          <p className="form-caption">
            Already have an account? <Link to="/login">Sign in</Link>
          </p>
        </form>
      </section>
    </main>
  );
}

export default Register;
