import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { supabase } from '@/utils/supabase/client'
import { toast } from '@/lib/hooks/use-toast'
import { Loader2Icon } from 'lucide-react'
import { Alert, AlertDescription } from "@/components/ui/alert"

interface InvitationData {
    invitation_email: string;
    role: 'Admin' | 'Member';
    organizations: {
        name: string;
    };
}

interface InvitationDetails {
    organization_name: string;
    role: string;
    email: string;
}

export default function AcceptInvitation() {
    const [loading, setLoading] = useState(true)
    const [invitationDetails, setInvitationDetails] = useState<InvitationDetails | null>(null)
    const navigate = useNavigate()
    const { token } = useParams()

    useEffect(() => {
        async function validateInvitation() {
            try {
                if (!token) {
                    toast({
                        title: "Invalid Invitation",
                        description: "No invitation token provided",
                        variant: "destructive",
                    })
                    navigate('/auth/connect/sign-in')
                    return
                }

                // Get current user
                const { data: { user } } = await supabase.auth.getUser()
                if (!user) {
                    // If not logged in, redirect to login with return URL
                    navigate(`/auth/connect/sign-in?returnTo=/auth/connect/team/accept/${token}`)
                    return
                }

                // Fetch invitation details
                const { data, error } = await supabase
                    .from('merchant_organization_links')
                    .select(`
                        invitation_email,
                        role,
                        organizations (
                            name
                        )
                    `)
                    .eq('invitation_token', token)
                    .eq('team_status', 'invited')
                    .single<InvitationData>()

                if (error || !data) {
                    toast({
                        title: "Invalid Invitation",
                        description: "This invitation is no longer valid",
                        variant: "destructive",
                    })
                    navigate('/auth/connect/sign-in')
                    return
                }

                // Verify the invitation is for the current user
                const { data: merchantData } = await supabase
                    .from('merchants')
                    .select('email')
                    .eq('merchant_id', user.id)
                    .single()

                if (merchantData?.email !== data.invitation_email) {
                    toast({
                        title: "Invalid Invitation",
                        description: "This invitation was sent to a different email address",
                        variant: "destructive",
                    })
                    navigate('/auth/connect/sign-in')
                    return
                }

                setInvitationDetails({
                    organization_name: data.organizations.name,
                    role: data.role,
                    email: data.invitation_email,
                })
            } catch (error) {
                console.error('Error validating invitation:', error)
                toast({
                    title: "Error",
                    description: "Failed to validate invitation",
                    variant: "destructive",
                })
                navigate('/auth/connect/sign-in')
            } finally {
                setLoading(false)
            }
        }

        validateInvitation()
    }, [token, navigate])

    const handleAccept = async () => {
        if (!invitationDetails || !token) return

        setLoading(true)
        try {
            const { data: { user } } = await supabase.auth.getUser()
            if (!user) throw new Error('No user found')

            // Update the organization link
            const { error: linkError } = await supabase
                .from('merchant_organization_links')
                .update({
                    merchant_id: user.id,
                    team_status: 'active',
                    invitation_email: null,
                })
                .eq('invitation_token', token)

            if (linkError) throw linkError

            toast({
                title: "Success",
                description: "You have successfully joined the organization",
            })

            // Redirect to the portal
            navigate('/portal')
        } catch (error) {
            console.error('Error accepting invitation:', error)
            toast({
                title: "Error",
                description: "Failed to accept invitation",
                variant: "destructive",
            })
        } finally {
            setLoading(false)
        }
    }

    if (loading || !invitationDetails) {
        return (
            <div className="flex min-h-screen items-center justify-center">
                <Loader2Icon className="h-6 w-6 animate-spin" />
            </div>
        )
    }

    return (
        <div className="container flex h-screen w-screen flex-col items-center justify-center">
            <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
                <div className="flex flex-col space-y-2 text-center">
                    <h1 className="text-2xl font-semibold tracking-tight">
                        Accept Invitation
                    </h1>
                    <p className="text-sm text-muted-foreground">
                        You&apos;ve been invited to join {invitationDetails.organization_name} as {invitationDetails.role}
                    </p>
                </div>

                <Alert>
                    <AlertDescription>
                        By accepting this invitation, you will be added as a team member to {invitationDetails.organization_name}.
                    </AlertDescription>
                </Alert>

                <Button
                    onClick={handleAccept}
                    className="w-full"
                    disabled={loading}
                >
                    {loading ? (
                        <>
                            <Loader2Icon className="mr-2 h-4 w-4 animate-spin" />
                            Accepting Invitation...
                        </>
                    ) : (
                        "Accept Invitation"
                    )}
                </Button>
            </div>
        </div>
    )
} 