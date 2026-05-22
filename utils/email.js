const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  host: 'smtp-relay.brevo.com',
  port: 587,
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  },
  tls: { rejectUnauthorized: false }
});

// Appointment confirmation to patient
exports.sendAppointmentConfirmation = async (appointment) => {
  await transporter.sendMail({
    from: process.env.EMAIL_FROM,
    to: appointment.email,
    subject: '✅ Appointment Confirmed - Physicwell Rehab Center',
    html: `
      <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;padding:20px;border:1px solid #e0e0e0;border-radius:10px;">
        <div style="background:#0a5c6b;padding:20px;border-radius:8px 8px 0 0;text-align:center;">
          <h1 style="color:white;margin:0;">Physicwell Rehab Center</h1>
          <p style="color:rgba(255,255,255,0.8);margin:5px 0 0;">Appointment Confirmed ✅</p>
        </div>
        <div style="padding:30px;">
          <p>Dear <strong>${appointment.patientName}</strong>,</p>
          <p>Your appointment has been successfully booked.</p>
          <table style="width:100%;border-collapse:collapse;margin:20px 0;">
            <tr style="background:#f0f8fa;"><td style="padding:12px;font-weight:bold;color:#0a5c6b;border:1px solid #e0e0e0;">Service</td><td style="padding:12px;border:1px solid #e0e0e0;">${appointment.service}</td></tr>
            <tr><td style="padding:12px;font-weight:bold;color:#0a5c6b;border:1px solid #e0e0e0;">Date</td><td style="padding:12px;border:1px solid #e0e0e0;">${new Date(appointment.date).toDateString()}</td></tr>
            <tr style="background:#f0f8fa;"><td style="padding:12px;font-weight:bold;color:#0a5c6b;border:1px solid #e0e0e0;">Time</td><td style="padding:12px;border:1px solid #e0e0e0;">${appointment.time}</td></tr>
          </table>
          <p>📍 <strong>Address:</strong> Gumaniwala, Rishikesh, Uttarakhand - 249204</p>
          <p>📞 <strong>Phone:</strong> +91 96395 48897</p>
        </div>
        <div style="background:#f5f5f5;padding:15px;text-align:center;border-radius:0 0 8px 8px;font-size:12px;color:#888;">
          © 2026 Physicwell Rehab Center
        </div>
      </div>
    `
  });
};

// New appointment alert to admin
exports.sendAdminAppointmentAlert = async (appointment) => {
  await transporter.sendMail({
    from: process.env.EMAIL_FROM,
    to: process.env.ADMIN_EMAIL,
    subject: `🆕 New Appointment: ${appointment.patientName} - ${appointment.service}`,
    html: `
      <div style="font-family:Arial,sans-serif;padding:20px;">
        <h2 style="color:#0a5c6b;">New Appointment Received</h2>
        <p><strong>Patient:</strong> ${appointment.patientName}</p>
        <p><strong>Phone:</strong> ${appointment.phone}</p>
        <p><strong>Email:</strong> ${appointment.email}</p>
        <p><strong>Service:</strong> ${appointment.service}</p>
        <p><strong>Date:</strong> ${new Date(appointment.date).toDateString()}</p>
        <p><strong>Time:</strong> ${appointment.time}</p>
        <p><strong>Notes:</strong> ${appointment.notes || 'None'}</p>
      </div>
    `
  });
};

// Contact notification to admin
exports.sendContactNotification = async (contact) => {
  await transporter.sendMail({
    from: process.env.EMAIL_FROM,
    to: process.env.ADMIN_EMAIL,
    subject: `📩 New Contact Message from ${contact.name}`,
    html: `
      <div style="font-family:Arial,sans-serif;padding:20px;">
        <h2 style="color:#0a5c6b;">New Contact Form Submission</h2>
        <p><strong>From:</strong> ${contact.name}</p>
        <p><strong>Subject:</strong> ${contact.subject || 'General Inquiry'}</p>
        <p><strong>Message:</strong></p>
        <p style="background:#f5f5f5;padding:15px;border-radius:6px;">${contact.message}</p>
      </div>
    `
  });
};
