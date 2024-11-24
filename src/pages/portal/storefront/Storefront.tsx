import { useState } from 'react'
import { Layout } from '@/components/custom/layout'
import { TopNav } from '@/components/dashboard/top-nav'
import { Separator } from '@/components/ui/separator';
import FeedbackForm from '@/components/dashboard/feedback-form'
import { UserNav } from '@/components/dashboard/user-nav'
import { StorefrontPreview } from '@/components/dashboard/storefront/storefront-preview'
import { OrganizationSettings } from '@/components/dashboard/storefront/org-settings'

interface StorefrontSettings {
    logoUrl: string
    orgName: string
    description: string
    themeColor: string
}

function StorefrontPage() {
    const topNav = [
        { title: 'Storefront', href: '/portal/storefront', isActive: true },
        { title: 'Settings', href: '/portal/settings/profile', isActive: false },
    ];

    const [settings, setSettings] = useState<StorefrontSettings>({
        logoUrl: '',
        orgName: 'lomi.',
        description: '',
        themeColor: '#000000'
    })

    return (
        <Layout fixed>
            <Layout.Header>
                <TopNav links={topNav} />
                <div className='ml-auto flex items-center space-x-4'>
                    <FeedbackForm />
                    <UserNav />
                </div>
            </Layout.Header>

            <Separator className='my-0' />
            <Layout.Body className="flex overflow-auto">
                <div className="flex-1 overflow-y-auto">
                    <StorefrontPreview {...settings} />
                </div>
                <div className="w-[400px] border-l border-border">
                    <OrganizationSettings onSettingsChange={setSettings} />
                </div>
            </Layout.Body>
        </Layout>
    );
}

export default StorefrontPage;