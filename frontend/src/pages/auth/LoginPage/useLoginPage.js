import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../../../context/AuthContext';
import { requestOtp, verifyOtp } from './useLoginPageQuery';

function useLoginPage() {
  const { signIn } = useAuth();
  const [step, setStep] = useState('email'); // email | otp
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [resendIn, setResendIn] = useState(0);

  useEffect(() => {
    if (resendIn <= 0) return;
    const t = setTimeout(() => setResendIn(r => r - 1), 1000);
    return () => clearTimeout(t);
  }, [resendIn]);

  const sendOtp = useCallback(async (e) => {
    e?.preventDefault();
    if (!/^\S+@\S+\.\S+$/.test(email)) { setError('Please enter a valid email address.'); return; }
    setError(''); setLoading(true);
    try {
      await requestOtp(email);
      setStep('otp'); setResendIn(30); setOtp('');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [email]);

  const verify = useCallback(async (e) => {
    e?.preventDefault();
    if (otp.length < 6) { setError('Enter the 6-digit code sent to your email.'); return; }
    setError(''); setLoading(true);
    try {
      await signIn(email, otp);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [email, otp, signIn]);

  const resend = useCallback(async () => {
    if (resendIn > 0) return;
    setError(''); setLoading(true);
    try {
      await requestOtp(email);
      setResendIn(30); setOtp('');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [email, resendIn]);

  return { step, email, setEmail, otp, setOtp, loading, error, resendIn, sendOtp, verify, resend, goBack: () => { setStep('email'); setOtp(''); setError(''); } };
}

export default useLoginPage;
