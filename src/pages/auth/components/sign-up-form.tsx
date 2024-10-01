import { useState } from 'react'
import { IconBrandGoogle, IconBrandGithub } from '@tabler/icons-react'
import { z } from 'zod'
import { Button } from '@/components/custom/button'
import { cn } from '@/lib/utils'
import { supabase } from '@/utils/supabase/client'
import { Input } from '@/components/ui/input'
import { PasswordInput } from '@/components/custom/password-input'

interface SignUpFormProps {
  className?: string
  onSubmit: (data: { email: string; password: string; fullName: string }) => Promise<void>
  isLoading: boolean
  isConfirmationSent: boolean
  onResendEmail: () => Promise<void>
  errorMessage: string
}

const formSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  fullName: z.string().min(1, 'Full name is required'),
})

export function SignUpForm({ className, onSubmit, isLoading, isConfirmationSent, onResendEmail, errorMessage, ...props }: SignUpFormProps) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [fullName, setFullName] = useState('')
  const [isValidEmail, setIsValidEmail] = useState(false)
  const [isValidPassword, setIsValidPassword] = useState(false)
  const [isValidFullName, setIsValidFullName] = useState(false)

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value)
    setIsValidEmail(formSchema.shape.email.safeParse(e.target.value).success)
  }

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value)
    setIsValidPassword(formSchema.shape.password.safeParse(e.target.value).success)
  }

  const handleFullNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFullName(e.target.value)
    setIsValidFullName(formSchema.shape.fullName.safeParse(e.target.value).success)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (isValidEmail && isValidPassword && isValidFullName) {
      await onSubmit({ email, password, fullName })
    }
  }

  const handleOAuthSignUp = async (provider: 'github' | 'google') => {
    try {
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider,
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
        },
      });
      if (error) throw error;
      if (!data.url) throw new Error('No URL returned from Supabase');
      window.location.href = data.url;
    } catch (error) {
      console.error(`Error signing up with ${provider}:`, error);
    }
  }

  if (isConfirmationSent) {
    return (
      <div className="text-center p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md transition-all duration-300 hover:scale-105">
        <h2 className="text-2xl font-semibold mb-4">Check your email</h2>
        <p className="mb-4">We&apos;ve sent you a confirmation email. Please check your inbox and follow the instructions to complete your registration.</p>
        <p className="text-sm text-muted-foreground">
          Didn&apos;t receive the email? Check your spam folder or{' '}
          <button
            className="text-primary hover:underline"
            onClick={onResendEmail}
          >
            resend the email
          </button>
        </p>
      </div>
    )
  }

  return (
    <div className={cn('grid gap-6', className)} {...props}>
      <form onSubmit={handleSubmit}>
        <div className='grid gap-4'>
          <Input
            id="fullName"
            type="text"
            placeholder='Full Name**'
            value={fullName}
            onChange={handleFullNameChange}
            className={cn(
              'h-12 border rounded-md focus:border-blue-500 focus:ring-blue-500 bg-white text-black dark:bg-gray-800 dark:text-white',
              {
                'border-gray-300 dark:border-gray-600': !isValidFullName && fullName === '',
                'border-red-500 dark:border-red-500': !isValidFullName && fullName !== '',
                'border-green-500 dark:border-green-500': isValidFullName,
              }
            )}
          />
          <Input
            id="email"
            type="email"
            placeholder='Email address**'
            value={email}
            onChange={handleEmailChange}
            className={cn(
              'h-12 border rounded-md focus:border-blue-500 focus:ring-blue-500 bg-white text-black dark:bg-gray-800 dark:text-white',
              {
                'border-gray-300 dark:border-gray-600': !isValidEmail && email === '',
                'border-red-500 dark:border-red-500': !isValidEmail && email !== '',
                'border-green-500 dark:border-green-500': isValidEmail,
              }
            )}
          />
          <PasswordInput
            id="password"
            placeholder='Password**'
            value={password}
            onChange={handlePasswordChange}
            className={cn(
              'h-12 border rounded-md focus:border-blue-500 focus:ring-blue-500 bg-white text-black dark:bg-gray-800 dark:text-white',
              {
                'border-gray-300 dark:border-gray-600': !isValidPassword && password === '',
                'border-red-500 dark:border-red-500': !isValidPassword && password !== '',
                'border-green-500 dark:border-green-500': isValidPassword,
              }
            )}
          />
          <Button
            className="w-full"
            type="submit"
            disabled={isLoading || !isValidEmail || !isValidPassword || !isValidFullName}
          >
            {isLoading ? 'Creating account...' : 'Create account'}
          </Button>
          {errorMessage && (
            <p className="text-center text-sm mt-2 text-red-500 dark:text-red-400">{errorMessage}</p>
          )}
        </div>
      </form>
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