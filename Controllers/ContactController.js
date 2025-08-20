const contactSchema = require('../models/contactSchema');
const sendMail = require('../Utils/mail');
const sanitizeInput = require('../Utils/sanitizeInput');
const { contactMailTemplate } = require('../Utils/template');
const { isValidEmail } = require('../Utils/Validators');

// -------------------- SEND MESSAGE --------------------
const sendMessage = async (req, res) => {
  try {
    let { name, phone, email, address, message } = req.body;
    const errors = [];

    // Sanitize inputs
    name = sanitizeInput(name);
    phone = sanitizeInput(phone);
    email = sanitizeInput(email);
    address = sanitizeInput(address);
    message = sanitizeInput(message);

    // -------------------- VALIDATION --------------------
    if (!name || !/^[a-zA-Z\s]+$/.test(name)) {
      errors.push('Name must only contain letters and spaces.');
    } else if (name.length < 2 || name.length > 50) {
      errors.push('Name must be between 2 and 50 characters.');
    }

    const cleaned = phone.replace(/\D/g, '');
    if (cleaned.length < 10 || cleaned.length > 15) {
      errors.push('Invalid phone number format.');
    }

    if (!email) {
      errors.push('Email is required.');
    } else if (!isValidEmail(email)) {
      errors.push('Invalid email format.');
    }

    if (address && address.length > 200) {
      errors.push('Address must be under 200 characters.');
    }

    if (!message || message.length < 10) {
      errors.push('Message must be at least 10 characters long.');
    }

    // If any validation errors, stop processing
    if (errors.length > 0) {
      return res.status(400).json({ success: false, errors });
    }

    // -------------------- SAVE TO DB --------------------
    const savedMessage = await contactSchema.create({
      name,
      phone,
      email,
      address,
      message,
    });

    // -------------------- SEND EMAILS --------------------
    // Production: send emails asynchronously, catch errors
    try {
      // Email to admin
      await sendMail(
        process.env.RECEIVER_EMAIL,
        '📩 New Client Message',
        contactMailTemplate,
        { name, email, phone, address, message }
      );
    } catch (err) {
      console.error('Error sending admin email:', err);
    }

    try {
      // Confirmation email to user
      await sendMail(
        email,
        'We Received Your Message',
        () =>
          `<p>Hi ${name},</p><p>Thank you for contacting us. We will get back to you shortly.</p>`
      );
    } catch (err) {
      console.error('Error sending user confirmation email:', err);
    }

    // -------------------- RESPONSE --------------------
    return res.status(200).json({
      success: true,
      message: 'Your message has been sent and stored successfully.',
      data: savedMessage,
    });
  } catch (err) {
    console.error('Contact form error:', err);
    return res.status(500).json({ success: false, error: 'Server error' });
  }
};

module.exports = sendMessage;
