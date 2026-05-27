const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { success, error } = require('../utils/apiResponse');

const generateToken = (userId) => {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new Error('JWT_SECRET is required');
  }

  return jwt.sign({ userId }, secret, { expiresIn: '7d' });
};

exports.register = async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return error(res, 'Name, email and password are required.', 400);
  }

  const existingUser = await User.findOne({ email });
  if (existingUser) {
    return error(res, 'Email is already registered.', 409);
  }

  const hashedPassword = await bcrypt.hash(password, 12);
  const user = await User.create({ name, email, password: hashedPassword });

  const token = generateToken(user._id);

  return success(res, {
    user: { id: user._id, name: user.name, email: user.email, createdAt: user.createdAt },
    token,
  }, 201);
};

exports.login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return error(res, 'Please provide email and password.', 400);
  }

  const user = await User.findOne({ email });
  if (!user) {
    return error(res, 'Invalid credentials.', 401);
  }

  const isValid = await bcrypt.compare(password, user.password);
  if (!isValid) {
    return error(res, 'Invalid credentials.', 401);
  }

  const token = generateToken(user._id);
  return success(res, { user: { id: user._id, name: user.name, email: user.email, createdAt: user.createdAt }, token });
};

exports.profile = async (req, res) => {
  const user = await User.findById(req.user.userId).select('-password');
  if (!user) {
    return error(res, 'User not found.', 404);
  }

  return success(res, { user });
};
