const visitRepo = require('../repositories/visitRepository');
const patientRepo = require('../repositories/patientRepository');
const PDFDocument = require('pdfkit');

function fail(message, status = 400) {
  const err = new Error(message);
  err.status = status;
  throw err;
}

async function getDashboardStats(clinicId) {
  return visitRepo.getDashboardStats(clinicId);
}

async function getTodayVisits(clinicId) {
  return visitRepo.findTodayVisits(clinicId);
}

async function getVisit(id) {
  const visit = await visitRepo.findById(id);
  if (!visit) fail('Visit not found.', 404);
  return visit;
}

async function createVisit(clinicId, data) {
  const { patient_id, visit_date, diagnosis, prescription, medicines, next_visit_date, notes } = data;
  if (!patient_id) fail('Patient ID is required.');
  if (!visit_date) fail('Visit date is required.');

  // Verify patient belongs to clinic
  const patient = await patientRepo.findById(patient_id, clinicId);
  if (!patient) fail('Patient not found.', 404);

  return visitRepo.create({ patient_id, clinic_id: clinicId, visit_date, diagnosis, prescription, medicines, next_visit_date, notes });
}

async function generatePdf(visitId, res) {
  const visit = await visitRepo.findById(visitId);
  if (!visit) fail('Visit not found.', 404);

  const doc = new PDFDocument({ size: 'A4', margin: 50 });
  res.setHeader('Content-Type', 'application/pdf');
  res.setHeader('Content-Disposition', `attachment; filename="ClinicDesk-Report.pdf"`);
  doc.pipe(res);

  // ── Header ──
  const primaryBlue = '#2563eb';

  // Blue header bar
  doc.rect(0, 0, doc.page.width, 100).fill(primaryBlue);

  // Clinic name
  doc.fontSize(22).fillColor('#ffffff').font('Helvetica-Bold')
    .text(visit.clinic_name, 50, 28, { align: 'left' });
  doc.fontSize(10).fillColor('rgba(255,255,255,0.85)').font('Helvetica')
    .text(`${visit.clinic_address || ''}  |  ${visit.clinic_phone || ''}`, 50, 56, { align: 'left' });

  // Visit ID top right
  doc.fontSize(10).fillColor('#bfdbfe')
    .text(`Visit ID: ${visit.id.slice(0, 8).toUpperCase()}`, 0, 36, { align: 'right', width: doc.page.width - 50 });

  doc.fillColor('#0f172a');
  let y = 120;

  // ── Patient Info Box ──
  doc.rect(50, y, doc.page.width - 100, 70).fill('#eff6ff').stroke('#dbeafe');
  doc.fontSize(10).fillColor('#64748b').font('Helvetica').text('PATIENT', 65, y + 10);
  doc.fontSize(14).fillColor('#0f172a').font('Helvetica-Bold')
    .text(visit.patient_name, 65, y + 24);
  doc.fontSize(10).fillColor('#334155').font('Helvetica')
    .text(`ID: ${visit.unique_patient_id}  |  Age: ${visit.age}  |  Gender: ${visit.gender}  |  Blood: ${visit.blood_group || 'N/A'}  |  Phone: ${visit.phone}`, 65, y + 44);

  // Visit date right side
  doc.fontSize(10).fillColor('#64748b')
    .text(`Visit Date: ${new Date(visit.visit_date).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}`, 0, y + 24, { align: 'right', width: doc.page.width - 65 });

  y += 90;

  function section(title, content) {
    if (!content) return;
    doc.moveTo(50, y).lineTo(doc.page.width - 50, y).strokeColor('#e2e8f0').stroke();
    y += 12;
    doc.fontSize(9).fillColor('#2563eb').font('Helvetica-Bold').text(title.toUpperCase(), 50, y);
    y += 16;
    doc.fontSize(11).fillColor('#334155').font('Helvetica').text(content, 50, y, { width: doc.page.width - 100 });
    y += doc.heightOfString(content, { width: doc.page.width - 100 }) + 16;
  }

  section('Diagnosis', visit.diagnosis);
  section('Prescription Notes', visit.prescription);

  // ── Medicines Table ──
  const meds = Array.isArray(visit.medicines) ? visit.medicines : JSON.parse(visit.medicines || '[]');
  if (meds.length > 0) {
    doc.moveTo(50, y).lineTo(doc.page.width - 50, y).strokeColor('#e2e8f0').stroke();
    y += 12;
    doc.fontSize(9).fillColor('#2563eb').font('Helvetica-Bold').text('MEDICINES', 50, y);
    y += 16;

    // Table header
    doc.rect(50, y, doc.page.width - 100, 22).fill('#f1f5f9');
    const cols = [50, 220, 330, 430];
    doc.fontSize(9).fillColor('#64748b').font('Helvetica-Bold');
    doc.text('Medicine', cols[0] + 6, y + 6);
    doc.text('Dosage', cols[1], y + 6);
    doc.text('Frequency', cols[2], y + 6);
    doc.text('Duration', cols[3], y + 6);
    y += 22;

    meds.forEach((med, i) => {
      if (i % 2 === 0) doc.rect(50, y, doc.page.width - 100, 20).fill('#f8fafc');
      doc.fontSize(10).fillColor('#334155').font('Helvetica');
      doc.text(med.name || '', cols[0] + 6, y + 4, { width: 165 });
      doc.text(med.dosage || '', cols[1], y + 4, { width: 105 });
      doc.text(med.frequency || '', cols[2], y + 4, { width: 95 });
      doc.text(med.duration || '', cols[3], y + 4, { width: 90 });
      y += 20;
    });
    y += 16;
  }

  // ── Next Visit ──
  if (visit.next_visit_date) {
    doc.moveTo(50, y).lineTo(doc.page.width - 50, y).strokeColor('#e2e8f0').stroke();
    y += 12;
    doc.fontSize(9).fillColor('#2563eb').font('Helvetica-Bold').text('NEXT VISIT', 50, y);
    y += 16;
    doc.rect(50, y, doc.page.width - 100, 28).fill('#fffbeb');
    doc.fontSize(11).fillColor('#d97706').font('Helvetica-Bold')
      .text(`Scheduled: ${new Date(visit.next_visit_date).toLocaleDateString('en-IN', { day: '2-digit', month: 'long', year: 'numeric' })}`, 62, y + 8);
    y += 40;
  }

  if (visit.notes) section('Additional Notes', visit.notes);

  // ── Footer ──
  doc.moveTo(50, doc.page.height - 60).lineTo(doc.page.width - 50, doc.page.height - 60).strokeColor('#e2e8f0').stroke();
  doc.fontSize(10).fillColor('#94a3b8').font('Helvetica')
    .text(`Thank you for visiting ${visit.clinic_name}`, 50, doc.page.height - 46, { align: 'center', width: doc.page.width - 100 });
  doc.fontSize(9).fillColor('#cbd5e1')
    .text(`Generated on ${new Date().toLocaleDateString('en-IN')}`, 50, doc.page.height - 32, { align: 'center', width: doc.page.width - 100 });

  doc.end();
}

async function updateVisit(visitId, clinicId, data) {
  const visit = await visitRepo.findById(visitId);
  if (!visit) fail('Visit not found.', 404);
  const medicines = Array.isArray(data.medicines) ? data.medicines : [];
  return visitRepo.update(visitId, clinicId, { ...data, medicines });
}

module.exports = { getDashboardStats, getTodayVisits, getVisit, createVisit, generatePdf, updateVisit };
