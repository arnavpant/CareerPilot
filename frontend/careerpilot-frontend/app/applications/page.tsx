import { Sidebar } from "@/components/sidebar"
import { Header } from "@/components/header"
import { ApplicationsTable } from "@/components/applications-table"

export default function ApplicationsPage() {
  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Header title="Applications" />
        <main className="flex-1 p-6">
          <ApplicationsTable />
        </main>
      </div>
    </div>
  )
}
