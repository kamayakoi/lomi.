import { useEffect, useState } from 'react';
import { useUser } from './use-user'; // Import the useUser hook

export function useLocalStorage<T>(key: string, initialValue: T): [T, (value: T | ((prevValue: T) => T)) => void] {
    const { user } = useUser(); // Get the current user from the useUser hook
    const userId = user?.id || ''; // Get the user ID or an empty string if user is null

    const userSpecificKey = `${userId}_${key}`; // Create a user-specific storage key

    const [storedValue, setStoredValue] = useState<T>(() => {
        try {
            const item = window.localStorage.getItem(userSpecificKey);
            return item ? JSON.parse(item) : initialValue;
        } catch (error) {
            return initialValue;
        }
    });

    useEffect(() => {
        try {
            const valueToStore = typeof storedValue === 'function' ? storedValue(storedValue) : storedValue;
            window.localStorage.setItem(userSpecificKey, JSON.stringify(valueToStore));
        } catch (error) {
            console.log(error);
        }
    }, [userSpecificKey, storedValue]);

    return [storedValue, setStoredValue];
}
