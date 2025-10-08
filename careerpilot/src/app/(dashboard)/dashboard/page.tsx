import { PageHeader } from "@/components/layout/PageHeader"
import { Section } from "@/components/layout/Section"

export default function DashboardPage() {
  return (
    <div className="space-y-8">
      <PageHeader 
        title="Dashboard" 
        description="Your application tracking overview"
      />
      
      <Section title="Key Metrics" description="Your application statistics at a glance">
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {/* KPI Cards placeholder */}
          <div className="glass-panel rounded-2xl p-6">
            <div className="text-3xl font-bold text-white mb-1">0</div>
            <div className="text-sm text-slate-400">Total Applications</div>
          </div>
          <div className="glass-panel rounded-2xl p-6">
            <div className="text-3xl font-bold text-white mb-1">0</div>
            <div className="text-sm text-slate-400">Active</div>
          </div>
          <div className="glass-panel rounded-2xl p-6">
            <div className="text-3xl font-bold text-white mb-1">0</div>
            <div className="text-sm text-slate-400">Offers</div>
          </div>
          <div className="glass-panel rounded-2xl p-6">
            <div className="text-3xl font-bold text-white mb-1">0</div>
            <div className="text-sm text-slate-400">Rejected</div>
          </div>
        </div>
      </Section>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Section title="Application Funnel">
          <div className="glass-panel rounded-2xl p-8 text-center">
            <p className="text-slate-400">Funnel chart coming soon...</p>
          </div>
        </Section>
        
        <Section title="Time Metrics">
          <div className="glass-panel rounded-2xl p-8 text-center">
            <p className="text-slate-400">Time metrics chart coming soon...</p>
          </div>
        </Section>
      </div>
    </div>
  )
}

