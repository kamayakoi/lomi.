import { Link } from 'react-router-dom'
import { IconChevronDown } from '@tabler/icons-react'
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible'
import { cn } from '@/lib/actions/utils'
import useCheckActiveNav from '@/lib/hooks/use-check-active-nav'
import { SideLink, SidebarItem } from '@/lib/data/sidelinks.tsx'
import { useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'

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
        <motion.div
          key={item.title}
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.2 }}
          className='px-3 py-1.5 text-xs font-semibold uppercase tracking-wide text-[hsl(var(--sidebar-foreground))]/60'
        >
          {item.title}
        </motion.div>
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
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      className={cn(
        'group border-b border-[hsl(var(--sidebar-border))]/50 bg-[hsl(var(--sidebar-background))] py-1.5 transition-[max-height,padding] duration-500 md:border-none',
        className
      )}
    >
      <nav className='grid gap-0.5 px-2'>
        <AnimatePresence>
          {links.map(renderItem)}
        </AnimatePresence>
      </nav>
    </motion.div>
  )
}

interface NavLinkProps extends SideLink {
  subLink?: boolean
  closeNav: () => void
}

function getIconColorClass(icon: JSX.Element): string {
  const className = icon.props.className || '';
  const colorMatch = className.match(/text-([a-z]+-[0-9]+)/);
  return colorMatch ? colorMatch[1] : 'primary';
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
  const iconColor = getIconColorClass(icon);

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.2 }}
    >
      <Link
        to={href}
        onClick={closeNav}
        className={cn(
          'group relative flex h-9 items-center gap-2.5 px-4 text-sm font-medium transition-all duration-300',
          subLink && 'h-8 border-l border-l-[hsl(var(--sidebar-border))]/50 px-3',
          isActive
            ? `text-${iconColor} before:absolute before:right-0 before:top-0 before:h-full before:w-1 before:bg-${iconColor} before:opacity-100 before:transition-all before:duration-300`
            : `text-[hsl(var(--sidebar-foreground))] hover:text-${iconColor} before:absolute before:right-0 before:top-0 before:h-full before:w-1 before:bg-${iconColor} before:opacity-0 hover:before:opacity-50 before:transition-all before:duration-300`,
          'hover:bg-[hsl(var(--sidebar-accent))]/30'
        )}
        aria-current={isActive ? 'page' : undefined}
      >
        <div className='scale-105'>{icon}</div>
        <span>{title}</span>
        {label && (
          <div className={cn('ml-2 rounded-md px-1.5 py-0.5 text-xs font-medium', `bg-${iconColor}`, 'text-white')}>
            {label}
          </div>
        )}
      </Link>
    </motion.div>
  )
}

function NavLinkDropdown({ title, icon, label, sub, closeNav, subLink = false }: NavLinkProps) {
  const { checkActiveNav } = useCheckActiveNav()
  const isChildActive = !!sub?.find((s) => checkActiveNav(s.href) || s.subSub?.some(ss => checkActiveNav(ss.href)))
  const iconColor = getIconColorClass(icon);

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.2 }}
    >
      <Collapsible defaultOpen={isChildActive}>
        <CollapsibleTrigger
          className={cn(
            'group relative flex h-9 w-full items-center gap-2.5 px-4 text-sm font-medium transition-all duration-300',
            subLink && 'h-8 border-l border-l-[hsl(var(--sidebar-border))]/50 px-3',
            isChildActive
              ? `text-${iconColor} before:absolute before:right-0 before:top-0 before:h-full before:w-1 before:bg-${iconColor} before:opacity-100 before:transition-all before:duration-300`
              : `text-[hsl(var(--sidebar-foreground))] hover:text-${iconColor} before:absolute before:right-0 before:top-0 before:h-full before:w-1 before:bg-${iconColor} before:opacity-0 hover:before:opacity-50 before:transition-all before:duration-300`,
            'hover:bg-[hsl(var(--sidebar-accent))]/30'
          )}
        >
          <div className='scale-105'>{icon}</div>
          <span>{title}</span>
          {label && (
            <div className={cn('ml-2 rounded-md px-1.5 py-0.5 text-xs font-medium', `bg-${iconColor}`, 'text-white')}>
              {label}
            </div>
          )}
          <span
            className={cn(
              'ml-auto transition-transform duration-300 group-data-[state="open"]:-rotate-180'
            )}
          >
            <IconChevronDown className="h-4 w-4" stroke={1.5} />
          </span>
        </CollapsibleTrigger>
        <CollapsibleContent className='collapsibleDropdown max-h-[60vh] overflow-y-auto'>
          <motion.ul
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className={cn('mt-0.5 space-y-0.5', subLink ? 'pl-4' : 'pl-6')}
          >
            {sub?.map((sublink) => (
              <motion.li
                key={sublink.title}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.2 }}
              >
                {sublink.subSub ? (
                  <NavLinkDropdown {...sublink} closeNav={closeNav} subLink />
                ) : (
                  <NavLink {...sublink} subLink closeNav={closeNav} />
                )}
              </motion.li>
            ))}
          </motion.ul>
        </CollapsibleContent>
      </Collapsible>
    </motion.div>
  )
}