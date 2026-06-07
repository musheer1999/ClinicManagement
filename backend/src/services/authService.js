const otpRepo = require('../repositories/otpRepository');
const clinicRepo = require('../repositories/clinicRepository');
const adminRepo = require('../repositories/adminRepository');
const { sendOtpEmail } = require('../utils/email');
const { generateToken } = require('../utils/jwt');

function fail(message, status = 400) {
  const err = new Error(message);
  err.status = status;
  throw err;
}

function generateOtp() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

async function requestOtp(email) {
  if (!email || !/^\S+@\S+\.\S+$/.test(email)) fail('Please enter a valid email address.');

  // Check if email belongs to a clinic or admin
  const clinic = await clinicRepo.findByEmail(email);
  const admin = await adminRepo.findAdminByEmail(email);

  if (!clinic && !admin) {
    fail('No account found with this email. Please register first.', 404);
  }

  await otpRepo.cleanExpiredOtps();
  const otp = generateOtp();
  await otpRepo.saveOtp(email, otp);
  await sendOtpEmail(email, otp, clinic?.name);

  return { message: 'OTP sent to your email.' };
}

async function verifyOtp(email, otp) {
  if (!email || !otp) fail('Email and OTP are required.');

  const record = await otpRepo.findValidOtp(email, otp);
  if (!record) fail('Invalid or expired OTP. Please try again.', 401);

  await otpRepo.markOtpUsed(record.id);

  // Determine role
  const admin = await adminRepo.findAdminByEmail(email);
  if (admin) {
    const token = generateToken(admin.id, 'admin');
    return { token, user: { id: admin.id, email: admin.email, role: 'admin' } };
  }

  const clinic = await clinicRepo.findByEmail(email);
  const token = generateToken(clinic.id, 'clinic');
  return {
    token,
    user: {
      id: clinic.id,
      email: clinic.email,
      role: 'clinic',
      name: clinic.name,
      owner_name: clinic.owner_name,
    },
  };
}

async function registerClinic({ name, owner_name, email, phone, address, logo_url }) {
  if (!name || !owner_name || !email) fail('Clinic name, owner name, and email are required.');
  if (!/^\S+@\S+\.\S+$/.test(email)) fail('Please enter a valid email address.');

  const existing = await clinicRepo.findByEmail(email);
  if (existing) fail('An account with this email already exists. Please login.', 400);

  const clinic = await clinicRepo.create({ name, owner_name, email, phone, address, logo_url });

  // Send OTP for verification
  const otp = generateOtp();
  await otpRepo.saveOtp(email, otp);
  await sendOtpEmail(email, otp, name);

  return { message: 'Clinic registered! OTP sent to verify your email.', clinic };
}

module.exports = { requestOtp, verifyOtp, registerClinic };
