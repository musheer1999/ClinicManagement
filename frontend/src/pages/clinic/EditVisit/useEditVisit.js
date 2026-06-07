import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchVisit, updateVisit } from './useEditVisitQuery';

const emptyMed = () => ({ name: '', dosage: '', frequency: '', duration: '' });

function useEditVisit(visitId) {
  const navigate = useNavigate();
  const [form, setForm] = useState({ visit_date: '', diagnosis: '', prescription: '', medicines: [emptyMed()], next_visit_date: '', notes: '' });
  const [patientId, setPatientId] = useState(null);
  const [loadingData, setLoadingData] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!visitId) return;
    fetchVisit(visitId)
      .then(res => {
        const v = res.data;
        setPatientId(v.patient_id);
        const meds = Array.isArray(v.medicines) ? v.medicines : JSON.parse(v.medicines || '[]');
        setForm({
          visit_date: v.visit_date ? v.visit_date.split('T')[0] : '',
          diagnosis: v.diagnosis || '',
          prescription: v.prescription || '',
          medicines: meds.length > 0 ? meds : [emptyMed()],
          next_visit_date: v.next_visit_date ? v.next_visit_date.split('T')[0] : '',
          notes: v.notes || '',
        });
      })
      .catch(() => setError('Failed to load visit.'))
      .finally(() => setLoadingData(false));
  }, [visitId]);

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
      await updateVisit(visitId, { ...form, medicines, next_visit_date: form.next_visit_date || null });
      navigate(`/visits/${visitId}`);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [form, visitId, navigate]);

  return { form, patientId, loadingData, update, updateMed, addMed, removeMed, loading, error, submit };
}

export default useEditVisit;
