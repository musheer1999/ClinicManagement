import React from 'react';
import { Btn, StatusBadge, Spinner, PageHeader } from '../../../components/ui/index';
import useSettings from './useSettings';

function SettingsPage() {
  const { form, update, clinic, globalPrice, loading, fetching, error, saved, submit } = useSettings();

  if (fetching) return <div style={{ display: 'flex', justifyContent: 'center', padding: 60 }}><Spinner size={36} /></div>;

  const daysUntilExpiry = clinic?.subscription_expiry
    ? Math.ceil((new Date(clinic.subscription_expiry) - new Date()) / (1000 * 60 * 60 * 24))
    : null;

  return (
    <div className="page fade-in">
      <PageHeader title="Account Settings" subtitle="Manage your clinic profile and subscription." />

      {daysUntilExpiry !== null && daysUntilExpiry <= 7 && daysUntilExpiry >= 0 && (
        <div className="sub-banner">⚠ Your subscription expires in {daysUntilExpiry} day{daysUntilExpiry !== 1 ? 's' : ''}. Please contact admin to renew.</div>
      )}

      <div style={{ display: 'grid', grid: 'auto / 2fr 1fr', gap: 24, alignItems: 'start' }}>
        {/* Clinic details form */}
        <div className="card card-pad">
          <h2 className="card-title" style={{ marginBottom: 20 }}>Clinic Information</h2>
          {error && <div className="toast toast-error" style={{ marginBottom: 16 }}>{error}</div>}
          {saved && <div className="toast toast-success" style={{ marginBottom: 16 }}>✓ Changes saved successfully.</div>}

          <form onSubmit={submit}>
            <div className="form-grid">
              <div className="field">
                <label className="field-label">Clinic Name *</label>
                <input className="input" value={form.name} onChange={e => update('name', e.target.value)} required />
              </div>
              <div className="field">
                <label className="field-label">Owner / Doctor Name *</label>
                <input className="input" value={form.owner_name} onChange={e => update('owner_name', e.target.value)} required />
              </div>
              <div className="field">
                <label className="field-label">Phone</label>
                <input className="input" value={form.phone} onChange={e => update('phone', e.target.value)} />
              </div>
              <div className="field">
                <label className="field-label">Logo URL</label>
                <input className="input" placeholder="https://…" value={form.logo_url} onChange={e => update('logo_url', e.target.value)} />
              </div>
              <div className="field span-2">
                <label className="field-label">Address</label>
                <textarea className="textarea" rows={3} value={form.address} onChange={e => update('address', e.target.value)} />
              </div>
            </div>
            <Btn type="submit" loading={loading}>Save Changes</Btn>
          </form>
        </div>

        {/* Subscription card */}
        <div className="card card-pad">
          <h2 className="card-title" style={{ marginBottom: 16 }}>Subscription</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span className="cell-muted">Status</span>
              <StatusBadge status={clinic?.subscription_status || 'active'} />
            </div>
            {clinic?.subscription_expiry && (
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span className="cell-muted">Expiry</span>
                <span style={{ fontWeight: 500 }}>{new Date(clinic.subscription_expiry).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}</span>
              </div>
            )}
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span className="cell-muted">Email</span>
              <span style={{ fontWeight: 500, fontSize: 13 }}>{clinic?.email}</span>
            </div>
            <div style={{ borderTop: '1px solid var(--slate-100)', margin: '4px 0' }} />
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span className="cell-muted">Monthly Price</span>
              <span style={{ fontWeight: 700, color: 'var(--primary)' }}>₹{globalPrice}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span className="cell-muted">Plan Type</span>
              {clinic?.custom_price != null
                ? <span style={{ fontSize: 12, fontWeight: 600, background: '#ede9fe', color: '#7c3aed', padding: '2px 8px', borderRadius: 4 }}>Custom Plan</span>
                : <span style={{ fontSize: 12, fontWeight: 600, background: 'var(--slate-100)', color: 'var(--slate-500)', padding: '2px 8px', borderRadius: 4 }}>Standard Plan</span>}
            </div>
          </div>
          <div style={{ marginTop: 20, paddingTop: 16, borderTop: '1px solid var(--slate-100)', fontSize: 13, color: 'var(--slate-400)' }}>
            To renew or upgrade your subscription, please contact <a href="mailto:admin@clinicdesk.in">admin@clinicdesk.in</a>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SettingsPage;
