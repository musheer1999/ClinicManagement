const nodemailer = require('nodemailer');

// Email delivery works in one of two ways:
// 1. Brevo HTTPS API (used when BREVO_API_KEY is set) — required on hosts like
//    Railway that block outbound SMTP ports on non-Pro plans.
// 2. Gmail SMTP via nodemailer — fallback for local development.
const BREVO_API_URL = 'https://api.brevo.com/v3/smtp/email';

const gmailTransporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

function buildOtpHtml(otp, clinicName = '') {
  const greeting = clinicName ? `Hello from ClinicDesk, ${clinicName}!` : 'Hello from ClinicDesk!';
  return `
    <div style="font-family: Inter, sans-serif; max-width: 480px; margin: 0 auto; padding: 32px; background: #f8fafc; border-radius: 12px;">
      <div style="text-align: center; margin-bottom: 24px;">
        <div style="display: inline-flex; align-items: center; justify-content: center; width: 56px; height: 56px; background: #2563eb; border-radius: 16px; margin-bottom: 12px;">
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2.6" stroke-linecap="round">
            <path d="M12 5v14M5 12h14"/>
          </svg>
        </div>
        <h1 style="color: #0f172a; font-size: 22px; margin: 0;">ClinicDesk</h1>
      </div>
      <div style="background: white; border-radius: 10px; padding: 28px; border: 1px solid #e2e8f0;">
        <p style="color: #334155; margin: 0 0 8px;">${greeting}</p>
        <p style="color: #64748b; margin: 0 0 24px; font-size: 14px;">Use the code below to sign in to your clinic account. It expires in <strong>10 minutes</strong>.</p>
        <div style="text-align: center; background: #eff6ff; border-radius: 10px; padding: 24px; letter-spacing: 10px; font-size: 36px; font-weight: 700; color: #2563eb; margin-bottom: 24px;">
          ${otp}
        </div>
        <p style="color: #94a3b8; font-size: 12px; margin: 0; text-align: center;">If you didn't request this code, you can safely ignore this email.</p>
      </div>
    </div>
  `;
}

async function sendViaBrevo(to, subject, html) {
  const response = await fetch(BREVO_API_URL, {
    method: 'POST',
    headers: {
      'api-key': process.env.BREVO_API_KEY,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      sender: { name: 'ClinicDesk', email: process.env.EMAIL_USER },
      to: [{ email: to }],
      subject,
      htmlContent: html,
    }),
  });

  if (!response.ok) {
    const body = await response.text().catch(() => '');
    throw new Error(`Brevo API error ${response.status}: ${body}`);
  }
}

async function sendViaGmail(to, subject, html) {
  await gmailTransporter.sendMail({
    from: `"ClinicDesk" <${process.env.EMAIL_USER}>`,
    to,
    subject,
    html,
  });
}

async function sendOtpEmail(email, otp, clinicName = '') {
  const subject = 'Your ClinicDesk Login OTP';
  const html = buildOtpHtml(otp, clinicName);

  if (process.env.BREVO_API_KEY) {
    return sendViaBrevo(email, subject, html);
  }
  return sendViaGmail(email, subject, html);
}

module.exports = { sendOtpEmail };
