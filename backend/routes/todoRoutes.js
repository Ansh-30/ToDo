const express = require('express');
const {
  getTodos,
  createTodo,
  updateTodo,
  deleteTodo,
  getSummary,
} = require('../controllers/todoController');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

router.use(authMiddleware);
router.get('/', getTodos);
router.get('/summary', getSummary);
router.post('/', createTodo);
router.put('/:id', updateTodo);
router.delete('/:id', deleteTodo);

module.exports = router;
