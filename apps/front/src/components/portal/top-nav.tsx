import { cn } from '@/lib/actions/utils'
import { Link, useParams } from 'react-router-dom'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Button } from '@/components/custom/button'
import { IconMenu } from '@tabler/icons-react'
import { useTranslation } from 'react-i18next'

interface TopNavProps extends React.HTMLAttributes<HTMLElement> {
  links: {
    title: string
    href: string
    isActive: boolean
  }[]
}

export function TopNav({ className, links, ...props }: TopNavProps) {
  const { t } = useTranslation()
  const { organizationId } = useParams()

  const getOrgAwareHref = (href: string) => {
    if (!organizationId) return href
    return href.replace('/portal/', `/portal/${organizationId}/`)
  }

  return (
    <>
      <div className='md:hidden'>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button size='icon' variant='outline'>
              <IconMenu />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent side='bottom' align='start'>
            {links.map(({ title, href, isActive }) => (
              <DropdownMenuItem key={`${title}-${href}`} asChild>
                <Link
                  to={getOrgAwareHref(href)}
                  className={!isActive ? 'text-muted-foreground' : ''}
                >
                  {t(`portal.top_nav.${title.toLowerCase()}`)}
                </Link>
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <nav
        className={cn(
          'hidden items-center space-x-4 md:flex lg:space-x-6',
          className
        )}
        {...props}
      >
        {links.map(({ title, href, isActive }) => (
          <Link
            key={`${title}-${href}`}
            to={getOrgAwareHref(href)}
            className={`text-sm font-medium transition-colors hover:text-primary ${isActive ? '' : 'text-muted-foreground'}`}
          >
            {t(`portal.top_nav.${title.toLowerCase()}`)}
          </Link>
        ))}
      </nav>
    </>
  )
}
