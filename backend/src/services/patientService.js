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

  const unique_patient_id = await patientRepo.generateUniquePatientId(clinicId);
  return patientRepo.create({ clinic_id: clinicId, unique_patient_id, name, age, gender, phone, blood_group, address });
}

async function updatePatient(id, clinicId, data) {
  const { name, phone } = data;
  if (!name || !phone) fail('Patient name and phone are required.');
  const patient = await patientRepo.update(id, clinicId, data);
  if (!patient) fail('Patient not found.', 404);
  return patient;
}

module.exports = { getPatients, getPatientWithVisits, createPatient, updatePatient };
