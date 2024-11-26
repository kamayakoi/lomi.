'use client'

import { useState } from 'react'
import { Layout } from '@/components/custom/layout'
import { TopNav } from '@/components/dashboard/top-nav'
import { Separator } from '@/components/ui/separator';
import FeedbackForm from '@/components/dashboard/feedback-form'
import Notifications from '@/components/dashboard/notifications'
import { UserNav } from '@/components/dashboard/user-nav'
import { StorefrontPreview } from '@/components/dashboard/storefront/storefront-preview'
import { OrganizationSettings } from '@/components/dashboard/storefront/settings'
import { CheckoutPreview } from '@/components/dashboard/storefront/checkout-preview'
import { ConfirmationPreview } from '@/components/dashboard/storefront/confirmation-preview'
import { PortalPreview } from '@/components/dashboard/storefront/portal-preview'
import { PreviewSwitcher } from '@/components/dashboard/storefront/preview-switcher'
import SupportForm from '@/components/dashboard/support-form'

interface StorefrontSettings {
    orgName: string
    description: string
    themeColor: string
    slug: string
}

function StorefrontPage() {
    const topNav = [
        { title: 'Storefront', href: '/portal/storefront', isActive: true },
        { title: 'Settings', href: '/portal/settings/profile', isActive: false },
    ];

    const [settings, setSettings] = useState<StorefrontSettings>({
        orgName: 'lomi.',
        description: '',
        themeColor: '#000000',
        slug: 'lomi',
    })

    const [activeView, setActiveView] = useState('storefront')

    const renderPreview = () => {
        switch (activeView) {
            case 'storefront':
                return <StorefrontPreview {...settings} />
            case 'checkout':
                return <CheckoutPreview {...settings} />
            case 'confirmation':
                return <ConfirmationPreview {...settings} />
            case 'portal':
                return <PortalPreview {...settings} />
            default:
                return null
        }
    }

    return (
        <Layout fixed>
            <Layout.Header>
                <TopNav links={topNav} />
                <div className='ml-auto flex items-center space-x-4'>
                    <FeedbackForm />
                    <Notifications />
                    <UserNav />
                </div>
            </Layout.Header>

            <Separator className='my-0' />
            <Layout.Body className="flex overflow-auto">
                <div className="flex-1 overflow-y-auto">
                    <h1 className="text-2xl font-bold tracking-tight mt-1">Storefront</h1>
                    <div className="space-y-4">
                        <PreviewSwitcher activeView={activeView} onChange={setActiveView} />
                        {renderPreview()}
                    </div>
                </div>
                <div className="w-[400px] border-l border-border">
                    <OrganizationSettings settings={settings} onSettingsChange={setSettings} />
                </div>
            </Layout.Body>
            <SupportForm />
        </Layout>
    );
}

export default StorefrontPage;