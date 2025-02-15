import { useState, useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { Card } from '@/components/ui/card'
import { OtpForm } from '@/components/auth/otp-form'
import { supabase } from '@/utils/supabase/client'
import { toast } from '@/lib/hooks/use-toast'
import { useTranslation } from 'react-i18next'
import { Button } from '@/components/custom/button'
import { ChevronLeft } from 'lucide-react'

export default function Otp() {
  const { t } = useTranslation()
  const [isResending, setIsResending] = useState(false)
  const [email, setEmail] = useState('')
  const [errorMessage, setErrorMessage] = useState('')
  const location = useLocation()
  const navigate = useNavigate()

  useEffect(() => {
    // Get email from query parameter or localStorage
    const searchParams = new URLSearchParams(location.search)
    const emailFromQuery = searchParams.get('email')
    const emailFromStorage = localStorage.getItem('userEmail')
    if (emailFromQuery) {
      setEmail(emailFromQuery)
    } else if (emailFromStorage) {
      setEmail(emailFromStorage)
    }
  }, [location])

  const handleResendOtp = async () => {
    setIsResending(true)
    setErrorMessage('')
    try {
      const { error } = await supabase.auth.resend({
        type: 'signup',
        email: email,
      })
      if (error) throw error
      toast({
        title: t('auth.otp.success'),
        description: t('auth.otp.success_message'),
      })
    } catch (error) {
      console.error('Error resending OTP:', error)
      setErrorMessage(t('auth.otp.error.unexpected'))
    } finally {
      setIsResending(false)
    }
  }

  return (
    <>
      <div className='container grid h-svh flex-col items-center justify-center lg:max-w-none lg:px-0'>
        {/* Back button */}
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
            <div className='mb-2 flex flex-col space-y-2 text-center'>
              <h1 className='text-2xl font-semibold tracking-tight'>
                {t('auth.otp.title')}
              </h1>
              <p className='text-sm text-muted-foreground'>
                {t('auth.check_email.message').replace('<email>', email)}
              </p>
            </div>
            <div className='mb-4'></div>
            <OtpForm email={email} errorMessage={errorMessage} setErrorMessage={setErrorMessage} />
            <p className='mt-4 px-8 text-center text-sm text-muted-foreground'>
              {t('auth.check_email.resend')}{' '}
              <button
                onClick={handleResendOtp}
                disabled={isResending}
                className='underline underline-offset-4 hover:text-primary'
              >
                {isResending ? t('auth.sign_up.processing') : t('auth.check_email.resend_link')}
              </button>
            </p>
          </Card>
        </div>
      </div>
    </>
  )
}