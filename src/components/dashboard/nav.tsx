import { Link } from 'react-router-dom'
import { IconChevronDown } from '@tabler/icons-react'
import { buttonVariants } from '@/components/custom/button'
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible'
import { cn } from '@/lib/actions/utils'
import useCheckActiveNav from '@/lib/hooks/use-check-active-nav'
import { SideLink, SidebarItem } from '@/utils/data/sidelinks'
import { useLocation } from 'react-router-dom'

interface NavProps extends React.HTMLAttributes<HTMLDivElement> {
  links: SidebarItem[]
  closeNav: () => void
}

export default function Nav({
  links,
  className,
  closeNav,
}: NavProps) {
  const renderItem = (item: SidebarItem) => {
    if ('type' in item && item.type === 'section') {
      return (
        <div
          key={item.title}
          className='px-3 py-1.5 text-xs font-semibold uppercase tracking-wide text-muted-foreground'
        >
          {item.title}
        </div>
      )
    }

    const { sub, ...rest } = item as SideLink
    const key = `${rest.title}-${rest.href}`

    if (sub)
      return (
        <NavLinkDropdown {...rest} sub={sub} key={key} closeNav={closeNav} />
      )

    return <NavLink {...rest} key={key} closeNav={closeNav} />
  }

  return (
    <div
      className={cn(
        'group border-b bg-background py-1.5 transition-[max-height,padding] duration-500 md:border-none',
        className
      )}
    >
      <nav className='grid gap-0.5 px-2'>
        {links.map(renderItem)}
      </nav>
    </div>
  )
}

interface NavLinkProps extends SideLink {
  subLink?: boolean
  closeNav: () => void
}

function NavLink({
  title,
  icon,
  label,
  href,
  closeNav,
  subLink = false,
}: NavLinkProps) {
  const location = useLocation();
  const isSettingsLink = href.startsWith('/portal/settings');
  const isActive = isSettingsLink
    ? location.pathname.startsWith('/portal/settings')
    : location.pathname === href;

  return (
    <Link
      to={href}
      onClick={closeNav}
      className={cn(
        buttonVariants({
          variant: isActive ? 'secondary' : 'ghost',
          size: 'sm',
        }),
        'h-9 justify-start text-wrap rounded-none px-4',
        subLink && 'h-8 w-full border-l border-l-border/50 px-3',
        'hover:bg-accent/50 transition-colors duration-200'
      )}
      aria-current={isActive ? 'page' : undefined}
    >
      <div className='mr-2.5 scale-105'>{icon}</div>
      <span className="font-medium">{title}</span>
      {label && (
        <div className='ml-2 rounded-md bg-primary px-1.5 py-0.5 text-xs font-medium text-primary-foreground'>
          {label}
        </div>
      )}
    </Link>
  )
}

function NavLinkDropdown({ title, icon, label, sub, closeNav, subLink = false }: NavLinkProps) {
  const { checkActiveNav } = useCheckActiveNav()

  const isChildActive = !!sub?.find((s) => checkActiveNav(s.href) || s.subSub?.some(ss => checkActiveNav(ss.href)))

  return (
    <Collapsible defaultOpen={isChildActive}>
      <CollapsibleTrigger
        className={cn(
          buttonVariants({ variant: 'ghost', size: 'sm' }),
          'group h-9 w-full justify-start rounded-none hover:bg-accent/50',
          subLink ? 'pl-6' : 'px-4'
        )}
      >
        <div className='mr-2.5 scale-105'>{icon}</div>
        <span className="font-medium">{title}</span>
        {label && (
          <div className='ml-2 rounded-md bg-primary px-1.5 py-0.5 text-xs font-medium text-primary-foreground'>
            {label}
          </div>
        )}
        <span
          className={cn(
            'ml-auto transition-transform duration-200 group-data-[state="open"]:-rotate-180'
          )}
        >
          <IconChevronDown className="h-4 w-4" stroke={1.5} />
        </span>
      </CollapsibleTrigger>
      <CollapsibleContent className='collapsibleDropdown max-h-[60vh] overflow-y-auto'>
        <ul className={cn('mt-0.5 space-y-0.5', subLink ? 'pl-4' : 'pl-6')}>
          {sub?.map((sublink) => (
            <li key={sublink.title}>
              {sublink.subSub ? (
                <NavLinkDropdown {...sublink} closeNav={closeNav} subLink />
              ) : (
                <NavLink {...sublink} subLink closeNav={closeNav} />
              )}
            </li>
          ))}
        </ul>
      </CollapsibleContent>
    </Collapsible>
  )
}