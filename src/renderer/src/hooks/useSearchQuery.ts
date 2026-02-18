import { useCallback } from 'react';
import { useSearchParams } from 'react-router';

export default function useSearchQuery(): {
  query: string;
  setQuery: (q: string) => void;
  clearQuery: () => void;
} {
  const [searchParams, setSearchParams] = useSearchParams();
  const query = searchParams.get('q') ?? '';

  const setQuery = useCallback(
    (q: string) => {
      const trimmed = q.trim();
      if (trimmed) {
        setSearchParams({ q: trimmed });
      } else {
        setSearchParams({});
      }
    },
    [setSearchParams],
  );

  const clearQuery = useCallback(() => {
    setSearchParams({});
  }, [setSearchParams]);

  return { query, setQuery, clearQuery };
}
