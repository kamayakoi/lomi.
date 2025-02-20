import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { PlusIcon } from 'lucide-react';
import { supabase } from '@/utils/supabase/client';
import { useSidebarData } from '@/lib/hooks/use-sidebar-data';
import { CreateOrganizationDialog } from './create-organization-dialog';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { cn } from '@/lib/actions/utils';

interface Organization {
    organization_id: string;
    organization_name: string;
    organization_logo_url: string | null;
    merchant_role: string;
    is_current: boolean;
}

export function OrgSwitcher() {
    const navigate = useNavigate();
    const [createOrgOpen, setCreateOrgOpen] = useState(false);
    const [organizations, setOrganizations] = useState<Organization[]>([]);
    const { sidebarData } = useSidebarData();

    useEffect(() => {
        const fetchOrganizations = async () => {
            try {
                const { data: { user } } = await supabase.auth.getUser();
                if (!user) return;

                const { data, error } = await supabase.rpc('fetch_merchant_organizations', {
                    p_merchant_id: user.id
                });

                if (error) throw error;

                const orgs = data.map((org: Organization) => ({
                    ...org,
                    is_current: Boolean(sidebarData?.organizationId) && org.organization_id === sidebarData?.organizationId
                }));

                setOrganizations(orgs);
            } catch (error) {
                console.error('Error fetching organizations:', error);
            }
        };

        fetchOrganizations();
    }, [sidebarData?.organizationId]);

    const handleOrganizationSwitch = async (orgId: string) => {
        if (orgId === sidebarData?.organizationId) return;
        navigate(`${window.location.pathname}?org=${orgId}`, { replace: true });
        window.location.reload();
    };

    if (!sidebarData?.merchantName) return null;

    return (
        <div className="relative">
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <button className="mt-auto hidden w-full border-t border-border/40 px-4 py-4 md:block hover:bg-accent/30 transition-all duration-200 focus:outline-none focus-visible:outline-none">
                        <div className="flex items-center space-x-3">
                            {sidebarData.organizationLogo ? (
                                <div className="flex h-[36px] w-[36px] items-center justify-center rounded-[5px] bg-primary/5 ring-1 ring-border/50 overflow-hidden transition-all duration-200">
                                    <img
                                        src={sidebarData.organizationLogo}
                                        alt="Organization logo"
                                        className="h-full w-full object-cover"
                                        onError={(e) => {
                                            const target = e.target as HTMLImageElement;
                                            target.onerror = null;
                                            target.src = `https://avatar.vercel.sh/${encodeURIComponent(sidebarData.merchantName?.toLowerCase() || 'org')}?rounded=5`;
                                        }}
                                    />
                                </div>
                            ) : (
                                <div className="flex h-[36px] w-[36px] items-center justify-center rounded-[5px] bg-primary/5 ring-1 ring-border/50 overflow-hidden transition-all duration-200">
                                    <img
                                        src={`https://avatar.vercel.sh/${encodeURIComponent(sidebarData.merchantName.toLowerCase())}?rounded=5`}
                                        alt="Generated avatar"
                                        className="h-full w-full object-cover"
                                    />
                                </div>
                            )}
                            <div className="min-w-0 flex-1 text-left">
                                <div className="truncate text-sm font-medium">
                                    {sidebarData.merchantName}
                                </div>
                                <div className="truncate text-xs text-muted-foreground/80">
                                    {sidebarData.merchantRole} • {sidebarData.organizationName}
                                </div>
                            </div>
                            <div className="text-muted-foreground/30">
                                <svg width="6" height="12" viewBox="0 0 6 12" fill="none" xmlns="http://www.w3.org/2000/svg" className="opacity-60">
                                    <path d="M3 0L6 3H0L3 0Z" fill="currentColor" />
                                    <path d="M3 12L0 9H6L3 12Z" fill="currentColor" />
                                </svg>
                            </div>
                        </div>
                    </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                    className="w-[251px] p-2 rounded-[5px] border-border/40 bg-background/80 backdrop-blur-sm"
                    align="start"
                    sideOffset={-2}
                >
                    <div className="space-y-1">
                        <button
                            onClick={() => setCreateOrgOpen(true)}
                            className="w-full flex items-center space-x-3 p-2 hover:bg-accent/30 transition-all duration-200 rounded-[5px] group"
                        >
                            <div className="flex h-[36px] w-[36px] items-center justify-center rounded-[5px] bg-primary/10 ring-1 ring-primary/20 group-hover:ring-primary/30 group-hover:bg-primary/20 transition-all duration-200">
                                <PlusIcon className="h-4 w-4 text-primary" />
                            </div>
                            <div className="min-w-0 flex-1 text-left">
                                <div className="truncate text-sm font-medium text-primary">
                                    Create
                                </div>
                            </div>
                        </button>

                        {organizations.map((org) => (
                            <button
                                key={org.organization_id}
                                onClick={() => {
                                    if (!org.is_current) {
                                        handleOrganizationSwitch(org.organization_id);
                                    }
                                }}
                                className={cn(
                                    "w-full flex items-center space-x-3 p-2 hover:bg-accent/30 transition-all duration-200 rounded-[5px] group focus:outline-none focus-visible:outline-none",
                                    org.is_current && "bg-accent/20"
                                )}
                            >
                                <div className="h-[36px] w-[36px] rounded-[5px] bg-primary/5 ring-1 ring-border/50 group-hover:ring-border/70 transition-all duration-200 overflow-hidden">
                                    {org.organization_logo_url ? (
                                        <img
                                            src={(() => {
                                                const logoPath = org.organization_logo_url.includes('https://')
                                                    ? org.organization_logo_url.split('/logos/').pop()
                                                    : org.organization_logo_url;
                                                return supabase.storage.from('logos').getPublicUrl(logoPath || '').data.publicUrl;
                                            })()}
                                            alt={org.organization_name}
                                            className="h-full w-full object-cover"
                                            onError={(e) => {
                                                const target = e.target as HTMLImageElement;
                                                target.onerror = null;
                                                target.src = `https://avatar.vercel.sh/${encodeURIComponent(org.organization_name?.toLowerCase() || 'org')}?rounded=5`;
                                            }}
                                        />
                                    ) : (
                                        <img
                                            src={`https://avatar.vercel.sh/${encodeURIComponent(org.organization_name.toLowerCase())}?rounded=5`}
                                            alt={org.organization_name}
                                            className="h-full w-full object-cover"
                                        />
                                    )}
                                </div>
                                <div className="min-w-0 flex-1 text-left">
                                    <div className="truncate text-sm font-medium">
                                        {org.organization_name}
                                    </div>
                                </div>
                            </button>
                        ))}
                    </div>
                </DropdownMenuContent>
            </DropdownMenu>

            <CreateOrganizationDialog
                open={createOrgOpen}
                onOpenChange={setCreateOrgOpen}
            />
        </div>
    );
}