const patientRepo = require('../repositories/patientRepository');
const visitRepo = require('../repositories/visitRepository');

function fail(message, status = 400) {
  const err = new Error(message);
  err.status = status;
  throw err;
}

async function getPatients(clinicId, search) {
  return patientRepo.findByClinic(clinicId, search);
}

async function getPatientWithVisits(id, clinicId) {
  const patient = await patientRepo.findById(id, clinicId);
  if (!patient) fail('Patient not found.', 404);
  const visits = await visitRepo.findByPatient(id);
  return { ...patient, visits };
}

async function createPatient(clinicId, data) {
  const { name, age, gender, phone, blood_group, address } = data;
  if (!name || !phone) fail('Patient name and phone are required.');

  // Two simultaneous inserts can generate the same PT-XXXX; on a unique-key
  // conflict (Postgres error 23505) regenerate and retry.
  for (let attempt = 1; ; attempt++) {
    const unique_patient_id = await patientRepo.generateUniquePatientId(clinicId);
    try {
      return await patientRepo.create({ clinic_id: clinicId, unique_patient_id, name, age, gender, phone, blood_group, address });
    } catch (err) {
      if (err.code !== '23505' || attempt >= 3) throw err;
    }
  }
}

async function updatePatient(id, clinicId, data) {
  const { name, phone } = data;
  if (!name || !phone) fail('Patient name and phone are required.');
  const patient = await patientRepo.update(id, clinicId, data);
  if (!patient) fail('Patient not found.', 404);
  return patient;
}

module.exports = { getPatients, getPatientWithVisits, createPatient, updatePatient };
