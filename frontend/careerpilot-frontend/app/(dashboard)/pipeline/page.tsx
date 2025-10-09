import { PageHeader } from "@/components/layout/PageHeader"
import { KanbanBoard } from "@/components/kanban/KanbanBoard"

export default function PipelinePage() {
  return (
    <div className="space-y-8">
      <PageHeader title="Pipeline" description="Drag and drop to move applications through stages" />
      <KanbanBoard />
    </div>
  )
}
