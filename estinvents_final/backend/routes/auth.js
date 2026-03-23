const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { protect } = require('../middleware/auth');

const generateToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN || '7d' });

// @route   POST /api/auth/register
// @desc    Register a new ESTIN student
// @access  Public
router.post('/register', async (req, res) => {
  try {
    const { firstName, lastName, email, password, department, year } = req.body;

    // Validate ESTIN email format
    const estinEmailRegex = /^[a-z]_[a-z]+@estin\.dz$/i;
    if (!estinEmailRegex.test(email)) {
      return res.status(400).json({
        message: 'Email must follow the format: first_letter_familyname@estin.dz (e.g. b_boutria@estin.dz)',
      });
    }

    // Check if email matches provided name
    const expectedPrefix = `${firstName[0].toLowerCase()}_${lastName.toLowerCase()}`;
    const emailPrefix = email.split('@')[0].toLowerCase();
    if (emailPrefix !== expectedPrefix) {
      return res.status(400).json({
        message: `Email prefix must match your name. Expected: ${expectedPrefix}@estin.dz`,
      });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return res.status(400).json({ message: 'Account already exists with this email' });
    }

    const user = await User.create({
      firstName,
      lastName,
      email: email.toLowerCase(),
      password,
      department,
      year,
    });

    const token = generateToken(user._id);

    res.status(201).json({
      message: 'Account created successfully',
      token,
      user,
    });
  } catch (err) {
    if (err.name === 'ValidationError') {
      const messages = Object.values(err.errors).map((e) => e.message);
      return res.status(400).json({ message: messages[0] });
    }
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// @route   POST /api/auth/login
// @desc    Login
// @access  Public
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password)
      return res.status(400).json({ message: 'Email and password are required' });

    // Validate ESTIN email
    const estinEmailRegex = /^[a-z]_[a-z]+@estin\.dz$/i;
    if (!estinEmailRegex.test(email)) {
      return res.status(400).json({ message: 'Only ESTIN student accounts are allowed' });
    }

    const user = await User.findOne({ email: email.toLowerCase() }).select('+password');
    if (!user) return res.status(401).json({ message: 'Invalid credentials' });

    const isMatch = await user.comparePassword(password);
    if (!isMatch) return res.status(401).json({ message: 'Invalid credentials' });

    const token = generateToken(user._id);

    res.json({
      message: 'Login successful',
      token,
      user: {
        _id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        role: user.role,
        department: user.department,
        year: user.year,
        avatar: user.avatar,
      },
    });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// @route   GET /api/auth/me
// @desc    Get current user
// @access  Private
router.get('/me', protect, async (req, res) => {
  res.json({ user: req.user });
});

// @route   PUT /api/auth/profile
// @desc    Update profile
// @access  Private
router.put('/profile', protect, async (req, res) => {
  try {
    const { department, year, avatar } = req.body;
    const user = await User.findByIdAndUpdate(
      req.user._id,
      { department, year, avatar },
      { new: true, runValidators: true }
    );
    res.json({ user });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

module.exports = router;
