import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Btn, Spinner, PageHeader } from '../../../components/ui/index';
import useAddEditPatient from './useAddEditPatient';

const BLOOD_GROUPS = ['A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-'];
const GENDERS = ['male', 'female', 'other'];

function AddEditPatientPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { form, update, loading, fetching, error, submit, isEdit } = useAddEditPatient(id);

  if (fetching) return <div style={{ display: 'flex', justifyContent: 'center', padding: 60 }}><Spinner size={36} /></div>;

  return (
    <div className="page fade-in">
      <PageHeader
        title={isEdit ? 'Edit Patient' : 'Add New Patient'}
        back={{ label: 'Back to patients', onClick: () => navigate(isEdit ? `/patients/${id}` : '/patients') }}
      />

      <div className="card card-pad" style={{ maxWidth: 700 }}>
        {error && <div className="toast toast-error" style={{ marginBottom: 16 }}>{error}</div>}
        <form onSubmit={submit}>
          <div className="form-grid">
            <div className="field">
              <label className="field-label">Full Name *</label>
              <input className="input" placeholder="Patient full name" value={form.name} onChange={e => update('name', e.target.value)} required />
            </div>
            <div className="field">
              <label className="field-label">Phone Number *</label>
              <input className="input" placeholder="+91 98765 43210" value={form.phone} onChange={e => update('phone', e.target.value)} required />
            </div>
            <div className="field">
              <label className="field-label">Age</label>
              <input className="input" type="number" min="0" max="150" placeholder="e.g. 35" value={form.age} onChange={e => update('age', e.target.value)} />
            </div>
            <div className="field">
              <label className="field-label">Blood Group</label>
              <select className="select" value={form.blood_group} onChange={e => update('blood_group', e.target.value)}>
                <option value="">Select blood group</option>
                {BLOOD_GROUPS.map(bg => <option key={bg} value={bg}>{bg}</option>)}
              </select>
            </div>
            <div className="field span-2">
              <label className="field-label">Gender</label>
              <div className="radio-group">
                {GENDERS.map(g => (
                  <label key={g} className={`radio-pill ${form.gender === g ? 'checked' : ''}`}>
                    <input type="radio" checked={form.gender === g} onChange={() => update('gender', g)} />
                    {g.charAt(0).toUpperCase() + g.slice(1)}
                  </label>
                ))}
              </div>
            </div>
            <div className="field span-2">
              <label className="field-label">Address</label>
              <textarea className="textarea" rows={3} placeholder="Patient's home address" value={form.address} onChange={e => update('address', e.target.value)} />
            </div>
          </div>

          <div style={{ display: 'flex', gap: 10, marginTop: 8 }}>
            <Btn type="submit" loading={loading}>{isEdit ? 'Save Changes' : 'Add Patient'}</Btn>
            <Btn type="button" variant="secondary" onClick={() => navigate(isEdit ? `/patients/${id}` : '/patients')}>Cancel</Btn>
          </div>
        </form>
      </div>
    </div>
  );
}

export default AddEditPatientPage;
