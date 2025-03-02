import { useState } from 'react'
import { Card } from '@/components/ui/card'
import { ForgotForm } from '@/components/auth/forgot-form'
import { CheckEmailMessage } from '@/components/auth/check-email-message'
import { Link, useNavigate } from 'react-router-dom'
import { supabase } from '@/utils/supabase/client'
import { toast } from '@/lib/hooks/use-toast'
import { useTranslation } from 'react-i18next'
import { Button } from '@/components/custom/button'
import { ChevronLeft } from 'lucide-react'

export default function ForgotPassword() {
  const { t } = useTranslation()
  const [isEmailSent, setIsEmailSent] = useState(false)
  const [email, setEmail] = useState('')
  const navigate = useNavigate()

  const handleResendEmail = async () => {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/auth/reset-password`,
      })
      if (error) throw error
      toast({
        title: t('auth.pages.forgot_password.email_resent.title'),
        description: t('auth.pages.forgot_password.email_resent.description'),
      })
    } catch (error) {
      console.error('Error resending password reset email:', error)
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
        className="absolute top-10 left-10 hidden sm:inline-flex items-center justify-center bg-gray-100 hover:bg-gray-200 dark:bg-black/50 text-gray-700 hover:text-gray-900 dark:text-sage-100 dark:hover:text-sage-200 dark:hover:bg-zinc-900 dark:border-zinc-800 border border-gray-200 h-10 w-10 rounded-none transition-colors"
        onClick={() => navigate(-1)}
      >
        <ChevronLeft className="h-5 w-5" />
      </Button>

      <div className='mx-auto flex w-full flex-col justify-center space-y-2 sm:w-[480px] lg:p-8'>
        <Card className='p-6'>
          {isEmailSent ? (
            <CheckEmailMessage email={email} onResendEmail={handleResendEmail} />
          ) : (
            <>
              <div className='mb-2 flex flex-col space-y-2 text-left'>
                <h1 className='text-2xl font-semibold tracking-tight'>
                  {t('auth.pages.forgot_password.title')}
                </h1>
              </div>
              <div className='mb-4'></div>
              <ForgotForm onSuccess={(submittedEmail) => {
                setEmail(submittedEmail)
                setIsEmailSent(true)
              }} />
              <p className='mt-4 px-8 text-center text-sm text-muted-foreground'>
                {t('auth.pages.forgot_password.no_account')}{' '}
                <Link
                  to='/sign-up'
                  className='underline underline-offset-4 text-blue-600 hover:text-blue-600'
                >
                  {t('auth.pages.forgot_password.sign_up_link')}
                </Link>
              </p>
            </>
          )}
        </Card>
      </div>
    </div>
  )
}