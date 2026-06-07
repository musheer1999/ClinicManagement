import { useState, useEffect } from 'react';
import { fetchDashboard } from './useDashboardQuery';

function useDashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchDashboard()
      .then(d => setStats(d.data))
      .catch(e => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  return { stats, loading, error };
}

export default useDashboard;
