import { useState, useEffect } from 'react';
import { fetchAllClinics } from './useAdminClinicsQuery';

function useAdminClinics() {
  const [clinics, setClinics] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('All');

  useEffect(() => {
    fetchAllClinics().then(d => setClinics(d.data)).catch(() => {}).finally(() => setLoading(false));
  }, []);

  const filtered = clinics.filter(c => {
    const matchFilter = filter === 'All' || c.subscription_status === filter.toLowerCase();
    const q = search.toLowerCase();
    const matchSearch = !search || c.name.toLowerCase().includes(q) || c.email.toLowerCase().includes(q);
    return matchFilter && matchSearch;
  });

  return { clinics, filtered, loading, search, setSearch, filter, setFilter };
}

export default useAdminClinics;
