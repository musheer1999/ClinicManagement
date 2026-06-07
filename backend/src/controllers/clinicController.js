const clinicService = require('../services/clinicService');

async function getMe(req, res) {
  try {
    const clinic = await clinicService.getClinic(req.user.id);
    res.json({ data: clinic });
  } catch (err) {
    res.status(err.status || 500).json({ error: err.message });
  }
}

async function updateMe(req, res) {
  try {
    const clinic = await clinicService.updateClinic(req.user.id, req.body);
    res.json({ message: 'Clinic updated successfully.', data: clinic });
  } catch (err) {
    res.status(err.status || 500).json({ error: err.message });
  }
}

module.exports = { getMe, updateMe };
