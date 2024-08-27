import { useState } from 'react'
import { Card } from '@/components/ui/card'
import { ForgotForm } from './components/forgot-form'
import { Link } from 'react-router-dom'

export default function ForgotPassword() {
  const [isEmailSent, setIsEmailSent] = useState(false)

  return (
    <>
      <div className='container grid h-svh flex-col items-center justify-center bg-primary-foreground lg:max-w-none lg:px-0'>
        <div className='mx-auto flex w-full flex-col justify-center space-y-2 sm:w-[480px] lg:p-8'>
          <Card className='p-6'>
            {isEmailSent ? (
              <div className='text-center'>
                <h2 className='text-2xl font-semibold mb-4'>Check your email</h2>
                <p className='mb-4'>We've sent you a password reset email. Please check your inbox and follow the instructions to reset your password.</p>
                <p className='text-sm text-muted-foreground'>
                  Didn't receive the email? Check your spam folder or{' '}
                  <button
                    className='text-primary hover:underline'
                    onClick={() => setIsEmailSent(false)}
                  >
                    try again
                  </button>
                </p>
              </div>
            ) : (
              <>
                <div className='mb-2 flex flex-col space-y-2 text-left'>
                  <h1 className='text-2xl font-semibold tracking-tight'>
                    Reset your password
                  </h1>
                </div>
                <div className='mb-4'></div>
                <ForgotForm onSuccess={() => setIsEmailSent(true)} />
                <p className='mt-4 px-8 text-center text-sm text-muted-foreground'>
                  Don't have an account?{' '}
                  <Link
                    to='/sign-up'
                    className='underline underline-offset-4 hover:text-primary'
                  >
                    Sign up
                  </Link>
                </p>
              </>
            )}
          </Card>
        </div>
      </div>
    </>
  )
}