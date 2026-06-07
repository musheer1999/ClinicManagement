import React from 'react';
import { Btn, Spinner, PageHeader } from '../../../components/ui/index';
import useGlobalConfig from './useGlobalConfig';

function GlobalConfigPage() {
  const { form, update, loading, saving, saved, error, submit } = useGlobalConfig();

  if (loading) return <div style={{ display: 'flex', justifyContent: 'center', padding: 60 }}><Spinner size={36} /></div>;

  return (
    <div className="page fade-in">
      <PageHeader title="Global Settings" subtitle="Control subscription pricing and platform-wide settings." />

      <div className="card card-pad" style={{ maxWidth: 500 }}>
        <h2 className="card-title" style={{ marginBottom: 20 }}>Subscription Configuration</h2>
        {error && <div className="toast toast-error" style={{ marginBottom: 16 }}>{error}</div>}
        {saved && <div className="toast toast-success" style={{ marginBottom: 16 }}>✓ Settings saved.</div>}

        <form onSubmit={submit}>
          <div className="field" style={{ marginBottom: 24 }}>
            <label className="field-label">Free for all clinics</label>
            <div className="toggle-wrap">
              <button type="button" className={`toggle ${form.is_free_for_all ? 'on' : ''}`} onClick={() => update('is_free_for_all', !form.is_free_for_all)}>
                <span className="toggle-knob" />
              </button>
              <span style={{ fontSize: 14, color: form.is_free_for_all ? 'var(--primary)' : 'var(--slate-500)' }}>
                {form.is_free_for_all ? 'ON — All clinics have free access' : 'OFF — Subscription required'}
              </span>
            </div>
            <span className="field-hint">When enabled, all clinics bypass subscription checks regardless of their status.</span>
          </div>

          <div className="field">
            <label className="field-label">Monthly Subscription Price (₹)</label>
            <input className="input" type="number" min="0" step="1" value={form.subscription_price}
              onChange={e => update('subscription_price', parseFloat(e.target.value))}
              disabled={form.is_free_for_all} />
            <span className="field-hint">This is the price shown to clinics for renewal.</span>
          </div>

          <Btn type="submit" loading={saving} style={{ marginTop: 8 }}>Save Settings</Btn>
        </form>
      </div>
    </div>
  );
}

export default GlobalConfigPage;
