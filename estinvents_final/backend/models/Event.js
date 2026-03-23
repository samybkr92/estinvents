const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Event title is required'],
    trim: true,
  },
  description: {
    type: String,
    required: [true, 'Description is required'],
  },
  category: {
    type: String,
    enum: ['academic', 'cultural', 'sports', 'workshop', 'conference', 'club', 'other'],
    default: 'other',
  },
  date: {
    type: Date,
    required: [true, 'Event date is required'],
  },
  endDate: {
    type: Date,
  },
  location: {
    type: String,
    required: [true, 'Location is required'],
  },
  organizer: {
    type: String,
    required: [true, 'Organizer is required'],
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  image: {
    type: String,
    default: '',
  },
  capacity: {
    type: Number,
    default: null,
  },
  registeredCount: {
    type: Number,
    default: 0,
  },
  registeredUsers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  tags: [String],
  isPublished: {
    type: Boolean,
    default: true,
  },
  isFeatured: {
    type: Boolean,
    default: false,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Index for faster date-based queries
eventSchema.index({ date: 1 });
eventSchema.index({ category: 1 });
eventSchema.index({ isPublished: 1 });

module.exports = mongoose.model('Event', eventSchema);
