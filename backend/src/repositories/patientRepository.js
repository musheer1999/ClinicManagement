const db = require('../config/database');

async function generateUniquePatientId(clinicId) {
  // Highest existing PT-XXXX number for this clinic + 1 (COUNT+1 would repeat
  // numbers if a patient were ever removed).
  const result = await db.query(
    `SELECT COALESCE(MAX(CAST(SUBSTRING(unique_patient_id FROM 4) AS INTEGER)), 0) + 1 AS next
     FROM patients WHERE clinic_id = $1`,
    [clinicId]
  );
  return `PT-${String(result.rows[0].next).padStart(4, '0')}`;
}

async function findByClinic(clinicId, search = '') {
  let query = `
    SELECT p.*, 
      (SELECT MAX(v.visit_date) FROM visits v WHERE v.patient_id = p.id) AS last_visit_date,
      (SELECT COUNT(*)::int FROM visits v WHERE v.patient_id = p.id) AS visit_count
    FROM patients p
    WHERE p.clinic_id = $1
  `;
  const params = [clinicId];

  if (search) {
    params.push(`%${search}%`);
    params.push(search);
    query += ` AND (p.phone ILIKE $2 OR p.unique_patient_id = $3)`;
  }

  query += ` ORDER BY p.created_at DESC`;
  const result = await db.query(query, params);
  return result.rows;
}

async function findById(id, clinicId) {
  const result = await db.query(
    `SELECT p.*,
      (SELECT COUNT(*)::int FROM visits v WHERE v.patient_id = p.id) AS visit_count
     FROM patients p
     WHERE p.id = $1 AND p.clinic_id = $2`,
    [id, clinicId]
  );
  return result.rows[0] || null;
}

async function create({ clinic_id, unique_patient_id, name, age, gender, phone, blood_group, address }) {
  const result = await db.query(
    `INSERT INTO patients (clinic_id, unique_patient_id, name, age, gender, phone, blood_group, address)
     VALUES ($1,$2,$3,$4,$5,$6,$7,$8)
     RETURNING *`,
    [clinic_id, unique_patient_id, name, age, gender, phone, blood_group, address]
  );
  return result.rows[0];
}

async function update(id, clinicId, { name, age, gender, phone, blood_group, address }) {
  const result = await db.query(
    `UPDATE patients SET name=$1, age=$2, gender=$3, phone=$4, blood_group=$5, address=$6
     WHERE id=$7 AND clinic_id=$8
     RETURNING *`,
    [name, age, gender, phone, blood_group, address, id, clinicId]
  );
  return result.rows[0];
}

async function findTodayPatients(clinicId) {
  const result = await db.query(
    `SELECT DISTINCT p.* FROM patients p
     JOIN visits v ON v.patient_id = p.id
     WHERE p.clinic_id = $1 AND v.visit_date = CURRENT_DATE
     ORDER BY p.name`,
    [clinicId]
  );
  return result.rows;
}

module.exports = { generateUniquePatientId, findByClinic, findById, create, update, findTodayPatients };
