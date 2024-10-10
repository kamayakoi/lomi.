import { Card } from '@/components/ui/card'
import { UserAuthForm } from '@/components/auth/user-auth-form'

export default function Login() {
  return (
    <>
      <div className='container grid h-svh flex-col items-center justify-center bg-primary-foreground lg:max-w-none lg:px-0'>
        <div className='mx-auto flex w-full flex-col justify-center space-y-2 sm:w-[480px] lg:p-8'>
          <Card className='p-6'>
            <div className='flex flex-col space-y-2 text-left'>
              <h1 className='text-2xl font-semibold tracking-tight'>Welcome back</h1>
              <p className='text-sm text-muted-foreground'>
                Enter your email below to log in to your account.
              </p>
            </div>
            <div className='mb-4'></div>
            <UserAuthForm />
          </Card>
        </div>
      </div>
    </>
  )
}