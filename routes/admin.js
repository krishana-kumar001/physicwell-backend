const express = require('express');
const router = express.Router();
const Appointment = require('../models/Appointment');
const Contact = require('../models/Contact');

// GET /api/admin/stats
router.get('/stats', async (req, res) => {
  try {
    const [totalAppointments, pendingAppointments, confirmedAppointments, completedAppointments, totalContacts, unreadContacts] = await Promise.all([
      Appointment.countDocuments(),
      Appointment.countDocuments({ status: 'pending' }),
      Appointment.countDocuments({ status: 'confirmed' }),
      Appointment.countDocuments({ status: 'completed' }),
      Contact.countDocuments(),
      Contact.countDocuments({ isRead: false })
    ]);

    const serviceStats = await Appointment.aggregate([
      { $group: { _id: '$service', count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]);

    res.json({
      success: true,
      stats: {
        appointments: { total: totalAppointments, pending: pendingAppointments, confirmed: confirmedAppointments, completed: completedAppointments },
        contacts: { total: totalContacts, unread: unreadContacts },
        serviceStats
      }
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// GET /api/admin/appointments
router.get('/appointments', async (req, res) => {
  try {
    const appointments = await Appointment.find().sort({ createdAt: -1 });
    res.json({ success: true, appointments });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// GET /api/admin/contacts
router.get('/contacts', async (req, res) => {
  try {
    const contacts = await Contact.find().sort({ createdAt: -1 });
    res.json({ success: true, contacts });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
