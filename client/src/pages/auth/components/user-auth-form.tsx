import { HTMLAttributes, useState } from 'react'
import { useForm } from 'react-hook-form'
import { Link } from 'react-router-dom'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { IconBrandGoogle, IconBrandGithub } from '@tabler/icons-react'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/custom/button'
import { PasswordInput } from '@/components/custom/password-input'
import { cn } from '@/lib/utils'

interface UserAuthFormProps extends HTMLAttributes<HTMLDivElement> { }

const formSchema = z.object({
  email: z
    .string()
    .min(1, { message: 'Please enter your email' })
    .email({ message: 'Invalid email address' }),
  password: z
    .string()
    .min(1, {
      message: 'Please enter your password',
    })
    .min(7, {
      message: 'Password must be at least 7 characters long',
    }),
})

export function UserAuthForm({ className, ...props }: UserAuthFormProps) {
  const [isLoading, setIsLoading] = useState(false)

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  })

  function onSubmit(data: z.infer<typeof formSchema>) {
    setIsLoading(true)
    console.log(data)

    setTimeout(() => {
      setIsLoading(false)
    }, 3000)
  }

  return (
    <div className={cn('grid gap-6', className)} {...props}>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <div className='grid gap-2'> {/* Reduced space between elements */}
            <FormField
              control={form.control}
              name='email'
              render={({ field }) => (
                <FormItem className='space-y-1'>
                  <FormControl>
                    <Input
                      placeholder='Email address*'
                      {...field}
                      className='h-12 border border-gray-300 rounded-md focus:border-blue-500 focus:ring-blue-500 bg-white text-black dark:bg-gray-800 dark:text-white dark:border-gray-600' // Increased height and added effects
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className='flex justify-end mb-1'> {/* Positioned "Forgot password?" link */}
              <Link
                to='/forgot-password'
                className='text-sm font-medium text-muted-foreground hover:opacity-75 whitespace-nowrap' // Ensured "Forgot password?" is on one line
              >
                Forgot password?
              </Link>
            </div>
            <FormField
              control={form.control}
              name='password'
              render={({ field }) => (
                <FormItem className='space-y-1'>
                  <FormControl>
                    <PasswordInput
                      placeholder='Password*'
                      {...field}
                      className='h-12 border border-gray-300 rounded-md focus:border-blue-500 focus:ring-blue-500 bg-white text-black dark:bg-gray-800 dark:text-white dark:border-gray-600' // Increased height and added effects
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className='mt-2'> {/* Added margin-top to create space */}
              <Button className='w-full' loading={isLoading}> {/* Set width to full */}
                Continue
              </Button>
            </div>
            <p className='mt-1 px-8 text-center text-sm text-muted-foreground'>
              Don't have an account?{' '}
              <Link
                to='/sign-up'
                className='underline underline-offset-4 hover:text-primary'
              >
                Sign up
              </Link>
            </p>

            <div className='relative my-2'>
              <div className='absolute inset-0 flex items-center'>
                <span className='w-full border-t' />
              </div>
              <div className='relative flex justify-center text-xs uppercase'>
                <span className='bg-background px-2 text-muted-foreground'>
                  Or continue with
                </span>
              </div>
            </div>

            <div className='flex items-center gap-2'>
              <Button
                variant='outline'
                className='w-full'
                type='button'
                loading={isLoading}
                leftSection={<IconBrandGithub className='h-4 w-4' />}
              >
                GitHub
              </Button>
              <Button
                variant='outline'
                className='w-full'
                type='button'
                loading={isLoading}
                leftSection={<IconBrandGoogle className='h-4 w-4' />}
              >
                Google
              </Button>
            </div>
          </div>
        </form>
      </Form>
    </div>
  )
}