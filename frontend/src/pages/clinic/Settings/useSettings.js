import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../../../context/AuthContext';
import { fetchClinic, updateClinic, fetchGlobalConfig } from './useSettingsQuery';

function useSettings() {
  const { setUser } = useAuth();
  const [form, setForm] = useState({ name: '', owner_name: '', phone: '', address: '', logo_url: '' });
  const [clinic, setClinic] = useState(null);
  const [globalPrice, setGlobalPrice] = useState(999);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchClinic().then(d => {
      const c = d.data;
      setClinic(c);
      setForm({ name: c.name, owner_name: c.owner_name, phone: c.phone || '', address: c.address || '', logo_url: c.logo_url || '' });
      if (c.custom_price !== null && c.custom_price !== undefined) {
        setGlobalPrice(c.custom_price);
      } else {
        fetchGlobalConfig().then(cfg => {
          setGlobalPrice(cfg.data.subscription_price);
        }).catch(() => {});
      }
    }).catch(e => setError(e.message)).finally(() => setFetching(false));
  }, []);

  const update = useCallback((field, value) => setForm(f => ({ ...f, [field]: value })), []);

  const submit = useCallback(async (e) => {
    e?.preventDefault();
    setError(''); setLoading(true); setSaved(false);
    try {
      const res = await updateClinic(form);
      setClinic(res.data);
      setUser(u => ({ ...u, ...res.data }));
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [form, setUser]);

  return { form, update, clinic, globalPrice, loading, fetching, error, saved, submit };
}

export default useSettings;
