import { Sidebar } from "@/components/sidebar"
import { Header } from "@/components/header"
import { AnalyticsDashboard } from "@/components/analytics-dashboard"

export default function AnalyticsPage() {
  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Header title="Analytics" />
        <main className="flex-1 p-6">
          <AnalyticsDashboard />
        </main>
      </div>
    </div>
  )
}
