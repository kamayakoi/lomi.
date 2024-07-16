import { Card } from '@/components/ui/card'
import { Link } from 'react-router-dom'
import { OtpForm } from './components/otp-form'

export default function Otp() {
  return (
    <>
      <div className='container grid h-svh flex-col items-center justify-center bg-primary-foreground lg:max-w-none lg:px-0'>
        <div className='mx-auto flex w-full flex-col justify-center space-y-2 sm:w-[480px] lg:p-8'>
          <Card className='p-6'>
            <div className='mb-2 flex flex-col space-y-2 text-left'> {/* Changed text-left to text-center */}
              <h1 className='text-2xl font-semibold tracking-tight'> {/* Increased text size */}
                Two-factor Authentication
              </h1>
              <p className='text-sm text-muted-foreground'>
                We have sent an authentication code to your email.
              </p>
            </div>
            <div className='mb-4'></div> {/* Added space between text and OtpForm */}
            <OtpForm />
            <p className='mt-4 px-8 text-center text-sm text-muted-foreground'>
              Haven't received it?{' '}
              <Link
                to='/resent-new-code'
                className='underline underline-offset-4 hover:text-primary'
              >
                Resend a new code
              </Link>
            </p>
          </Card>
        </div>
      </div>
    </>
  )
}