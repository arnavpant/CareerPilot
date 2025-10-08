"use client"

import { Draggable } from "@hello-pangea/dnd"
import { Calendar, DollarSign, MapPin } from "lucide-react"
import { format } from "date-fns"
import { Badge } from "@/components/ui/badge"
import type { Application, Company } from "@prisma/client"

interface ApplicationCardProps {
  application: Application & { company: Company | null }
  index: number
}

const PRIORITY_COLORS = {
  high: "bg-red-100 text-red-700",
  medium: "bg-yellow-100 text-yellow-700",
  low: "bg-green-100 text-green-700",
} as const

export function ApplicationCard({ application, index }: ApplicationCardProps) {
  const companyInitial = application.company?.name?.[0] || "?"
  const salaryRange = 
    application.salaryMin && application.salaryMax
      ? `$${(application.salaryMin / 1000).toFixed(0)}k - $${(application.salaryMax / 1000).toFixed(0)}k`
      : application.salaryMin
      ? `$${(application.salaryMin / 1000).toFixed(0)}k+`
      : null

  return (
    <Draggable draggableId={application.id} index={index}>
      {(provided, snapshot) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          className={`glass-panel glass-panel-hover rounded-2xl p-4 cursor-grab active:cursor-grabbing ${
            snapshot.isDragging ? "shadow-2xl scale-105 rotate-2" : ""
          }`}
        >
          <div className="flex items-start gap-3 mb-3">
            {/* Company Avatar */}
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-bold text-lg flex-shrink-0">
              {companyInitial}
            </div>

            <div className="flex-1 min-w-0">
              {/* Position Title */}
              <h4 className="font-semibold text-white text-sm mb-1 truncate">
                {application.roleTitle}
              </h4>
              
              {/* Company Name */}
              <p className="text-sm text-slate-400 truncate">
                {application.company?.name || "Unknown Company"}
              </p>
            </div>
          </div>

          {/* Metadata */}
          <div className="space-y-1.5 text-xs text-slate-500">
            {application.location && (
              <div className="flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5" />
                <span className="truncate">{application.location}</span>
              </div>
            )}
            
            {salaryRange && (
              <div className="flex items-center gap-1.5">
                <DollarSign className="w-3.5 h-3.5" />
                <span>{salaryRange}</span>
              </div>
            )}
            
            <div className="flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5" />
              <span>
                Applied {format(new Date(application.appliedAt || application.createdAt), "MMM d")}
              </span>
            </div>
          </div>

          {/* Tags */}
          {application.tags && application.tags.length > 0 && (
            <div className="flex flex-wrap gap-1 mt-3">
              {application.tags.slice(0, 3).map((tag) => (
                <span
                  key={tag}
                  className="text-xs px-2 py-0.5 rounded bg-white/5 text-slate-400"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}
        </div>
      )}
    </Draggable>
  )
}
