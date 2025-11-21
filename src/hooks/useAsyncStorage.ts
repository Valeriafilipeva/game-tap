// src/hooks/useAsyncStorage.ts
import { useEffect, useState } from 'react';
import { getItem, setItem } from '../services/storage';

export function useAsyncStorage<T>(key: string, initial: T) {
  const [state, setState] = useState<T>(initial);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const stored = await getItem(key);
        if (mounted && stored !== null) setState(stored);
      } catch (e) { /* ignore */ }
      finally { if (mounted) setLoading(false); }
    })();
    return () => { mounted = false; };
  }, [key]);

  const save = async (v: T) => {
    setState(v);
    await setItem(key, v);
  };

  return { state, setState: save, loading };
}
