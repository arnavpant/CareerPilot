"use client"

import { Droppable } from "@hello-pangea/dnd"
import { ApplicationCard } from "./ApplicationCard"
import type { Application, Company, ApplicationStage } from "@prisma/client"
import { STAGE_CONFIG } from "@/lib/constants/stages"

interface StageColumnProps {
  stage: ApplicationStage
  applications: (Application & { company: Company | null })[]
}

export function StageColumn({ stage, applications }: StageColumnProps) {
  const config = STAGE_CONFIG[stage]

  return (
    <div className="flex-shrink-0 w-80">
      {/* Column Header */}
      <div className="glass-panel p-4 mb-4 rounded-2xl">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-semibold text-white">{config.label}</h3>
          <span className={`text-sm ${config.textColor} bg-white/10 px-2 py-1 rounded-lg font-medium`}>
            {applications.length}
          </span>
        </div>
        
        {/* Stage Indicator Bar */}
        <div className={`h-1 rounded-full bg-gradient-to-r ${config.color}`} />
      </div>

      {/* Droppable Area */}
      <Droppable droppableId={stage}>
        {(provided, snapshot) => (
          <div
            ref={provided.innerRef}
            {...provided.droppableProps}
            className={`space-y-3 min-h-[200px] rounded-2xl p-3 transition-colors ${
              snapshot.isDraggingOver ? config.bgColor : ""
            }`}
          >
            {applications.map((application, index) => (
              <ApplicationCard
                key={application.id}
                application={application}
                index={index}
              />
            ))}
            {provided.placeholder}
            
            {/* Empty State */}
            {applications.length === 0 && !snapshot.isDraggingOver && (
              <div className="text-center py-8 text-slate-500 text-sm">
                No applications yet
              </div>
            )}
          </div>
        )}
      </Droppable>
    </div>
  )
}
