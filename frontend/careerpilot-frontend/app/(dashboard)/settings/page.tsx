import { PageHeader } from "@/components/layout/PageHeader"
import { SettingsForm } from "@/components/forms/SettingsForm"

export default function SettingsPage() {
  return (
    <div className="space-y-8">
      <PageHeader title="Settings" description="Manage your account and preferences" />
      <SettingsForm />
    </div>
  )
}
