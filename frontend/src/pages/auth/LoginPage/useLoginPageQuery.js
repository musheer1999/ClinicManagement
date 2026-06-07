import apiCall from '../../../utils/apiCall';

async function requestOtp(email) {
  return apiCall('POST', '/auth/request-otp', { email });
}

async function verifyOtp(email, otp) {
  return apiCall('POST', '/auth/verify-otp', { email, otp });
}

export { requestOtp, verifyOtp };
