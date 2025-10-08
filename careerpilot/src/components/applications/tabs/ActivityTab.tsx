import { format } from "date-fns"
import { Circle } from "lucide-react"
import type { Activity } from "@prisma/client"

interface ActivityTabProps {
  activities: Activity[]
}

export function ActivityTab({ activities }: ActivityTabProps) {
  if (activities.length === 0) {
    return (
      <div className="glass-panel rounded-2xl p-12 text-center">
        <p className="text-slate-400">No activity yet</p>
      </div>
    )
  }

  return (
    <div className="glass-panel rounded-2xl p-6">
      <h3 className="text-xl font-bold text-white mb-6">Activity Timeline</h3>
      
      <div className="space-y-4">
        {activities.map((activity, index) => (
          <div key={activity.id} className="flex gap-4">
            {/* Timeline Line */}
            <div className="flex flex-col items-center">
              <div className="w-2 h-2 rounded-full bg-indigo-500" />
              {index < activities.length - 1 && (
                <div className="w-px h-full bg-white/10 my-1" />
              )}
            </div>

            {/* Content */}
            <div className="flex-1 pb-6">
              <div className="flex items-center justify-between mb-1">
                <span className="text-white font-medium">{activity.type}</span>
                <span className="text-sm text-slate-400">
                  {format(new Date(activity.createdAt), "MMM d, yyyy 'at' h:mm a")}
                </span>
              </div>
              <div className="text-sm text-slate-400">{activity.description}</div>
              {activity.metadata && (
                <div className="mt-2 text-xs text-slate-500 font-mono">
                  {activity.metadata}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
