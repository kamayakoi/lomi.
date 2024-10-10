import { useContext } from 'react';
import { UserContext } from '@/lib/contexts/UserContext';

export const useUser = () => useContext(UserContext);