"use client"

import Link from "next/link"
import { Calendar, Clock, MapPin, Video, CheckCircle2, AlertCircle } from "lucide-react"
import { Badge } from "@/components/ui/badge"

interface CalendarEvent {
  id: string
  title: string
  type: "interview" | "task"
  date: Date
  time?: string
  location?: string
  priority?: string
  status?: string
  applicationId?: string
  company?: string
  role?: string
}

interface EventCardProps {
  event: CalendarEvent
}

export function EventCard({ event }: EventCardProps) {
  const isInterview = event.type === "interview"
  const isVideoCall = event.location?.toLowerCase().includes("virtual") || 
                      event.location?.includes("http") || 
                      event.location?.includes("zoom") || 
                      event.location?.includes("meet")

  return (
    <Link
      href={event.applicationId ? `/applications/${event.applicationId}` : "#"}
      className="block glass-panel glass-panel-hover rounded-xl p-4 transition-all"
    >
      {/* Event Type Badge */}
      <div className="flex items-start justify-between mb-2">
        <Badge
          variant="outline"
          className={`
            ${isInterview 
              ? "bg-indigo-500/20 text-indigo-300 border-indigo-500/30" 
              : "bg-purple-500/20 text-purple-300 border-purple-500/30"
            }
          `}
        >
          {isInterview ? "Interview" : "Task"}
        </Badge>
        {!isInterview && event.status && (
          <div className="flex items-center gap-1">
            {event.status === "COMPLETED" ? (
              <CheckCircle2 className="w-4 h-4 text-green-400" />
            ) : event.status === "OVERDUE" ? (
              <AlertCircle className="w-4 h-4 text-red-400" />
            ) : null}
          </div>
        )}
      </div>

      {/* Event Title */}
      <h4 className="font-semibold text-white mb-2 line-clamp-2">
        {event.title}
      </h4>

      {/* Event Details */}
      <div className="space-y-1.5 text-xs text-slate-400">
        {event.time && (
          <div className="flex items-center gap-2">
            <Clock className="w-3.5 h-3.5" />
            <span>{event.time}</span>
          </div>
        )}

        {event.location && (
          <div className="flex items-center gap-2">
            {isVideoCall ? (
              <Video className="w-3.5 h-3.5" />
            ) : (
              <MapPin className="w-3.5 h-3.5" />
            )}
            <span className="truncate">{event.location}</span>
          </div>
        )}

        {event.company && event.role && (
          <div className="flex items-center gap-2 pt-1 border-t border-white/10">
            <span className="font-medium text-slate-300">{event.company}</span>
            <span className="text-slate-500">•</span>
            <span className="truncate">{event.role}</span>
          </div>
        )}

        {!isInterview && event.priority && (
          <Badge
            variant="outline"
            className={`
              mt-2
              ${event.priority === "HIGH" 
                ? "bg-red-500/20 text-red-300 border-red-500/30" 
                : event.priority === "MEDIUM"
                ? "bg-yellow-500/20 text-yellow-300 border-yellow-500/30"
                : "bg-green-500/20 text-green-300 border-green-500/30"
              }
            `}
          >
            {event.priority.toLowerCase()}
          </Badge>
        )}
      </div>
    </Link>
  )
}
