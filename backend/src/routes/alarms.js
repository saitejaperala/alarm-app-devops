const express = require('express');
const router = express.Router();
const Alarm = require('../models/Alarm');

// GET all alarms for a user
router.get('/', async (req, res) => {
  try {
    const userId = req.query.userId || 'user123';
    const alarms = await Alarm.find({ userId }).sort({ createdAt: -1 });
    res.json(alarms);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET single alarm by ID
router.get('/:id', async (req, res) => {
  try {
    const alarm = await Alarm.findById(req.params.id);
    if (!alarm) {
      return res.status(404).json({ error: 'Alarm not found' });
    }
    res.json(alarm);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// CREATE new alarm
router.post('/', async (req, res) => {
  try {
    const alarm = new Alarm(req.body);
    await alarm.save();
    res.status(201).json(alarm);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// UPDATE alarm
router.put('/:id', async (req, res) => {
  try {
    const alarm = await Alarm.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!alarm) {
      return res.status(404).json({ error: 'Alarm not found' });
    }
    res.json(alarm);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// DELETE alarm
router.delete('/:id', async (req, res) => {
  try {
    const alarm = await Alarm.findByIdAndDelete(req.params.id);
    if (!alarm) {
      return res.status(404).json({ error: 'Alarm not found' });
    }
    res.json({ message: 'Alarm deleted successfully', alarm });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// TOGGLE alarm (enable/disable)
router.patch('/:id/toggle', async (req, res) => {
  try {
    const alarm = await Alarm.findById(req.params.id);
    if (!alarm) {
      return res.status(404).json({ error: 'Alarm not found' });
    }
    alarm.enabled = !alarm.enabled;
    await alarm.save();
    res.json(alarm);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
