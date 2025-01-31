const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { User, Thermostat } = require('../models');

const router = express.Router();

// Error handler wrapper
const asyncHandler = fn => (req, res, next) =>
  Promise.resolve(fn(req, res, next)).catch(next);

// Register route
router.post('/register', asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;

  // Validate required fields
  if (!name || !email || !password) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  // Check if user exists
  const userExists = await User.findOne({ where: { email } });
  if (userExists) {
    return res.status(400).json({ message: 'Email already exists' });
  }

  // Create user
  const user = await User.create({
    name,
    email,
    password
  });

  // Create default thermostat for the user
  await Thermostat.create({
    user_id: user.id,
    name: 'Main Thermostat',
    current_temperature: 20.0,
    target_temperature: 20.0,
    mode: 'off',
    is_active: true
  });

  // Generate token
  const token = jwt.sign(
    { userId: user.id },
    process.env.JWT_SECRET,
    { expiresIn: '24h' }
  );

  // Send response without sensitive data
  const userResponse = user.toJSON();
  delete userResponse.password_hash;

  res.status(201).json({
    token,
    user: userResponse
  });
}));

// Login route
router.post('/login', asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  // Find user by email with thermostats
  const user = await User.findOne({ 
    where: { email },
    include: [{
      model: Thermostat,
      as: 'thermostats'
    }]
  });

  if (!user) {
    return res.status(400).json({ message: 'Invalid credentials' });
  }

  // Verify password
  const isMatch = await bcrypt.compare(password, user.password_hash);
  if (!isMatch) {
    return res.status(400).json({ message: 'Invalid credentials' });
  }

  // Generate token
  const token = jwt.sign(
    { userId: user.id },
    process.env.JWT_SECRET,
    { expiresIn: '24h' }
  );

  // Send response without password_hash
  const userResponse = user.toJSON();
  delete userResponse.password_hash;

  res.json({
    token,
    user: userResponse
  });
}));

// Get current user
router.get('/me', asyncHandler(async (req, res) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');
  
  if (!token) {
    return res.status(401).json({ message: 'Authentication required' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findOne({
      where: { id: decoded.userId },
      include: [{
        model: Thermostat,
        as: 'thermostats'
      }],
      attributes: { exclude: ['password_hash'] }
    });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json(user);
  } catch (error) {
    res.status(401).json({ message: 'Invalid token' });
  }
}));

module.exports = router;
