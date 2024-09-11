import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { buttonVariants } from '@/components/custom/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { cn } from '@/lib/utils'
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible'
import { ChevronDown } from 'lucide-react'

interface SidebarNavProps extends React.HTMLAttributes<HTMLElement> {
  items: {
    href: string
    title: string
    icon: JSX.Element
    subItems?: { href: string; title: string }[]
    defaultOpen?: boolean
  }[]
}

export default function SidebarNav({
  className,
  items,
  ...props
}: SidebarNavProps) {
  const { pathname } = useLocation()
  const navigate = useNavigate()
  const [val, setVal] = useState(pathname ?? '/settings')

  const handleSelect = (e: string) => {
    setVal(e)
    navigate(e)
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
            <Collapsible key={item.href} open={item.defaultOpen}>
              <CollapsibleTrigger className={cn(
                buttonVariants({ variant: 'ghost' }),
                'justify-between w-full'
              )}>
                <div className="flex items-center">
                  <span className='mr-2'>{item.icon}</span>
                  {item.title}
                </div>
                {item.subItems && (
                  <ChevronDown className="h-4 w-4" />
                )}
              </CollapsibleTrigger>
              <CollapsibleContent
                style={{
                  overflowY: 'auto',
                  overflowX: 'hidden',
                  whiteSpace: 'normal', // Allow text to wrap
                }}
                className="space-y-1 pl-4 pr-2"
              >
                {item.subItems?.map((subItem) => (
                  <Link
                    key={subItem.href}
                    to={subItem.href}
                    className={cn(
                      buttonVariants({ variant: 'ghost' }),
                      pathname === subItem.href
                        ? 'bg-muted hover:bg-muted'
                        : 'hover:bg-transparent hover:underline',
                      'justify-start block'
                    )}
                  >
                    {subItem.title}
                  </Link>
                ))}
              </CollapsibleContent>
            </Collapsible>
          ))}
        </nav>
      </div>
    </>
  )
}
