import React from 'react';
import { Link } from 'react-router-dom';
import { Btn, OtpInput } from '../../../components/ui/index';
import useLoginPage from './useLoginPage';

const FEATURES = [
  'Manage unlimited patient records',
  'Digital prescriptions & visit history',
  'One-click PDF reports for every visit',
  'Secure OTP login — no passwords to remember',
];

function LoginPage() {
  const { step, email, setEmail, otp, setOtp, loading, error, resendIn, sendOtp, verify, resend, goBack } = useLoginPage();

  return (
    <div className="auth-wrap">
      <div className="auth-aside">
        <div className="navbar-brand" style={{ marginBottom: 8 }}>
          <div className="logo-mark">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.6" strokeLinecap="round">
              <path d="M12 5v14M5 12h14" />
            </svg>
          </div>
          <span style={{ fontFamily: 'var(--font-heading)', fontSize: 20, color: '#fff', fontWeight: 700 }}>
            Clinic<span style={{ color: '#bfdbfe' }}>Desk</span>
          </span>
        </div>
        <div>
          <h2>Everything your clinic needs, in one calm dashboard.</h2>
          <p>Patients, visits, prescriptions and reports — organised the way busy clinics actually work.</p>
        </div>
        <div className="auth-features">
          {FEATURES.map((f, i) => (
            <div key={i} className="auth-feature">
              <span style={{ color: '#60a5fa', fontSize: 16 }}>✓</span> {f}
            </div>
          ))}
        </div>
      </div>

      <div className="auth-main">
        <div className="auth-card fade-in">
          <div className="auth-logo">
            <div className="logo-mark">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.6" strokeLinecap="round">
                <path d="M12 5v14M5 12h14" />
              </svg>
            </div>
            <div>
              <div className="auth-title">Welcome to ClinicDesk</div>
              <div style={{ fontSize: 13, color: 'var(--slate-400)' }}>
                {step === 'email' ? 'Sign in to your clinic account' : <>Code sent to <b>{email}</b></>}
              </div>
            </div>
          </div>

          {error && <div className="toast toast-error" style={{ marginBottom: 16 }}>{error}</div>}

          {step === 'email' ? (
            <form onSubmit={sendOtp}>
              <div className="field">
                <label className="field-label">Email address</label>
                <input className="input" type="email" placeholder="you@clinic.com" value={email} onChange={e => setEmail(e.target.value)} autoFocus required />
              </div>
              <Btn type="submit" size="lg" loading={loading} style={{ width: '100%', justifyContent: 'center', marginTop: 8 }}>
                Send OTP
              </Btn>
            </form>
          ) : (
            <form onSubmit={verify}>
              <p style={{ fontSize: 14, color: 'var(--slate-500)', marginBottom: 4 }}>Enter the 6-digit code</p>
              <OtpInput value={otp} onChange={setOtp} />
              <Btn type="submit" size="lg" loading={loading} style={{ width: '100%', justifyContent: 'center', marginTop: 8 }}>
                Verify & Login
              </Btn>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 14, fontSize: 13 }}>
                <button type="button" style={{ background: 'none', border: 'none', color: 'var(--slate-500)', cursor: 'pointer' }} onClick={goBack}>← Change email</button>
                <button type="button" style={{ background: 'none', border: 'none', color: resendIn > 0 ? 'var(--slate-400)' : 'var(--primary)', cursor: resendIn > 0 ? 'default' : 'pointer' }} onClick={resend} disabled={resendIn > 0}>
                  {resendIn > 0 ? `Resend in ${resendIn}s` : 'Resend OTP'}
                </button>
              </div>
            </form>
          )}

          <p style={{ textAlign: 'center', marginTop: 24, fontSize: 13, color: 'var(--slate-400)' }}>
            New clinic? <Link to="/register">Register here</Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;
