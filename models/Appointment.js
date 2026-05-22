const mongoose = require('mongoose');

const appointmentSchema = new mongoose.Schema({
  patientName:  { type: String, required: [true, 'Patient name is required'], trim: true },
  phone:        { type: String, required: [true, 'Phone is required'] },
  email:        { type: String, required: [true, 'Email is required'], lowercase: true },
  service: {
    type: String,
    required: [true, 'Service is required'],
    enum: [
      'Orthopedic Physiotherapy',
      'Sports Injury Rehabilitation',
      'Neurological Physiotherapy',
      'Pediatric Physiotherapy',
      'Geriatric Physiotherapy',
      'Post-Surgical Rehabilitation',
      'Chronic Pain Management'
    ]
  },
  date:   { type: Date, required: [true, 'Date is required'] },
  time:   { type: String, required: [true, 'Time is required'] },
  notes:  { type: String, maxlength: 500 },
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'rejected', 'completed', 'cancelled'],
    default: 'pending'
  },
  adminNotes:       { type: String },
  confirmationSent: { type: Boolean, default: false },
  createdAt:        { type: Date, default: Date.now }
});

appointmentSchema.index({ date: 1, time: 1 });

module.exports = mongoose.model('Appointment', appointmentSchema);
