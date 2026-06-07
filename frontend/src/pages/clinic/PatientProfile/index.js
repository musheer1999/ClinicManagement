import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Btn, Avatar, Badge, Spinner, EmptyState, PageHeader } from '../../../components/ui/index';
import usePatientProfile from './usePatientProfile';

function PatientProfilePage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { patient, loading, error } = usePatientProfile(id);

  if (loading) return <div style={{ display: 'flex', justifyContent: 'center', padding: 60 }}><Spinner size={36} /></div>;
  if (error) return <div className="toast toast-error" style={{ margin: 24 }}>{error}</div>;
  if (!patient) return null;

  const sortedVisits = [...(patient.visits || [])].sort((a, b) => new Date(b.visit_date) - new Date(a.visit_date));

  const INFO = [
    { k: 'Unique ID', v: patient.unique_patient_id },
    { k: 'Age', v: patient.age ? `${patient.age} years` : '—' },
    { k: 'Gender', v: patient.gender || '—' },
    { k: 'Blood Group', v: patient.blood_group || '—' },
    { k: 'Phone', v: patient.phone },
    { k: 'Address', v: patient.address || '—' },
  ];

  return (
    <div className="page fade-in">
      <PageHeader
        title="Patient Profile"
        back={{ label: 'Back to patients', onClick: () => navigate('/patients') }}
        actions={<>
          <Btn variant="secondary" onClick={() => navigate(`/patients/${id}/edit`)}>Edit</Btn>
          <Btn onClick={() => navigate(`/patients/${id}/visit/new`)}>+ Add New Visit</Btn>
        </>}
      />

      {/* Patient info card */}
      <div className="card card-pad" style={{ marginBottom: 24 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 20, flexWrap: 'wrap' }}>
          <Avatar name={patient.name} size={64} ring />
          <div style={{ flex: 1, minWidth: 0 }}>
            <h2 style={{ fontSize: 22, marginBottom: 8 }}>{patient.name}</h2>
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              <Badge tone="blue">{patient.unique_patient_id}</Badge>
              {patient.age && <Badge tone="slate">{patient.age}y · {patient.gender}</Badge>}
              {patient.blood_group && <Badge tone="red">{patient.blood_group}</Badge>}
              <Badge tone="green">{sortedVisits.length} visit{sortedVisits.length !== 1 ? 's' : ''}</Badge>
            </div>
          </div>
        </div>
        <div style={{ borderTop: '1px solid var(--slate-100)', paddingTop: 18 }}>
          <div className="info-grid">
            {INFO.map((c, i) => (
              <div className="info-cell" key={i}>
                <div className="k">{c.k}</div>
                <div className="v">{c.v}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Visit history */}
      <div className="card-head">
        <h2 className="card-title">Visit history</h2>
        <span className="cell-muted">{sortedVisits.length} record{sortedVisits.length !== 1 ? 's' : ''}</span>
      </div>

      {sortedVisits.length === 0 ? (
        <div className="card">
          <EmptyState title="No visits recorded" text="Add this patient's first visit to begin building their medical history."
            action={<Btn onClick={() => navigate(`/patients/${id}/visit/new`)}>Add New Visit</Btn>} />
        </div>
      ) : (
        <div className="timeline">
          {sortedVisits.map((v, idx) => {
            const meds = Array.isArray(v.medicines) ? v.medicines : [];
            return (
              <div className="card card-pad card-hover fade-in" key={v.id}>
                <div className="visit-card-head">
                  <div>
                    <div className="visit-date">{new Date(v.visit_date).toLocaleDateString('en-IN', { day: '2-digit', month: 'long', year: 'numeric' })}</div>
                    <div className="cell-muted" style={{ fontSize: 12, marginTop: 2 }}>
                      {v.id.slice(0, 8).toUpperCase()}
                      {idx === 0 && <span style={{ marginLeft: 8 }}><Badge tone="blue">Latest</Badge></span>}
                    </div>
                  </div>
                  <div className="visit-actions">
                    <Btn variant="secondary" size="sm" onClick={() => navigate(`/visits/${v.id}`)}>View Details</Btn>
                    <Btn variant="secondary" size="sm" onClick={() => navigate(`/visits/${v.id}/edit`)}>Edit</Btn>
                    <Btn variant="ghost" size="sm" onClick={() => { const link = document.createElement('a'); link.href = `http://localhost:5000/api/visits/${v.id}/pdf`; link.setAttribute('download', 'ClinicDesk-Report.pdf'); document.body.appendChild(link); link.click(); document.body.removeChild(link); }}>Download PDF</Btn>
                  </div>
                </div>
                <p style={{ marginTop: 10, color: 'var(--slate-700)', lineHeight: 1.55 }}>{v.diagnosis || '—'}</p>
                <div style={{ display: 'flex', gap: 10, marginTop: 12, flexWrap: 'wrap' }}>
                  {meds.length > 0 && <Badge tone="slate">{meds.length} medicine{meds.length !== 1 ? 's' : ''}</Badge>}
                  {v.next_visit_date && <Badge tone="amber" dot>Next: {new Date(v.next_visit_date).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}</Badge>}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default PatientProfilePage;
