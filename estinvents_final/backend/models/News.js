const mongoose = require('mongoose');

const newsSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Title is required'],
    trim: true,
  },
  content: {
    type: String,
    required: [true, 'Content is required'],
  },
  excerpt: {
    type: String,
    maxlength: 300,
  },
  category: {
    type: String,
    enum: ['announcement', 'academic', 'administrative', 'achievement', 'general'],
    default: 'general',
  },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  image: {
    type: String,
    default: '',
  },
  tags: [String],
  isPinned: {
    type: Boolean,
    default: false,
  },
  isPublished: {
    type: Boolean,
    default: true,
  },
  views: {
    type: Number,
    default: 0,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

newsSchema.index({ createdAt: -1 });
newsSchema.index({ isPinned: -1, createdAt: -1 });

module.exports = mongoose.model('News', newsSchema);
