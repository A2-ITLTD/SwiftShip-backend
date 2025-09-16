const nodemailer = require('nodemailer');

const sendMail = async (email, subject, templateFn, templateData) => {
  try {
    const transporter = nodemailer.createTransport({
      host: 'transport.commercialtirerepairllc.com',
      port: 465,
      secure: true,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    await transporter.sendMail({
      from: `"Swiftship" <${process.env.EMAIL_USER}>`,
      to: email,
      subject,
      html:
        typeof templateFn === 'function'
          ? templateFn(templateData)
          : templateFn,
    });
  } catch (err) {
    console.error('Email send error:', err.message, err.stack);
    throw err;
  }
};

module.exports = sendMail;
