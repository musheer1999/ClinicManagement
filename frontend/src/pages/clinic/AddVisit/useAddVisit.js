import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { createVisit, fetchPatientBasic } from './useAddVisitQuery';

const today = new Date().toISOString().split('T')[0];
const emptyMed = () => ({ name: '', dosage: '', frequency: '', duration: '' });

function useAddVisit(patientId) {
  const navigate = useNavigate();
  const [patient, setPatient] = useState(null);
  const [form, setForm] = useState({ visit_date: today, diagnosis: '', prescription: '', medicines: [emptyMed()], next_visit_date: '', notes: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (patientId) fetchPatientBasic(patientId).then(d => setPatient(d.data)).catch(() => {});
  }, [patientId]);

  const update = useCallback((field, value) => setForm(f => ({ ...f, [field]: value })), []);

  const updateMed = useCallback((i, field, value) => {
    setForm(f => {
      const meds = [...f.medicines];
      meds[i] = { ...meds[i], [field]: value };
      return { ...f, medicines: meds };
    });
  }, []);

  const addMed = useCallback(() => setForm(f => ({ ...f, medicines: [...f.medicines, emptyMed()] })), []);

  const removeMed = useCallback((i) => setForm(f => ({ ...f, medicines: f.medicines.filter((_, idx) => idx !== i) })), []);

  const submit = useCallback(async (e) => {
    e?.preventDefault();
    if (!form.visit_date) { setError('Visit date is required.'); return; }
    setError(''); setLoading(true);
    try {
      const medicines = form.medicines.filter(m => m.name.trim());
      const res = await createVisit({ patient_id: patientId, ...form, medicines, next_visit_date: form.next_visit_date || null });
      navigate(`/visits/${res.data.id}`);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [form, patientId, navigate]);

  return { patient, form, update, updateMed, addMed, removeMed, loading, error, submit };
}

export default useAddVisit;
