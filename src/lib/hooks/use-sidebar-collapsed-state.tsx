import { useEffect, useState } from 'react';

interface SidebarCollapsedStateProps<T> {
  key: string;
  defaultValue: T;
}

export default function useSidebarCollapsedState<T>({
  key,
  defaultValue,
}: SidebarCollapsedStateProps<T>) {
  const [value, setValue] = useState<T>(() => {
    const storedValue = localStorage.getItem(key);
    return storedValue !== null ? (JSON.parse(storedValue) as T) : defaultValue;
  });

  useEffect(() => {
    localStorage.setItem(key, JSON.stringify(value));
  }, [value, key]);

  return [value, setValue] as const;
}