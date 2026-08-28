const clinicRepo = require('../repositories/clinicRepository');
const adminRepo = require('../repositories/adminRepository');

function fail(message, status = 400) {
  const err = new Error(message);
  err.status = status;
  throw err;
}

async function getClinic(id) {
  const clinic = await clinicRepo.findById(id);
  if (!clinic) fail('Clinic not found.', 404);

  // Attach billing context so the frontend never needs admin endpoints:
  // is_free_for_all = platform-wide free (beta) mode, effective_price = what
  // this clinic would pay (custom price if set, else global price).
  const config = await adminRepo.getConfig();
  return {
    ...clinic,
    is_free_for_all: config?.is_free_for_all ?? false,
    effective_price: clinic.custom_price ?? config?.subscription_price ?? null,
  };
}

async function updateClinic(id, data) {
  const { name, owner_name, phone, address, logo_url } = data;
  if (!name || !owner_name) fail('Clinic name and owner name are required.');
  const clinic = await clinicRepo.update(id, { name, owner_name, phone, address, logo_url });
  return clinic;
}

module.exports = { getClinic, updateClinic };
