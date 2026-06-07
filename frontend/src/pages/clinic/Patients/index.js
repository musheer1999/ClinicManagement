import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Btn, Avatar, SkeletonRow, EmptyState, PageHeader } from '../../../components/ui/index';
import usePatients from './usePatients';

function PatientsPage() {
  const { patients, search, setSearch, loading } = usePatients();
  const navigate = useNavigate();

  return (
    <div className="page fade-in">
      <PageHeader title="Patients" subtitle="Search, view, and manage all patient records."
        actions={<Btn onClick={() => navigate('/patients/new')}>+ Add New Patient</Btn>} />

      <div style={{ display: 'flex', gap: 12, marginBottom: 20, flexWrap: 'wrap' }}>
        <div style={{ flex: 1, minWidth: 240, position: 'relative' }}>
          <svg style={{ position: 'absolute', left: 11, top: '50%', transform: 'translateY(-50%)', color: 'var(--slate-400)' }} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/></svg>
          <input className="input" style={{ paddingLeft: 36 }} placeholder="Search by phone number or patient ID…" value={search} onChange={e => setSearch(e.target.value)} />
        </div>
      </div>

      <div className="table-wrap">
        {loading ? (
          <table className="data"><tbody>{[0,1,2,3,4].map(i => <SkeletonRow key={i} cols={5} />)}</tbody></table>
        ) : patients.length === 0 ? (
          <EmptyState title={search ? 'No patients found' : 'No patients yet'}
            text={search ? 'Try searching with a different phone number or ID.' : 'Add your first patient to get started.'}
            action={!search && <Btn onClick={() => navigate('/patients/new')}>Add your first patient</Btn>} />
        ) : (
          <div className="table-scroll">
            <table className="data">
              <thead><tr><th>Patient</th><th>Unique ID</th><th>Age / Gender</th><th>Phone</th><th>Last Visit</th><th style={{ textAlign: 'right' }}>Actions</th></tr></thead>
              <tbody>
                {patients.map(p => (
                  <tr key={p.id} style={{ cursor: 'pointer' }} onClick={() => navigate(`/patients/${p.id}`)}>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        <Avatar name={p.name} size={36} />
                        <span className="cell-strong">{p.name}</span>
                      </div>
                    </td>
                    <td><span className="badge badge-blue">{p.unique_patient_id}</span></td>
                    <td className="cell-muted">{p.age ? `${p.age}y` : '—'} · {p.gender || '—'}</td>
                    <td className="cell-muted">{p.phone}</td>
                    <td className="cell-muted">{p.last_visit_date ? new Date(p.last_visit_date).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }) : '—'}</td>
                    <td onClick={e => e.stopPropagation()}>
                      <div className="table-actions">
                        <Btn variant="secondary" size="sm" onClick={() => navigate(`/patients/${p.id}`)}>View</Btn>
                        <Btn variant="ghost" size="sm" onClick={() => navigate(`/patients/${p.id}/visit/new`)}>+ Visit</Btn>
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

export default PatientsPage;
