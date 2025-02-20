import { useState, useEffect } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { buttonVariants } from '@/components/ui/button-variants'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { cn } from '@/lib/actions/utils'
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible'
import { ChevronDown, ChevronUp } from 'lucide-react'

interface SidebarNavProps extends React.HTMLAttributes<HTMLElement> {
  items: {
    href: string
    title: string
    icon: JSX.Element
    subItems?: { href: string; title: string }[]
    defaultOpen?: boolean
  }[]
}

interface OpenSections {
  [key: string]: boolean;
}

export default function SidebarNav({
  className,
  items,
  ...props
}: SidebarNavProps) {
  const { pathname } = useLocation()
  const navigate = useNavigate()
  const [val, setVal] = useState(pathname ?? '/settings')
  const [openSections, setOpenSections] = useState<OpenSections>({})

  // Initialize and update open sections based on current pathname
  useEffect(() => {
    setOpenSections(prev => items.reduce((acc, item) => ({
      ...acc,
      [item.href]: prev[item.href] !== undefined
        ? prev[item.href]
        : item.subItems?.some(subItem => pathname.startsWith(subItem.href)) || item.defaultOpen || false
    }), {}));
  }, [pathname, items]);

  const handleSelect = (e: string) => {
    setVal(e)
    navigate(e)
  }

  const toggleSection = (href: string) => {
    setOpenSections(prev => ({
      ...prev,  // Preserve all other section states
      [href]: !prev[href]  // Toggle only the clicked section
    }))
  }

  return (
    <>
      <div className='p-1 md:hidden'>
        <Select value={val} onValueChange={handleSelect}>
          <SelectTrigger className='h-12 sm:w-48'>
            <SelectValue placeholder='Theme' />
          </SelectTrigger>
          <SelectContent>
            {items.map((item) => (
              <SelectItem key={item.href} value={item.href}>
                <div className='flex gap-x-4 px-2 py-1'>
                  <span className='scale-125'>{item.icon}</span>
                  <span className='text-md'>{item.title}</span>
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className='hidden w-full overflow-x-auto bg-background px-1 py-2 md:block'>
        <nav
          className={cn(
            'flex flex-col space-y-1',
            className
          )}
          {...props}
        >
          {items.map((item) => (
            <Collapsible key={item.href} open={openSections[item.href]}>
              <CollapsibleTrigger
                className={cn(
                  buttonVariants({ variant: 'ghost' }),
                  'justify-between w-full text-left whitespace-nowrap rounded-none hover:bg-accent hover:text-accent-foreground transition-colors duration-200'
                )}
                onClick={() => toggleSection(item.href)}
              >
                <div className="flex items-center">
                  <span className='mr-2'>{item.icon}</span>
                  {item.title}
                </div>
                {item.subItems && (
                  openSections[item.href] ? <ChevronUp className="h-4 w-4 flex-shrink-0" /> : <ChevronDown className="h-4 w-4 flex-shrink-0" />
                )}
              </CollapsibleTrigger>
              <CollapsibleContent
                className="space-y-1 pl-8 pr-2"
              >
                {item.subItems?.map((subItem) => (
                  <Link
                    key={subItem.href}
                    to={subItem.href}
                    className={cn(
                      buttonVariants({ variant: 'ghost' }),
                      pathname === subItem.href
                        ? 'bg-accent text-accent-foreground rounded-none'
                        : 'hover:bg-accent hover:text-accent-foreground hover:no-underline rounded-none',
                      'justify-start block whitespace-nowrap transition-colors duration-200'
                    )}
                  >
                    {subItem.title}
                  </Link>
                ))}
              </CollapsibleContent>
            </Collapsible>
          ))}
          <div className="h-24" />
        </nav>
      </div>
    </>
  )
}
