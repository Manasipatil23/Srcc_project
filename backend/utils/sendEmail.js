import nodemailer from 'nodemailer';

const sendEmail = async (options) => {
  // Create a transporter using Gmail SMTP
  const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 587,
    secure: false, // true for 465, false for other ports
    requireTLS: true,
    auth: {
      user: process.env.SMTP_EMAIL,
      pass: process.env.SMTP_PASSWORD,
    },
  });

  const message = {
    from: `${process.env.FROM_NAME || 'SRCC Hospital'} <${process.env.SMTP_EMAIL}>`,
    to: options.email,
    subject: options.subject,
    html: options.html || options.message, // Support both plain text/basic html and rich HTML
  };

  try {
    const info = await transporter.sendMail(message);
    console.log('Message sent: %s', info.messageId);
    return true;
  } catch (error) {
    console.error('Error sending email:', error);
    throw new Error('Email could not be sent. Please check SMTP configuration.');
  }
};

export default sendEmail;
