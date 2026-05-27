import { motion } from 'framer-motion';

function TodoCard({ todo, onToggle, onEdit, onDelete }) {
  const due = todo.dueDate ? new Date(todo.dueDate).toLocaleDateString() : 'No deadline';
  return (
    <motion.article
      layout
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -2 }}
      className={`todo-card ${todo.completed ? 'completed' : ''}`}>
      <div className="todo-primary">
        <button className="checkbox-button" onClick={() => onToggle(todo)}>
          {todo.completed ? '✓' : ''}
        </button>
        <div>
          <h3>{todo.title}</h3>
          <p>{todo.description || 'No description yet.'}</p>
        </div>
      </div>

      <div className="todo-meta">
        <span className={`priority-pill ${todo.priority.toLowerCase()}`}>{todo.priority}</span>
        <span>{due}</span>
      </div>

      <div className="todo-actions">
        <button onClick={() => onEdit(todo)}>Edit</button>
        <button className="danger" onClick={() => onDelete(todo._id)}>
          Delete
        </button>
      </div>
    </motion.article>
  );
}

export default TodoCard;
