const clinicRepo = require('../repositories/clinicRepository');

function fail(message, status = 400) {
  const err = new Error(message);
  err.status = status;
  throw err;
}

async function getClinic(id) {
  const clinic = await clinicRepo.findById(id);
  if (!clinic) fail('Clinic not found.', 404);
  return clinic;
}

async function updateClinic(id, data) {
  const { name, owner_name, phone, address, logo_url } = data;
  if (!name || !owner_name) fail('Clinic name and owner name are required.');
  const clinic = await clinicRepo.update(id, { name, owner_name, phone, address, logo_url });
  return clinic;
}

module.exports = { getClinic, updateClinic };
