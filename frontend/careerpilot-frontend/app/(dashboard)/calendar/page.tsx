import { PageHeader } from "@/components/layout/PageHeader"
import { Section } from "@/components/layout/Section"
import { CalendarView } from "@/components/calendar/CalendarView"

export default function CalendarPage() {
  return (
    <div className="space-y-8">
      <PageHeader title="Calendar" description="View your interviews and task deadlines" />
      <Section>
        <CalendarView />
      </Section>
    </div>
  )
}
