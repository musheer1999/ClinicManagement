import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchPatient, createPatient, updatePatient } from './useAddEditPatientQuery';

function useAddEditPatient(patientId) {
  const navigate = useNavigate();
  const isEdit = Boolean(patientId);
  const [form, setForm] = useState({ name: '', age: '', gender: 'male', phone: '', blood_group: '', address: '' });
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(isEdit);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!isEdit) return;
    fetchPatient(patientId)
      .then(d => {
        const p = d.data;
        setForm({ name: p.name, age: p.age || '', gender: p.gender || 'male', phone: p.phone, blood_group: p.blood_group || '', address: p.address || '' });
      })
      .catch(e => setError(e.message))
      .finally(() => setFetching(false));
  }, [patientId, isEdit]);

  const update = useCallback((field, value) => setForm(f => ({ ...f, [field]: value })), []);

  const submit = useCallback(async (e) => {
    e?.preventDefault();
    if (!form.name || !form.phone) { setError('Patient name and phone are required.'); return; }
    setError(''); setLoading(true);
    try {
      if (isEdit) {
        await updatePatient(patientId, form);
        navigate(`/patients/${patientId}`);
      } else {
        const res = await createPatient(form);
        navigate(`/patients/${res.data.id}`);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [form, isEdit, patientId, navigate]);

  return { form, update, loading, fetching, error, submit, isEdit };
}

export default useAddEditPatient;
