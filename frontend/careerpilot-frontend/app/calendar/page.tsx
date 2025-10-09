import { Sidebar } from "@/components/sidebar"
import { Header } from "@/components/header"
import { CalendarView } from "@/components/calendar-view"

export default function CalendarPage() {
  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Header title="Calendar" />
        <main className="flex-1 p-6">
          <CalendarView />
        </main>
      </div>
    </div>
  )
}
