import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Btn, Badge, Spinner, PageHeader } from '../../../components/ui/index';
import useVisitDetail from './useVisitDetail';

function VisitDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { visit, loading, error } = useVisitDetail(id);

  if (loading) return <div style={{ display: 'flex', justifyContent: 'center', padding: 60 }}><Spinner size={36} /></div>;
  if (error) return <div className="toast toast-error" style={{ margin: 24 }}>{error}</div>;
  if (!visit) return null;

  const meds = Array.isArray(visit.medicines) ? visit.medicines : JSON.parse(visit.medicines || '[]');
  const fmt = (d) => new Date(d).toLocaleDateString('en-IN', { day: '2-digit', month: 'long', year: 'numeric' });

  return (
    <div className="page fade-in">
      <PageHeader
        title="Visit Details"
        back={{ label: 'Back to patient', onClick: () => navigate(`/patients/${visit.patient_id}`) }}
        actions={
          <>
            <Btn variant="secondary" onClick={() => navigate(`/visits/${id}/edit`)}>Edit Visit</Btn>
            <Btn onClick={() => { const link = document.createElement('a'); link.href = `http://localhost:5000/api/visits/${id}/pdf`; link.setAttribute('download', 'ClinicDesk-Report.pdf'); document.body.appendChild(link); link.click(); document.body.removeChild(link); }}>
              ⬇ Download PDF Report
            </Btn>
          </>
        }
      />

      {/* Clinic letterhead preview */}
      <div className="card" style={{ marginBottom: 20, overflow: 'hidden' }}>
        <div style={{ background: 'var(--primary)', padding: '20px 28px' }}>
          <div style={{ fontSize: 22, fontWeight: 700, color: '#fff', fontFamily: 'var(--font-heading)' }}>{visit.clinic_name}</div>
          <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.8)', marginTop: 4 }}>
            {visit.clinic_address} {visit.clinic_phone && `· ${visit.clinic_phone}`}
          </div>
        </div>

        <div style={{ padding: 28 }}>
          {/* Patient info */}
          <div style={{ background: 'var(--primary-light)', borderRadius: 8, padding: '14px 18px', marginBottom: 24, display: 'flex', gap: 24, flexWrap: 'wrap' }}>
            <div><div style={{ fontSize: 11, color: 'var(--slate-400)', textTransform: 'uppercase', marginBottom: 2 }}>Patient</div><div style={{ fontWeight: 600 }}>{visit.patient_name}</div></div>
            <div><div style={{ fontSize: 11, color: 'var(--slate-400)', textTransform: 'uppercase', marginBottom: 2 }}>ID</div><div style={{ fontWeight: 600 }}>{visit.unique_patient_id}</div></div>
            <div><div style={{ fontSize: 11, color: 'var(--slate-400)', textTransform: 'uppercase', marginBottom: 2 }}>Age / Gender</div><div style={{ fontWeight: 600 }}>{visit.age}y · {visit.gender}</div></div>
            <div><div style={{ fontSize: 11, color: 'var(--slate-400)', textTransform: 'uppercase', marginBottom: 2 }}>Blood Group</div><div style={{ fontWeight: 600 }}>{visit.blood_group || '—'}</div></div>
            <div><div style={{ fontSize: 11, color: 'var(--slate-400)', textTransform: 'uppercase', marginBottom: 2 }}>Phone</div><div style={{ fontWeight: 600 }}>{visit.phone}</div></div>
            <div style={{ marginLeft: 'auto' }}><div style={{ fontSize: 11, color: 'var(--slate-400)', textTransform: 'uppercase', marginBottom: 2 }}>Visit Date</div><div style={{ fontWeight: 600 }}>{fmt(visit.visit_date)}</div></div>
          </div>

          {visit.diagnosis && (
            <Section title="Diagnosis">{visit.diagnosis}</Section>
          )}

          {visit.prescription && (
            <Section title="Prescription Notes">{visit.prescription}</Section>
          )}

          {meds.length > 0 && (
            <div style={{ marginBottom: 20 }}>
              <SectionTitle>Medicines</SectionTitle>
              <div className="table-wrap">
                <table className="data">
                  <thead><tr><th>Medicine</th><th>Dosage</th><th>Frequency</th><th>Duration</th></tr></thead>
                  <tbody>
                    {meds.map((m, i) => (
                      <tr key={i}>
                        <td className="cell-strong">{m.name}</td>
                        <td className="cell-muted">{m.dosage}</td>
                        <td className="cell-muted">{m.frequency}</td>
                        <td className="cell-muted">{m.duration}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {visit.next_visit_date && (
            <div style={{ background: 'var(--amber-50)', border: '1px solid var(--amber-100)', borderRadius: 8, padding: '12px 18px', marginBottom: 16 }}>
              <span style={{ fontSize: 12, color: 'var(--amber-600)', fontWeight: 600, textTransform: 'uppercase' }}>Next Visit</span>
              <div style={{ fontWeight: 600, color: 'var(--amber-600)', marginTop: 2 }}>{fmt(visit.next_visit_date)}</div>
            </div>
          )}

          {visit.notes && <Section title="Additional Notes">{visit.notes}</Section>}

          <div style={{ textAlign: 'center', borderTop: '1px solid var(--slate-100)', paddingTop: 16, color: 'var(--slate-400)', fontSize: 13 }}>
            Thank you for visiting {visit.clinic_name}
          </div>
        </div>
      </div>
    </div>
  );
}

function SectionTitle({ children }) {
  return <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--primary)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 8 }}>{children}</div>;
}
function Section({ title, children }) {
  return (
    <div style={{ marginBottom: 20 }}>
      <SectionTitle>{title}</SectionTitle>
      <p style={{ color: 'var(--slate-700)', lineHeight: 1.6 }}>{children}</p>
    </div>
  );
}

export default VisitDetailPage;
