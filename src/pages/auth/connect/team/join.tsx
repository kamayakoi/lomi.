import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { supabase } from '@/utils/supabase/client'
import { toast } from '@/lib/hooks/use-toast'
import { Loader2Icon } from 'lucide-react'
import { z } from "zod"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"

interface InvitationData {
    invitation_email: string;
    role: 'Admin' | 'Member';
    organizations: {
        name: string;
    };
}

const signupSchema = z.object({
    name: z.string().min(2, "Name must be at least 2 characters"),
    email: z.string().email("Please enter a valid email address"),
    password: z.string().min(8, "Password must be at least 8 characters"),
})

type SignupValues = z.infer<typeof signupSchema>

export default function TeamSignup() {
    const [loading, setLoading] = useState(false)
    const [invitationDetails, setInvitationDetails] = useState<{
        organization_name: string;
        role: string;
        email: string;
    } | null>(null)
    const navigate = useNavigate()
    const { token } = useParams()

    const form = useForm<SignupValues>({
        resolver: zodResolver(signupSchema),
        defaultValues: {
            name: "",
            email: "",
            password: "",
        },
    })

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

                setInvitationDetails({
                    organization_name: data.organizations.name,
                    role: data.role,
                    email: data.invitation_email,
                })

                // Pre-fill the email field
                form.setValue('email', data.invitation_email)
            } catch (error) {
                console.error('Error validating invitation:', error)
                toast({
                    title: "Error",
                    description: "Failed to validate invitation",
                    variant: "destructive",
                })
                navigate('/auth/connect/sign-in')
            }
        }

        validateInvitation()
    }, [token, navigate, form])

    const onSubmit = async (data: SignupValues) => {
        if (!invitationDetails || !token) return

        setLoading(true)
        try {
            // 1. Create the user account
            const { data: authData, error: authError } = await supabase.auth.signUp({
                email: data.email,
                password: data.password,
                options: {
                    data: {
                        name: data.name,
                    }
                }
            })

            if (authError) throw authError

            // 2. Create merchant record
            const { error: merchantError } = await supabase
                .from('merchants')
                .insert([{
                    merchant_id: authData.user?.id,
                    name: data.name,
                    email: data.email,
                }])
                .single()

            if (merchantError) throw merchantError

            // 3. Update the organization link
            const { error: linkError } = await supabase
                .from('merchant_organization_links')
                .update({
                    merchant_id: authData.user?.id,
                    team_status: 'active',
                    invitation_email: null,
                })
                .eq('invitation_token', token)

            if (linkError) throw linkError

            toast({
                title: "Success",
                description: "Your account has been created and linked to the organization",
            })

            // 4. Redirect to the portal
            navigate('/portal')
        } catch (error) {
            console.error('Error during signup:', error)
            toast({
                title: "Error",
                description: "Failed to create account",
                variant: "destructive",
            })
        } finally {
            setLoading(false)
        }
    }

    if (!invitationDetails) {
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
                        Create your account
                    </h1>
                    <p className="text-sm text-muted-foreground">
                        You&apos;ve been invited to join {invitationDetails.organization_name} as {invitationDetails.role}
                    </p>
                </div>

                <div className="grid gap-6">
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                            <FormField
                                control={form.control}
                                name="name"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Full Name</FormLabel>
                                        <FormControl>
                                            <Input
                                                placeholder="John Doe"
                                                {...field}
                                                disabled={loading}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="email"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Email</FormLabel>
                                        <FormControl>
                                            <Input
                                                {...field}
                                                type="email"
                                                disabled={true}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="password"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Password</FormLabel>
                                        <FormControl>
                                            <Input
                                                {...field}
                                                type="password"
                                                disabled={loading}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <Button type="submit" className="w-full" disabled={loading}>
                                {loading ? (
                                    <>
                                        <Loader2Icon className="mr-2 h-4 w-4 animate-spin" />
                                        Creating Account...
                                    </>
                                ) : (
                                    "Create Account"
                                )}
                            </Button>
                        </form>
                    </Form>
                </div>
            </div>
        </div>
    )
} 