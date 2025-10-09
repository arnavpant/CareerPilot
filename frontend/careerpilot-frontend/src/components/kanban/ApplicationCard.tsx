import { Draggable } from "@hello-pangea/dnd"
import Link from "next/link"
import type { Application } from "@/types/domain"
import { Building2, MapPin, DollarSign } from "lucide-react"
import { Badge } from "@/components/ui/badge"

interface ApplicationCardProps {
  application: Application
  index: number
}

export function ApplicationCard({ application, index }: ApplicationCardProps) {
  return (
    <Draggable draggableId={application.id} index={index}>
      {(provided, snapshot) => (
        <Link
          href={`/applications/${application.id}`}
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          className={`block glass-panel glass-panel-hover rounded-[var(--radius-md)] p-4 cursor-grab active:cursor-grabbing ${
            snapshot.isDragging ? "shadow-2xl scale-105" : ""
          }`}
        >
          <h4 className="font-semibold text-white mb-1 text-balance">{application.position}</h4>
          <div className="flex items-center gap-2 text-sm text-slate-400 mb-3">
            <Building2 className="w-3.5 h-3.5" />
            <span>{application.company}</span>
          </div>

          <div className="space-y-2 text-xs text-slate-400">
            {application.location && (
              <div className="flex items-center gap-2">
                <MapPin className="w-3.5 h-3.5" />
                <span>{application.location}</span>
              </div>
            )}
            {application.salary && (
              <div className="flex items-center gap-2">
                <DollarSign className="w-3.5 h-3.5" />
                <span>{application.salary}</span>
              </div>
            )}
          </div>

          {application.tags && application.tags.length > 0 && (
            <div className="flex flex-wrap gap-1 mt-3">
              {application.tags.map((tag) => (
                <Badge key={tag} variant="secondary" className="text-xs">
                  {tag}
                </Badge>
              ))}
            </div>
          )}
        </Link>
      )}
    </Draggable>
  )
}
