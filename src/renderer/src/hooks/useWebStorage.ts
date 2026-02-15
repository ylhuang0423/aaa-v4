import { useState, useCallback } from 'react';

type StorageType = 'local' | 'session';

const storageMap: Record<StorageType, Storage> = {
  local: localStorage,
  session: sessionStorage,
};

export default function useWebStorage<T>(
  type: StorageType,
  key: string,
  defaultValue: T,
): [T, (value: T | ((prev: T) => T)) => void] {
  const storage = storageMap[type];

  const [stored, setStored] = useState<T>(() => {
    const item = storage.getItem(key);
    if (item === null) return defaultValue;
    try {
      return JSON.parse(item) as T;
    } catch {
      return defaultValue;
    }
  });

  const setValue = useCallback(
    (value: T | ((prev: T) => T)) => {
      setStored(prev => {
        const next = value instanceof Function ? value(prev) : value;
        storage.setItem(key, JSON.stringify(next));
        return next;
      });
    },
    [key, storage],
  );

  return [stored, setValue];
}
