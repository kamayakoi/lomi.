import { Link, useLocation } from 'react-router-dom'
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible'
import { cn } from '@/lib/actions/utils'
import { SideLink, SidebarItem } from '@/lib/data/sidelinks.tsx'
import { motion, AnimatePresence } from 'framer-motion'
import { useState } from 'react'
import { ChevronDown, ChevronRight } from 'lucide-react'

interface NavProps extends React.HTMLAttributes<HTMLDivElement> {
  links: SidebarItem[]
  closeNav: () => void
}

interface NavLinkProps extends SideLink {
  subLink?: boolean
  closeNav: () => void
}

function getIconColorClass(icon: JSX.Element | undefined) {
  if (!icon || !icon.props || !icon.props.className) return 'primary'
  const className = icon.props.className
  const colorMatch = className.match(/text-([a-z-]+)-\d+/)
  return colorMatch ? colorMatch[1] : 'primary'
}

function NavLink({ href, title, icon, label, subLink = false, closeNav }: NavLinkProps) {
  const location = useLocation()
  const isSettingsLink = href.startsWith('/portal/settings')
  const isActive = isSettingsLink
    ? location.pathname.startsWith('/portal/settings')
    : location.pathname === href
  const iconColor = getIconColorClass(icon)

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
          'group relative flex h-8 w-full items-center gap-2 px-3 text-[13px] font-medium transition-all duration-200',
          subLink && 'border-l border-l-[hsl(var(--sidebar-border))]/50',
          isActive
            ? `text-${iconColor} before:absolute before:right-0 before:top-0 before:h-full before:w-1 before:bg-${iconColor} before:opacity-100 before:transition-all before:duration-200`
            : `text-[hsl(var(--sidebar-foreground))]/80 hover:text-${iconColor} before:absolute before:right-0 before:top-0 before:h-full before:w-1 before:bg-${iconColor} before:opacity-0 hover:before:opacity-50 before:transition-all before:duration-200`,
          'hover:bg-[hsl(var(--sidebar-accent))]/10 rounded-sm'
        )}
      >
        <div className='scale-[0.85]'>{icon}</div>
        <span className="truncate">{title}</span>
        {label && (
          <div className={cn('ml-auto rounded px-1.5 py-0.5 text-[10px] font-medium', `bg-${iconColor}/10`, `text-${iconColor}`)}>
            {label}
          </div>
        )}
      </Link>
    </motion.div>
  )
}

function NavSection({ title, links, closeNav }: { title: string; links: SideLink[]; closeNav: () => void }) {
  const [isOpen, setIsOpen] = useState(true)
  const location = useLocation()
  const hasActiveLink = links.some(link => {
    const isSettingsLink = link.href.startsWith('/portal/settings')
    return isSettingsLink
      ? location.pathname.startsWith('/portal/settings')
      : location.pathname === link.href
  })

  return (
    <Collapsible defaultOpen={hasActiveLink || isOpen} onOpenChange={setIsOpen}>
      <CollapsibleTrigger className="flex w-full items-center justify-between px-3 py-1.5 text-xs font-medium uppercase tracking-wider text-[hsl(var(--sidebar-foreground))]/90 hover:text-[hsl(var(--sidebar-foreground))] transition-colors duration-200">
        <span>{title}</span>
        {isOpen ? <ChevronDown className="h-3.5 w-3.5 transition-transform duration-200" /> : <ChevronRight className="h-3.5 w-3.5 transition-transform duration-200" />}
      </CollapsibleTrigger>
      <CollapsibleContent className="space-y-0.5 overflow-hidden transition-all duration-200 data-[state=closed]:animate-collapsible-up data-[state=open]:animate-collapsible-down">
        <div className="pt-1 pb-0.5">
          {links.map((link) => (
            <NavLink key={link.href} {...link} closeNav={closeNav} />
          ))}
        </div>
      </CollapsibleContent>
    </Collapsible>
  )
}

export default function Nav({ links, closeNav, className, ...props }: NavProps) {
  const currentLinks = links.reduce<{ title: string; links: SideLink[] }[]>((acc, item) => {
    if ('type' in item && item.type === 'section') {
      acc.push({ title: item.title, links: [] })
    } else if (!('type' in item)) {
      const lastSection = acc[acc.length - 1]
      if (!lastSection) {
        acc.push({ title: 'Main', links: [item] })
      } else {
        lastSection.links.push(item)
      }
    }
    return acc
  }, [])

  return (
    <nav className={cn('space-y-3', className)} {...props}>
      <AnimatePresence>
        {currentLinks.map((section, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2, delay: index * 0.05 }}
          >
            <NavSection {...section} closeNav={closeNav} />
          </motion.div>
        ))}
      </AnimatePresence>
    </nav>
  )
}