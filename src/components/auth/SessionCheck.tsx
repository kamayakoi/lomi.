import { useEffect, useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { checkSession } from '@/utils/supabase/client'

interface SessionCheckProps {
    children: React.ReactNode
}

export function SessionCheck({ children }: SessionCheckProps) {
    const [isLoading, setIsLoading] = useState(true)
    const navigate = useNavigate()
    const location = useLocation()

    useEffect(() => {
        const checkUserSession = async () => {
            const session = await checkSession()
            if (session) {
                // User is authenticated
                if (location.pathname === '/sign-in' || location.pathname === '/sign-up') {
                    // Redirect to portal if trying to access login/signup pages
                    navigate('/portal')
                }
            }
            setIsLoading(false)
        }

        checkUserSession()
    }, [navigate, location])

    if (isLoading) {
        return <div>Loading...</div>
    }

    return <>{children}</>
}