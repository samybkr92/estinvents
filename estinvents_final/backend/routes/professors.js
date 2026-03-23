const express = require('express');
const router = express.Router();
const Professor = require('../models/Professor');
const { protect, adminOnly } = require('../middleware/auth');

// @route   GET /api/professors
// @access  Private
router.get('/', protect, async (req, res) => {
  try {
    const { department, status, search } = req.query;
    const query = {};
    if (department) query.department = department;
    if (status) query.status = status;
    if (search) query.name = { $regex: search, $options: 'i' };

    const professors = await Professor.find(query).sort({ name: 1 });
    res.json({ professors });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/professors/:id
// @access  Private
router.get('/:id', protect, async (req, res) => {
  try {
    const professor = await Professor.findById(req.params.id);
    if (!professor) return res.status(404).json({ message: 'Professor not found' });
    res.json({ professor });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   POST /api/professors
// @access  Private/Admin
router.post('/', protect, adminOnly, async (req, res) => {
  try {
    const professor = await Professor.create(req.body);
    res.status(201).json({ professor });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// @route   PUT /api/professors/:id
// @access  Private/Admin
router.put('/:id', protect, adminOnly, async (req, res) => {
  try {
    const professor = await Professor.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!professor) return res.status(404).json({ message: 'Not found' });
    res.json({ professor });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// @route   PATCH /api/professors/:id/status
// @desc    Update professor attendance status (admin only)
// @access  Private/Admin
router.patch('/:id/status', protect, adminOnly, async (req, res) => {
  try {
    const { status, statusNote } = req.body;
    const professor = await Professor.findByIdAndUpdate(
      req.params.id,
      {
        status,
        statusNote,
        statusUpdatedAt: Date.now(),
        statusUpdatedBy: req.user._id,
      },
      { new: true }
    );
    if (!professor) return res.status(404).json({ message: 'Not found' });
    res.json({ professor });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// @route   DELETE /api/professors/:id
// @access  Private/Admin
router.delete('/:id', protect, adminOnly, async (req, res) => {
  try {
    await Professor.findByIdAndDelete(req.params.id);
    res.json({ message: 'Professor deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
