// src/hooks/useFetch.ts
import { useEffect, useState } from 'react';
import { apiGet } from '../services/api';

export function useFetch<T = any>(path: string | null) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!path) return;
    let mounted = true;
    setLoading(true);
    apiGet(path)
      .then(res => { if (mounted) setData(res); })
      .catch(err => { if (mounted) setError(err); })
      .finally(() => { if (mounted) setLoading(false); });
    return () => { mounted = false; };
  }, [path]);

  return { data, loading, error };
}
