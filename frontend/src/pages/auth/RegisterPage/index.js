import React from 'react';
import { Link } from 'react-router-dom';
import { Btn, OtpInput } from '../../../components/ui/index';
import useRegisterPage from './useRegisterPage';

function RegisterPage() {
  const { step, form, update, otp, setOtp, loading, error, submit, verify } = useRegisterPage();

  return (
    <div className="auth-wrap">
      <div className="auth-aside">
        <div className="navbar-brand">
          <div className="logo-mark">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.6" strokeLinecap="round"><path d="M12 5v14M5 12h14" /></svg>
          </div>
          <span style={{ fontFamily: 'var(--font-heading)', fontSize: 20, color: '#fff', fontWeight: 700 }}>Clinic<span style={{ color: '#bfdbfe' }}>Desk</span></span>
        </div>
        <div>
          <h2>Join thousands of clinics managing smarter.</h2>
          <p>Set up your clinic in minutes. No training needed.</p>
        </div>
      </div>

      <div className="auth-main">
        <div className="auth-card fade-in" style={{ maxWidth: 500 }}>
          <div className="auth-title" style={{ marginBottom: 4 }}>Register your clinic</div>
          <div style={{ fontSize: 13, color: 'var(--slate-400)', marginBottom: 24 }}>Create your ClinicDesk account</div>

          {error && <div className="toast toast-error" style={{ marginBottom: 16 }}>{error}</div>}

          {step === 'form' ? (
            <form onSubmit={submit}>
              <div className="form-grid">
                <div className="field">
                  <label className="field-label">Clinic Name *</label>
                  <input className="input" placeholder="e.g. Sharma Care Clinic" value={form.name} onChange={e => update('name', e.target.value)} required />
                </div>
                <div className="field">
                  <label className="field-label">Owner / Doctor Name *</label>
                  <input className="input" placeholder="e.g. Dr. Anil Sharma" value={form.owner_name} onChange={e => update('owner_name', e.target.value)} required />
                </div>
                <div className="field">
                  <label className="field-label">Email *</label>
                  <input className="input" type="email" placeholder="clinic@example.com" value={form.email} onChange={e => update('email', e.target.value)} required />
                </div>
                <div className="field">
                  <label className="field-label">Phone</label>
                  <input className="input" placeholder="+91 98765 43210" value={form.phone} onChange={e => update('phone', e.target.value)} />
                </div>
                <div className="field span-2">
                  <label className="field-label">Address</label>
                  <textarea className="textarea" rows={3} placeholder="Clinic full address" value={form.address} onChange={e => update('address', e.target.value)} />
                </div>
              </div>
              <Btn type="submit" size="lg" loading={loading} style={{ width: '100%', justifyContent: 'center', marginTop: 8 }}>
                Register & Get OTP
              </Btn>
            </form>
          ) : (
            <form onSubmit={verify}>
              <p style={{ fontSize: 14, color: 'var(--slate-500)', marginBottom: 4 }}>
                Enter the 6-digit code sent to <b>{form.email}</b>
              </p>
              <OtpInput value={otp} onChange={setOtp} />
              <Btn type="submit" size="lg" loading={loading} style={{ width: '100%', justifyContent: 'center', marginTop: 8 }}>
                Verify & Enter ClinicDesk
              </Btn>
            </form>
          )}

          <p style={{ textAlign: 'center', marginTop: 20, fontSize: 13, color: 'var(--slate-400)' }}>
            Already have an account? <Link to="/login">Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default RegisterPage;
