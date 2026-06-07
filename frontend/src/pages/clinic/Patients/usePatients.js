import { useState, useEffect, useCallback } from 'react';
import { fetchPatients } from './usePatientsQuery';

function usePatients() {
  const [patients, setPatients] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  const load = useCallback((q) => {
    setLoading(true);
    fetchPatients(q).then(d => setPatients(d.data)).catch(() => {}).finally(() => setLoading(false));
  }, []);

  useEffect(() => { load(''); }, [load]);

  useEffect(() => {
    const t = setTimeout(() => load(search), 350);
    return () => clearTimeout(t);
  }, [search, load]);

  return { patients, search, setSearch, loading };
}

export default usePatients;
