import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/custom/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { supabase } from '@/utils/supabase/client'
import { toast } from '@/components/ui/use-toast'
import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useTranslation } from 'react-i18next'
import { ChevronLeft } from 'lucide-react'

const formSchema = z.object({
    password: z.string().min(8, 'Password must be at least 8 characters'),
    confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
})

export default function ResetPassword() {
    const { t } = useTranslation()
    const [isLoading, setIsLoading] = useState(false)
    const navigate = useNavigate()

    const { register, handleSubmit, formState: { errors } } = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
    })

    const onSubmit = async (data: z.infer<typeof formSchema>) => {
        setIsLoading(true)
        try {
            const { error } = await supabase.auth.updateUser({ password: data.password })
            if (error) throw error
            toast({
                title: t('auth.pages.reset_password.success.title'),
                description: t('auth.pages.reset_password.success.description'),
            })
            navigate('/portal')
        } catch (error) {
            console.error('Error resetting password:', error)
            toast({
                title: t('auth.pages.reset_password.error.title'),
                description: t('auth.pages.reset_password.error.description'),
                variant: "destructive",
            })
        } finally {
            setIsLoading(false)
        }
    }

    return (
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
                    <h1 className='text-2xl font-semibold tracking-tight mb-4'>{t('auth.pages.reset_password.title')}</h1>
                    <form onSubmit={handleSubmit(onSubmit)}>
                        <div className='grid gap-4'>
                            <div className='grid gap-2'>
                                <Label htmlFor='password'>{t('auth.pages.reset_password.new_password')}</Label>
                                <Input
                                    id='password'
                                    type='password'
                                    placeholder={t('auth.pages.reset_password.placeholder.new')}
                                    {...register('password')}
                                    className='h-12 border border-gray-300 rounded-none focus:border-blue-500 focus:ring-blue-500'
                                />
                                {errors.password && <p className='text-red-500 text-sm'>{t('auth.pages.reset_password.validation.min_length')}</p>}
                            </div>
                            <div className='grid gap-2'>
                                <Label htmlFor='confirmPassword'>{t('auth.pages.reset_password.confirm_password')}</Label>
                                <Input
                                    id='confirmPassword'
                                    type='password'
                                    placeholder={t('auth.pages.reset_password.placeholder.confirm')}
                                    {...register('confirmPassword')}
                                    className='h-12 border border-gray-300 rounded-none focus:border-blue-500 focus:ring-blue-500'
                                />
                                {errors.confirmPassword && <p className='text-red-500 text-sm'>{t('auth.pages.reset_password.validation.match')}</p>}
                            </div>
                            <Button type='submit' className='w-full' disabled={isLoading}>
                                {isLoading ? t('auth.pages.reset_password.button.processing') : t('auth.pages.reset_password.button.submit')}
                            </Button>
                        </div>
                    </form>
                </Card>
            </div>
        </div>
    )
}