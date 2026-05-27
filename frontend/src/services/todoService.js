import api from './api';

export const getTodos = async () => {
  const response = await api.get('/todos');
  return response.data;
};

export const getTodoSummary = async () => {
  const response = await api.get('/todos/summary');
  return response.data;
};

export const createTodo = async (payload) => {
  const response = await api.post('/todos', payload);
  return response.data;
};

export const updateTodo = async (id, payload) => {
  const response = await api.put(`/todos/${id}`, payload);
  return response.data;
};

export const deleteTodo = async (id) => {
  const response = await api.delete(`/todos/${id}`);
  return response.data;
};
