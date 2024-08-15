import { useState, useEffect } from 'react'
import { useLocation, } from 'react-router-dom'
import { Card } from '@/components/ui/card'
import { OtpForm } from './components/otp-form'
import { supabase } from '@/utils/supabase/client'
import { toast } from '@/components/ui/use-toast'

export default function Otp() {
  const [isResending, setIsResending] = useState(false)
  const [email, setEmail] = useState('')
  const location = useLocation()

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
    try {
      const { error } = await supabase.auth.resend({
        type: 'signup',
        email: email,
      })
      if (error) throw error
      toast({
        title: "Success",
        description: "A new OTP has been sent to your email.",
      })
    } catch (error) {
      console.error('Error resending OTP:', error)
      toast({
        title: "Error",
        description: "There was a problem resending the OTP. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsResending(false)
    }
  }

  return (
    <>
      <div className='container grid h-svh flex-col items-center justify-center bg-primary-foreground lg:max-w-none lg:px-0'>
        <div className='mx-auto flex w-full flex-col justify-center space-y-2 sm:w-[480px] lg:p-8'>
          <Card className='p-6'>
            <div className='mb-2 flex flex-col space-y-2 text-center'>
              <h1 className='text-2xl font-semibold tracking-tight'>
                Two-factor Authentication
              </h1>
              <p className='text-sm text-muted-foreground'>
                We have sent an authentication code to your email.
              </p>
            </div>
            <div className='mb-4'></div>
            <OtpForm email={email} />
            <p className='mt-4 px-8 text-center text-sm text-muted-foreground'>
              Haven't received it?{' '}
              <button
                onClick={handleResendOtp}
                disabled={isResending}
                className='underline underline-offset-4 hover:text-primary'
              >
                {isResending ? 'Resending...' : 'Resend a new code'}
              </button>
            </p>
          </Card>
        </div>
      </div>
    </>
  )
}