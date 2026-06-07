import { useState, useEffect, useCallback } from 'react';
import { fetchConfig, saveConfig } from './useGlobalConfigQuery';

function useGlobalConfig() {
  const [form, setForm] = useState({ subscription_price: 999, is_free_for_all: false });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchConfig().then(d => setForm({ subscription_price: d.data.subscription_price, is_free_for_all: d.data.is_free_for_all }))
      .catch(e => setError(e.message)).finally(() => setLoading(false));
  }, []);

  const update = useCallback((field, value) => setForm(f => ({ ...f, [field]: value })), []);

  const submit = useCallback(async (e) => {
    e?.preventDefault();
    setSaving(true); setSaved(false); setError('');
    try {
      await saveConfig(form);
      setSaved(true); setTimeout(() => setSaved(false), 3000);
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  }, [form]);

  return { form, update, loading, saving, saved, error, submit };
}

export default useGlobalConfig;
