const patientService = require('../services/patientService');

async function getPatients(req, res) {
  try {
    const { search } = req.query;
    const patients = await patientService.getPatients(req.user.id, search);
    res.json({ data: patients });
  } catch (err) {
    res.status(err.status || 500).json({ error: err.message });
  }
}

async function getPatient(req, res) {
  try {
    const patient = await patientService.getPatientWithVisits(req.params.id, req.user.id);
    res.json({ data: patient });
  } catch (err) {
    res.status(err.status || 500).json({ error: err.message });
  }
}

async function createPatient(req, res) {
  try {
    const patient = await patientService.createPatient(req.user.id, req.body);
    res.status(201).json({ message: 'Patient added successfully.', data: patient });
  } catch (err) {
    res.status(err.status || 500).json({ error: err.message });
  }
}

async function updatePatient(req, res) {
  try {
    const patient = await patientService.updatePatient(req.params.id, req.user.id, req.body);
    res.json({ message: 'Patient updated successfully.', data: patient });
  } catch (err) {
    res.status(err.status || 500).json({ error: err.message });
  }
}

module.exports = { getPatients, getPatient, createPatient, updatePatient };
