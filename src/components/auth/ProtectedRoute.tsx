import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { checkSession } from '@/utils/supabase/client'

interface ProtectedRouteProps {
    children: React.ReactNode
}

export function ProtectedRoute({ children }: ProtectedRouteProps) {
    const [isLoading, setIsLoading] = useState(true)
    const [isAuthenticated, setIsAuthenticated] = useState(false)
    const navigate = useNavigate()

    useEffect(() => {
        const checkAuth = async () => {
            const session = await checkSession()
            if (session) {
                setIsAuthenticated(true)
            } else {
                navigate('/sign-in')
            }
            setIsLoading(false)
        }

        checkAuth()
    }, [navigate])

    if (isLoading) {
        return <div>Loading...</div>
    }

    return isAuthenticated ? <>{children}</> : null
}