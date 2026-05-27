import { useEffect, useState } from 'react';

const initialState = {
  title: '',
  description: '',
  dueDate: '',
  priority: 'Medium',
};

function TodoForm({ onSubmit, onClose, editing }) {
  const [form, setForm] = useState(initialState);
  const [error, setError] = useState('');

  useEffect(() => {
    if (editing) {
      setForm({
        title: editing.title,
        description: editing.description || '',
        dueDate: editing.dueDate ? editing.dueDate.split('T')[0] : '',
        priority: editing.priority,
      });
    }
  }, [editing]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const submit = (event) => {
    event.preventDefault();
    if (!form.title.trim()) {
      setError('Task title is required.');
      return;
    }
    setError('');
    onSubmit({ ...form });
  };

  return (
    <div className="form-panel">
      <div className="form-header">
        <div>
          <h2>{editing ? 'Update task' : 'Add a new task'}</h2>
          <p>Keep your week organized with task due dates and priority labels.</p>
        </div>
        <button className="ghost-button" onClick={onClose}>
          Close
        </button>
      </div>

      <form className="todo-form" onSubmit={submit}>
        <label>
          Task title
          <input name="title" value={form.title} onChange={handleChange} placeholder="Design the new roadmap" />
        </label>

        <label>
          Description
          <textarea name="description" value={form.description} onChange={handleChange} rows="3" placeholder="Add extra notes for context." />
        </label>

        <div className="form-row">
          <label>
            Due date
            <input type="date" name="dueDate" value={form.dueDate} onChange={handleChange} />
          </label>
          <label>
            Priority
            <select name="priority" value={form.priority} onChange={handleChange}>
              <option>Low</option>
              <option>Medium</option>
              <option>High</option>
            </select>
          </label>
        </div>

        {error ? <span className="form-error">{error}</span> : null}

        <button type="submit" className="primary-button">
          {editing ? 'Update task' : 'Create task'}
        </button>
      </form>
    </div>
  );
}

export default TodoForm;
