import { NotificationsForm } from './notifications-form'
import ContentSection from '@/components/portal/content-section'

export default function SettingsNotifications() {
  return (
    <ContentSection
      title='Notifications'
      desc='Configure how you receive notifications.'
    >
      <NotificationsForm />
    </ContentSection>
  )
}
