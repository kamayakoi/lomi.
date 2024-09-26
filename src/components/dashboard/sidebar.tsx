import { useEffect, useState } from 'react'
import { IconChevronsLeft, IconMenu2, IconX } from '@tabler/icons-react'
import { Layout } from '@/components/custom/layout'
import { Button } from '@/components/custom/button'
import Nav from './nav'
import { cn } from '@/lib/utils'
import { sidelinks } from '../../pages/portal/dashboard/data/sidelinks'
import { useTheme } from '@/lib/useTheme'
import icon from "/icon.png"
import iconDark from "/icon_dark.svg"
import { supabase } from '@/utils/supabase/client'

interface SidebarProps extends React.HTMLAttributes<HTMLElement> {
  isCollapsed: boolean
  setIsCollapsed: React.Dispatch<React.SetStateAction<boolean>>
}

export default function Sidebar({
  className,
  isCollapsed,
  setIsCollapsed,
}: SidebarProps) {
  const [navOpened, setNavOpened] = useState(false)
  const { theme } = useTheme()
  const [organizationName, setOrganizationName] = useState<string | null>(null)

  useEffect(() => {
    const fetchOrganizationName = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (user) {
        const { data, error } = await supabase
          .rpc('fetch_organization_name', { user_id: user.id })

        if (error) {
          console.error('Error fetching organization name:', error)
        } else {
          setOrganizationName(data)
        }
      }
    }

    fetchOrganizationName()
  }, [])

  useEffect(() => {
    if (navOpened) {
      document.body.classList.add('overflow-hidden')
    } else {
      document.body.classList.remove('overflow-hidden')
    }
  }, [navOpened])

  return (
    <aside
      className={cn(
        `fixed left-0 right-0 top-0 z-50 w-full border-r-2 border-r-muted transition-[width] md:bottom-0 md:right-auto md:h-svh ${isCollapsed ? 'md:w-14' : 'md:w-64'}`,
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
          className='z-50 flex justify-between px-4 py-3 shadow-sm md:px-4'
        >
          <a href="/portal" className={`flex items-center ${!isCollapsed ? 'gap-2' : ''}`}>
            <div className={`flex items-center justify-center rounded ${isCollapsed ? 'h-8 w-8 -ml-1' : 'h-10 w-10'}`}>
              <img
                src={theme === 'dark' ? iconDark : icon}
                alt="lomi. Logo"
                className="object-contain h-full w-full"
              />
            </div>
            <div
              className={`flex flex-col justify-center truncate ${isCollapsed ? 'invisible w-0' : 'visible w-auto'}`}
            >
              <span className='font-medium leading-tight'>lomi.</span>
              <span className='text-xs leading-tight'>Portal</span>
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

        {/* Navigation links */}
        <Nav
          id='sidebar-menu'
          className={`z-40 h-full flex-1 overflow-auto ${navOpened ? 'max-h-screen' : 'max-h-0 py-0 md:max-h-screen md:py-1'}`}
          closeNav={() => setNavOpened(false)}
          isCollapsed={isCollapsed}
          links={sidelinks}
        />

        {/* Organization name */}
        {organizationName && !isCollapsed && (
          <div className="px-4 py-2 text-sm font-semibold text-muted-foreground">
            {organizationName}
          </div>
        )}

        {/* Scrollbar width toggle button */}
        <Button
          onClick={() => setIsCollapsed((prev) => !prev)}
          size='icon'
          variant='outline'
          className='absolute -right-5 top-1/2 z-50 hidden rounded-full md:inline-flex'
        >
          <IconChevronsLeft
            stroke={1.5}
            className={`h-5 w-5 ${isCollapsed ? 'rotate-180' : ''}`}
          />
        </Button>
      </Layout>
    </aside>
  )
}