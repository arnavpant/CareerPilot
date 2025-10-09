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
    <div className="flex flex-col">
      {/* Column Header */}
      <div className="glass-panel p-3 mb-3 rounded-xl">
        <div className="flex items-center justify-between mb-2">
          <h3 className="font-semibold text-white text-sm">{config.label}</h3>
          <span className={`text-xs ${config.textColor} bg-white/10 px-2 py-0.5 rounded font-medium`}>
            {applications.length}
          </span>
        </div>
        
        {/* Stage Indicator Bar */}
        <div className={`h-0.5 rounded-full bg-gradient-to-r ${config.color}`} />
      </div>

      {/* Droppable Area */}
      <Droppable droppableId={stage}>
        {(provided, snapshot) => (
          <div
            ref={provided.innerRef}
            {...provided.droppableProps}
            className={`space-y-2 min-h-[150px] rounded-xl p-2 transition-colors ${
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
              <div className="text-center py-6 text-slate-500 text-xs">
                No applications
              </div>
            )}
          </div>
        )}
      </Droppable>
    </div>
  )
}
