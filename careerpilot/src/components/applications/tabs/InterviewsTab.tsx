import { format } from "date-fns"
import { Calendar, Clock, MapPin, Video, Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import type { Interview } from "@prisma/client"

interface InterviewsTabProps {
  interviews: Interview[]
  applicationId: string
}

export function InterviewsTab({ interviews, applicationId }: InterviewsTabProps) {
  if (interviews.length === 0) {
    return (
      <div className="glass-panel rounded-2xl p-12 text-center">
        <p className="text-slate-400 mb-4">No interviews scheduled</p>
        <Button className="bg-gradient-to-r from-indigo-500 to-purple-600">
          <Plus className="w-4 h-4 mr-2" />
          Schedule Interview
        </Button>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-bold text-white">Interview Schedule</h3>
        <Button className="bg-gradient-to-r from-indigo-500 to-purple-600">
          <Plus className="w-4 h-4 mr-2" />
          Add Interview
        </Button>
      </div>

      <div className="grid gap-4">
        {interviews.map((interview) => (
          <div key={interview.id} className="glass-panel glass-panel-hover rounded-2xl p-6">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h4 className="text-lg font-semibold text-white mb-1">
                  {interview.roundName}
                </h4>
                {interview.type && (
                  <Badge className="bg-indigo-500/10 text-indigo-400 border-0">
                    {interview.type}
                  </Badge>
                )}
              </div>
              {interview.outcome && (
                <Badge
                  className={
                    interview.outcome === "PASSED"
                      ? "bg-green-500/10 text-green-400 border-0"
                      : interview.outcome === "FAILED"
                      ? "bg-red-500/10 text-red-400 border-0"
                      : "bg-yellow-500/10 text-yellow-400 border-0"
                  }
                >
                  {interview.outcome}
                </Badge>
              )}
            </div>

            <div className="space-y-2 text-sm">
              <div className="flex items-center gap-2 text-slate-400">
                <Calendar className="w-4 h-4" />
                <span>{format(new Date(interview.scheduledAt), "EEEE, MMMM d, yyyy")}</span>
              </div>
              
              <div className="flex items-center gap-2 text-slate-400">
                <Clock className="w-4 h-4" />
                <span>
                  {format(new Date(interview.scheduledAt), "h:mm a")}
                  {interview.duration && ` (${interview.duration} min)`}
                </span>
              </div>

              {interview.location && (
                <div className="flex items-center gap-2 text-slate-400">
                  <MapPin className="w-4 h-4" />
                  <span>{interview.location}</span>
                </div>
              )}

              {interview.virtualLink && (
                <div className="flex items-center gap-2 text-indigo-400">
                  <Video className="w-4 h-4" />
                  <a
                    href={interview.virtualLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-indigo-300"
                  >
                    Join Video Call
                  </a>
                </div>
              )}
            </div>

            {interview.instructions && (
              <div className="mt-4 p-3 bg-white/5 rounded-lg">
                <div className="text-sm text-slate-400 mb-1">Instructions</div>
                <div className="text-white text-sm">{interview.instructions}</div>
              </div>
            )}

            {interview.notes && (
              <div className="mt-4 p-3 bg-white/5 rounded-lg">
                <div className="text-sm text-slate-400 mb-1">Notes</div>
                <div className="text-white text-sm whitespace-pre-wrap">{interview.notes}</div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
