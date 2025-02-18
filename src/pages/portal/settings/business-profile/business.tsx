import { useState, useEffect, useRef, useCallback } from 'react'
import ContentSection from '@/components/portal/content-section'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { CopyIcon } from '@radix-ui/react-icons'
import { supabase } from '@/utils/supabase/client'
import { toast } from '@/lib/hooks/use-toast'
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Skeleton } from "@/components/ui/skeleton"
import LogoUploader from '@/components/auth/logo-uploader'
import { PencilIcon, CheckIcon, MoreVerticalIcon, UserPlusIcon, CheckCircle2 } from 'lucide-react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { InviteMemberForm } from './invite-member-form'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { format } from "date-fns"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog"
import { cn } from "@/lib/actions/utils"
import { Separator } from "@/components/ui/separator"

interface OrganizationDetails {
    organization_id: string;
    name: string;
    email: string;
    logo_url: string | null;
    website_url: string | null;
    verified: boolean;
    default_currency: 'XOF' | 'USD' | 'EUR';
    country: string;
    region: string;
    city: string;
    district: string;
    street: string;
    postal_code: string;
}

interface TeamMember {
    merchant_id: string | null;
    merchant_name: string | null;
    merchant_email: string;
    role: 'Admin' | 'Member';
    team_status: 'active' | 'invited' | 'inactive';
    organization_position: string | null;
    invitation_email: string | null;
    created_at: string;
}

const styles = `
@keyframes check {
    0% {
        transform: scale(0) translateY(-50%) rotate(-90deg);
        opacity: 0;
    }
    50% {
        transform: scale(1.2) translateY(-50%);
        opacity: 0.8;
    }
    100% {
        transform: scale(1) translateY(-50%);
        opacity: 1;
    }
}
`;

export default function Business() {
    const [organization, setOrganization] = useState<OrganizationDetails | null>(null)
    const [loading, setLoading] = useState(true)
    const [logoUrl, setLogoUrl] = useState<string | null>(null)
    const addressRef = useRef<HTMLTextAreaElement>(null);
    const [isCopied, setIsCopied] = useState(false);
    const [editedOrganization, setEditedOrganization] = useState<OrganizationDetails | null>(null);
    const [isEditing, setIsEditing] = useState(false);
    const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
    const [isAdmin, setIsAdmin] = useState(false);
    const [deleteConfirmation, setDeleteConfirmation] = useState('');

    const fetchTeamMembers = useCallback(async () => {
        try {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) throw new Error('No user found');

            // Check if current user is admin
            const { data: adminCheck } = await supabase.rpc('is_organization_admin', {
                p_merchant_id: user.id,
                p_organization_id: organization?.organization_id
            });
            setIsAdmin(adminCheck);

            // Fetch team members
            const { data, error } = await supabase.rpc('fetch_team_members', {
                p_organization_id: organization?.organization_id
            });

            if (error) throw error;
            setTeamMembers(data);

        } catch (error) {
            console.error('Error fetching team members:', error);
            toast({
                title: "Error",
                description: "Failed to fetch team members",
                variant: "destructive",
            });
        }
    }, [organization?.organization_id]);

    useEffect(() => {
        if (organization) {
            fetchTeamMembers();
        }
    }, [organization, fetchTeamMembers]);

    useEffect(() => {
        if (organization) {
            setEditedOrganization(organization);
        }
    }, [organization]);

    const cancelEdit = useCallback(() => {
        setIsEditing(false);
        setEditedOrganization(organization);
    }, [organization]);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (isEditing) {
                const target = event.target as HTMLElement;
                if (!target.closest('.relative') && !target.closest('button')) {
                    cancelEdit();
                }
            }
        };

        const handleKeyDown = (event: KeyboardEvent) => {
            if (isEditing && event.key === 'Enter') {
                cancelEdit();
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        document.addEventListener('keydown', handleKeyDown);

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
            document.removeEventListener('keydown', handleKeyDown);
        };
    }, [isEditing, cancelEdit]);

    useEffect(() => {
        fetchOrganization()
    }, [])

    useEffect(() => {
        if (addressRef.current) {
            adjustTextareaHeight(addressRef.current);
        }
    }, [organization]);

    const adjustTextareaHeight = (element: HTMLTextAreaElement) => {
        element.style.height = 'auto';
        element.style.height = `${element.scrollHeight}px`;
    };

    async function handleLogoUpdate(newLogoUrl: string) {
        setLogoUrl(newLogoUrl);
        if (!organization) return;

        try {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) throw new Error('No user found');

            // Extract the relative path from the full URL
            const relativeLogoPath = newLogoUrl.replace(/^.*\/logos\//, '');

            const { error: updateError } = await supabase.rpc('update_organization_logo', {
                p_organization_id: organization.organization_id,
                p_logo_url: relativeLogoPath
            });

            if (updateError) throw updateError;

            // Update the local state with the new logo URL
            setOrganization({ ...organization, logo_url: relativeLogoPath });
            toast({
                title: "Success",
                description: "Logo updated successfully",
            });

            // Refresh the organization data to ensure we have the latest information
            await fetchOrganization();
        } catch (error) {
            console.error('Error uploading logo:', error);
            toast({
                title: "Error",
                description: "Failed to upload logo",
                variant: "destructive",
            });
        }
    }

    const copyBusinessId = () => {
        if (organization?.organization_id) {
            navigator.clipboard.writeText(organization.organization_id);
            setIsCopied(true);
            toast({
                title: "Copied!",
                description: "Business ID has been copied to clipboard",
                duration: 3000,
            });
            setTimeout(() => setIsCopied(false), 2000); // Reset after 2 seconds
        }
    };

    const handleInputChange = (field: keyof OrganizationDetails, value: string) => {
        if (!editedOrganization) return;
        setEditedOrganization({ ...editedOrganization, [field]: value });
    };

    const handleFieldValidate = useCallback(async (field: keyof OrganizationDetails) => {
        if (!editedOrganization) return;

        try {
            console.log('Updating organization with:', {
                p_organization_id: editedOrganization.organization_id,
                p_name: editedOrganization.name,
                p_email: editedOrganization.email,
                p_website_url: editedOrganization.website_url,
                p_verified: editedOrganization.verified,
                p_default_currency: editedOrganization.default_currency
            });

            const { error } = await supabase.rpc('update_organization_details', {
                p_organization_id: editedOrganization.organization_id,
                p_name: editedOrganization.name,
                p_email: editedOrganization.email,
                p_website_url: editedOrganization.website_url,
                p_verified: editedOrganization.verified,
                p_default_currency: editedOrganization.default_currency as 'XOF' | 'USD' | 'EUR'
            });

            if (error) {
                console.error('Supabase error:', error);
                throw error;
            }

            setOrganization(editedOrganization);
            setIsEditing(false);
            toast({
                title: "Success",
                description: `${field.charAt(0).toUpperCase() + field.slice(1)} updated successfully`,
            });
        } catch (error) {
            console.error('Error updating field:', error);
            toast({
                title: "Error",
                description: "Failed to update field",
                variant: "destructive",
            });
        }
    }, [editedOrganization]);

    const handleFieldEdit = (field: string) => {
        setIsEditing(true);
        setTimeout(() => {
            const element = document.getElementById(field);
            if (element) element.focus();
        }, 0);
    };

    useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            if (isEditing && event.key === 'Enter') {
                const activeElement = document.activeElement as HTMLElement;
                const field = activeElement?.id;
                if (field) {
                    handleFieldValidate(field as keyof OrganizationDetails);
                }
            }
        };

        document.addEventListener('keydown', handleKeyDown);
        return () => {
            document.removeEventListener('keydown', handleKeyDown);
        };
    }, [isEditing, handleFieldValidate]);

    const fetchOrganization = async () => {
        if (typeof window === 'undefined') return

        try {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) throw new Error('No user found');

            const { data, error } = await supabase
                .rpc('fetch_organization_details', { p_merchant_id: user.id });

            if (error) {
                console.error('Supabase function error:', error);
                throw error;
            }

            if (data && data.length > 0) {
                setOrganization(data[0] as OrganizationDetails);

                // Extract the relative path from the logo URL
                const logoPath = data[0].logo_url?.replace(/^.*\/logos\//, '');

                if (logoPath) {
                    // Download the organization logo using the relative path
                    const { data: logoData, error: logoError } = await supabase
                        .storage
                        .from('logos')
                        .download(logoPath);

                    if (logoError) {
                        console.error('Error downloading logo:', logoError);
                    } else {
                        const logoUrl = URL.createObjectURL(logoData);
                        setLogoUrl(logoUrl);
                    }
                }
            } else {
                console.error('No organization data found');
                throw new Error('No organization found.');
            }
        } catch (error) {
            console.error('Error fetching organization:', error);
            toast({
                title: "Error",
                description: "Failed to fetch organization details",
                variant: "destructive",
            });
        } finally {
            setLoading(false);
        }
    }

    const handleChangeRole = async (member: TeamMember) => {
        try {
            const newRole = member.role === 'Admin' ? 'Member' : 'Admin';
            const { data: success, error } = await supabase.rpc('update_team_member_role', {
                p_organization_id: organization?.organization_id,
                p_merchant_id: member.merchant_id,
                p_new_role: newRole
            });

            if (error) throw error;

            if (!success) {
                toast({
                    title: "Error",
                    description: "Cannot change the last admin to a member. Organizations must have at least one admin.",
                    variant: "destructive",
                });
                return;
            }

            toast({
                title: "Success",
                description: "Role updated successfully",
            });

            fetchTeamMembers();
        } catch (error) {
            console.error('Error updating role:', error);
            toast({
                title: "Error",
                description: "Failed to update role",
                variant: "destructive",
            });
        }
    };

    const handleRemoveMember = async (member: TeamMember) => {
        try {
            const { error } = await supabase.rpc('remove_team_member', {
                p_organization_id: organization?.organization_id,
                p_merchant_id: member.merchant_id
            });

            if (error) throw error;

            toast({
                title: "Success",
                description: "Team member removed successfully",
            });

            fetchTeamMembers();
        } catch (error) {
            console.error('Error removing member:', error);
            toast({
                title: "Error",
                description: "Failed to remove team member",
                variant: "destructive",
            });
        }
    };

    if (typeof window === 'undefined' || loading) {
        return (
            <ContentSection
                title="Business"
                desc="Upload your business logo and view your public contact information."
            >
                <div className="space-y-6">
                    <Skeleton className="h-[100px] w-[100px] rounded-full" />
                    <div className="space-y-2">
                        <Skeleton className="h-4 w-[250px]" />
                        <Skeleton className="h-4 w-[200px]" />
                    </div>
                    <div className="grid gap-4 md:grid-cols-2">
                        <div className="space-y-2">
                            <Skeleton className="h-4 w-[100px]" />
                            <Skeleton className="h-10 w-full" />
                        </div>
                        <div className="space-y-2">
                            <Skeleton className="h-4 w-[100px]" />
                            <Skeleton className="h-10 w-full" />
                        </div>
                    </div>
                    <div className="grid gap-4 md:grid-cols-2">
                        <div className="space-y-2">
                            <Skeleton className="h-4 w-[100px]" />
                            <Skeleton className="h-10 w-full" />
                        </div>
                        <div className="space-y-2">
                            <Skeleton className="h-4 w-[100px]" />
                            <Skeleton className="h-10 w-full" />
                        </div>
                    </div>
                </div>
            </ContentSection>
        )
    }

    if (!organization) {
        return (
            <ContentSection
                title="Business Not Found"
                desc="We couldn't find your business profile."
            >
                <div>
                    No business found. Please ensure you&apos;re logged in and have business data associated with your account.
                </div>
            </ContentSection>
        )
    }

    return (
        <div style={{
            overflowY: 'auto',
            overflowX: 'hidden',
            maxHeight: '100vh',
            scrollbarWidth: 'none',
            msOverflowStyle: 'none',
            WebkitOverflowScrolling: 'touch'
        }}>
            <style>{`
                div::-webkit-scrollbar {
                    display: none;
                }
                ${styles}
            `}</style>
            <ContentSection
                title="Business"
                desc="Upload your business logo and view your public contact information."
            >
                <>
                    <div className="space-y-6">
                        <Alert variant="info">
                            <AlertDescription>
                                This information helps customers recognize your business, and may appear in your payment statements, invoices, and receipts.
                            </AlertDescription>
                        </Alert>

                        <LogoUploader
                            currentLogo={logoUrl}
                            onLogoUpdate={handleLogoUpdate}
                            companyName={organization?.name || ''}
                        />

                        <div className="grid gap-4 md:grid-cols-2">
                            <div className="grid gap-2">
                                <Label htmlFor="name">Business name</Label>
                                <div className="relative ml-[1px]">
                                    <Input
                                        id="name"
                                        value={editedOrganization?.name || ''}
                                        onChange={(e) => handleInputChange('name', e.target.value)}
                                        className={`${!isEditing ? "bg-muted" : ""} rounded-none pr-8`}
                                        readOnly={!isEditing}
                                        onKeyDown={(e) => {
                                            if (e.key === 'Enter') {
                                                handleFieldValidate('name');
                                            }
                                        }}
                                    />
                                    {!isEditing ? (
                                        <button
                                            onClick={() => handleFieldEdit('name')}
                                            className="absolute right-2 top-1/2 -translate-y-1/2 text-blue-500 hover:text-blue-600 transition-colors"
                                        >
                                            <PencilIcon className="h-3 w-3" />
                                        </button>
                                    ) : (
                                        <button
                                            onClick={() => handleFieldValidate('name')}
                                            className="absolute right-2 top-1/2 -translate-y-1/2 text-green-500 hover:text-green-600 transition-colors"
                                        >
                                            <CheckIcon className="h-4 w-4" />
                                        </button>
                                    )}
                                </div>
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="email">Business email</Label>
                                <div className="relative">
                                    <Input
                                        id="email"
                                        type="email"
                                        value={editedOrganization?.email || ''}
                                        onChange={(e) => handleInputChange('email', e.target.value)}
                                        className={`${!isEditing ? "bg-muted" : ""} rounded-none pr-8`}
                                        readOnly={!isEditing}
                                        onKeyDown={(e) => {
                                            if (e.key === 'Enter') {
                                                handleFieldValidate('email');
                                            }
                                        }}
                                    />
                                    {!isEditing ? (
                                        <button
                                            onClick={() => handleFieldEdit('email')}
                                            className="absolute right-2 top-1/2 -translate-y-1/2 text-blue-500 hover:text-blue-600 transition-colors"
                                        >
                                            <PencilIcon className="h-3 w-3" />
                                        </button>
                                    ) : (
                                        <button
                                            onClick={() => handleFieldValidate('email')}
                                            className="absolute right-2 top-1/2 -translate-y-1/2 text-green-500 hover:text-green-600 transition-colors"
                                        >
                                            <CheckIcon className="h-4 w-4" />
                                        </button>
                                    )}
                                </div>
                            </div>
                        </div>

                        <div className="grid gap-4 md:grid-cols-2">
                            <div className="grid gap-2">
                                <Label htmlFor="business-id">Business ID</Label>
                                <div className="flex ml-[1px]">
                                    <Input id="business-id" value={organization.organization_id} readOnly className="rounded-none bg-muted" />
                                    <Button
                                        variant={isCopied ? "default" : "outline"}
                                        className={`rounded-none ${isCopied ? 'bg-blue-500 hover:bg-blue-600' : ''}`}
                                        onClick={copyBusinessId}
                                    >
                                        {isCopied ? (
                                            "Copied"
                                        ) : (
                                            <>
                                                <CopyIcon className="h-4 w-4 mr-2" />
                                                Copy
                                            </>
                                        )}
                                    </Button>
                                </div>
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="website">Website URL</Label>
                                <div className="relative">
                                    <Input
                                        id="website"
                                        value={editedOrganization?.website_url || ''}
                                        onChange={(e) => handleInputChange('website_url', e.target.value)}
                                        className={`${!isEditing ? "bg-muted" : ""} rounded-none pr-8`}
                                        readOnly={!isEditing}
                                        onKeyDown={(e) => {
                                            if (e.key === 'Enter') {
                                                handleFieldValidate('website_url');
                                            }
                                        }}
                                    />
                                    {!isEditing ? (
                                        <button
                                            onClick={() => handleFieldEdit('website')}
                                            className="absolute right-2 top-1/2 -translate-y-1/2 text-blue-500 hover:text-blue-600 transition-colors"
                                        >
                                            <PencilIcon className="h-3 w-3" />
                                        </button>
                                    ) : (
                                        <button
                                            onClick={() => handleFieldValidate('website_url')}
                                            className="absolute right-2 top-1/2 -translate-y-1/2 text-green-500 hover:text-green-600 transition-colors"
                                        >
                                            <CheckIcon className="h-4 w-4" />
                                        </button>
                                    )}
                                </div>
                            </div>
                        </div>

                        <div className="grid gap-4 md:grid-cols-2">
                            <div className="grid gap-2">
                                <Label htmlFor="verified">Status</Label>
                                <div className="relative ml-[1px]">
                                    <Input
                                        id="verified"
                                        value={organization.verified ? 'Verified' : 'Unverified'}
                                        readOnly
                                        className={cn(
                                            "bg-muted rounded-none",
                                            organization.verified && "text-emerald-600 dark:text-emerald-400 font-medium"
                                        )}
                                    />
                                    {organization.verified && (
                                        <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center">
                                            <CheckCircle2
                                                className={cn(
                                                    "h-4 w-4 text-emerald-500 dark:text-emerald-400",
                                                    "animate-[check_0.3s_ease-in-out]"
                                                )}
                                            />
                                        </div>
                                    )}
                                </div>
                                {organization.verified && (
                                    <p className="text-xs text-emerald-600 dark:text-emerald-400 mt-1 flex items-center gap-1">
                                        Your business is verified and compliant.
                                    </p>
                                )}
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="default_currency">Currency</Label>
                                <Input
                                    id="default_currency"
                                    value={
                                        organization.default_currency === 'XOF'
                                            ? 'XOF — Franc CFA'
                                            : organization.default_currency === 'USD'
                                                ? 'USD — United States Dollar'
                                                : organization.default_currency === 'EUR'
                                                    ? 'EUR — Euro'
                                                    : organization.default_currency
                                    }
                                    readOnly
                                    className="bg-muted rounded-none"
                                />
                            </div>
                        </div>

                        <div className="grid gap-4 md:grid-cols-2">
                            <div className="grid gap-2">
                                <Label htmlFor="country">Billing country</Label>
                                <div className="relative ml-[1px]">
                                    <Input id="country" value={organization.country || ''} readOnly className="bg-muted rounded-none" />
                                </div>
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="address">Business address</Label>
                                <div className="relative">
                                    <textarea
                                        ref={addressRef}
                                        id="address"
                                        value={`${organization.region || ''}, ${organization.city || ''}, ${organization.district || ''}, ${organization.street || ''}, ${organization.postal_code || ''}`}
                                        readOnly
                                        className="bg-muted w-full px-3 py-2 rounded-none border border-input text-sm resize-none focus:outline-none"
                                        style={{
                                            minHeight: '2.5rem',
                                            overflow: 'hidden',
                                            lineHeight: '1.5',
                                            whiteSpace: 'pre-wrap',
                                            wordBreak: 'break-word'
                                        }}
                                        onChange={() => {
                                            if (addressRef.current) {
                                                adjustTextareaHeight(addressRef.current);
                                            }
                                        }}
                                    />
                                </div>
                            </div>
                        </div>

                        <p className="text-sm text-muted-foreground">
                            Contact <a href="mailto:hello@lomi.africa?subject=[Support] — Updating Business information" className="underline">hello@lomi.africa</a> if you want to update your business details.
                        </p>
                    </div>

                    {/* Team Members Section */}
                    <div className="mt-8 bg-card border">
                        <div className="flex items-center justify-between p-6">
                            <div>
                                <h2 className="text-xl font-semibold">Team Members</h2>
                                <p className="text-sm text-muted-foreground mt-1">
                                    Manage your organization&apos;s team members and their roles.
                                </p>
                            </div>
                            {isAdmin && (
                                <Dialog>
                                    <DialogTrigger asChild>
                                        <Button size="icon" className="h-10 w-10" title="Invite Member">
                                            <UserPlusIcon className="h-4 w-4" />
                                        </Button>
                                    </DialogTrigger>
                                    <DialogContent>
                                        <DialogHeader>
                                            <DialogTitle>Invite a team member</DialogTitle>
                                        </DialogHeader>
                                        <InviteMemberForm
                                            organizationId={organization?.organization_id}
                                            onInviteSuccess={fetchTeamMembers}
                                        />
                                    </DialogContent>
                                </Dialog>
                            )}
                        </div>

                        <Table>
                            <TableHeader>
                                <TableRow className="hover:bg-transparent">
                                    <TableHead className="w-[400px]">Member</TableHead>
                                    <TableHead className="w-[120px]">Role</TableHead>
                                    <TableHead>Position</TableHead>
                                    <TableHead className="w-[100px] text-right">Joined</TableHead>
                                    {isAdmin && <TableHead className="w-[70px]">Actions</TableHead>}
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {teamMembers.map((member) => (
                                    <TableRow key={member.merchant_id || member.invitation_email}>
                                        <TableCell className="font-medium">
                                            <div className="flex items-center gap-3">
                                                <Avatar className="h-8 w-8">
                                                    <AvatarImage
                                                        src={`https://avatar.vercel.sh/${encodeURIComponent(member.merchant_email?.toLowerCase() || '')}?rounded=60`}
                                                        alt={member.merchant_name || member.merchant_email}
                                                    />
                                                    <AvatarFallback>
                                                        {(member.merchant_name || member.merchant_email)
                                                            .split(' ')
                                                            .map(n => n[0])
                                                            .join('')
                                                            .toUpperCase()
                                                            .slice(0, 2)}
                                                    </AvatarFallback>
                                                </Avatar>
                                                <div>
                                                    <div className="flex items-center gap-1.5">
                                                        <span className="font-medium">
                                                            {member.merchant_name || 'Pending'}
                                                        </span>
                                                        <Badge
                                                            variant="outline"
                                                            className={cn(
                                                                "rounded-none px-1 py-0 text-[10px] font-medium h-4",
                                                                member.team_status === 'active'
                                                                    ? "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-400/10 dark:text-emerald-200 dark:border-emerald-400/20"
                                                                    : member.team_status === 'invited'
                                                                        ? "bg-yellow-50 text-yellow-700 border-yellow-200 dark:bg-yellow-400/10 dark:text-yellow-200 dark:border-yellow-400/20"
                                                                        : "bg-red-50 text-red-700 border-red-200 dark:bg-red-400/10 dark:text-red-200 dark:border-red-400/20"
                                                            )}
                                                        >
                                                            {member.team_status}
                                                        </Badge>
                                                    </div>
                                                    <div className="text-xs text-muted-foreground">
                                                        {member.merchant_email}
                                                    </div>
                                                </div>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <Badge
                                                variant="outline"
                                                className={cn(
                                                    "rounded-none text-xs font-medium",
                                                    member.role === 'Admin'
                                                        ? "bg-blue-900/10 text-blue-400 border-blue-800/20 dark:bg-blue-400/10 dark:text-blue-200 dark:border-blue-400/20"
                                                        : "bg-slate-100 text-slate-700 border-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700"
                                                )}
                                            >
                                                {member.role}
                                            </Badge>
                                        </TableCell>
                                        <TableCell className="text-sm">
                                            {member.organization_position}
                                        </TableCell>
                                        <TableCell className="text-xs text-right text-muted-foreground whitespace-nowrap">
                                            {format(new Date(member.created_at), 'MMM d, yyyy')}
                                        </TableCell>
                                        {isAdmin && (
                                            <TableCell>
                                                <DropdownMenu>
                                                    <DropdownMenuTrigger asChild>
                                                        <Button
                                                            variant="ghost"
                                                            size="sm"
                                                            className="h-8 w-8 p-0"
                                                        >
                                                            <MoreVerticalIcon className="h-4 w-4" />
                                                        </Button>
                                                    </DropdownMenuTrigger>
                                                    <DropdownMenuContent align="end">
                                                        <DropdownMenuItem
                                                            onClick={() => handleChangeRole(member)}
                                                            className="text-xs"
                                                        >
                                                            Change to {member.role === 'Admin' ? 'Member' : 'Admin'}
                                                        </DropdownMenuItem>
                                                        <AlertDialog>
                                                            <AlertDialogTrigger asChild>
                                                                <DropdownMenuItem
                                                                    className="text-destructive text-xs"
                                                                    onSelect={(e) => e.preventDefault()}
                                                                >
                                                                    Remove member
                                                                </DropdownMenuItem>
                                                            </AlertDialogTrigger>
                                                            <AlertDialogContent>
                                                                <AlertDialogHeader>
                                                                    <AlertDialogTitle>Remove team member</AlertDialogTitle>
                                                                    <AlertDialogDescription>
                                                                        Are you sure you want to remove {member.merchant_name || member.merchant_email}?
                                                                        This action cannot be undone.
                                                                    </AlertDialogDescription>
                                                                </AlertDialogHeader>
                                                                <AlertDialogFooter>
                                                                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                                                                    <AlertDialogAction
                                                                        onClick={() => handleRemoveMember(member)}
                                                                        className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                                                                    >
                                                                        Remove
                                                                    </AlertDialogAction>
                                                                </AlertDialogFooter>
                                                            </AlertDialogContent>
                                                        </AlertDialog>
                                                    </DropdownMenuContent>
                                                </DropdownMenu>
                                            </TableCell>
                                        )}
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </div>

                    {/* Delete Account Section */}
                    <div className="mt-8">
                        <Separator className="my-8" />
                        <div className="space-y-3 p-6 bg-red-50/50 dark:bg-red-950/50 border border-red-200 dark:border-red-800/50">
                            <h2 className="text-xl font-semibold text-red-600 dark:text-red-400">Danger zone</h2>
                            <p className="text-sm text-red-600/80 dark:text-red-400/80">
                                Once you delete your account, there is no going back as we can&apos;t recover your data. Please be sure you want to do this.
                            </p>
                            <AlertDialog>
                                <AlertDialogTrigger asChild>
                                    <Button
                                        variant="destructive"
                                        className="bg-red-600 hover:bg-red-700 dark:bg-red-900 dark:hover:bg-red-800"
                                    >
                                        Delete account
                                    </Button>
                                </AlertDialogTrigger>
                                <AlertDialogContent>
                                    <AlertDialogHeader>
                                        <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                                        <AlertDialogDescription className="space-y-4">
                                            <div>
                                                This action will permanently deactivate your account
                                                and remove your access to all organizations you&apos;re a member of.
                                            </div>
                                            {isAdmin && (
                                                <div className="font-medium text-red-600 dark:text-red-400">
                                                    Warning: As you are the only admin of this organization,
                                                    the organization will also be deleted.
                                                </div>
                                            )}
                                            <div className="space-y-2 pt-4">
                                                <Label htmlFor="confirm" className="text-sm font-medium">
                                                    Please type &apos;<span className="font-semibold text-red-500">{organization.name}</span>&apos; to confirm
                                                </Label>
                                                <Input
                                                    id="confirm"
                                                    className="rounded-none"
                                                    placeholder={organization.name}
                                                    value={deleteConfirmation}
                                                    onChange={(e) => setDeleteConfirmation(e.target.value)}
                                                />
                                            </div>
                                        </AlertDialogDescription>
                                    </AlertDialogHeader>
                                    <AlertDialogFooter>
                                        <AlertDialogCancel onClick={() => setDeleteConfirmation('')}>Cancel</AlertDialogCancel>
                                        <AlertDialogAction
                                            data-delete-button
                                            disabled={deleteConfirmation !== organization.name}
                                            className="bg-destructive text-destructive-foreground hover:bg-destructive/90 disabled:opacity-50"
                                            onClick={async () => {
                                                try {
                                                    const { data: { user } } = await supabase.auth.getUser()
                                                    if (!user) throw new Error('No user found')

                                                    const { error } = await supabase
                                                        .rpc('soft_delete_merchant', {
                                                            p_merchant_id: user.id
                                                        })

                                                    if (error) throw error

                                                    toast({
                                                        title: "Account Deleted",
                                                        description: "Your account has been successfully deleted.",
                                                    })

                                                    // Clear all local storage and session data
                                                    localStorage.clear();
                                                    sessionStorage.clear();

                                                    await supabase.auth.signOut({ scope: 'global' });
                                                    window.location.href = '/';
                                                } catch (error) {
                                                    console.error('Error deleting account:', error)
                                                    toast({
                                                        title: "Error",
                                                        description: "Failed to delete account",
                                                        variant: "destructive",
                                                    })
                                                }
                                            }}
                                        >
                                            Delete Account
                                        </AlertDialogAction>
                                    </AlertDialogFooter>
                                </AlertDialogContent>
                            </AlertDialog>
                        </div>
                    </div>
                </>
            </ContentSection>
        </div>
    )
}