import * as React from 'react'
import { Slot } from '@radix-ui/react-slot'
import { type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/actions/utils'
import { IconLoader2 } from '@tabler/icons-react'
import { buttonVariants } from './button-variants'

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
  VariantProps<typeof buttonVariants> {
  asChild?: boolean
  loading?: boolean
  leftSection?: JSX.Element
  rightSection?: JSX.Element
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant,
      size,
      asChild = false,
      children,
      disabled,
      loading = false,
      leftSection,
      rightSection,
      ...props
    },
    ref
  ) => {
    const Comp = asChild ? Slot : 'button'
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        disabled={loading || disabled}
        ref={ref}
        {...props}
      >
        {((leftSection && loading) ||
          (!leftSection && !rightSection && loading)) && (
            <IconLoader2 className='mr-2 h-4 w-4 animate-spin' />
          )}
        {!loading && leftSection && <div className='mr-2'>{leftSection}</div>}
        {children}
        {!loading && rightSection && <div className='ml-2'>{rightSection}</div>}
        {rightSection && loading && (
          <IconLoader2 className='ml-2 h-4 w-4 animate-spin' />
        )}
      </Comp>
    )
  }
)
Button.displayName = 'Button'

export { Button }