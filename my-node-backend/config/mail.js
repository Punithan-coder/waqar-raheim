import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

// Verify required environment variables
const requiredEnvVars = ['EMAIL_HOST', 'EMAIL_PORT', 'EMAIL_USER', 'EMAIL_PASS'];
const missingVars = requiredEnvVars.filter(envVar => !process.env[envVar]);

if (missingVars.length > 0) {
  console.error(`[Nodemailer Setup Error] Missing required environment variables: ${missingVars.join(', ')}`);
}

// Create reusable transporter object using the default SMTP transport
const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST || 'smtp.gmail.com',
  port: process.env.EMAIL_PORT || 587,
  secure: process.env.EMAIL_PORT == 465, // true for 465, false for other ports
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// Verify SMTP connection configuration
transporter.verify(function (error, success) {
  if (error) {
    console.error('[SMTP Connection Error] Invalid credentials or connection issue:', error.message);
  } else {
    console.log('[SMTP Connection Success] Server is ready to take our messages');
  }
});

export default transporter;
