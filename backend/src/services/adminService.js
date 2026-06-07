const adminRepo = require('../repositories/adminRepository');
const clinicRepo = require('../repositories/clinicRepository');

function fail(message, status = 400) {
  const err = new Error(message);
  err.status = status;
  throw err;
}

async function getAllClinics() {
  return clinicRepo.findAll();
}

async function getClinicDetail(id) {
  const clinic = await clinicRepo.findById(id);
  if (!clinic) fail('Clinic not found.', 404);
  return clinic;
}

async function updateClinicSubscription(id, { subscription_status, subscription_expiry }) {
  if (!subscription_status) fail('Subscription status is required.');
  return clinicRepo.updateSubscription(id, { subscription_status, subscription_expiry });
}

async function getConfig() {
  return adminRepo.getConfig();
}

async function updateConfig({ subscription_price, is_free_for_all }) {
  return adminRepo.updateConfig({ subscription_price, is_free_for_all });
}

async function updateClinicCustomPrice(id, custom_price) {
  return clinicRepo.updateCustomPrice(id, custom_price);
}

module.exports = { getAllClinics, getClinicDetail, updateClinicSubscription, getConfig, updateConfig, updateClinicCustomPrice };
