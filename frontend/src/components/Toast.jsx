function Toast({ message, type, onClose }) {
  if (!message) return null;

  return (
    <div className={`toast ${type || 'info'}`} onClick={onClose}>
      <span>{message}</span>
      <button>×</button>
    </div>
  );
}

export default Toast;
