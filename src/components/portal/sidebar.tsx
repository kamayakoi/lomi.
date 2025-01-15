import { useState, useMemo } from 'react'
import { IconMenu2, IconX } from '@tabler/icons-react'
import { Layout } from '@/components/custom/layout'
import { Button } from '@/components/custom/button'
import Nav from './nav'
import { cn } from '@/lib/actions/utils'
import { useSidelinks, type SidebarItem } from '../../utils/data/sidelinks'
import { useTheme } from '@/lib/hooks/useTheme'
import iconLight from "/transparent2.webp"
import iconDark from "/transparent.webp"
import { Separator } from "@/components/ui/separator"
import { useActivationStatus } from '@/lib/hooks/useActivationStatus'
import { useSidebar } from '@/lib/hooks/useSidebar'
import { useTranslation } from 'react-i18next'

type SidebarProps = React.HTMLAttributes<HTMLElement>

export default function Sidebar({ className }: SidebarProps) {
  const [navOpened, setNavOpened] = useState(false)
  const { theme, setTheme } = useTheme()
  const { isActivated } = useActivationStatus()
  const { sidebarData } = useSidebar()
  const sidelinks = useSidelinks()
  const { t } = useTranslation()

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

  return (
    <>
      {/* Mobile Header - Always visible */}
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
          // Mobile: full height minus header height, and slide from left
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
          {sidebarData.merchantName && (
            <div className="mt-auto hidden border-t border-border/40 px-4 py-4 md:block">
              <div className="flex items-center space-x-3">
                {sidebarData.organizationLogo ? (
                  <img
                    src={sidebarData.organizationLogo}
                    alt="Organization logo"
                    className="h-[36px] w-[36px] rounded-[5px] border-6 border-transparent cursor-pointer transition-transform duration-200 hover:scale-105"
                    onClick={toggleTheme}
                  />
                ) : (
                  <img
                    src={`https://avatar.vercel.sh/${encodeURIComponent(sidebarData.merchantName.toLowerCase())}?rounded=5`}
                    alt="Generated avatar"
                    className="h-[36px] w-[36px] rounded-[5px] border-6 border-transparent cursor-pointer transition-transform duration-200 hover:scale-105"
                    onClick={toggleTheme}
                  />
                )}
                <div className="min-w-0 flex-1">
                  <div className="truncate text-sm font-medium">
                    {sidebarData.merchantName}
                  </div>
                  <div className="truncate text-xs text-muted-foreground">
                    {sidebarData.merchantRole} • {sidebarData.organizationName}
                  </div>
                </div>
              </div>
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
    </>
  )
}