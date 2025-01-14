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
        if (error.message.includes('Password should be at least 6 characters')) {
          message = t('auth.sign_up.error.invalid_password');
        }
        setErrorMessage(message);
        setIsLoading(false);
      } else {
        setIsConfirmationSent(true);
        toast({
          title: t('auth.sign_up.resend_email.title'),
          description: t('auth.sign_up.resend_email.success'),
        });
        await new Promise((resolve) => setTimeout(resolve, 4000));
        setIsLoading(false);
      }
    } catch (error) {
      console.error('Unexpected error during sign-up:', error);
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
      })
    } catch (error) {
      console.error('Error resending email:', error)
      toast({
        title: t('auth.pages.forgot_password.error.title'),
        description: t('auth.pages.forgot_password.error.description'),
        variant: "destructive",
      })
    }
  }

  return (
    <div className='container grid h-svh flex-col items-center justify-center lg:max-w-none lg:px-0'>
      <Button
        variant="ghost"
        size="icon"
        className="fixed top-6 left-6 z-50"
        onClick={() => navigate(-1)}
      >
        <ChevronLeft className="h-6 w-6" />
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