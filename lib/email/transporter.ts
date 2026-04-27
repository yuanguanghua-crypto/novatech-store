import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_SERVER_HOST,
  port: Number(process.env.EMAIL_SERVER_PORT) || 587,
  secure: false,
  auth: {
    user: process.env.EMAIL_SERVER_USER,
    pass: process.env.EMAIL_SERVER_PASSWORD,
  },
});

export async function sendEmail({
  to,
  subject,
  html,
}: {
  to: string;
  subject: string;
  html: string;
}) {
  if (!process.env.EMAIL_SERVER_HOST) {
    console.warn('Email server not configured, skipping email send');
    console.log(`[Email] To: ${to}, Subject: ${subject}`);
    return;
  }

  await transporter.sendMail({
    from: process.env.EMAIL_FROM || 'noreply@novatech-store.com',
    to,
    subject,
    html,
  });
}
