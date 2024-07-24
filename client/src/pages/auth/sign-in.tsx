import { UserAuthForm } from './components/user-auth-form'
import Icon from '/inner-radius.png'

export default function SignIn() {
  return (
    <>
      <div className='container relative grid h-svh flex-col items-center justify-center lg:max-w-none lg:grid-cols-2 lg:px-0'>
        <div className='relative hidden h-full flex-col bg-muted p-10 text-white dark:border-r lg:flex'>
          {/* Updated background color to a darker sage */}
          <div className='absolute inset-0 bg-black' />

          {/* Reintroduced and updated the text */}
          <div className='relative z-20 flex items-center text-2xl font-medium text-sage-100'>
            Portal
          </div>

          {/* Centered the logo */}
          <div className='relative z-20 flex items-center justify-center flex-grow'>
            <img
              src={Icon}
              className='relative'
              width={301}
              height={60}
              alt='lomi. Logo'
            />
          </div>

          {/* Kept the quote at the bottom */}
          <div className='relative z-20 mt-auto'>
            <blockquote className='space-y-2'>
              <p className='text-lg text-sage-100'>
                &ldquo;We're just getting started.&rdquo;
              </p>
              <footer className='text-sm text-sage-200'>lomi.'s Team</footer>
            </blockquote>
          </div>
        </div>
        <div className='lg:p-8'>
          <div className='mx-auto flex w-full flex-col justify-center space-y-2 sm:w-[350px]'>
            <div className='flex flex-col space-y-2 text-left'>
              <h1 className='text-2xl font-semibold tracking-tight'>Welcome back</h1>
            </div>
            {/* Added a margin-bottom to adjust space modularly */}
            <div className='mb-4'></div>
            <UserAuthForm />
          </div>
        </div>
      </div>
    </>
  )
}