import apiCall from '../../../utils/apiCall';
export async function registerClinic(data) { return apiCall('POST', '/auth/register', data); }
export async function verifyRegistrationOtp(email, otp) { return apiCall('POST', '/auth/verify-otp', { email, otp }); }
