const mongoose = require('mongoose');

const contactSchema = new mongoose.Schema({
  name:    { type: String, required: true, trim: true },
  email:   { type: String, lowercase: true },
  phone:   { type: String },
  subject: { type: String },
  message: { type: String, required: true, maxlength: 1000 },
  isRead:  { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Contact', contactSchema);
