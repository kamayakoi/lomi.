import { useState, useMemo, useEffect } from 'react'
import { IconMenu2, IconX } from '@tabler/icons-react'
import { Layout } from '@/components/custom/layout'
import { Button } from '@/components/custom/button'
import Nav from './nav'
import { cn } from '@/lib/actions/utils'
import { useSidelinks, type SidebarItem } from '../../lib/data/sidelinks'
import { useTheme } from '@/lib/hooks/use-theme'
import iconLight from "/company/transparent_dark.webp"
import iconDark from "/company/transparent.webp"
import { Separator } from "@/components/ui/separator"
import { useActivationStatus } from '@/lib/hooks/use-activation-status'
import { useSidebarData } from '@/lib/hooks/use-sidebar-data'
import { useTranslation } from 'react-i18next'
import { PlusIcon } from 'lucide-react'
import { supabase } from '@/utils/supabase/client'
import { CreateOrganizationDialog } from './create-organization-dialog'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useNavigate } from 'react-router-dom'

type SidebarProps = React.HTMLAttributes<HTMLElement>

interface Organization {
  organization_id: string;
  organization_name: string;
  organization_logo_url: string | null;
  merchant_role: string;
  is_current: boolean;
}

export default function Sidebar({ className }: SidebarProps) {
  const navigate = useNavigate()
  const [navOpened, setNavOpened] = useState(false)
  const [createOrgOpen, setCreateOrgOpen] = useState(false)
  const [organizations, setOrganizations] = useState<Organization[]>([])
  const { theme, setTheme } = useTheme()
  const { isActivated } = useActivationStatus()
  const { sidebarData } = useSidebarData()
  const sidelinks = useSidelinks()
  const { t } = useTranslation()

  useEffect(() => {
    const fetchOrganizations = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;

        const { data, error } = await supabase.rpc('fetch_merchant_organizations', {
          p_merchant_id: user.id
        });

        if (error) throw error;

        const orgs = data.map((org: Organization) => ({
          ...org,
          is_current: Boolean(sidebarData?.organizationId) && org.organization_id === sidebarData?.organizationId
        }));

        setOrganizations(orgs);
      } catch (error) {
        console.error('Error fetching organizations:', error);
      }
    };

    fetchOrganizations();
  }, [sidebarData?.organizationId]);

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
  };

  const filteredLinks = useMemo(() => {
    return sidelinks.filter((link: SidebarItem) => {
      if ('condition' in link) {
        return link.condition === 'isActivationRequired' ? !isActivated : true;
      }
      return true;
    });
  }, [isActivated, sidelinks]);

  const handleOrganizationSwitch = async (orgId: string) => {
    if (orgId === sidebarData?.organizationId) return;

    navigate(`${window.location.pathname}?org=${orgId}`, { replace: true });

    window.location.reload();
  };

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-50 flex h-16 items-center justify-between border-b border-border/40 bg-background/95 px-4 backdrop-blur supports-[backdrop-filter]:bg-background/60 md:hidden">
        <a href="#" className="group flex items-center gap-2.5 transition-transform duration-200 ease-in-out hover:scale-[0.98]">
          <div className="flex h-[36px] w-[36px] items-center justify-center rounded-[5px] bg-primary/5 ring-1 ring-border/50">
            <img
              src={theme === 'dark' ? iconDark : iconLight}
              alt={t('portal.brand.name')}
              className="h-6 w-6 object-contain transition-opacity duration-200 group-hover:opacity-80"
              onClick={toggleTheme}
            />
          </div>
          <div className="flex flex-col justify-center truncate">
            <span className='font-semibold tracking-tight'>{t('portal.brand.name')}</span>
            <span className='text-xs font-medium text-muted-foreground'>{t('portal.brand.control_portal')}</span>
          </div>
        </a>

        <Button
          variant='ghost'
          size='icon'
          className='hover:bg-accent'
          aria-label='Toggle Navigation'
          aria-controls='sidebar-menu'
          aria-expanded={navOpened}
          onClick={() => setNavOpened((prev) => !prev)}
        >
          {navOpened ? <IconX className="h-5 w-5" /> : <IconMenu2 className="h-5 w-5" />}
        </Button>
      </header>

      {/* Sidebar - Hidden on mobile until toggled */}
      <aside
        className={cn(
          `fixed z-40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60
           border-r-[1.25px] border-gray-200 dark:border-gray-700 shadow-sm transition-all duration-300 ease-in-out
           md:bottom-0 md:right-auto md:h-svh md:w-64`,
          'top-16 left-0 right-0 h-[calc(100svh-4rem)] md:top-0',
          navOpened ? 'translate-x-0' : '-translate-x-full md:translate-x-0',
          className
        )}
      >
        {/* Overlay in mobile */}
        <div
          onClick={() => setNavOpened(false)}
          className={cn(
            'fixed inset-0 bg-background/80 backdrop-blur-sm transition-all duration-300',
            navOpened ? 'opacity-100 md:hidden' : 'pointer-events-none opacity-0'
          )}
        />

        <Layout fixed className={navOpened ? 'h-full' : ''}>
          {/* Header - Only visible on desktop */}
          <Layout.Header
            sticky
            className='z-50 hidden items-center justify-between px-4 py-3 md:flex md:px-4'
          >
            <a href="#" className="group flex items-center gap-2.5 transition-transform duration-200 ease-in-out hover:scale-[0.98]">
              <div className="flex h-[36px] w-[36px] items-center justify-center rounded-[5px] bg-primary/5 ring-1 ring-border/50">
                <img
                  src={theme === 'dark' ? iconDark : iconLight}
                  alt={t('portal.brand.name')}
                  className="h-6 w-6 object-contain transition-opacity duration-200 group-hover:opacity-80"
                  onClick={toggleTheme}
                />
              </div>
              <div className="flex flex-col justify-center truncate">
                <span className='font-semibold tracking-tight'>{t('portal.brand.name')}</span>
                <span className='text-xs font-medium text-muted-foreground'>{t('portal.brand.control_portal')}</span>
              </div>
            </a>
          </Layout.Header>

          <Separator className="my-0 hidden md:block" />

          {/* Navigation links */}
          <Nav
            id='sidebar-menu'
            className={cn(
              'z-40 h-full flex-1 overflow-auto px-2 py-2 scrollbar-hide transition-all duration-300',
              navOpened ? 'max-h-[calc(100vh-4rem)]' : 'max-h-0 py-0 md:max-h-screen md:py-2'
            )}
            closeNav={() => setNavOpened(false)}
            links={filteredLinks}
          />

          {/* Organization info */}
          {sidebarData?.merchantName && (
            <div className="relative">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="mt-auto hidden w-full border-t border-border/40 px-4 py-4 md:block hover:bg-accent/30 transition-all duration-200 focus:outline-none focus-visible:outline-none">
                    <div className="flex items-center space-x-3">
                      {sidebarData.organizationLogo ? (
                        <div className="flex h-[36px] w-[36px] items-center justify-center rounded-[5px] bg-primary/5 ring-1 ring-border/50 overflow-hidden transition-all duration-200">
                          <img
                            src={sidebarData.organizationLogo}
                            alt="Organization logo"
                            className="h-full w-full object-cover"
                            onError={(e) => {
                              const target = e.target as HTMLImageElement;
                              target.onerror = null; // Prevent infinite loop
                              target.src = `https://avatar.vercel.sh/${encodeURIComponent(sidebarData.merchantName?.toLowerCase() || 'org')}?rounded=5`;
                            }}
                          />
                        </div>
                      ) : (
                        <div className="flex h-[36px] w-[36px] items-center justify-center rounded-[5px] bg-primary/5 ring-1 ring-border/50 overflow-hidden transition-all duration-200">
                          <img
                            src={`https://avatar.vercel.sh/${encodeURIComponent(sidebarData.merchantName.toLowerCase())}?rounded=5`}
                            alt="Generated avatar"
                            className="h-full w-full object-cover"
                          />
                        </div>
                      )}
                      <div className="min-w-0 flex-1 text-left">
                        <div className="truncate text-sm font-medium">
                          {sidebarData.merchantName}
                        </div>
                        <div className="truncate text-xs text-muted-foreground/80">
                          {sidebarData.merchantRole} • {sidebarData.organizationName}
                        </div>
                      </div>
                    </div>
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  className="w-64 p-2 rounded-[5px] border-border/40 bg-background/80 backdrop-blur-sm"
                  align="start"
                  sideOffset={1}
                >
                  <div className="space-y-1">
                    <button
                      onClick={() => setCreateOrgOpen(true)}
                      className="w-full flex items-center space-x-3 p-2 hover:bg-accent/30 transition-all duration-200 rounded-[5px] group"
                    >
                      <div className="flex h-[36px] w-[36px] items-center justify-center rounded-[5px] bg-primary/10 ring-1 ring-primary/20 group-hover:ring-primary/30 group-hover:bg-primary/20 transition-all duration-200">
                        <PlusIcon className="h-4 w-4 text-primary" />
                      </div>
                      <div className="min-w-0 flex-1 text-left">
                        <div className="truncate text-sm font-medium text-primary">
                          Create
                        </div>
                      </div>
                    </button>

                    {organizations.map((org) => (
                      <button
                        key={org.organization_id}
                        onClick={() => {
                          if (!org.is_current) {
                            handleOrganizationSwitch(org.organization_id);
                          }
                        }}
                        className={cn(
                          "w-full flex items-center space-x-3 p-2 hover:bg-accent/30 transition-all duration-200 rounded-[5px] group focus:outline-none focus-visible:outline-none",
                          org.is_current && "bg-accent/20"
                        )}
                      >
                        <div className="h-[36px] w-[36px] rounded-[5px] bg-primary/5 ring-1 ring-border/50 group-hover:ring-border/70 transition-all duration-200 overflow-hidden">
                          {org.organization_logo_url ? (
                            <img
                              src={(() => {
                                const logoPath = org.organization_logo_url.includes('https://')
                                  ? org.organization_logo_url.split('/logos/').pop()
                                  : org.organization_logo_url;
                                return supabase.storage.from('logos').getPublicUrl(logoPath || '').data.publicUrl;
                              })()}
                              alt={org.organization_name}
                              className="h-full w-full object-cover"
                              onError={(e) => {
                                const target = e.target as HTMLImageElement;
                                target.onerror = null; // Prevent infinite loop
                                target.src = `https://avatar.vercel.sh/${encodeURIComponent(org.organization_name?.toLowerCase() || 'org')}?rounded=5`;
                              }}
                            />
                          ) : (
                            <img
                              src={`https://avatar.vercel.sh/${encodeURIComponent(org.organization_name.toLowerCase())}?rounded=5`}
                              alt={org.organization_name}
                              className="h-full w-full object-cover"
                            />
                          )}
                        </div>
                        <div className="min-w-0 flex-1 text-left">
                          <div className="truncate text-sm font-medium">
                            {org.organization_name}
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          )}
        </Layout>

        <style>{`
          .scrollbar-hide::-webkit-scrollbar {
            display: none;
          }
          .scrollbar-hide {
            -ms-overflow-style: none;
            scrollbar-width: none;
          }
        `}</style>
      </aside>

      <CreateOrganizationDialog
        open={createOrgOpen}
        onOpenChange={setCreateOrgOpen}
      />
    </>
  )
}