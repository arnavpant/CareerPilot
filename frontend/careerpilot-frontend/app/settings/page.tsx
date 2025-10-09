import { Sidebar } from "@/components/sidebar"
import { Header } from "@/components/header"
import { SettingsPanel } from "@/components/settings-panel"

export default function SettingsPage() {
  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Header title="Settings" />
        <main className="flex-1 p-6">
          <SettingsPanel />
        </main>
      </div>
    </div>
  )
}
