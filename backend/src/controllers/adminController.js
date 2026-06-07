const adminService = require('../services/adminService');

async function getAllClinics(req, res) {
  try {
    const clinics = await adminService.getAllClinics();
    res.json({ data: clinics });
  } catch (err) {
    res.status(err.status || 500).json({ error: err.message });
  }
}

async function getClinic(req, res) {
  try {
    const clinic = await adminService.getClinicDetail(req.params.id);
    res.json({ data: clinic });
  } catch (err) {
    res.status(err.status || 500).json({ error: err.message });
  }
}

async function updateSubscription(req, res) {
  try {
    const clinic = await adminService.updateClinicSubscription(req.params.id, req.body);
    res.json({ message: 'Subscription updated.', data: clinic });
  } catch (err) {
    res.status(err.status || 500).json({ error: err.message });
  }
}

async function getConfig(req, res) {
  try {
    const config = await adminService.getConfig();
    res.json({ data: config });
  } catch (err) {
    res.status(err.status || 500).json({ error: err.message });
  }
}

async function updateConfig(req, res) {
  try {
    const config = await adminService.updateConfig(req.body);
    res.json({ message: 'Config updated.', data: config });
  } catch (err) {
    res.status(err.status || 500).json({ error: err.message });
  }
}

async function updateCustomPrice(req, res) {
  try {
    const { custom_price } = req.body;
    const clinic = await adminService.updateClinicCustomPrice(req.params.id, custom_price);
    res.json({ message: 'Custom price updated successfully.', data: clinic });
  } catch (err) {
    res.status(err.status || 500).json({ error: err.message });
  }
}

module.exports = { getAllClinics, getClinic, updateSubscription, getConfig, updateConfig, updateCustomPrice };
