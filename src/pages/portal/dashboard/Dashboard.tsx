import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from "@/components/ui/button"
import { ArrowRight, Code, FileText, BookOpen, FileCode, HelpCircle, Link as LinkIcon, Plug } from 'lucide-react'
import { TopNav } from '@/components/dashboard/top-nav'
import { UserNav } from '@/components/dashboard/user-nav'
import Notifications from '@/components/dashboard/notifications'
import { Link } from 'react-router-dom'
import { Settings2 } from 'lucide-react'
import { Layout } from '@/components/custom/layout'
import { Separator } from '@/components/ui/separator'
import { Video } from 'lucide-react'


export default function Dashboard() {
  const topNav = [
    { title: 'Home', href: '/portal', isActive: true },
    { title: 'Settings', href: '/portal/settings/profile', isActive: false },
  ]

  return (
    <Layout fixed>
      <Layout.Header>
        <TopNav links={topNav} />
        <div className='ml-auto flex items-center space-x-4'>
          <Notifications />
          <UserNav />
        </div>
      </Layout.Header>

      <Separator className='my-0' />

      {/* ===== Main ===== */}
      <Layout.Body>
        <div className='mb-8'>
          <h1 className='text-2xl font-bold mb-6'>Getting Started</h1>
          <div className="grid md:grid-cols-2 gap-6">
            <Link to="/portal/settings/developers/api-keys" className="block">
              <Card className="bg-amber-100 dark:bg-amber-800 hover:bg-amber-200 dark:hover:bg-amber-700 transition-colors duration-200">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-lg font-medium">Manage API keys</CardTitle>
                  <Settings2 className="h-6 w-6" />
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">View and manage your API keys.</p>
                  <Button variant="link" className="p-0 h-auto font-normal text-blue-600 dark:text-blue-400">
                    Technical
                  </Button>
                </CardContent>
              </Card>
            </Link>
            <Link to="/portal/settings/developers/webhooks" className="block">
              <Card className="bg-sky-100 dark:bg-sky-800 hover:bg-sky-200 dark:hover:bg-sky-700 transition-colors duration-200">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-lg font-medium">Set callback URLs</CardTitle>
                  <ArrowRight className="h-6 w-6" />
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">Set up your Callback URLs for us to inform you of successful payments.</p>
                  <Button variant="link" className="p-0 h-auto font-normal text-blue-600 dark:text-blue-400">
                    Technical
                  </Button>
                </CardContent>
              </Card>
            </Link>
            <Link to="/portal/payment-links" className="block">
              <Card className="bg-emerald-100 dark:bg-emerald-800 hover:bg-emerald-200 dark:hover:bg-emerald-700 transition-colors duration-200">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-lg font-medium">Create payment links</CardTitle>
                  <LinkIcon className="h-6 w-6" />
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">Generate payment links to collect money easily.</p>
                </CardContent>
              </Card>
            </Link>
            <Link to="/portal/integrations" className="block">
              <Card className="bg-violet-100 dark:bg-violet-800 hover:bg-violet-200 dark:hover:bg-violet-700 transition-colors duration-200">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-lg font-medium">Set integrations</CardTitle>
                  <Plug className="h-6 w-6" />
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">Connect with various payment providers and services.</p>
                </CardContent>
              </Card>
            </Link>
          </div>
        </div>

        <div className='mb-8'>
          <h2 className="text-xl font-semibold mb-6">Developer Resources</h2>
          <div className="overflow-x-auto pb-4" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
            <div className="flex space-x-6" style={{ minWidth: 'max-content' }}>
              {developerResources.map((item, index) => (
                <a key={index} href={item.link} target="_blank" rel="noopener noreferrer" className="block group">
                  <Card className="w-64 flex-shrink-0 transition-all duration-200 group-hover:scale-105 transform group-hover:z-10 overflow-visible border border-gray-200 dark:border-gray-700">
                    <CardContent className="pt-6 h-full flex flex-col relative">
                      <div className="absolute inset-0 rounded-lg transition-colors duration-200 group-hover:bg-gray-100 dark:group-hover:bg-gray-800" />
                      <div className="relative z-10">
                        {item.icon}
                        <h3 className="font-semibold mb-2">{item.title}</h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-4 flex-grow">{item.description}</p>
                      </div>
                    </CardContent>
                  </Card>
                </a>
              ))}
            </div>
          </div>
        </div>

      </Layout.Body>
    </Layout>
  )
}

const developerResources = [
  {
    icon: <FileText className="h-10 w-10 text-blue-600 dark:text-blue-400 mb-4" />,
    title: "Documentation",
    description: "Familiarize yourself with lomi. products with our docs.",
    link: "https://developers.lomi.africa/docs"
  },
  {
    icon: <Code className="h-10 w-10 text-emerald-600 dark:text-emerald-400 mb-4" />,
    title: "API reference",
    description: "Find out how our APIs work and how you can deploy them.",
    link: "https://developers.lomi.africa/api-reference"
  },
  {
    icon: <BookOpen className="h-10 w-10 text-amber-600 dark:text-amber-400 mb-4" />,
    title: "Integration guides",
    description: "Step-by-step guides to integrate lomi. into your app.",
    link: "https://developers.lomi.africa/guides"
  },
  {
    icon: <FileCode className="h-10 w-10 text-purple-600 dark:text-purple-400 mb-4" />,
    title: "Sample projects",
    description: "Explore sample projects & apps to kickstart your integration.",
    link: "https://github.com/lomiafrica"
  },
  {
    icon: <HelpCircle className="h-10 w-10 text-cyan-600 dark:text-cyan-400 mb-4" />,
    title: "Support",
    description: "Get help and support from our team.",
    link: "mailto:hello@lomi.africa?subject=[Support] — Question about integration"
  },
  {
    icon: <Video className="h-10 w-10 text-red-600 dark:text-red-400 mb-4" />,
    title: "Videos",
    description: "Watch some videos to get you started very quickly.",
    link: "https://www.youtube.com/watch?v=dQw4w9WgXcQ"
  }
]