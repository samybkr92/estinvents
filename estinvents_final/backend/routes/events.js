const express = require('express');
const router = express.Router();
const Event = require('../models/Event');
const { protect, adminOnly } = require('../middleware/auth');

// @route   GET /api/events
// @desc    Get all published events (with filters)
// @access  Private
router.get('/', protect, async (req, res) => {
  try {
    const { category, upcoming, search, page = 1, limit = 10 } = req.query;
    const query = { isPublished: true };

    if (category) query.category = category;
    if (upcoming === 'true') query.date = { $gte: new Date() };
    if (search) query.title = { $regex: search, $options: 'i' };

    const skip = (parseInt(page) - 1) * parseInt(limit);
    const total = await Event.countDocuments(query);
    const events = await Event.find(query)
      .populate('createdBy', 'firstName lastName')
      .sort({ date: 1 })
      .skip(skip)
      .limit(parseInt(limit));

    res.json({
      events,
      total,
      page: parseInt(page),
      pages: Math.ceil(total / parseInt(limit)),
    });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// @route   GET /api/events/featured
// @desc    Get featured events
// @access  Private
router.get('/featured', protect, async (req, res) => {
  try {
    const events = await Event.find({ isFeatured: true, isPublished: true, date: { $gte: new Date() } })
      .sort({ date: 1 })
      .limit(5);
    res.json({ events });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/events/:id
// @desc    Get single event
// @access  Private
router.get('/:id', protect, async (req, res) => {
  try {
    const event = await Event.findById(req.params.id).populate('createdBy', 'firstName lastName');
    if (!event) return res.status(404).json({ message: 'Event not found' });
    res.json({ event });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   POST /api/events
// @desc    Create event (admin only)
// @access  Private/Admin
router.post('/', protect, adminOnly, async (req, res) => {
  try {
    const event = await Event.create({ ...req.body, createdBy: req.user._id });
    res.status(201).json({ event });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// @route   PUT /api/events/:id
// @desc    Update event (admin only)
// @access  Private/Admin
router.put('/:id', protect, adminOnly, async (req, res) => {
  try {
    const event = await Event.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!event) return res.status(404).json({ message: 'Event not found' });
    res.json({ event });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// @route   DELETE /api/events/:id
// @desc    Delete event (admin only)
// @access  Private/Admin
router.delete('/:id', protect, adminOnly, async (req, res) => {
  try {
    await Event.findByIdAndDelete(req.params.id);
    res.json({ message: 'Event deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   POST /api/events/:id/register
// @desc    Register for an event
// @access  Private
router.post('/:id/register', protect, async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) return res.status(404).json({ message: 'Event not found' });

    if (event.registeredUsers.includes(req.user._id)) {
      return res.status(400).json({ message: 'Already registered for this event' });
    }

    if (event.capacity && event.registeredCount >= event.capacity) {
      return res.status(400).json({ message: 'Event is full' });
    }

    event.registeredUsers.push(req.user._id);
    event.registeredCount += 1;
    await event.save();

    res.json({ message: 'Registered successfully', event });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
