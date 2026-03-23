const mongoose = require('mongoose');

const professorSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Professor name is required'],
    trim: true,
  },
  department: {
    type: String,
    required: [true, 'Department is required'],
  },
  email: {
    type: String,
    lowercase: true,
    trim: true,
  },
  photo: {
    type: String,
    default: '',
  },
  modules: [String],
  status: {
    type: String,
    enum: ['present', 'absent', 'unknown'],
    default: 'unknown',
  },
  statusNote: {
    type: String,
    default: '',
  },
  statusUpdatedAt: {
    type: Date,
    default: Date.now,
  },
  statusUpdatedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  schedule: [
    {
      day: {
        type: String,
        enum: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
      },
      startTime: String,
      endTime: String,
      room: String,
      module: String,
    },
  ],
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

professorSchema.index({ department: 1 });
professorSchema.index({ status: 1 });

module.exports = mongoose.model('Professor', professorSchema);
