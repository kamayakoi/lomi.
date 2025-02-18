import { useState, useEffect } from 'react'
import { IconBrandGithub } from '@tabler/icons-react'
import { z } from 'zod'
import { Button } from '@/components/custom/button'
import { cn } from '@/lib/actions/utils'
import { Input } from '@/components/ui/input'
import { PasswordInput } from '@/components/custom/password-input'
import { supabase } from '@/utils/supabase/client'
import { useTranslation } from 'react-i18next'
import Spinner from '@/components/portal/spinner'
import { MagicCard } from '@/components/ui/magic-card'
import { Check, X } from 'lucide-react'

interface SignUpFormProps {
  className?: string
  onSubmit: (data: { email: string; password: string; fullName: string }) => Promise<void>
  isLoading: boolean
  isConfirmationSent: boolean
  onResendEmail: () => Promise<void>
  errorMessage: string
}

interface PasswordRequirement {
  text: string
  isMet: boolean
}

function PasswordRequirements({ password, isVisible }: { password: string, isVisible: boolean }) {
  const { t } = useTranslation()
  const [shouldShow, setShouldShow] = useState(true)
  const requirements: PasswordRequirement[] = [
    {
      text: t('auth.sign_up.password_requirements.min_length'),
      isMet: password.length >= 8,
    },
    {
      text: t('auth.sign_up.password_requirements.uppercase'),
      isMet: /[A-Z]/.test(password),
    },
    {
      text: t('auth.sign_up.password_requirements.lowercase'),
      isMet: /[a-z]/.test(password),
    },
    {
      text: t('auth.sign_up.password_requirements.number'),
      isMet: /[0-9]/.test(password),
    },
    {
      text: t('auth.sign_up.password_requirements.special'),
      isMet: /[^A-Za-z0-9]/.test(password),
    },
  ]

  const allRequirementsMet = requirements.every(req => req.isMet)

  useEffect(() => {
    let timer: number | undefined;

    if (allRequirementsMet) {
      timer = window.setTimeout(() => {
        setShouldShow(false)
      }, 2000)
    } else {
      setShouldShow(true)
    }

    return () => {
      if (timer) window.clearTimeout(timer)
    }
  }, [allRequirementsMet])

  if (!isVisible || !shouldShow) return null

  return (
    <div className="absolute lg:left-[calc(100%+1rem)] lg:top-0 top-full left-0 z-50 w-full lg:w-64 transform transition-all duration-200 ease-in-out mt-2 lg:mt-0">
      <MagicCard
        className="p-3 rounded-none bg-opacity-50 backdrop-blur-sm"
        gradientColor="#3b82f6"
        gradientOpacity={0.1}
      >
        <div className="space-y-1.5">
          {requirements.map((requirement, index) => (
            <div key={index} className="flex items-center space-x-1.5">
              {requirement.isMet ? (
                <Check className="h-3 w-3 text-green-500" />
              ) : (
                <X className="h-3 w-3 text-red-500" />
              )}
              <span className={cn(
                "text-xs",
                requirement.isMet ? "text-green-500" : "text-red-500"
              )}>
                {requirement.text}
              </span>
            </div>
          ))}
        </div>
      </MagicCard>
    </div>
  )
}

const formSchema = z.object({
  email: z.string().email(),
  password: z.string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
    .regex(/[0-9]/, 'Password must contain at least one number')
    .regex(/[^A-Za-z0-9]/, 'Password must contain at least one special character'),
  fullName: z.string().regex(/^[\p{L}']+ [\p{L}']+/u, 'Please enter both first and last name'),
})

export function SignUpForm({ className, onSubmit, isLoading, isConfirmationSent, onResendEmail, errorMessage, ...props }: SignUpFormProps) {
  const { t } = useTranslation()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [fullName, setFullName] = useState('')
  const [isValidEmail, setIsValidEmail] = useState(false)
  const [isValidPassword, setIsValidPassword] = useState(false)
  const [isValidFullName, setIsValidFullName] = useState(false)
  const [isGoogleLoading, setIsGoogleLoading] = useState(false)
  const [isGithubLoading, setIsGithubLoading] = useState(false)
  const [isPasswordFocused, setIsPasswordFocused] = useState(false)
  const [hasResent, setHasResent] = useState(false)

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value)
    setIsValidEmail(formSchema.shape.email.safeParse(e.target.value).success)
  }

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newPassword = e.target.value
    setPassword(newPassword)

    // Check if all requirements are met
    const hasMinLength = newPassword.length >= 8
    const hasUppercase = /[A-Z]/.test(newPassword)
    const hasLowercase = /[a-z]/.test(newPassword)
    const hasNumber = /[0-9]/.test(newPassword)
    const hasSpecial = /[^A-Za-z0-9]/.test(newPassword)

    setIsValidPassword(hasMinLength && hasUppercase && hasLowercase && hasNumber && hasSpecial)
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
      if (provider === 'google') setIsGoogleLoading(true)
      if (provider === 'github') setIsGithubLoading(true)

      const { data, error } = await supabase.auth.signInWithOAuth({
        provider,
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
          scopes: 'email',
        },
      });
      if (error) throw error;
      if (!data.url) throw new Error('No URL returned from Supabase');
      window.location.href = data.url;
    } catch (error) {
      console.error(`Error signing up with ${provider}:`, error);
    } finally {
      if (provider === 'google') setIsGoogleLoading(false)
      if (provider === 'github') setIsGithubLoading(false)
    }
  }

  const handleResendClick = async () => {
    await onResendEmail()
    setHasResent(true)
  }

  if (isConfirmationSent) {
    return (
      <div className="w-full max-w-md mx-auto">
        <div className="bg-background border rounded-lg shadow-lg p-8">
          <div className="text-center space-y-4">
            <div className="w-16 h-16 bg-green-100 dark:bg-green-900/20 rounded-full mx-auto flex items-center justify-center">
              <Check className="w-8 h-8 text-green-600 dark:text-green-400" />
            </div>

            <h2 className="text-2xl font-semibold tracking-tight">
              {t('auth.check_email.title')}
            </h2>

            <p className="text-muted-foreground">
              {t('auth.check_email.message').replace('<email>', email)}
            </p>

            {!hasResent && (
              <div className="pt-4">
                <p className="text-sm text-muted-foreground">
                  {t('auth.check_email.resend')}{' '}
                  <button
                    className="text-primary hover:underline font-medium"
                    onClick={handleResendClick}
                  >
                    {t('auth.check_email.resend_link')}
                  </button>
                </p>
              </div>
            )}
          </div>
        </div>
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
            placeholder={t('auth.sign_up.full_name_placeholder')}
            value={fullName}
            onChange={handleFullNameChange}
            autoComplete="name"
            className={cn(
              'h-12 border rounded-none focus:border-blue-500 focus:ring-blue-500 bg-white text-black dark:bg-gray-800 dark:text-white',
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
            placeholder={t('auth.sign_up.email_placeholder')}
            value={email}
            onChange={handleEmailChange}
            autoComplete="username"
            className={cn(
              'h-12 border rounded-none focus:border-blue-500 focus:ring-blue-500 bg-white text-black dark:bg-gray-800 dark:text-white',
              {
                'border-gray-300 dark:border-gray-600': !isValidEmail && email === '',
                'border-red-500 dark:border-red-500': !isValidEmail && email !== '',
                'border-green-500 dark:border-green-500': isValidEmail,
              }
            )}
          />
          <div className="space-y-2">
            <div className="relative">
              <PasswordInput
                id="password"
                placeholder={t('auth.sign_up.password_placeholder')}
                value={password}
                onChange={handlePasswordChange}
                onFocus={() => setIsPasswordFocused(true)}
                onBlur={() => setIsPasswordFocused(false)}
                autoComplete="new-password"
                className={cn(
                  'h-12 border rounded-none focus:border-blue-500 focus:ring-blue-500 bg-white text-black dark:bg-gray-800 dark:text-white',
                  {
                    'border-gray-300 dark:border-gray-600': !isValidPassword && password === '',
                    'border-red-500 dark:border-red-500': !isValidPassword && password !== '',
                    'border-green-500 dark:border-green-500': isValidPassword,
                  }
                )}
              />
              <PasswordRequirements
                password={password}
                isVisible={isPasswordFocused || (!!password && !isValidPassword)}
              />
            </div>
          </div>
          <Button
            className="w-full h-12"
            type="submit"
            disabled={isLoading || !isValidEmail || !isValidPassword || !isValidFullName}
          >
            <span className="text-base font-semibold">
              {isLoading ? t('auth.sign_up.processing') : t('auth.sign_up.submit_button')}
            </span>
          </Button>
          {errorMessage && (
            <p className="text-center text-sm mt-2 text-red-500 dark:text-red-400">{errorMessage}</p>
          )}
        </div>
      </form>
      <div className='relative'>
        <div className='absolute inset-0 flex items-center'>
          <span className='w-full border-t border-gray-300 dark:border-gray-600' />
        </div>
        <div className='relative flex justify-center text-xs uppercase'>
          <span className='bg-background px-2 text-gray-500'>
            {t('auth.sign_up.continue_with')}
          </span>
        </div>
      </div>
      <div className='flex flex-col gap-4'>
        <Button className="w-full h-12" variant="outline" onClick={() => handleOAuthSignUp('google')}>
          <div className="flex items-center justify-center">
            {isGoogleLoading ? (
              <Spinner size={20} color="#4285F4" />
            ) : (
              <svg
                className="w-5 h-5 mr-2"
                viewBox="0 0 24 24"
                fill="currentColor"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  fill="#4285F4"
                />
                <path
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  fill="#34A853"
                />
                <path
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  fill="#FBBC05"
                />
                <path
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  fill="#EA4335"
                />
              </svg>
            )}
            <span>&nbsp;{t('auth.sign_up.google')}</span>
          </div>
        </Button>
        <Button
          variant='outline'
          className='w-full h-12'
          type='button'
          disabled={isLoading}
          onClick={() => handleOAuthSignUp('github')}
        >
          <div className="flex items-center justify-center">
            {isGithubLoading ? (
              <Spinner size={20} color="#24292e" />
            ) : (
              <IconBrandGithub className='h-6 w-6 mr-2' />
            )}
            <span>&nbsp;{t('auth.sign_up.github')}</span>
          </div>
        </Button>
      </div>
    </div>
  )
}