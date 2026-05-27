const Todo = require('../models/Todo');
const { success, error } = require('../utils/apiResponse');

exports.getTodos = async (req, res) => {
  const todos = await Todo.find({ user: req.user.userId }).sort({ createdAt: -1 });
  return success(res, { todos });
};

exports.getSummary = async (req, res) => {
  const todos = await Todo.find({ user: req.user.userId });
  const total = todos.length;
  const completed = todos.filter((todo) => todo.completed).length;
  const pending = total - completed;

  return success(res, { total, completed, pending, completionRate: total ? Math.round((completed / total) * 100) : 0 });
};

exports.createTodo = async (req, res) => {
  const { title, description, dueDate, priority } = req.body;

  if (!title || !priority) {
    return error(res, 'Title and priority are required.', 400);
  }

  const todo = await Todo.create({
    user: req.user.userId,
    title,
    description,
    dueDate: dueDate ? new Date(dueDate) : undefined,
    priority,
  });

  return success(res, { todo }, 201);
};

exports.updateTodo = async (req, res) => {
  const { id } = req.params;
  const updates = req.body;

  const todo = await Todo.findOneAndUpdate(
    { _id: id, user: req.user.userId },
    { $set: updates },
    { new: true, runValidators: true }
  );

  if (!todo) {
    return error(res, 'Todo not found.', 404);
  }

  return success(res, { todo });
};

exports.deleteTodo = async (req, res) => {
  const { id } = req.params;
  const todo = await Todo.findOneAndDelete({ _id: id, user: req.user.userId });
  if (!todo) {
    return error(res, 'Todo not found.', 404);
  }

  return success(res, { message: 'Todo deleted successfully.' });
};
