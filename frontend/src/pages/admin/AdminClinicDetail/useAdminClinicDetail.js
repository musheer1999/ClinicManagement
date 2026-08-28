import { useState, useEffect, useCallback } from 'react';
import { fetchClinic, updateSubscription, updateCustomPrice } from './useAdminClinicDetailQuery';

function toDateStr(d) {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

function todayStr() {
  return toDateStr(new Date());
}

function defaultExpiryStr(daysAhead = 30) {
  const d = new Date();
  d.setDate(d.getDate() + daysAhead);
  return toDateStr(d);
}

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

  const update = useCallback((field, value) => {
    setForm(f => {
      const next = { ...f, [field]: value };
      // Switching to Active with no expiry (or one that's already stale) silently
      // leaves the clinic blocked by the subscription middleware — auto-fill a
      // sane default so "Active" actually means active.
      if (field === 'subscription_status' && value === 'active' && (!f.subscription_expiry || f.subscription_expiry < todayStr())) {
        next.subscription_expiry = defaultExpiryStr();
      }
      return next;
    });
  }, []);

  const save = useCallback(async (e) => {
    e?.preventDefault();
    setSaved(false); setError('');
    if (form.subscription_status === 'active' && (!form.subscription_expiry || form.subscription_expiry < todayStr())) {
      setError('Active subscriptions need an expiry date today or later.');
      return;
    }
    setSaving(true);
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
