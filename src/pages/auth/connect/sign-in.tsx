import { UserAuthForm } from '@/components/auth/user-auth-form'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { AnimatedBeamMultipleOutputDemo } from '@/components/landing/beam-multiple-outputs'
import { ButtonExpandBack } from '@/components/design/button-expand'

export default function SignIn() {
  const { t } = useTranslation()

  return (
    <>
      <div className='container relative grid h-svh flex-col items-center justify-center lg:max-w-none lg:grid-cols-2 lg:px-0'>
        <div className='relative hidden h-full flex-col bg-muted p-10 text-white dark:border-r lg:flex'>
          <div className='absolute inset-0 bg-black' />
          <Link to="/">
            <ButtonExpandBack
              text={t('auth.sign_in.home_link')}
            />
          </Link>
          <div className='relative z-20 flex items-center justify-center flex-grow'>
            <AnimatedBeamMultipleOutputDemo />
          </div>
          <div className='relative z-20 mt-auto'>
            <blockquote className='space-y-2'>
              <p className='text-lg text-sage-100'>
                {t('auth.sign_in.quote')}
              </p>
              <footer className='text-sm text-sage-200'>{t('auth.sign_in.company')}</footer>
            </blockquote>
          </div>
        </div>
        <div className='lg:p-8'>
          <div className='mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[480px] lg:p-8'>
            <div className='flex flex-col space-y-2 text-left'>
              <h1 className='text-2xl font-semibold tracking-tight'>{t('auth.sign_in.title')}</h1>
              <p className='text-sm text-muted-foreground'>
                {t('auth.sign_in.subtitle')}
              </p>
            </div>
            <UserAuthForm />
          </div>
        </div>
      </div>
    </>
  )
}