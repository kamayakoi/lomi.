import { useState, useEffect, useRef, useCallback } from 'react'
import ContentSection from '@/components/dashboard/content-section'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { CopyIcon } from '@radix-ui/react-icons'
import { supabase } from '@/utils/supabase/client'
import { toast } from '@/components/ui/use-toast'
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Skeleton } from "@/components/ui/skeleton"
import LogoUploader from '@/components/auth/logo-uploader'
import { PencilIcon, CheckIcon } from 'lucide-react'

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

export default function Business() {
    const [organization, setOrganization] = useState<OrganizationDetails | null>(null)
    const [loading, setLoading] = useState(true)
    const [logoUrl, setLogoUrl] = useState<string | null>(null)
    const addressRef = useRef<HTMLTextAreaElement>(null);
    const [isCopied, setIsCopied] = useState(false);
    const [editedOrganization, setEditedOrganization] = useState<OrganizationDetails | null>(null);
    const [isEditing, setIsEditing] = useState(false);

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
            maxHeight: '100vh',
            scrollbarWidth: 'none',
            msOverflowStyle: 'none',
            WebkitOverflowScrolling: 'touch'
        }}>
            <style>{`
                div::-webkit-scrollbar {
                    display: none;
                }
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
                                        className="bg-muted rounded-none"
                                    />
                                </div>
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
                </>
            </ContentSection>
        </div>
    )
}