import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Btn, PageHeader, Spinner } from '../../../components/ui/index';
import useEditVisit from './useEditVisit';

function EditVisitPage() {
  const { id: visitId } = useParams();
  const navigate = useNavigate();
  const { form, loadingData, update, updateMed, addMed, removeMed, loading, error, submit } = useEditVisit(visitId);

  if (loadingData) return <div style={{ display: 'flex', justifyContent: 'center', padding: 60 }}><Spinner size={36} /></div>;

  return (
    <div className="page fade-in">
      <PageHeader
        title="Edit Visit"
        back={{ label: 'Back to visit', onClick: () => navigate(`/visits/${visitId}`) }}
      />

      <div className="card card-pad" style={{ maxWidth: 780 }}>
        {error && <div className="toast toast-error" style={{ marginBottom: 16 }}>{error}</div>}

        <form onSubmit={submit}>
          <div className="form-grid">
            <div className="field">
              <label className="field-label">Visit Date *</label>
              <input className="input" type="date" value={form.visit_date} onChange={e => update('visit_date', e.target.value)} required />
            </div>
            <div className="field">
              <label className="field-label">Next Visit Date</label>
              <input className="input" type="date" value={form.next_visit_date} onChange={e => update('next_visit_date', e.target.value)} min={form.visit_date} />
            </div>
            <div className="field span-2">
              <label className="field-label">Diagnosis</label>
              <textarea className="textarea" rows={3} placeholder="Enter diagnosis details…" value={form.diagnosis} onChange={e => update('diagnosis', e.target.value)} />
            </div>
            <div className="field span-2">
              <label className="field-label">Prescription Notes</label>
              <textarea className="textarea" rows={3} placeholder="General prescription instructions…" value={form.prescription} onChange={e => update('prescription', e.target.value)} />
            </div>
          </div>

          <div style={{ marginBottom: 16 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
              <label className="field-label" style={{ margin: 0 }}>Medicines</label>
              <Btn type="button" variant="secondary" size="sm" onClick={addMed}>+ Add Medicine</Btn>
            </div>

            <div className="med-row" style={{ marginBottom: 6 }}>
              {['Medicine Name', 'Dosage', 'Frequency', 'Duration', ''].map((h, i) => (
                <span key={i} style={{ fontSize: 12, fontWeight: 600, color: 'var(--slate-500)', textTransform: 'uppercase' }}>{h}</span>
              ))}
            </div>

            {form.medicines.map((med, i) => (
              <div className="med-row" key={i}>
                <input className="input" placeholder="e.g. Paracetamol" value={med.name} onChange={e => updateMed(i, 'name', e.target.value)} />
                <input className="input" placeholder="e.g. 500 mg" value={med.dosage} onChange={e => updateMed(i, 'dosage', e.target.value)} />
                <input className="input" placeholder="e.g. Twice daily" value={med.frequency} onChange={e => updateMed(i, 'frequency', e.target.value)} />
                <input className="input" placeholder="e.g. 5 days" value={med.duration} onChange={e => updateMed(i, 'duration', e.target.value)} />
                <button type="button" className="med-delete" onClick={() => removeMed(i)} title="Remove">✕</button>
              </div>
            ))}
          </div>

          <div className="field span-2">
            <label className="field-label">Additional Notes</label>
            <textarea className="textarea" rows={2} placeholder="Any other notes for this visit…" value={form.notes} onChange={e => update('notes', e.target.value)} />
          </div>

          <div style={{ display: 'flex', gap: 10, marginTop: 16 }}>
            <Btn type="submit" loading={loading}>Save Changes</Btn>
            <Btn type="button" variant="secondary" onClick={() => navigate(`/visits/${visitId}`)}>Cancel</Btn>
          </div>
        </form>
      </div>
    </div>
  );
}

export default EditVisitPage;
