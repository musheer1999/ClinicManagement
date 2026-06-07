import React from 'react';

// ── Button ──────────────────────────────────────────────────────
export function Btn({ variant = 'primary', size, icon: IconC, iconRight: IconR, children, className = '', loading, ...rest }) {
  const base = 'btn';
  const v = `btn-${variant}`;
  const s = size === 'lg' ? 'btn-lg' : size === 'sm' ? 'btn-sm' : '';
  return (
    <button className={[base, v, s, className].filter(Boolean).join(' ')} disabled={loading || rest.disabled} {...rest}>
      {loading ? <Spinner size={14} /> : IconC && <IconC size={15} />}
      {children}
      {IconR && <IconR size={14} />}
    </button>
  );
}

// ── Badge ────────────────────────────────────────────────────────
export function Badge({ tone = 'slate', dot, children }) {
  return <span className={`badge badge-${tone}`}>{dot && <span className="badge-dot" />}{children}</span>;
}
export function StatusBadge({ status }) {
  const tone = status === 'active' || status === 'Active' ? 'green'
    : status === 'free' || status === 'Free' ? 'blue'
    : status === 'expired' || status === 'Expired' ? 'red' : 'slate';
  return <Badge tone={tone} dot>{status}</Badge>;
}

// ── Avatar ───────────────────────────────────────────────────────
export function Avatar({ name = '', size = 40, color = 'var(--primary)', square, ring }) {
  const initials = name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase();
  const style = { width: size, height: size, fontSize: size * 0.36, background: color, borderRadius: square ? 8 : '50%', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 700, flexShrink: 0, outline: ring ? '3px solid #bfdbfe' : 'none', outlineOffset: 2 };
  return <span style={style}>{initials}</span>;
}

// ── Spinner ──────────────────────────────────────────────────────
export function Spinner({ size = 20 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className="spinner">
      <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeDasharray="31 63" />
    </svg>
  );
}

// ── Input ────────────────────────────────────────────────────────
export function Input({ icon: IconC, label, error, hint, ...rest }) {
  return (
    <div className="field">
      {label && <label className="field-label">{label}</label>}
      <div className={IconC ? 'input-icon-wrap' : ''}>
        {IconC && <IconC size={16} className="input-icon" />}
        <input className={`input ${error ? 'input-error' : ''}`} {...rest} />
      </div>
      {error && <span className="field-hint field-hint-error">{error}</span>}
      {!error && hint && <span className="field-hint">{hint}</span>}
    </div>
  );
}

export function Textarea({ label, error, hint, ...rest }) {
  return (
    <div className="field">
      {label && <label className="field-label">{label}</label>}
      <textarea className={`textarea ${error ? 'input-error' : ''}`} {...rest} />
      {error && <span className="field-hint field-hint-error">{error}</span>}
      {!error && hint && <span className="field-hint">{hint}</span>}
    </div>
  );
}

export function Select({ label, error, children, ...rest }) {
  return (
    <div className="field">
      {label && <label className="field-label">{label}</label>}
      <select className={`select ${error ? 'input-error' : ''}`} {...rest}>{children}</select>
      {error && <span className="field-hint field-hint-error">{error}</span>}
    </div>
  );
}

// ── Card ─────────────────────────────────────────────────────────
export function Card({ children, className = '', style }) {
  return <div className={`card ${className}`} style={style}>{children}</div>;
}

// ── Modal ────────────────────────────────────────────────────────
export function Modal({ open, onClose, title, children, footer }) {
  if (!open) return null;
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h3 className="modal-title">{title}</h3>
          <button className="modal-close" onClick={onClose}>✕</button>
        </div>
        <div className="modal-body">{children}</div>
        {footer && <div className="modal-footer">{footer}</div>}
      </div>
    </div>
  );
}

// ── Toast ────────────────────────────────────────────────────────
export function Toast({ toasts, remove }) {
  return (
    <div className="toast-container">
      {toasts.map(t => (
        <div key={t.id} className={`toast toast-${t.kind || 'info'}`}>
          <span>{t.message}</span>
          <button onClick={() => remove(t.id)}>✕</button>
        </div>
      ))}
    </div>
  );
}

// ── EmptyState ───────────────────────────────────────────────────
export function EmptyState({ title, text, action }) {
  return (
    <div className="empty-state">
      <div className="empty-icon">
        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <path d="M20 13V6a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h6" />
          <path d="M16 19l2 2 4-4" />
        </svg>
      </div>
      <h3>{title}</h3>
      {text && <p>{text}</p>}
      {action && <div className="empty-action">{action}</div>}
    </div>
  );
}

// ── Skeleton ─────────────────────────────────────────────────────
export function SkeletonRow({ cols = 4 }) {
  return (
    <tr>
      {Array.from({ length: cols }).map((_, i) => (
        <td key={i}><div className="skeleton" style={{ height: 16, borderRadius: 4 }} /></td>
      ))}
    </tr>
  );
}
export function SkeletonCard() {
  return (
    <div className="card" style={{ padding: 20 }}>
      <div className="skeleton" style={{ height: 18, width: '60%', borderRadius: 4, marginBottom: 10 }} />
      <div className="skeleton" style={{ height: 14, width: '40%', borderRadius: 4 }} />
    </div>
  );
}

// ── PageHeader ───────────────────────────────────────────────────
export function PageHeader({ title, subtitle, actions, back }) {
  return (
    <div className="page-header">
      <div>
        {back && <button className="back-btn" onClick={back.onClick}>← {back.label}</button>}
        <h1 className="page-title">{title}</h1>
        {subtitle && <p className="page-subtitle">{subtitle}</p>}
      </div>
      {actions && <div className="page-actions">{actions}</div>}
    </div>
  );
}

// ── OTP Input ────────────────────────────────────────────────────
export function OtpInput({ value, onChange, length = 6 }) {
  const refs = React.useRef([]);
  function setDigit(i, d) {
    const clean = d.replace(/\D/g, '').slice(-1);
    const arr = value.split('');
    arr[i] = clean;
    const next = arr.join('').slice(0, length);
    onChange(next);
    if (clean && i < length - 1) refs.current[i + 1]?.focus();
  }
  function onKey(i, e) {
    if (e.key === 'Backspace' && !value[i] && i > 0) refs.current[i - 1]?.focus();
  }
  function onPaste(e) {
    const text = (e.clipboardData.getData('text') || '').replace(/\D/g, '').slice(0, length);
    if (text) { e.preventDefault(); onChange(text); refs.current[Math.min(text.length, length - 1)]?.focus(); }
  }
  return (
    <div className="otp-row" onPaste={onPaste}>
      {Array.from({ length }).map((_, i) => (
        <input key={i} ref={el => refs.current[i] = el}
          className={`otp-box ${value[i] ? 'filled' : ''}`}
          inputMode="numeric" maxLength={1} value={value[i] || ''}
          onChange={e => setDigit(i, e.target.value)} onKeyDown={e => onKey(i, e)} />
      ))}
    </div>
  );
}

export default { Btn, Badge, StatusBadge, Avatar, Spinner, Input, Textarea, Select, Card, Modal, Toast, EmptyState, SkeletonRow, SkeletonCard, PageHeader, OtpInput };
