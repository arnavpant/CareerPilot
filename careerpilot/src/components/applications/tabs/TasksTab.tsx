import { format } from "date-fns"
import { CheckCircle2, Circle, Clock, Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import type { Task } from "@prisma/client"

interface TasksTabProps {
  tasks: Task[]
  applicationId: string
}

export function TasksTab({ tasks, applicationId }: TasksTabProps) {
  const activeTasks = tasks.filter(t => t.status !== "COMPLETED")
  const completedTasks = tasks.filter(t => t.status === "COMPLETED")

  if (tasks.length === 0) {
    return (
      <div className="glass-panel rounded-2xl p-12 text-center">
        <p className="text-slate-400 mb-4">No tasks yet</p>
        <Button className="bg-gradient-to-r from-indigo-500 to-purple-600">
          <Plus className="w-4 h-4 mr-2" />
          Add Task
        </Button>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-bold text-white">Tasks</h3>
        <Button className="bg-gradient-to-r from-indigo-500 to-purple-600">
          <Plus className="w-4 h-4 mr-2" />
          Add Task
        </Button>
      </div>

      {/* Active Tasks */}
      {activeTasks.length > 0 && (
        <div className="space-y-3">
          <h4 className="text-sm font-semibold text-slate-400 uppercase tracking-wide">
            Active ({activeTasks.length})
          </h4>
          {activeTasks.map((task) => (
            <div
              key={task.id}
              className="glass-panel glass-panel-hover rounded-2xl p-4 flex items-start gap-3"
            >
              <button className="mt-0.5 text-slate-400 hover:text-white transition-colors">
                <Circle className="w-5 h-5" />
              </button>
              
              <div className="flex-1">
                <div className="flex items-start justify-between mb-2">
                  <h5 className="text-white font-medium">{task.title}</h5>
                  {task.priority && (
                    <Badge
                      className={
                        task.priority === "HIGH"
                          ? "bg-red-500/10 text-red-400 border-0"
                          : task.priority === "MEDIUM"
                          ? "bg-yellow-500/10 text-yellow-400 border-0"
                          : "bg-green-500/10 text-green-400 border-0"
                      }
                    >
                      {task.priority}
                    </Badge>
                  )}
                </div>

                {task.description && (
                  <p className="text-sm text-slate-400 mb-2">{task.description}</p>
                )}

                <div className="flex items-center gap-4 text-xs text-slate-500">
                  {task.dueDate && (
                    <div className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5" />
                      <span>Due {format(new Date(task.dueDate), "MMM d")}</span>
                    </div>
                  )}
                  {task.recurrence && (
                    <Badge variant="outline" className="text-xs border-white/10 text-slate-400">
                      {task.recurrence}
                    </Badge>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Completed Tasks */}
      {completedTasks.length > 0 && (
        <div className="space-y-3">
          <h4 className="text-sm font-semibold text-slate-400 uppercase tracking-wide">
            Completed ({completedTasks.length})
          </h4>
          {completedTasks.map((task) => (
            <div
              key={task.id}
              className="glass-panel rounded-2xl p-4 flex items-start gap-3 opacity-60"
            >
              <CheckCircle2 className="w-5 h-5 text-green-400 mt-0.5" />
              
              <div className="flex-1">
                <h5 className="text-white font-medium line-through">{task.title}</h5>
                {task.completedAt && (
                  <p className="text-xs text-slate-500 mt-1">
                    Completed {format(new Date(task.completedAt), "MMM d, yyyy")}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
