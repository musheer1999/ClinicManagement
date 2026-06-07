import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Btn, StatusBadge, Spinner, PageHeader } from '../../../components/ui/index';
import useAdminClinicDetail from './useAdminClinicDetail';
import { fetchConfig } from '../GlobalConfig/useGlobalConfigQuery';

function AdminClinicDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { clinic, form, update, loading, saving, saved, error, save, customPrice, setCustomPrice, saveCustomPrice } = useAdminClinicDetail(id);
  const [globalPrice, setGlobalPrice] = React.useState(999);

  React.useEffect(() => {
    fetchConfig().then(d => setGlobalPrice(d.data?.subscription_price || 999)).catch(() => {});
  }, []);

  if (loading) return <div style={{ display: 'flex', justifyContent: 'center', padding: 60 }}><Spinner size={36} /></div>;
  if (!clinic) return null;

  return (
    <div className="page fade-in">
      <PageHeader title={clinic.name} back={{ label: 'Back to all clinics', onClick: () => navigate('/admin/clinics') }} />

      <div style={{ display: 'grid', grid: 'auto / 2fr 1fr', gap: 24, alignItems: 'start' }}>
        <div className="card card-pad">
          <h2 className="card-title" style={{ marginBottom: 16 }}>Clinic Details</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {[
              { k: 'Owner', v: clinic.owner_name },
              { k: 'Email', v: clinic.email },
              { k: 'Phone', v: clinic.phone || '—' },
              { k: 'Address', v: clinic.address || '—' },
              { k: 'Registered', v: new Date(clinic.created_at).toLocaleDateString('en-IN') },
            ].map((r, i) => (
              <div key={i} style={{ display: 'flex', gap: 16, paddingBottom: 10, borderBottom: '1px solid var(--slate-50)' }}>
                <span style={{ width: 80, color: 'var(--slate-400)', fontSize: 13, flexShrink: 0 }}>{r.k}</span>
                <span style={{ fontWeight: 500 }}>{r.v}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="card card-pad">
          <h2 className="card-title" style={{ marginBottom: 16 }}>Subscription Control</h2>
          {error && <div className="toast toast-error" style={{ marginBottom: 12 }}>{error}</div>}
          {saved && <div className="toast toast-success" style={{ marginBottom: 12 }}>✓ Subscription updated.</div>}
          <form onSubmit={save}>
            <div className="field">
              <label className="field-label">Status</label>
              <select className="select" value={form.subscription_status} onChange={e => update('subscription_status', e.target.value)}>
                <option value="active">Active</option>
                <option value="free">Free</option>
                <option value="expired">Expired</option>
              </select>
            </div>
            <div className="field">
              <label className="field-label">Expiry Date</label>
              <input className="input" type="date" value={form.subscription_expiry} onChange={e => update('subscription_expiry', e.target.value)} />
            </div>
            <div style={{ marginTop: 8, marginBottom: 12 }}>
              <span className="cell-muted" style={{ fontSize: 13 }}>Current: </span>
              <StatusBadge status={clinic.subscription_status} />
            </div>
            <Btn type="submit" loading={saving}>Update Subscription</Btn>
          </form>

          <div style={{ borderTop: '1px solid var(--slate-100)', margin: '20px 0' }} />
          <h3 style={{ fontSize: 14, fontWeight: 600, marginBottom: 6 }}>Custom Subscription Price</h3>
          <p style={{ fontSize: 13, color: 'var(--slate-400)', marginBottom: 14 }}>
            Override the global price (₹{globalPrice}) for this clinic only. Leave empty to use global price.
          </p>
          <form onSubmit={saveCustomPrice}>
            <div className="field">
              <label className="field-label">Price (₹)</label>
              <input
                className="input"
                type="number"
                min="0"
                step="0.01"
                placeholder="e.g. 399"
                value={customPrice}
                onChange={e => setCustomPrice(e.target.value)}
              />
            </div>
            <p style={{ fontSize: 13, color: 'var(--slate-500)', marginBottom: 12 }}>
              {customPrice !== ''
                ? `This clinic pays ₹${customPrice}/month`
                : `Using global price ₹${globalPrice}/month`}
            </p>
            <div style={{ display: 'flex', gap: 8 }}>
              <Btn type="submit" loading={saving}>Set Custom Price</Btn>
              <Btn type="button" variant="secondary" onClick={() => { setCustomPrice(''); saveCustomPrice(null); }}>Reset to Global</Btn>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default AdminClinicDetailPage;
