import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
dotenv.config();

async function sendTest() {
  console.log('USER:', process.env.EMAIL_USER);
  console.log('PASS:', process.env.EMAIL_PASS ? 'EXISTS' : 'MISSING');

  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  await transporter.sendMail({
    from: process.env.EMAIL_USER,
    to: 'yourtestmail@gmail.com',
    subject: 'Test Email',
    text: '✅ Gmail test success!',
  });

  console.log('✅ Sent!');
}

sendTest().catch(console.error);
