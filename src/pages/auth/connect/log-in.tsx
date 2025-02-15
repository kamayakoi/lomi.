import { Card } from '@/components/ui/card'
import { UserAuthForm } from '@/components/auth/user-auth-form'
import { useTranslation } from 'react-i18next'
import { Button } from '@/components/custom/button'
import { ChevronLeft } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

export default function Login() {
  const { t } = useTranslation()
  const navigate = useNavigate()

  return (
    <>
      <div className='container grid h-svh flex-col items-center justify-center lg:max-w-none lg:px-0'>
        <Button
          variant="ghost"
          size="icon"
          className="fixed top-6 left-6 z-50"
          onClick={() => navigate(-1)}
        >
          <ChevronLeft className="h-6 w-6" />
        </Button>

        <div className='mx-auto flex w-full flex-col justify-center space-y-2 sm:w-[480px] lg:p-8'>
          <Card className='p-6'>
            <div className='flex flex-col space-y-2 text-left'>
              <h1 className='text-2xl font-semibold tracking-tight'>{t('auth.pages.sign_in.title')}</h1>
              <p className='text-sm text-muted-foreground'>
                {t('auth.pages.sign_in.subtitle')}
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