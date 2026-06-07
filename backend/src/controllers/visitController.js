const visitService = require('../services/visitService');

async function getDashboard(req, res) {
  try {
    const stats = await visitService.getDashboardStats(req.user.id);
    res.json({ data: stats });
  } catch (err) {
    res.status(err.status || 500).json({ error: err.message });
  }
}

async function getTodayVisits(req, res) {
  try {
    const visits = await visitService.getTodayVisits(req.user.id);
    res.json({ data: visits });
  } catch (err) {
    res.status(err.status || 500).json({ error: err.message });
  }
}

async function getVisit(req, res) {
  try {
    const visit = await visitService.getVisit(req.params.id);
    res.json({ data: visit });
  } catch (err) {
    res.status(err.status || 500).json({ error: err.message });
  }
}

async function createVisit(req, res) {
  try {
    const visit = await visitService.createVisit(req.user.id, req.body);
    res.status(201).json({ message: 'Visit recorded successfully.', data: visit });
  } catch (err) {
    res.status(err.status || 500).json({ error: err.message });
  }
}

async function downloadPdf(req, res) {
  try {
    await visitService.generatePdf(req.params.id, res);
  } catch (err) {
    res.status(err.status || 500).json({ error: err.message });
  }
}

async function updateVisit(req, res) {
  try {
    const visit = await visitService.updateVisit(req.params.id, req.user.id, req.body);
    res.json({ message: 'Visit updated successfully.', data: visit });
  } catch (err) {
    res.status(err.status || 500).json({ error: err.message });
  }
}

module.exports = { getDashboard, getTodayVisits, getVisit, createVisit, downloadPdf, updateVisit };
