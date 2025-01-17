'use client'

import { useState } from 'react'
import { Layout } from '@/components/custom/layout'
import { TopNav } from '@/components/portal/top-nav'
import { Separator } from '@/components/ui/separator';
import FeedbackForm from '@/components/portal/feedback-form'
import Notifications from '@/components/portal/notifications'
import { UserNav } from '@/components/portal/user-nav'
import { StorefrontPreview } from './components/storefront-preview'
import { OrganizationSettings } from './components/settings'
import { CheckoutPreview } from './components/checkout-preview'
import { ConfirmationPreview } from './components/confirmation-preview'
import { PortalPreview } from './components/portal-preview'
import { PreviewSwitcher } from './components/preview-switcher'
import SupportForm from '@/components/portal/support-form'

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
        orgName: '',
        description: '',
        themeColor: '#000000',
        slug: '',
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
                <div className='hidden md:block'>
                    <TopNav links={topNav} />
                </div>

                <div className='block md:hidden'>
                    <FeedbackForm />
                </div>

                <div className='ml-auto flex items-center space-x-4'>
                    <div className='hidden md:block'>
                        <FeedbackForm />
                    </div>
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