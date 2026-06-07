import { useState, useEffect, useCallback } from 'react';
import { fetchClinic, updateSubscription, updateCustomPrice } from './useAdminClinicDetailQuery';

function useAdminClinicDetail(clinicId) {
  const [clinic, setClinic] = useState(null);
  const [form, setForm] = useState({ subscription_status: 'active', subscription_expiry: '' });
  const [customPrice, setCustomPrice] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchClinic(clinicId).then(d => {
      setClinic(d.data);
      setForm({ subscription_status: d.data.subscription_status, subscription_expiry: d.data.subscription_expiry?.split('T')[0] || '' });
      setCustomPrice(d.data.custom_price != null ? String(d.data.custom_price) : '');
    }).catch(e => setError(e.message)).finally(() => setLoading(false));
  }, [clinicId]);

  const update = useCallback((field, value) => setForm(f => ({ ...f, [field]: value })), []);

  const save = useCallback(async (e) => {
    e?.preventDefault();
    setSaving(true); setSaved(false); setError('');
    try {
      await updateSubscription(clinicId, form);
      setSaved(true); setTimeout(() => setSaved(false), 3000);
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  }, [clinicId, form]);

  const saveCustomPrice = useCallback(async (e) => {
    if (e && typeof e.preventDefault === 'function') e.preventDefault();
    const isReset = e === null;
    setSaving(true);
    try {
      const price = isReset ? null : (customPrice === '' ? null : parseFloat(customPrice));
      await updateCustomPrice(clinicId, price);
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  }, [clinicId, customPrice]);

  return { clinic, form, update, loading, saving, saved, error, save, customPrice, setCustomPrice, saveCustomPrice };
}

export default useAdminClinicDetail;
