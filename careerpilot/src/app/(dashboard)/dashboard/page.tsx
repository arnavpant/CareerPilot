import { getSession } from "@/lib/auth/session"

export default async function DashboardPage() {
  const session = await getSession()

  return (
    <div className="min-h-screen flex items-center justify-center p-8">
      <div className="glass-card p-8 max-w-2xl w-full animate-scale-in">
        <h1 className="text-4xl font-bold text-white mb-4">
          Welcome to CareerPilot! 🚀
        </h1>
        <p className="text-lg text-slate-300 mb-6">
          Hello, {session?.user?.name || session?.user?.email}!
        </p>
        <div className="space-y-4 text-slate-400">
          <p>
            Your dashboard is being built. Here&apos;s what&apos;s coming next:
          </p>
          <ul className="list-disc list-inside space-y-2 ml-4">
            <li>Analytics and KPI cards</li>
            <li>Application pipeline (Kanban board)</li>
            <li>Table view with filters</li>
            <li>Calendar for interviews</li>
            <li>Quick-add application form</li>
          </ul>
          <p className="mt-6 text-sm">
            Session is active and protected! ✅
          </p>
        </div>
      </div>
    </div>
  )
}

