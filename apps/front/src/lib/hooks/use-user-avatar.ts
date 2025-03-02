import { useContext } from 'react';
import { UserAvatarContext } from '../contexts/user-avatar-context';

export const useUserAvatar = () => {
    const context = useContext(UserAvatarContext);
    if (!context) {
        throw new Error('useUserAvatar must be used within a UserAvatarProvider');
    }
    return context;
};
