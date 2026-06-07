import { useState, useEffect } from 'react';
import { fetchPatientWithVisits } from './usePatientProfileQuery';

function usePatientProfile(patientId) {
  const [patient, setPatient] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!patientId) return;
    fetchPatientWithVisits(patientId)
      .then(d => setPatient(d.data))
      .catch(e => setError(e.message))
      .finally(() => setLoading(false));
  }, [patientId]);

  return { patient, loading, error };
}

export default usePatientProfile;
