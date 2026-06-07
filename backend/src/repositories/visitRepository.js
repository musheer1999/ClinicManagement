const db = require('../config/database');

async function findByPatient(patientId) {
  const result = await db.query(
    `SELECT * FROM visits WHERE patient_id = $1 ORDER BY visit_date DESC, created_at DESC`,
    [patientId]
  );
  return result.rows;
}

async function findById(id) {
  const result = await db.query(
    `SELECT v.*, 
            p.name AS patient_name, p.age, p.gender, p.phone, p.blood_group, p.unique_patient_id,
            c.name AS clinic_name, c.address AS clinic_address, c.phone AS clinic_phone, c.logo_url
     FROM visits v
     JOIN patients p ON p.id = v.patient_id
     JOIN clinics c ON c.id = v.clinic_id
     WHERE v.id = $1`,
    [id]
  );
  return result.rows[0] || null;
}

async function create({ patient_id, clinic_id, visit_date, diagnosis, prescription, medicines, next_visit_date, notes }) {
  const result = await db.query(
    `INSERT INTO visits (patient_id, clinic_id, visit_date, diagnosis, prescription, medicines, next_visit_date, notes)
     VALUES ($1,$2,$3,$4,$5,$6,$7,$8)
     RETURNING *`,
    [patient_id, clinic_id, visit_date, diagnosis, prescription, JSON.stringify(medicines || []), next_visit_date || null, notes]
  );
  return result.rows[0];
}

async function findTodayVisits(clinicId) {
  const result = await db.query(
    `SELECT v.*, p.name AS patient_name, p.unique_patient_id, p.phone
     FROM visits v
     JOIN patients p ON p.id = v.patient_id
     WHERE v.clinic_id = $1 AND v.visit_date = CURRENT_DATE
     ORDER BY v.created_at DESC`,
    [clinicId]
  );
  return result.rows;
}

async function getDashboardStats(clinicId) {
  const total = await db.query('SELECT COUNT(*)::int AS count FROM patients WHERE clinic_id = $1', [clinicId]);
  const today = await db.query('SELECT COUNT(*)::int AS count FROM visits WHERE clinic_id = $1 AND visit_date = CURRENT_DATE', [clinicId]);
  const upcoming = await db.query(
    `SELECT COUNT(*)::int AS count FROM visits
     WHERE clinic_id = $1 AND next_visit_date >= CURRENT_DATE AND next_visit_date <= CURRENT_DATE + INTERVAL '14 days'`,
    [clinicId]
  );
  const recent = await db.query(
    `SELECT v.id, v.visit_date, v.diagnosis, v.next_visit_date,
            p.name AS patient_name, p.unique_patient_id
     FROM visits v
     JOIN patients p ON p.id = v.patient_id
     WHERE v.clinic_id = $1
     ORDER BY v.visit_date DESC, v.created_at DESC
     LIMIT 6`,
    [clinicId]
  );

  return {
    totalPatients: total.rows[0].count,
    todayVisits: today.rows[0].count,
    upcomingRevisits: upcoming.rows[0].count,
    recentVisits: recent.rows,
  };
}

async function update(id, clinicId, { visit_date, diagnosis, prescription, medicines, next_visit_date, notes }) {
  const result = await db.query(
    `UPDATE visits SET visit_date=$1, diagnosis=$2, prescription=$3,
     medicines=$4, next_visit_date=$5, notes=$6
     WHERE id=$7 AND clinic_id=$8
     RETURNING *`,
    [visit_date, diagnosis, prescription, JSON.stringify(medicines || []),
     next_visit_date || null, notes, id, clinicId]
  );
  return result.rows[0];
}

module.exports = { findByPatient, findById, create, findTodayVisits, getDashboardStats, update };
