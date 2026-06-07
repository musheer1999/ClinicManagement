import { useState, useEffect } from 'react';
import { fetchVisit } from './useVisitDetailQuery';

function useVisitDetail(visitId) {
  const [visit, setVisit] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!visitId) return;
    fetchVisit(visitId).then(d => setVisit(d.data)).catch(e => setError(e.message)).finally(() => setLoading(false));
  }, [visitId]);

  return { visit, loading, error };
}

export default useVisitDetail;
