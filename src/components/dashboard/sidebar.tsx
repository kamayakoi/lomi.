import { useState, useMemo } from 'react'
import { IconMenu2, IconX } from '@tabler/icons-react'
import { Layout } from '@/components/custom/layout'
import { Button } from '@/components/custom/button'
import Nav from './nav'
import { cn } from '@/lib/actions/utils'
import { sidelinks } from '../../utils/data/sidelinks'
import { useTheme } from '@/lib/hooks/useTheme'
import iconLight from "/transparent2.webp"
import iconDark from "/icon_dark.webp"
import { Separator } from "@/components/ui/separator"
import { useActivationStatus } from '@/lib/hooks/useActivationStatus'
import { useSidebar } from '@/lib/hooks/useSidebar'
// import { CommandPalette } from '@/components/dashboard/command-palette'

type SidebarProps = React.HTMLAttributes<HTMLElement>

export default function Sidebar({ className }: SidebarProps) {
  const [navOpened, setNavOpened] = useState(false)
  const { theme, setTheme } = useTheme()
  const { isActivated } = useActivationStatus()
  const { sidebarData } = useSidebar()

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
  };

  const filteredLinks = useMemo(() => {
    return sidelinks.filter((link) => {
      if ('condition' in link) {
        return link.condition === 'isActivationRequired' ? !isActivated : true;
      }
      return true;
    });
  }, [isActivated]);

  return (
    <aside
      className={cn(
        `fixed left-0 right-0 top-0 z-50 w-full border-r-[1.25px] border-gray-200 dark:border-gray-700 transition-[width] md:bottom-0 md:right-auto md:h-svh md:w-64`,
        className
      )}
    >
      {/* Overlay in mobile */}
      <div
        onClick={() => setNavOpened(false)}
        className={`absolute inset-0 transition-[opacity] delay-100 duration-700 ${navOpened ? 'h-svh opacity-50' : 'h-0 opacity-0'} w-full bg-black md:hidden`}
      />

      <Layout fixed className={navOpened ? 'h-svh' : ''}>
        {/* Header */}
        <Layout.Header
          sticky
          className='z-50 flex justify-between px-4 py-3 md:px-4'
        >
          <a href="#" className="flex items-center gap-2">
            <div className="flex items-center justify-center h-[40px] w-[40px] rounded border-6 border-transparent">
              <img
                src={theme === 'dark' ? iconDark : iconLight}
                alt="lomi. Logo"
                className="object-contain h-full w-full"
                onClick={toggleTheme}
              />
            </div>
            <div className="flex flex-col justify-center truncate visible w-auto">
              <span className='font-medium leading-tight'>lomi.</span>
              <span className='text-xs leading-tight'>Control Portal</span>
            </div>
          </a>

          {/* Toggle Button in mobile */}
          <Button
            variant='ghost'
            size='icon'
            className='md:hidden'
            aria-label='Toggle Navigation'
            aria-controls='sidebar-menu'
            aria-expanded={navOpened}
            onClick={() => setNavOpened((prev) => !prev)}
          >
            {navOpened ? <IconX /> : <IconMenu2 />}
          </Button>
        </Layout.Header>

        <Separator className="my-0 border-t-[1.25px] border-gray-200 dark:border-gray-700" />

        {/* Navigation links */}
        <Nav
          id='sidebar-menu'
          className={`z-40 h-full flex-1 overflow-auto scrollbar-hide ${navOpened ? 'max-h-screen' : 'max-h-0 py-0 md:max-h-screen md:py-1'}`}
          closeNav={() => setNavOpened(false)}
          links={filteredLinks}
        />

        {/* Command Palette
        <div className="px-4 py-2">
          <CommandPalette />
        </div> */}

        {/* Organization info */}
        {sidebarData.merchantName && (
          <div className={`mt-auto px-4 py-4 hidden md:block`}>
            <Separator className="mb-4" />
            <div className="flex items-center space-x-4">
              {sidebarData.organizationLogo ? (
                <img
                  src={sidebarData.organizationLogo}
                  alt="Organization logo"
                  className="h-[40px] w-[40px] rounded border-6 border-transparent cursor-pointer"
                  onClick={toggleTheme}
                />
              ) : (
                <div className="h-[38px] w-[38px] rounded-full bg-muted flex items-center justify-center cursor-pointer" onClick={toggleTheme}>
                  <span className="text-xl font-semibold uppercase text-muted-foreground">
                    {sidebarData.merchantName[0]}
                  </span>
                </div>
              )}
              <div>
                <div className="text-sm font-semibold text-foreground">
                  {sidebarData.merchantName}
                </div>
                <div className="text-xs text-muted-foreground">
                  {sidebarData.merchantRole} • {sidebarData.organizationName}
                </div>
              </div>
            </div>
          </div>
        )}
      </Layout>

      {/* CSS to hide scrollbar */}
      <style>{`
        /* Hide scrollbar for Chrome, Safari and Opera */
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }

        /* Hide scrollbar for IE, Edge and Firefox */
        .scrollbar-hide {
          -ms-overflow-style: none;  /* IE and Edge */
          scrollbar-width: none;  /* Firefox */
        }
      `}</style>
    </aside>
  )
}