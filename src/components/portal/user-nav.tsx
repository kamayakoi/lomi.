import { useUser } from '@/lib/hooks/useUserContext';
import { useNavigate } from 'react-router-dom';
import { Avatar, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/custom/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { supabase } from '@/utils/supabase/client';
import { useUserAvatar } from '@/lib/hooks/useUserAvatar';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

interface PostgresChangePayload {
  new: {
    name?: string;
  };
}

export function UserNav() {
  const { user } = useUser();
  const navigate = useNavigate();
  const { avatarUrl, fetchUserAvatar } = useUserAvatar();
  const { t } = useTranslation();
  const [userName, setUserName] = useState<string>('');

  // Function to fetch merchant name using RPC
  const fetchMerchantName = async (userId: string) => {
    const { data, error } = await supabase
      .rpc('fetch_merchant_details', {
        p_user_id: userId
      });

    if (!error && data?.[0]?.name) {
      setUserName(data[0].name);
    }
  };

  // Initial fetch of merchant name
  useEffect(() => {
    if (user?.id) {
      fetchMerchantName(user.id);
    }
  }, [user?.id]);

  useEffect(() => {
    // Listen for merchant name updates
    const merchantsChannel = supabase
      .channel('merchant_updates')
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'merchants',
          filter: `merchant_id=eq.${user?.id}`,
        },
        (payload: PostgresChangePayload) => {
          if (payload.new?.name) {
            setUserName(payload.new.name);
          }
          fetchUserAvatar();
        }
      )
      .subscribe();

    // Listen for auth state changes to refetch merchant name
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user?.id) {
        fetchMerchantName(session.user.id);
      }
    });

    return () => {
      subscription.unsubscribe();
      supabase.removeChannel(merchantsChannel);
    };
  }, [user?.id, fetchUserAvatar]);

  const handleLogout = async () => {
    window.location.href = '/';
    localStorage.clear();
    await supabase.auth.signOut();
  };

  if (!user) {
    return null;
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-[40px] w-[40px] rounded-full">
          <Avatar className="h-[40px] w-[40px]">
            {avatarUrl ? (
              <AvatarImage
                src={avatarUrl}
                alt={user?.email || ''}
                className="h-full w-full rounded-full"
                loading="lazy"
              />
            ) : (
              <AvatarImage
                src={`https://avatar.vercel.sh/${encodeURIComponent(user?.email?.toLowerCase() || '')}?rounded=60`}
                alt="Generated avatar"
                className="h-full w-full rounded-full"
              />
            )}
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className='w-56' align='end' forceMount sideOffset={13}>
        <DropdownMenuLabel className='font-normal'>
          <div className='flex flex-col space-y-1'>
            <p className='text-sm font-medium leading-none'>{userName}</p>
            <p className='text-xs leading-none text-muted-foreground'>
              {user?.email}
            </p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem onClick={() => navigate('/portal/settings/profile')}>
            {t('portal.user_nav.settings')}
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => navigate('/portal/settings/billing/statements')}>
            {t('portal.user_nav.billing')}
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => navigate('')}>
            {t('portal.user_nav.support')}
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => navigate('')}>
            {t('portal.user_nav.developers')}
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleLogout}>
          {t('portal.user_nav.log_out')}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
