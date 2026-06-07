import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext';
import { Btn, Badge, SkeletonRow, EmptyState, PageHeader } from '../../../components/ui/index';
import useDashboard from './useDashboard';

function StatCard({ icon, label, value, bg, fg, trend, trendFlat, loading }) {
  return (
    <div className="stat-card">
      <div className="stat-icon" style={{ background: bg, color: fg }}>{icon}</div>
      <div className="stat-label">{label}</div>
      {loading ? <div className="skeleton" style={{ height: 32, width: 80, borderRadius: 6, margin: '6px 0' }} /> : <div className="stat-value">{value}</div>}
      <div className={`stat-trend ${trendFlat ? 'flat' : ''}`}>{trend}</div>
    </div>
  );
}

function DashboardPage() {
  const { user } = useAuth();
  const { stats, loading } = useDashboard();
  const navigate = useNavigate();

  const firstName = user?.owner_name?.replace('Dr. ', '').split(' ')[0] || 'Doctor';

  return (
    <div className="page fade-in">
      <PageHeader
        title={`Good morning, Dr. ${firstName}`}
        subtitle={`Here's what's happening at ${user?.name || 'your clinic'} today.`}
        actions={<>
          <Btn variant="secondary" onClick={() => navigate('/patients')}>Search Patient</Btn>
          <Btn onClick={() => navigate('/patients/new')}>+ Add New Patient</Btn>
        </>}
      />

      <div className="stat-grid" style={{ marginBottom: 28 }}>
        <StatCard loading={loading} icon={<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"/></svg>} label="Total Patients" value={stats?.totalPatients ?? '—'} bg="#eff6ff" fg="#2563eb" trend="All registered patients" trendFlat />
        <StatCard loading={loading} icon={<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>} label="Today's Visits" value={stats?.todayVisits ?? '—'} bg="#ecfdf5" fg="#059669" trend="Recorded today" trendFlat />
        <StatCard loading={loading} icon={<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="23 4 23 10 17 10"/><path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"/></svg>} label="Upcoming Revisits" value={stats?.upcomingRevisits ?? '—'} bg="#fffbeb" fg="#d97706" trend="Next 14 days" trendFlat />
        <StatCard loading={loading} icon={<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>} label="Subscription" value={user?.subscription_status || 'Active'} bg="#f5f3ff" fg="#7c3aed" trend={user?.subscription_expiry ? `Expires ${new Date(user.subscription_expiry).toLocaleDateString('en-IN')}` : ''} trendFlat />
      </div>

      <div className="card-head">
        <h2 className="card-title">Recent visits</h2>
        <Btn variant="ghost" size="sm" onClick={() => navigate('/patients')}>View all patients →</Btn>
      </div>

      <div className="table-wrap">
        {loading ? (
          <table className="data"><tbody>{[0,1,2,3,4].map(i => <SkeletonRow key={i} cols={5} />)}</tbody></table>
        ) : !stats?.recentVisits?.length ? (
          <EmptyState title="No visits recorded yet" text="Once you add patient visits, they'll appear here." action={<Btn onClick={() => navigate('/patients/new')}>Add your first patient</Btn>} />
        ) : (
          <div className="table-scroll">
            <table className="data">
              <thead><tr><th>Patient</th><th>Visit date</th><th>Diagnosis</th><th>Next visit</th><th style={{ textAlign: 'right' }}>Actions</th></tr></thead>
              <tbody>
                {stats.recentVisits.map(v => (
                  <tr key={v.id}>
                    <td>
                      <div className="cell-strong">{v.patient_name}</div>
                      <div className="cell-muted">{v.unique_patient_id}</div>
                    </td>
                    <td className="cell-muted">{new Date(v.visit_date).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}</td>
                    <td style={{ maxWidth: 280 }}><span style={{ display: 'block', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{v.diagnosis || '—'}</span></td>
                    <td>{v.next_visit_date ? <Badge tone="amber" dot>{new Date(v.next_visit_date).toLocaleDateString('en-IN', { day: '2-digit', month: 'short' })}</Badge> : <span className="cell-muted">—</span>}</td>
                    <td>
                      <div className="table-actions">
                        <Btn variant="secondary" size="sm" onClick={() => navigate(`/visits/${v.id}`)}>View</Btn>
                        <Btn variant="ghost" size="sm" onClick={() => { const link = document.createElement('a'); link.href = `http://localhost:5000/api/visits/${v.id}/pdf`; link.setAttribute('download', 'ClinicDesk-Report.pdf'); document.body.appendChild(link); link.click(); document.body.removeChild(link); }}>PDF</Btn>
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

export default DashboardPage;
