import { useUser } from '@/lib/useUser';
import { useNavigate } from 'react-router-dom';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
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
import { useEffect, useState } from 'react';

export function UserNav() {
  const { user } = useUser();
  const navigate = useNavigate();
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);

  useEffect(() => {
    const fetchAvatar = async () => {
      if (user) {
        const cachedAvatarUrl = localStorage.getItem(`avatarUrl_${user.id}`);
        if (cachedAvatarUrl) {
          setAvatarUrl(cachedAvatarUrl);
        } else {
          const { data: avatarPath, error: avatarError } = await supabase
            .rpc('fetch_user_avatar', { p_user_id: user.id });

          if (avatarError) {
            console.error('Error fetching avatar URL:', avatarError);
          } else {
            if (avatarPath) {
              const { data: avatarData, error: downloadError } = await supabase
                .storage
                .from('avatars')
                .download(avatarPath);

              if (downloadError) {
                console.error('Error downloading avatar:', downloadError);
              } else {
                const url = URL.createObjectURL(avatarData);
                setAvatarUrl(url);
                localStorage.setItem(`avatarUrl_${user.id}`, url);
              }
            }
          }
        }
      }
    };

    fetchAvatar();
  }, [user]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/');
  };

  const getInitials = (name: string) => {
    return name.split(' ').map((n) => n[0]).join('').toUpperCase();
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
                alt={user.email || ''}
                className="h-full w-full rounded-full"
                loading="lazy"
              />
            ) : (
              <AvatarFallback className="h-full w-full rounded-full flex items-center justify-center text-lg font-semibold uppercase">
                {user.email ? getInitials(user.email) : ''}
              </AvatarFallback>
            )}
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className='w-56' align='end' forceMount>
        <DropdownMenuLabel className='font-normal'>
          <div className='flex flex-col space-y-1'>
            <p className='text-sm font-medium leading-none'>{user?.user_metadata['full_name']}</p>
            <p className='text-xs leading-none text-muted-foreground'>
              {user?.email}
            </p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem onClick={() => navigate('/portal/settings/profile')}>
            Settings
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => navigate('/portal/settings/billing/statements')}>
            Billing
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => navigate('')}>
            Support
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => navigate('')}>
            Developers
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleLogout}>
          Log out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}