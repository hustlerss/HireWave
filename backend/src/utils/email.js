import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  service: process.env.EMAIL_SERVICE || 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD
  }
});

export const sendEmail = async ({ email, subject, message, html }) => {
  const mailOptions = {
    from: process.env.EMAIL_FROM || 'noreply@hirewave.com',
    to: email,
    subject,
    text: message,
    html: html || message
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`✅ Email sent to ${email}`);
  } catch (error) {
    console.error(`❌ Email error: ${error.message}`);
    throw error;
  }
};
