import { HTMLAttributes, useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { IconBrandGoogle, IconBrandGithub } from '@tabler/icons-react'
import { z } from 'zod'
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

interface SignUpFormCustomProps {
  onSubmit: (data: { email: string; password: string; name: string }) => Promise<boolean>
  isLoading: boolean
}

interface SignUpFormProps extends SignUpFormCustomProps, Omit<HTMLAttributes<HTMLDivElement>, 'onSubmit'> { }

const formSchema = z.object({
  name: z.string().min(1, { message: 'Please enter your name' }),
  email: z
    .string()
    .min(1, { message: 'Please enter your email' })
    .email({ message: 'Invalid email address' }),
  password: z
    .string()
    .min(1, { message: 'Please enter your password' })
    .min(7, { message: 'Password must be at least 7 characters long' }),
})

export function SignUpForm({ className, onSubmit, isLoading, ...props }: SignUpFormProps) {
  const [isConfirmationSent, setIsConfirmationSent] = useState(false)
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      email: '',
      password: '',
    },
  })

  const handleSubmit = form.handleSubmit(async (data) => {
    try {
      const success = await onSubmit(data)
      if (success) {
        setIsConfirmationSent(true)
      }
    } catch (error) {
      console.error('Error during sign up:', error)
      toast({
        title: "Error",
        description: "There was a problem creating your account. Please try again.",
        variant: "destructive",
      })
    }
  })

  const handleOAuthSignUp = async (provider: 'github' | 'google') => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider,
        options: {
          redirectTo: `${window.location.origin}/auth/callback`
        }
      });
      if (error) throw error;
    } catch (error) {
      console.error(`Error signing up with ${provider}:`, error);
      toast({
        title: "Error",
        description: `There was a problem signing up with ${provider}. Please try again.`,
        variant: "destructive",
      });
    }
  };

  if (isConfirmationSent) {
    return (
      <div className="text-center">
        <h2 className="text-2xl font-semibold mb-4">Check your email</h2>
        <p className="mb-4">We've sent you a confirmation email. Please check your inbox and follow the instructions to complete your registration.</p>
        <p className="text-sm text-muted-foreground">
          Didn't receive the email? Check your spam folder or{' '}
          <button
            className="text-primary hover:underline"
            onClick={() => setIsConfirmationSent(false)}
          >
            try again
          </button>
        </p>
      </div>
    )
  }

  return (
    <div className={cn('grid gap-6', className)} {...props}>
      <Form {...form}>
        <form onSubmit={handleSubmit}>
          <div className='grid gap-4'>
            <FormField
              control={form.control}
              name='name'
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      placeholder='Full name*'
                      {...field}
                      className='h-12 border border-gray-300 rounded-md focus:border-blue-500 focus:ring-blue-500 bg-white text-black dark:bg-gray-800 dark:text-white dark:border-gray-600'
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name='email'
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      placeholder='Email address*'
                      type='email'
                      {...field}
                      className='h-12 border border-gray-300 rounded-md focus:border-blue-500 focus:ring-blue-500 bg-white text-black dark:bg-gray-800 dark:text-white dark:border-gray-600'
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name='password'
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <PasswordInput
                      placeholder='Password*'
                      {...field}
                      className='h-12 border border-gray-300 rounded-md focus:border-blue-500 focus:ring-blue-500 bg-white text-black dark:bg-gray-800 dark:text-white dark:border-gray-600'
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button className='w-full' type='submit' disabled={isLoading}>
              {isLoading ? 'Creating account...' : 'Create account'}
            </Button>
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
          onClick={() => handleOAuthSignUp('github')}
        >
          <IconBrandGithub className='h-4 w-4 mr-2' />
          GitHub
        </Button>
        <Button
          variant='outline'
          className='w-full'
          type='button'
          disabled={isLoading}
          onClick={() => handleOAuthSignUp('google')}
        >
          <IconBrandGoogle className='h-4 w-4 mr-2' />
          Google
        </Button>
      </div>
    </div>
  )
}