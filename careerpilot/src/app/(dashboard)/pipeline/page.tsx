import { PageHeader } from "@/components/layout/PageHeader"
import { KanbanBoard } from "@/components/kanban/KanbanBoard"
import { getSession } from "@/lib/auth/session"
import { prisma } from "@/lib/db/prisma"
import { redirect } from "next/navigation"

export default async function PipelinePage() {
  // Get authenticated user
  const session = await getSession()
  
  if (!session?.user?.id) {
    redirect("/signin")
  }
  
  // Fetch all applications for the user
  const applications = await prisma.application.findMany({
    where: { userId: session.user.id },
    include: { company: true },
    orderBy: { createdAt: "desc" },
  })

  return (
    <div>
      <PageHeader
        title="Pipeline"
        description="Drag and drop to move applications through stages"
      />
      
      {applications.length === 0 ? (
        <div className="glass-panel rounded-2xl p-12 text-center">
          <p className="text-slate-400 mb-2">No applications yet</p>
          <p className="text-sm text-slate-500">
            Click &ldquo;Quick Add&rdquo; to create your first application
          </p>
        </div>
      ) : (
        <KanbanBoard initialApplications={applications} />
      )}
    </div>
  )
}
