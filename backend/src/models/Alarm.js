const mongoose = require('mongoose');

// Define the Alarm schema
const alarmSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
    default: 'user123' // For now, we use a default user
  },
  title: {
    type: String,
    required: [true, 'Alarm title is required'],
    trim: true
  },
  description: {
    type: String,
    default: '',
    trim: true
  },
  time: {
    type: String,
    required: [true, 'Alarm time is required'],
    match: [/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Time must be in HH:MM format']
  },
  enabled: {
    type: Boolean,
    default: true
  },
  repeatType: {
    type: String,
    enum: ['once', 'daily', 'weekdays', 'weekends', 'custom', 'interval'],
    default: 'once'
  },
  repeatDays: [{
    type: String,
    enum: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']
  }],
  intervalDays: {
    type: Number,
    default: 1,
    min: 1
  },
  snoozeMinutes: {
    type: Number,
    default: 5,
    min: 1,
    max: 60
  },
  sound: {
    type: String,
    default: 'default'
  },
  vibrate: {
    type: Boolean,
    default: true
  },
  gradualVolume: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true // Automatically add createdAt and updatedAt
});

// Create and export the model
const Alarm = mongoose.model('Alarm', alarmSchema);

module.exports = Alarm;