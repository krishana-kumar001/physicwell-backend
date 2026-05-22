const express = require('express');
const router = express.Router();
const Appointment = require('../models/Appointment');
const { sendAppointmentConfirmation, sendAdminAppointmentAlert } = require('../utils/email');

// POST /api/appointments — Book appointment
router.post('/', async (req, res) => {
  try {
    const { patientName, phone, email, service, date, time, notes } = req.body;

    if (!patientName || !phone || !email || !service || !date || !time) {
      return res.status(400).json({ success: false, message: 'Please fill all required fields' });
    }

    // Check double booking
    const existing = await Appointment.findOne({
      date: new Date(date), time,
      status: { $in: ['pending', 'confirmed'] }
    });
    if (existing) {
      return res.status(409).json({ success: false, message: 'This time slot is already booked. Please choose a different time.' });
    }

    const appointment = await Appointment.create({ patientName, phone, email, service, date: new Date(date), time, notes });

    try {
      await sendAppointmentConfirmation(appointment);
      await sendAdminAppointmentAlert(appointment);
      appointment.confirmationSent = true;
      await appointment.save();
    } catch (emailErr) {
      console.error('Email error:', emailErr.message);
    }

    res.status(201).json({ success: true, message: 'Appointment booked successfully!', appointment });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// GET /api/appointments/slots?date=YYYY-MM-DD — Available slots
router.get('/slots', async (req, res) => {
  try {
    const { date } = req.query;
    if (!date) return res.status(400).json({ success: false, message: 'Date is required' });

    const allSlots = ['9:00 AM','10:00 AM','11:00 AM','12:00 PM','2:00 PM','3:00 PM','4:00 PM','5:00 PM'];
    const booked = await Appointment.find({ date: new Date(date), status: { $in: ['pending', 'confirmed'] } }).select('time');
    const bookedTimes = booked.map(a => a.time);
    const available = allSlots.filter(s => !bookedTimes.includes(s));

    res.json({ success: true, available, booked: bookedTimes });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// GET /api/appointments/admin/all — Admin: all appointments
router.get('/admin/all', async (req, res) => {
  try {
    const { status, page = 1, limit = 20 } = req.query;
    const query = status ? { status } : {};
    const total = await Appointment.countDocuments(query);
    const appointments = await Appointment.find(query).sort({ createdAt: -1 }).limit(limit * 1).skip((page - 1) * limit);
    res.json({ success: true, total, appointments });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// PATCH /api/appointments/:id/status — Update status
router.patch('/:id/status', async (req, res) => {
  try {
    const { status, adminNotes } = req.body;
    const appointment = await Appointment.findByIdAndUpdate(req.params.id, { status, adminNotes }, { new: true });
    if (!appointment) return res.status(404).json({ success: false, message: 'Appointment not found' });
    res.json({ success: true, message: `Appointment ${status}`, appointment });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
