import { useContext } from 'react';
import { UserContext } from '@/lib/contexts/user-context';

export const useUser = () => useContext(UserContext);