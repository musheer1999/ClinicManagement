import { useState, useCallback } from 'react';
import { useAuth } from '../../../context/AuthContext';
import { registerClinic, verifyRegistrationOtp } from './useRegisterPageQuery';

function useRegisterPage() {
  const { signIn } = useAuth();
  const [step, setStep] = useState('form'); // form | otp
  const [form, setForm] = useState({ name: '', owner_name: '', email: '', phone: '', address: '' });
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const update = useCallback((field, value) => setForm(f => ({ ...f, [field]: value })), []);

  const submit = useCallback(async (e) => {
    e?.preventDefault();
    if (!form.name || !form.owner_name || !form.email) { setError('Please fill all required fields.'); return; }
    setError(''); setLoading(true);
    try {
      await registerClinic(form);
      setStep('otp');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [form]);

  const verify = useCallback(async (e) => {
    e?.preventDefault();
    if (otp.length < 6) { setError('Enter the 6-digit code.'); return; }
    setError(''); setLoading(true);
    try {
      await signIn(form.email, otp);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [form.email, otp, signIn]);

  return { step, form, update, otp, setOtp, loading, error, submit, verify };
}

export default useRegisterPage;
