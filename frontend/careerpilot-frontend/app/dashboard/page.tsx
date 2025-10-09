import { Sidebar } from "@/components/sidebar"
import { KanbanBoard } from "@/components/kanban-board"
import { Header } from "@/components/header"

export default function DashboardPage() {
  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Header title="Pipeline" />
        <main className="flex-1 p-6">
          <KanbanBoard />
        </main>
      </div>
    </div>
  )
}
