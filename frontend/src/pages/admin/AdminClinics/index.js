import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Btn, Avatar, StatusBadge, SkeletonRow, EmptyState, PageHeader } from '../../../components/ui/index';
import useAdminClinics from './useAdminClinics';

function AdminClinicsPage() {
  const { clinics, filtered, loading, search, setSearch, filter, setFilter } = useAdminClinics();
  const navigate = useNavigate();
  const counts = { active: clinics.filter(c => c.subscription_status === 'active').length, free: clinics.filter(c => c.subscription_status === 'free').length, expired: clinics.filter(c => c.subscription_status === 'expired').length };

  return (
    <div className="page fade-in">
      <PageHeader title="All Clinics" subtitle="Manage every clinic registered on ClinicDesk." />

      <div className="stat-grid" style={{ marginBottom: 24 }}>
        {[
          { label: 'Total Clinics', value: clinics.length, bg: 'rgba(37,99,235,.12)', fg: '#60a5fa' },
          { label: 'Active', value: counts.active, bg: 'rgba(5,150,105,.12)', fg: '#34d399' },
          { label: 'Free Plan', value: counts.free, bg: 'rgba(37,99,235,.12)', fg: '#60a5fa' },
          { label: 'Expired', value: counts.expired, bg: 'rgba(220,38,38,.12)', fg: '#f87171' },
        ].map((s, i) => (
          <div key={i} className="stat-card" style={{ background: '#1e293b', border: '1px solid #334155' }}>
            <div className="stat-icon" style={{ background: s.bg, color: s.fg }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="18" height="18" rx="2"/></svg>
            </div>
            <div className="stat-label" style={{ color: '#94a3b8' }}>{s.label}</div>
            <div className="stat-value" style={{ color: '#f1f5f9' }}>{s.value}</div>
          </div>
        ))}
      </div>

      <div style={{ display: 'flex', gap: 12, marginBottom: 16, flexWrap: 'wrap' }}>
        <div style={{ flex: 1, minWidth: 240, position: 'relative' }}>
          <svg style={{ position: 'absolute', left: 11, top: '50%', transform: 'translateY(-50%)', color: 'var(--slate-400)' }} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/></svg>
          <input className="input" style={{ paddingLeft: 36 }} placeholder="Search clinics…" value={search} onChange={e => setSearch(e.target.value)} />
        </div>
        <div className="chips">
          {['All', 'Active', 'Free', 'Expired'].map(f => (
            <button key={f} className={`chip ${filter === f ? 'active' : ''}`} onClick={() => setFilter(f)}>{f}</button>
          ))}
        </div>
      </div>

      <div className="table-wrap">
        {loading ? (
          <table className="data"><tbody>{[0,1,2,3].map(i => <SkeletonRow key={i} cols={5} />)}</tbody></table>
        ) : filtered.length === 0 ? (
          <EmptyState title="No clinics found" text="No clinics match your search." />
        ) : (
          <div className="table-scroll">
            <table className="data">
              <thead><tr><th>Clinic</th><th>Email</th><th>Status</th><th>Expiry</th><th>Patients</th><th style={{ textAlign: 'right' }}>Actions</th></tr></thead>
              <tbody>
                {filtered.map(c => (
                  <tr key={c.id} style={{ cursor: 'pointer' }} onClick={() => navigate(`/admin/clinics/${c.id}`)}>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        <Avatar name={c.name} size={36} color="#1e40af" square />
                        <div>
                          <div className="cell-strong">{c.name}</div>
                          <div className="cell-muted" style={{ fontSize: 12 }}>{c.owner_name}</div>
                        </div>
                      </div>
                    </td>
                    <td className="cell-muted">{c.email}</td>
                    <td><StatusBadge status={c.subscription_status} /></td>
                    <td className="cell-muted">{c.subscription_expiry ? new Date(c.subscription_expiry).toLocaleDateString('en-IN') : '—'}</td>
                    <td className="cell-muted">{c.patient_count}</td>
                    <td onClick={e => e.stopPropagation()}>
                      <div className="table-actions">
                        <Btn variant="secondary" size="sm" onClick={() => navigate(`/admin/clinics/${c.id}`)}>Manage</Btn>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

export default AdminClinicsPage;
