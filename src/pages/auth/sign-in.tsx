import { UserAuthForm } from './components/user-auth-form'
import Icon from '/inner-radius.png'
import { Link } from 'react-router-dom'

export default function SignIn() {
  return (
    <>
      <div className='container relative grid h-svh flex-col items-center justify-center lg:max-w-none lg:grid-cols-2 lg:px-0'>
        <div className='relative hidden h-full flex-col bg-muted p-10 text-white dark:border-r lg:flex'>
          <div className='absolute inset-0 bg-black' />
          <Link to="/" className='relative z-20 flex items-center text-2xl font-medium text-sage-100 hover:text-sage-200 transition-colors'>
            Portal
          </Link>
          <div className='relative z-20 flex items-center justify-center flex-grow'>
            <Link to="/">
              <img
                src={Icon}
                className='relative hover:opacity-80 transition-opacity'
                width={301}
                height={60}
                alt='lomi. Logo'
              />
            </Link>
          </div>
          <div className='relative z-20 mt-auto'>
            <blockquote className='space-y-2'>
              <p className='text-lg text-sage-100'>
                &ldquo;We&apos;re just getting started.&rdquo;
              </p>
              <footer className='text-sm text-sage-200'>lomi&apos;s Team</footer>
            </blockquote>
          </div>
        </div>
        <div className='lg:p-8'>
          <div className='mx-auto flex w-full flex-col justify-center space-y-2 sm:w-[350px]'>
            <div className='flex flex-col space-y-2 text-left'>
              <h1 className='text-2xl font-semibold tracking-tight'>Welcome back</h1>
              <p className='text-sm text-muted-foreground'>
                Enter your email below to sign in to your account.
              </p>
            </div>
            <UserAuthForm />
          </div>
        </div>
      </div>
    </>
  )
}