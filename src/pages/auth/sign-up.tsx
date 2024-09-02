import { useState } from 'react'
import { Card } from '@/components/ui/card'
import { SignUpForm } from './components/sign-up-form'
import { supabase } from '@/utils/supabase/client'
import { toast } from '@/components/ui/use-toast'

export default function SignUp() {
  const [isLoading, setIsLoading] = useState(false)
  const [isConfirmationSent, setIsConfirmationSent] = useState(false)

  const handleSignUp = async (data: { email: string; password: string; name: string }): Promise<boolean> => {
    setIsLoading(true)
    try {
      const { data: authData, error } = await supabase.auth.signUp({
        email: data.email,
        password: data.password,
        options: {
          data: {
            name: data.name,
          },
          emailRedirectTo: `${window.location.origin}/auth/callback`,
        },
      })
      if (error) throw error

      if (authData.user) {
        // Create a minimal user profile in the users table
        const { error: profileError } = await supabase
          .from('users')
          .insert([
            {
              user_id: authData.user.id,
              name: data.name,
              email: data.email,
              phone_number: '', // This will be collected during onboarding
              is_admin: false,
              verified: false,
              onboarded: false,
            }
          ])
        if (profileError) throw profileError

        setIsConfirmationSent(true)
        toast({
          title: "Account created",
          description: "Please check your email for the verification link.",
        })
        return true
      }
      return false // If no user was created
    } catch (error) {
      console.error('Error signing up:', error)
      toast({
        title: "Error",
        description: "There was a problem creating your account.",
        variant: "destructive",
      })
      return false
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <>
      <div className='container grid h-svh flex-col items-center justify-center bg-primary-foreground lg:max-w-none lg:px-0'>
        <div className='mx-auto flex w-full flex-col justify-center space-y-2 sm:w-[480px] lg:p-8'>
          <Card className='p-6'>
            <div className='mb-2 flex flex-col space-y-2 text-left'>
              <h1 className='text-2xl font-semibold tracking-tight'>
                Create an account
              </h1>
            </div>
            <div className='mb-4'></div>
            <SignUpForm
              onSubmit={handleSignUp}
              isLoading={isLoading}
              isConfirmationSent={isConfirmationSent}
            />
            <p className='mt-4 px-8 text-center text-sm text-muted-foreground'>
              By creating an account, you agree to our{' '}
              <a
                href='/terms'
                className='underline underline-offset-4 hover:text-primary'
              >
                Terms of Service
              </a>{' '}
              and{' '}
              <a
                href='/privacy'
                className='underline underline-offset-4 hover:text-primary'
              >
                Privacy Policy
              </a>
              .
            </p>
          </Card>
        </div>
      </div>
    </>
  )
}