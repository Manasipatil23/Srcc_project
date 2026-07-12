import dotenv from 'dotenv';
dotenv.config();
import sendEmail from './utils/sendEmail.js';

async function test() {
  try {
    console.log("Testing email with:", process.env.SMTP_EMAIL, process.env.SMTP_PASSWORD);
    await sendEmail({
      email: process.env.SMTP_EMAIL,
      subject: 'Test Email',
      message: 'This is a test'
    });
    console.log("Email sent successfully");
  } catch (err) {
    console.error("Failed:", err);
  }
}
test();
