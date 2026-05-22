const express = require('express');
const router = express.Router();
const Contact = require('../models/Contact');
const { sendContactNotification } = require('../utils/email');

// POST /api/contact
router.post('/', async (req, res) => {
  try {
    const { name, message, subject } = req.body;
    if (!name || !message) return res.status(400).json({ success: false, message: 'Name and message are required' });

    const contact = await Contact.create(req.body);
    try { await sendContactNotification(contact); } catch (e) { console.error('Email error:', e.message); }

    res.status(201).json({ success: true, message: 'Message received!' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// GET /api/contact/admin/all
router.get('/admin/all', async (req, res) => {
  try {
    const messages = await Contact.find().sort({ createdAt: -1 });
    res.json({ success: true, count: messages.length, messages });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// PATCH /api/contact/:id/read
router.patch('/:id/read', async (req, res) => {
  try {
    await Contact.findByIdAndUpdate(req.params.id, { isRead: true });
    res.json({ success: true, message: 'Marked as read' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
