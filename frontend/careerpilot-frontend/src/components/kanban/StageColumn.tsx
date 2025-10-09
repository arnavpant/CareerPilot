import type { DroppableProvided } from "@hello-pangea/dnd"
import { ApplicationCard } from "./ApplicationCard"
import type { Application } from "@/types/domain"
import { STAGE_CONFIG } from "@/lib/constants/stages"

interface StageColumnProps {
  stage: string
  applications: Application[]
  provided: DroppableProvided
  isDraggingOver: boolean
}

export function StageColumn({ stage, applications, provided, isDraggingOver }: StageColumnProps) {
  const config = STAGE_CONFIG[stage as keyof typeof STAGE_CONFIG]

  return (
    <div className="flex-shrink-0 w-80">
      <div className="glass-panel rounded-[var(--radius-lg)] p-4">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: `rgb(${config.color})` }} />
            <h3 className="font-semibold text-white">{config.label}</h3>
          </div>
          <span className="text-sm text-slate-400">{applications.length}</span>
        </div>

        <div
          ref={provided.innerRef}
          {...provided.droppableProps}
          className={`space-y-3 min-h-[200px] transition-colors rounded-lg ${isDraggingOver ? "bg-white/5" : ""}`}
        >
          {applications.map((application, index) => (
            <ApplicationCard key={application.id} application={application} index={index} />
          ))}
          {provided.placeholder}
        </div>
      </div>
    </div>
  )
}
