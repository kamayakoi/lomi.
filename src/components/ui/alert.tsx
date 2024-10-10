import { cva, VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/actions/utils'
import { Info, AlertTriangle, AlertCircle, CheckCircle } from 'lucide-react'

const alertVariants = cva(
    'relative w-full rounded-lg border p-4 [&>svg]:absolute [&>svg]:text-foreground [&>svg]:left-4 [&>svg]:top-4 [&>svg+div]:translate-y-[-3px] [&:has(svg)]:pl-11',
    {
        variants: {
            variant: {
                default: 'bg-background text-foreground',
                destructive:
                    'text-destructive border-destructive/50 dark:border-destructive [&>svg]:text-destructive text-destructive',
                info: 'text-info border-info/50 dark:border-info [&>svg]:text-info text-info',
                success:
                    'text-success border-success/50 dark:border-success [&>svg]:text-success text-success',
                warning:
                    'text-warning border-warning/50 dark:border-warning [&>svg]:text-warning text-warning',
            },
        },
        defaultVariants: {
            variant: 'default',
        },
    }
)

const Alert = ({ className, variant, ...props }: React.HTMLAttributes<HTMLDivElement> & VariantProps<typeof alertVariants>) => (
    <div className={cn(alertVariants({ variant }), className)} {...props} />
)

const AlertTitle = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
    <h5 className={cn('mb-1 font-medium leading-none tracking-tight', className)} {...props} />
)

const AlertDescription = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
    <div className={cn('text-sm [&_p]:leading-relaxed', className)} {...props} />
)

const AlertIcon = ({ variant }: { variant: VariantProps<typeof alertVariants>['variant'] }) => {
    switch (variant) {
        case 'destructive':
            return <AlertCircle className='h-4 w-4' />
        case 'info':
            return <Info className='h-4 w-4' />
        case 'success':
            return <CheckCircle className='h-4 w-4' />
        case 'warning':
            return <AlertTriangle className='h-4 w-4' />
        default:
            return null
    }
}

Alert.displayName = 'Alert'
AlertTitle.displayName = 'AlertTitle'
AlertDescription.displayName = 'AlertDescription'

export { Alert, AlertTitle, AlertDescription, AlertIcon }