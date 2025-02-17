import { useState } from 'react'
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { supabase } from '@/utils/supabase/client'
import { toast } from '@/lib/hooks/use-toast'
import { Loader2Icon, ChevronDown } from 'lucide-react'
import { cn } from '@/lib/actions/utils'
import { organizationPositions } from '@/lib/data/onboarding'

const inviteFormSchema = z.object({
    email: z.string().email("Please enter a valid email address"),
    role: z.enum(["Admin", "Member"]),
    position: z.string().min(2, "Position must be at least 2 characters").max(50, "Position must be less than 50 characters"),
})

type InviteFormValues = z.infer<typeof inviteFormSchema>

interface InviteMemberFormProps {
    organizationId: string;
    onInviteSuccess: () => void;
}

export function InviteMemberForm({ organizationId, onInviteSuccess }: InviteMemberFormProps) {
    const [loading, setLoading] = useState(false)
    const { register, handleSubmit, formState: { errors } } = useForm<InviteFormValues>({
        resolver: zodResolver(inviteFormSchema),
        defaultValues: {
            email: "",
            role: "Member",
            position: "",
        },
    })

    const onSubmit = async (data: InviteFormValues) => {
        setLoading(true)
        try {
            const { error } = await supabase.rpc('invite_team_member', {
                p_organization_id: organizationId,
                p_email: data.email,
                p_role: data.role,
                p_position: data.position
            })

            if (error) throw error

            toast({
                title: "Success",
                description: "Invitation sent successfully",
            })
            onInviteSuccess()
        } catch (error) {
            console.error('Error sending invitation:', error)
            toast({
                title: "Error",
                description: "Failed to send invitation",
                variant: "destructive",
            })
        } finally {
            setLoading(false)
        }
    }

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                    id="email"
                    type="email"
                    placeholder="member@company.com"
                    {...register('email')}
                    className={cn("rounded-none", errors.email && "border-red-500")}
                    disabled={loading}
                />
                {errors.email && (
                    <p className="text-sm text-red-500">{errors.email.message}</p>
                )}
            </div>

            <div className="space-y-2">
                <Label htmlFor="role">Role</Label>
                <div className="relative">
                    <select
                        id="role"
                        {...register('role')}
                        className={cn(
                            "w-full px-3 py-2 border h-10 rounded-none appearance-none",
                            "focus:ring-1 focus:ring-primary focus:ring-offset-0 focus:outline-none",
                            "dark:bg-gray-700 dark:border-gray-600 dark:text-white",
                            "pr-10" // Add padding for the icon
                        )}
                        disabled={loading}
                    >
                        <option value="Member">Member</option>
                        <option value="Admin">Admin</option>
                    </select>
                    <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 opacity-50" />
                </div>
                {errors.role && (
                    <p className="text-sm text-red-500">{errors.role.message}</p>
                )}
            </div>

            <div className="space-y-2">
                <Label htmlFor="position">Position</Label>
                <select
                    id="position"
                    {...register('position')}
                    className={cn(
                        "w-full px-3 py-2 border h-10 rounded-none appearance-none",
                        "focus:ring-1 focus:ring-primary focus:ring-offset-0 focus:outline-none",
                        "dark:bg-gray-700 dark:border-gray-600 dark:text-white",
                        "pr-10", // Add padding for the icon
                        errors.position && "border-red-500"
                    )}
                    disabled={loading}
                >
                    <option value="">Select a position</option>
                    {organizationPositions.map((position) => (
                        <option key={position} value={position}>
                            {position.replace('_', ' ')}
                        </option>
                    ))}
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 opacity-50" />
                {errors.position && (
                    <p className="text-sm text-red-500">{errors.position.message}</p>
                )}
            </div>

            <Button
                type="submit"
                className="w-full rounded-none"
                disabled={loading}
            >
                {loading ? (
                    <>
                        <Loader2Icon className="mr-2 h-4 w-4 animate-spin" />
                        Sending...
                    </>
                ) : (
                    "Send Invitation"
                )}
            </Button>
        </form>
    )
}