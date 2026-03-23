const express = require('express');
const router = express.Router();
const News = require('../models/News');
const { protect, adminOnly } = require('../middleware/auth');

// @route   GET /api/news
// @access  Private
router.get('/', protect, async (req, res) => {
  try {
    const { category, search, page = 1, limit = 10 } = req.query;
    const query = { isPublished: true };
    if (category) query.category = category;
    if (search) query.title = { $regex: search, $options: 'i' };

    const skip = (parseInt(page) - 1) * parseInt(limit);
    const total = await News.countDocuments(query);
    const news = await News.find(query)
      .populate('author', 'firstName lastName')
      .sort({ isPinned: -1, createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    res.json({ news, total, page: parseInt(page), pages: Math.ceil(total / parseInt(limit)) });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/news/:id
// @access  Private
router.get('/:id', protect, async (req, res) => {
  try {
    const article = await News.findById(req.params.id).populate('author', 'firstName lastName');
    if (!article) return res.status(404).json({ message: 'Article not found' });
    article.views += 1;
    await article.save();
    res.json({ article });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   POST /api/news
// @access  Private/Admin
router.post('/', protect, adminOnly, async (req, res) => {
  try {
    const article = await News.create({ ...req.body, author: req.user._id });
    res.status(201).json({ article });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// @route   PUT /api/news/:id
// @access  Private/Admin
router.put('/:id', protect, adminOnly, async (req, res) => {
  try {
    const article = await News.findByIdAndUpdate(
      req.params.id,
      { ...req.body, updatedAt: Date.now() },
      { new: true }
    );
    if (!article) return res.status(404).json({ message: 'Not found' });
    res.json({ article });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// @route   DELETE /api/news/:id
// @access  Private/Admin
router.delete('/:id', protect, adminOnly, async (req, res) => {
  try {
    await News.findByIdAndDelete(req.params.id);
    res.json({ message: 'Article deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
