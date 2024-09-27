import { Link } from 'react-router-dom'
import { IconChevronDown } from '@tabler/icons-react'
import { buttonVariants } from '@/components/custom/button'
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible'
import { cn } from '@/lib/utils'
import useCheckActiveNav from '@/lib/hooks/use-check-active-nav'
import { SideLink, SidebarItem } from '../../pages/portal/dashboard/data/sidelinks'
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
          className='px-3 py-1 text-xs font-semibold text-muted-foreground'
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
        'group border-b bg-background py-1 transition-[max-height,padding] duration-500 md:border-none',
        className
      )}
    >
      <nav className='grid gap-1 px-2'>
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
  const isActive = location.pathname === href;

  return (
    <Link
      to={href}
      onClick={closeNav}
      className={cn(
        buttonVariants({
          variant: isActive ? 'secondary' : 'ghost',
          size: 'sm',
        }),
        'h-8 justify-start text-wrap rounded-none px-6',
        subLink && 'h-7 w-full border-l border-l-slate-500 px-2'
      )}
      aria-current={isActive ? 'page' : undefined}
    >
      <div className='mr-2'>{icon}</div>
      {title}
      {label && (
        <div className='ml-2 rounded-lg bg-primary px-1 text-[0.625rem] text-primary-foreground'>
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
          'group h-8 w-full justify-start rounded-none',
          subLink ? 'pl-8' : 'px-6'
        )}
      >
        <div className='mr-2'>{icon}</div>
        {title}
        {label && (
          <div className='ml-2 rounded-lg bg-primary px-1 text-[0.625rem] text-primary-foreground'>
            {label}
          </div>
        )}
        <span
          className={cn(
            'ml-auto transition-all group-data-[state="open"]:-rotate-180'
          )}
        >
          <IconChevronDown stroke={1} />
        </span>
      </CollapsibleTrigger>
      <CollapsibleContent className='collapsibleDropdown max-h-[60vh] overflow-y-auto'>
        <ul className={cn(subLink ? 'pl-4' : 'pl-6')}>
          {sub?.map((sublink) => (
            <li key={sublink.title} className='my-0.5'>
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