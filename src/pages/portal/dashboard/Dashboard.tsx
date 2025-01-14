import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from "@/components/ui/button"
import { ArrowRight, Code, FileText, FileCode, HelpCircle, Link as LinkIcon, Plug, Package } from 'lucide-react'
import { TopNav } from '@/components/portal/top-nav'
import { UserNav } from '@/components/portal/user-nav'
import Notifications from '@/components/portal/notifications'
import { Link } from 'react-router-dom'
import { Settings2 } from 'lucide-react'
import { Layout } from '@/components/custom/layout'
import { Separator } from '@/components/ui/separator'
import FeedbackForm from '@/components/portal/feedback-form'
import SupportForm from '@/components/portal/support-form'
import ApiKeysSection from '@/components/portal/api-key-panel'
import { useTranslation } from 'react-i18next'

export default function Dashboard() {
  const { t } = useTranslation()

  const topNav = [
    { title: 'Home', href: '/portal', isActive: true },
    { title: 'Settings', href: '/portal/settings/profile', isActive: false },
  ]

  const developerResources = [
    {
      icon: <FileText className="h-10 w-10 text-blue-600 dark:text-blue-400 mb-4" />,
      title: t('dashboard.developer_resources.resources.documentation.title'),
      description: t('dashboard.developer_resources.resources.documentation.description'),
      link: "https://developers.lomi.africa/docs"
    },
    {
      icon: <Code className="h-10 w-10 text-emerald-600 dark:text-emerald-400 mb-4" />,
      title: t('dashboard.developer_resources.resources.api_reference.title'),
      description: t('dashboard.developer_resources.resources.api_reference.description'),
      link: "https://developers.lomi.africa/api-reference"
    },
    {
      icon: <Package className="h-10 w-10 text-amber-600 dark:text-amber-400 mb-4" />,
      title: t('dashboard.developer_resources.resources.product_catalog.title'),
      description: t('dashboard.developer_resources.resources.product_catalog.description'),
      link: "https://developers.lomi.africa/catalog"
    },
    {
      icon: <FileCode className="h-10 w-10 text-purple-600 dark:text-purple-400 mb-4" />,
      title: t('dashboard.developer_resources.resources.sample_projects.title'),
      description: t('dashboard.developer_resources.resources.sample_projects.description'),
      link: "https://github.com/lomiafrica"
    },
    {
      icon: <HelpCircle className="h-10 w-10 text-cyan-600 dark:text-cyan-400 mb-4" />,
      title: t('dashboard.developer_resources.resources.support.title'),
      description: t('dashboard.developer_resources.resources.support.description'),
      link: "mailto:hello@lomi.africa?subject=[Support] — Question about integration"
    },
  ]

  return (
    <Layout fixed>
      <Layout.Header className="flex items-center justify-between">
        <div className='hidden md:block'>
          <TopNav links={topNav} />
        </div>

        <div className='block md:hidden'>
          <FeedbackForm />
        </div>

        <div className='flex items-center space-x-4 ml-auto'>
          <div className='hidden md:block'>
            <FeedbackForm />
          </div>
          <Notifications />
          <UserNav />
        </div>
      </Layout.Header>

      <Separator className='my-0' />

      {/* ===== Main ===== */}
      <Layout.Body>
        <div className='mb-8'>
          <h1 className='text-2xl font-bold mb-6'>{t('dashboard.getting_started.title')}</h1>
          <div className="grid md:grid-cols-2 gap-6">
            <Link to="/portal/settings/developers/api-keys" className="block">
              <Card className="rounded-none bg-amber-100 dark:bg-amber-800 hover:bg-amber-200 dark:hover:bg-amber-700 transition-colors duration-200">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-lg font-medium">{t('dashboard.getting_started.api_keys.title')}</CardTitle>
                  <Settings2 className="h-6 w-6" />
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">{t('dashboard.getting_started.api_keys.description')}</p>
                  <Button variant="link" className="rounded-none p-0 h-auto font-normal text-blue-600 dark:text-blue-400">
                    {t('dashboard.getting_started.api_keys.technical')}
                  </Button>
                </CardContent>
              </Card>
            </Link>
            <Link to="/portal/settings/developers/webhooks" className="block">
              <Card className="rounded-none bg-sky-100 dark:bg-sky-800 hover:bg-sky-200 dark:hover:bg-sky-700 transition-colors duration-200">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-lg font-medium">{t('dashboard.getting_started.webhooks.title')}</CardTitle>
                  <ArrowRight className="h-6 w-6" />
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">{t('dashboard.getting_started.webhooks.description')}</p>
                  <Button variant="link" className="rounded-none p-0 h-auto font-normal text-blue-600 dark:text-blue-400">
                    {t('dashboard.getting_started.webhooks.technical')}
                  </Button>
                </CardContent>
              </Card>
            </Link>
            <Link to="/portal/payment-links" className="block">
              <Card className="rounded-none bg-emerald-100 dark:bg-emerald-800 hover:bg-emerald-200 dark:hover:bg-emerald-700 transition-colors duration-200">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-lg font-medium">{t('dashboard.getting_started.payment_links.title')}</CardTitle>
                  <LinkIcon className="h-6 w-6" />
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">{t('dashboard.getting_started.payment_links.description')}</p>
                </CardContent>
              </Card>
            </Link>
            <Link to="/portal/integrations" className="block">
              <Card className="rounded-none bg-violet-100 dark:bg-violet-800 hover:bg-violet-200 dark:hover:bg-violet-700 transition-colors duration-200">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-lg font-medium">{t('dashboard.getting_started.integrations.title')}</CardTitle>
                  <Plug className="h-6 w-6" />
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">{t('dashboard.getting_started.integrations.description')}</p>
                </CardContent>
              </Card>
            </Link>
          </div>
        </div>

        <div className='mb-8'>
          <h2 className="text-xl font-semibold mb-6">{t('dashboard.developer_resources.title')}</h2>
          <div className="overflow-x-auto pb-4" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
            <div className="flex space-x-6" style={{ minWidth: 'max-content' }}>
              <ApiKeysSection />
              {developerResources.map((item, index) => (
                <a key={index} href={item.link} target="_blank" rel="noopener noreferrer" className="block group">
                  <div className="w-64 p-1">
                    <Card className="rounded-none h-full border border-gray-200 dark:border-gray-700 overflow-hidden transition-colors duration-200 group-hover:bg-gray-100 dark:group-hover:bg-gray-800">
                      <CardContent className="pt-6 h-full flex flex-col relative">
                        <div className="relative z-10">
                          {item.icon}
                          <h3 className="font-semibold mb-2">{item.title}</h3>
                          <p className="text-sm text-gray-600 dark:text-gray-400 mb-4 flex-grow">{item.description}</p>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </a>
              ))}
            </div>
          </div>
        </div>

        <SupportForm />

      </Layout.Body>
    </Layout>
  )
}
