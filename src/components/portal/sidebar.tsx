import { useState, useMemo } from 'react'
import { IconMenu2, IconX } from '@tabler/icons-react'
import { Layout } from '@/components/custom/layout'
import { Button } from '@/components/custom/button'
import Nav from './sidebar-nav'
import { cn } from '@/lib/actions/utils'
import { useSidelinks, type SidebarItem } from '../../lib/data/sidelinks'
import { useTheme } from '@/lib/hooks/use-theme'
import iconLight from "/company/transparent_dark.webp"
import iconDark from "/company/transparent.webp"
import { Separator } from "@/components/ui/separator"
import { useActivationStatus } from '@/lib/hooks/use-activation-status'
import { useTranslation } from 'react-i18next'
import { OrgSwitcher } from './org-switcher'
import { SidebarActionButton } from './sidebar-action-button'

type SidebarProps = React.HTMLAttributes<HTMLElement>

export default function Sidebar({ className }: SidebarProps) {
  const [navOpened, setNavOpened] = useState(false)
  const { theme, setTheme } = useTheme()
  const { isActivated } = useActivationStatus()
  const { t } = useTranslation()

  const sidelinks = useSidelinks()

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
      <header className="fixed top-0 left-0 right-0 z-50 flex h-16 items-center justify-between border-b border-[hsl(var(--sidebar-border))]/40 bg-[hsl(var(--sidebar-background))] px-4 md:hidden">
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
            <span className='text-xs font-medium text-[hsl(var(--sidebar-foreground))]/60'>
              {t('portal.brand.control_portal')}
            </span>
          </div>
        </a>

        <Button
          variant='ghost'
          size='icon'
          className='hover:bg-[hsl(var(--sidebar-accent))] hover:text-[hsl(var(--sidebar-accent-foreground))]'
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
          `fixed z-40 bg-sidebar backdrop-blur supports-[backdrop-filter]:bg-sidebar/60
           border-r-[1.25px] border-sidebar-border shadow-lg transition-all duration-300 ease-in-out
           rounded-tl-xl rounded-br-xl
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
            'fixed inset-0 bg-[hsl(var(--sidebar-background))]/80 backdrop-blur-sm transition-all duration-300',
            navOpened ? 'opacity-100 md:hidden rounded-tl-xl rounded-br-xl' : 'pointer-events-none opacity-0'
          )}
        />

        <Layout fixed className={cn(navOpened ? 'h-full' : '', 'bg-[hsl(var(--sidebar-background))]')}>
          {/* Header - Only visible on desktop */}
          <Layout.Header
            sticky
            className='z-50 hidden items-center justify-between bg-[hsl(var(--sidebar-background))] px-4 py-3 md:flex md:px-4'
          >
            <button
              onClick={toggleTheme}
              className="group flex w-full items-center gap-1.5 rounded-lg px-2 py-1.5 mr-2 -ml-1 transition-all duration-200 hover:bg-[hsl(var(--sidebar-accent))]/20 active:scale-[0.98]"
            >
              <div className="flex h-[36px] w-[36px] items-center justify-center rounded-[5px] bg-[hsl(var(--sidebar-accent))] ring-1 ring-[hsl(var(--sidebar-border))]/50 transition-all duration-200 group-hover:ring-[hsl(var(--sidebar-border))]/70">
                <img
                  src={theme === 'dark' ? iconDark : iconLight}
                  alt={t('portal.brand.name')}
                  className="h-6 w-6 object-contain transition-opacity duration-200 group-hover:opacity-90"
                />
              </div>
              <div className="flex flex-col justify-center gap-0.25">
                <div className="flex items-center">
                  <span className='font-semibold tracking-tight text-[hsl(var(--sidebar-foreground))] transition-colors duration-200 group-hover:text-[hsl(var(--sidebar-foreground))]/90'>{t('portal.brand.name')}</span>
                  <div className="w-[2px] h-[2px] bg-current ml-[1px] transform scale-90 translate-y-[5px]" />
                </div>
                <span className='text-[10px] font-semibold text-emerald-500 transition-colors duration-200'>{t('portal.brand.control_portal')}</span>
              </div>
            </button>
          </Layout.Header>

          <Separator className="my-0 hidden md:block" />

          {/* Mobile header version */}
          <a
            onClick={toggleTheme}
            className="group flex items-center gap-1.5 rounded-lg px-2 py-1.5 transition-all duration-200 hover:bg-[hsl(var(--sidebar-accent))]/20 active:scale-[0.98] md:hidden"
          >
            <div className="flex h-[36px] w-[36px] items-center justify-center rounded-[5px] bg-primary/5 ring-1 ring-border/50 transition-all duration-200 group-hover:ring-border/70">
              <img
                src={theme === 'dark' ? iconDark : iconLight}
                alt={t('portal.brand.name')}
                className="h-6 w-6 object-contain transition-opacity duration-200 group-hover:opacity-90"
              />
            </div>
            <div className="flex flex-col justify-center gap-0.5">
              <div className="flex items-center">
                <span className='font-semibold tracking-tight text-[hsl(var(--sidebar-foreground))] transition-colors duration-200 group-hover:text-[hsl(var(--sidebar-foreground))]/90'>{t('portal.brand.name')}</span>
                <div className="w-[2px] h-[2px] bg-current ml-[1px] transform scale-90 translate-y-8" />
              </div>
              <div className="inline-flex px-1.5 py-0.5 rounded-sm bg-emerald-500/10 border border-emerald-500/20">
                <span className='text-xs font-medium text-emerald-500 transition-colors duration-200'>{t('portal.brand.control_portal')}</span>
              </div>
            </div>
          </a>

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

          {/* Action Buttons */}
          <div className="hidden space-y-0.5 border-t border-[hsl(var(--sidebar-border))]/40 px-2 py-3 md:block">
            <SidebarActionButton variant="website" onClick={() => window.open('https://lomi.africa', '_blank')} />
            <SidebarActionButton variant="developers" onClick={() => window.open('https://developers.lomi.africa/docs/introduction/what-is-lomi', '_blank')} />
            <SidebarActionButton variant="book-call" onClick={() => window.open('https://cal.com/babacar-diop-umkvq2/30min', '_blank')} />
          </div>

          {/* Organization Switcher */}
          <OrgSwitcher />
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
      </aside >
    </>
  );
}