import { HTMLAttributes, useState } from 'react'
import { useForm } from 'react-hook-form'
import { Link, useNavigate } from 'react-router-dom'
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
import { supabase } from '@/utils/supabase/client'
import { toast } from '@/components/ui/use-toast'

type UserAuthFormProps = HTMLAttributes<HTMLDivElement>

const formSchema = z.object({
  email: z
    .string()
    .min(1, { message: 'Please enter your email' })
    .email({ message: 'Invalid email address' }),
  password: z
    .string()
    .min(1, { message: 'Please enter your password' })
    .min(7, { message: 'Password must be at least 7 characters long' }),
})

export function UserAuthForm({ className, ...props }: UserAuthFormProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')
  const navigate = useNavigate()

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  })

  async function onSubmit(data: z.infer<typeof formSchema>) {
    setIsLoading(true)
    setErrorMessage('')
    try {
      const { data: signInData, error } = await supabase.auth.signInWithPassword({
        email: data.email,
        password: data.password,
      })

      if (error) {
        let message = 'An error occurred while signing in. Please try again.'
        if (error.message.includes('Invalid login credentials')) {
          message = "Invalid email or password. Please try again or sign up if you don't have an account."
        } else if (error.message.includes('Email not confirmed')) {
          message = "Please confirm your email address before signing in."
        }
        setErrorMessage(message)
      } else if (signInData.user) {
        toast({
          title: "Success",
          description: "You have successfully signed in.",
        })
        navigate('/portal')
      }
    } catch (error) {
      console.error('Error during sign in:', error)
      setErrorMessage('An unexpected error occurred. Please try again later.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleOAuthSignIn = async (provider: 'github' | 'google') => {
    try {
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider,
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
        },
      })
      if (error) throw error
      if (!data.url) throw new Error('No URL returned from Supabase')
      window.location.href = data.url
    } catch (error) {
      console.error(`Error signing in with ${provider}:`, error)
      setErrorMessage(`There was a problem signing in with ${provider}. Please try again.`)
    }
  }

  return (
    <div className={cn('grid gap-6', className)} {...props}>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <div className='grid gap-2'>
            <FormField
              control={form.control}
              name='email'
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      placeholder='Email address**'
                      {...field}
                      className='h-12 border border-gray-300 rounded-md focus:border-blue-500 focus:ring-blue-500 bg-white text-black dark:bg-gray-800 dark:text-white dark:border-gray-600'
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className='flex justify-end mb-1'>
              <Link
                to='/forgot-password'
                className='text-sm font-medium text-muted-foreground hover:opacity-75 whitespace-nowrap'
              >
                Forgot password?
              </Link>
            </div>
            <FormField
              control={form.control}
              name='password'
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <PasswordInput
                      placeholder='Password**'
                      {...field}
                      className='h-12 border border-gray-300 rounded-md focus:border-blue-500 focus:ring-blue-500 bg-white text-black dark:bg-gray-800 dark:text-white dark:border-gray-600'
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button className='w-full' type='submit' disabled={isLoading}>
              {isLoading ? 'Processing...' : 'Connect'}
            </Button>
            {errorMessage && (
              <p className="text-center text-sm mt-2 text-red-500 dark:text-red-400">{errorMessage}</p>
            )}
          </div>
        </form>
      </Form>
      <div className='relative'>
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
          disabled={isLoading}
          onClick={() => handleOAuthSignIn('github')}
        >
          <IconBrandGithub className='h-4 w-4 mr-2' />
          GitHub
        </Button>
        <Button
          variant='outline'
          className='w-full'
          type='button'
          disabled={isLoading}
          onClick={() => handleOAuthSignIn('google')}
        >
          <IconBrandGoogle className='h-4 w-4 mr-2' />
          Google
        </Button>
      </div>
      <p className='px-8 text-center text-sm text-muted-foreground'>
        Don&apos;t have an account?{' '}
        <Link
          to='/sign-up'
          className='underline underline-offset-4 hover:text-primary'
        >
          Sign up
        </Link>
      </p>
    </div>
  )
}