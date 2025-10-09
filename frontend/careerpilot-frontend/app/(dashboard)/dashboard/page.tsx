import { PageHeader } from "@/components/layout/PageHeader"
import { Section } from "@/components/layout/Section"
import { KPICards } from "@/components/charts/KPICards"
import { FunnelChart } from "@/components/charts/FunnelChart"
import { TimeMetricsChart } from "@/components/charts/TimeMetricsChart"

export default function DashboardPage() {
  return (
    <div className="space-y-8">
      <PageHeader title="Dashboard" description="Overview of your job search progress and metrics" />

      <Section title="Key Metrics" description="Your application statistics at a glance">
        <KPICards />
      </Section>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Section title="Application Funnel" description="Conversion rates by stage">
          <FunnelChart />
        </Section>

        <Section title="Time Metrics" description="Average days in each stage">
          <TimeMetricsChart />
        </Section>
      </div>
    </div>
  )
}
