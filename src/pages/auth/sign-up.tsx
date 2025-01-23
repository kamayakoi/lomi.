import { useState } from 'react'
import { Card } from '@/components/ui/card'
import { SignUpForm } from '@/components/auth/sign-up-form'
import { supabase } from '@/utils/supabase/client'
import { toast } from '@/components/ui/use-toast'
import { Link, useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { Button } from '@/components/custom/button'
import { ChevronLeft } from 'lucide-react'

export default function SignUp() {
  const { t } = useTranslation()
  const [isLoading, setIsLoading] = useState(false)
  const [isConfirmationSent, setIsConfirmationSent] = useState(false)
  const [email, setEmail] = useState('')
  const [errorMessage, setErrorMessage] = useState('')
  const navigate = useNavigate()

  const handleSignUp = async (data: { email: string; password: string; fullName: string }) => {
    setIsLoading(true);
    setEmail(data.email);
    setErrorMessage('');

    try {
      console.log('Calling supabase.auth.signUp with data:', data);
      const { data: signUpData, error } = await supabase.auth.signUp({
        email: data.email,
        password: data.password,
        options: {
          data: {
            full_name: data.fullName
          },
          emailRedirectTo: `${window.location.origin}/onboarding`,
        },
      });

      console.log('Sign-up response:', signUpData);

      if (error) {
        console.error('Error during sign-up:', error);
        let message = t('auth.sign_up.error.default');
        let title = t('auth.sign_up.error.title');

        if (error.message.includes('weak') || error.message.includes('easy to guess')) {
          message = t('auth.sign_up.error.weak_password') || 'Password is too weak. Please choose a stronger password with a mix of letters, numbers, and special characters.';
          title = 'Weak Password';
        } else if (error.message.includes('Password should be')) {
          message = t('auth.sign_up.error.invalid_password');
          title = 'Invalid Password';
        }

        toast({
          title: title,
          description: message,
          variant: "destructive",
          duration: 5000,
        });

        setErrorMessage(message);
        setIsLoading(false);
      } else {
        setIsConfirmationSent(true);
        toast({
          title: t('auth.sign_up.success.title'),
          description: t('auth.sign_up.success.message'),
          duration: 4000,
        });
        await new Promise((resolve) => setTimeout(resolve, 4000));
        setIsLoading(false);
      }
    } catch (error) {
      console.error('Unexpected error during sign-up:', error);
      toast({
        title: t('auth.sign_up.error.title'),
        description: t('auth.sign_up.error.default'),
        variant: "destructive",
        duration: 5000,
      });
      setErrorMessage(t('auth.sign_up.error.default'));
      setIsLoading(false);
    }
  };

  const handleResendEmail = async () => {
    try {
      const { error } = await supabase.auth.resend({
        type: 'signup',
        email: email,
      })
      if (error) throw error
      toast({
        title: t('auth.sign_up.resend_email.title'),
        description: t('auth.sign_up.resend_email.success'),
        duration: 4000,
      })
    } catch (error) {
      console.error('Error resending email:', error)
      toast({
        title: t('auth.sign_up.error.title'),
        description: t('auth.sign_up.error.resend_failed'),
        variant: "destructive",
        duration: 5000,
      })
    }
  }

  return (
    <div className='container grid h-svh flex-col items-center justify-center lg:max-w-none lg:px-0'>
      <Button
        variant="ghost"
        size="icon"
        className="absolute top-10 left-10 inline-flex items-center justify-center bg-gray-100 hover:bg-gray-200 dark:bg-black/50 text-gray-700 hover:text-gray-900 dark:text-sage-100 dark:hover:text-sage-200 dark:hover:bg-zinc-900 dark:border-zinc-800 border border-gray-200 h-10 w-10 rounded-none transition-colors"
        onClick={() => navigate(-1)}
      >
        <ChevronLeft className="h-5 w-5" />
      </Button>

      <div className='mx-auto flex w-full flex-col justify-center space-y-2 sm:w-[500px] lg:p-8'>
        <Card className='p-6'>
          <div className='mb-2 flex flex-col space-y-2 text-left'>
            <h1 className='text-2xl font-semibold tracking-tight'>
              {t('auth.pages.sign_up.title')}
            </h1>
          </div>
          <div className='mb-4'></div>
          <SignUpForm
            onSubmit={handleSignUp}
            isLoading={isLoading}
            isConfirmationSent={isConfirmationSent}
            onResendEmail={handleResendEmail}
            errorMessage={errorMessage}
          />
          <p className='mt-4 px-8 text-center text-sm text-muted-foreground'>
            {t('auth.pages.sign_up.terms_text')}{' '}
            <Link
              to='/terms'
              className='text-blue-600 hover:underline'
            >
              {t('auth.pages.sign_up.terms_link')}
            </Link>{' '}
            {t('auth.pages.sign_up.and')}{' '}
            <Link
              to='/privacy'
              className='text-blue-600 hover:underline'
            >
              {t('auth.pages.sign_up.privacy_link')}
            </Link>
            {t('auth.pages.sign_up.period')}
          </p>
        </Card>
      </div>
    </div>
  )
}