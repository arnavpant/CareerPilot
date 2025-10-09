"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { format } from "date-fns"
import { CheckCircle2, Circle, Clock, Plus, Edit2, Trash2, Loader2 } from "lucide-react"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import type { Task } from "@prisma/client"

interface TasksTabProps {
  tasks: Task[]
  applicationId: string
}

export function TasksTab({ tasks, applicationId }: TasksTabProps) {
  const router = useRouter()
  const [createDialogOpen, setCreateDialogOpen] = useState(false)
  const [editingTask, setEditingTask] = useState<Task | null>(null)
  const [deletingTask, setDeletingTask] = useState<Task | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const activeTasks = tasks.filter(t => t.status !== "COMPLETED")
  const completedTasks = tasks.filter(t => t.status === "COMPLETED")

  const handleToggleComplete = async (task: Task) => {
    const newStatus = task.status === "COMPLETED" ? "PENDING" : "COMPLETED"
    
    try {
      const response = await fetch(`/api/tasks/${task.id}/complete`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ completed: newStatus === "COMPLETED" }),
      })

      if (!response.ok) {
        throw new Error("Failed to update task")
      }

      toast.success(newStatus === "COMPLETED" ? "Task completed!" : "Task reopened")
      router.refresh()
    } catch (error) {
      console.error("Error toggling task:", error)
      toast.error("Failed to update task")
    }
  }

  const handleDeleteTask = async (taskId: string) => {
    setIsSubmitting(true)
    
    try {
      const response = await fetch(`/api/tasks/${taskId}`, {
        method: "DELETE",
      })

      if (!response.ok) {
        throw new Error("Failed to delete task")
      }

      toast.success("Task deleted")
      setDeletingTask(null)
      router.refresh()
    } catch (error) {
      console.error("Error deleting task:", error)
      toast.error("Failed to delete task")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-bold text-white">Tasks</h3>
        <Button 
          className="bg-gradient-to-r from-indigo-500 to-purple-600"
          onClick={() => setCreateDialogOpen(true)}
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Task
        </Button>
      </div>

      {tasks.length === 0 ? (
        <div className="glass-panel rounded-2xl p-12 text-center">
          <p className="text-slate-400 mb-4">No tasks yet</p>
          <Button 
            className="bg-gradient-to-r from-indigo-500 to-purple-600"
            onClick={() => setCreateDialogOpen(true)}
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Task
          </Button>
        </div>
      ) : (
        <>
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
                  <button 
                    className="mt-0.5 text-slate-400 hover:text-white transition-colors"
                    onClick={() => handleToggleComplete(task)}
                  >
                    <Circle className="w-5 h-5" />
                  </button>
                  
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-2">
                      <h5 className="text-white font-medium">{task.title}</h5>
                      <div className="flex items-center gap-2">
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
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8 w-8 p-0"
                          onClick={() => setEditingTask(task)}
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8 w-8 p-0 text-red-400 hover:text-red-300"
                          onClick={() => setDeletingTask(task)}
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </Button>
                      </div>
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
                  <button
                    className="mt-0.5 text-green-400 hover:text-green-300 transition-colors"
                    onClick={() => handleToggleComplete(task)}
                  >
                    <CheckCircle2 className="w-5 h-5" />
                  </button>
                  
                  <div className="flex-1">
                    <div className="flex items-start justify-between">
                      <h5 className="text-white font-medium line-through">{task.title}</h5>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 w-8 p-0 text-red-400 hover:text-red-300"
                        onClick={() => setDeletingTask(task)}
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </Button>
                    </div>
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
        </>
      )}

      {/* Create/Edit Task Dialog */}
      <TaskFormDialog
        open={createDialogOpen || editingTask !== null}
        onOpenChange={(open) => {
          if (!open) {
            setCreateDialogOpen(false)
            setEditingTask(null)
          }
        }}
        task={editingTask}
        applicationId={applicationId}
      />

      {/* Delete Confirmation */}
      <AlertDialog open={deletingTask !== null} onOpenChange={(open) => !open && setDeletingTask(null)}>
        <AlertDialogContent className="glass-panel border-white/10">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-white">Delete Task?</AlertDialogTitle>
            <AlertDialogDescription className="text-slate-400">
              Are you sure you want to delete &ldquo;{deletingTask?.title}&rdquo;? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel
              disabled={isSubmitting}
              className="bg-white/5 border-white/10 hover:bg-white/10"
            >
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={() => deletingTask && handleDeleteTask(deletingTask.id)}
              disabled={isSubmitting}
              className="bg-red-600 hover:bg-red-700"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Deleting...
                </>
              ) : (
                "Delete"
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}

// Task Form Dialog Component
function TaskFormDialog({
  open,
  onOpenChange,
  task,
  applicationId,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
  task: Task | null
  applicationId: string
}) {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formData, setFormData] = useState({
    title: task?.title || "",
    description: task?.description || "",
    dueDate: task?.dueDate ? format(new Date(task.dueDate), "yyyy-MM-dd") : "",
    priority: task?.priority || "MEDIUM",
  })

  // Update form data when task changes (for edit mode)
  useEffect(() => {
    if (task) {
      setFormData({
        title: task.title || "",
        description: task.description || "",
        dueDate: task.dueDate ? format(new Date(task.dueDate), "yyyy-MM-dd") : "",
        priority: task.priority || "MEDIUM",
      })
    } else {
      // Reset form for create mode
      setFormData({
        title: "",
        description: "",
        dueDate: "",
        priority: "MEDIUM",
      })
    }
  }, [task, open])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const payload = {
        title: formData.title,
        description: formData.description || undefined,
        dueDate: formData.dueDate ? new Date(formData.dueDate).toISOString() : undefined,
        priority: formData.priority,
        applicationId,
      }

      const url = task ? `/api/tasks/${task.id}` : "/api/tasks"
      const method = task ? "PATCH" : "POST"

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      })

      if (!response.ok) {
        throw new Error(`Failed to ${task ? "update" : "create"} task`)
      }

      toast.success(task ? "Task updated!" : "Task created!")
      onOpenChange(false)
      router.refresh()
    } catch (error) {
      console.error("Error saving task:", error)
      toast.error(`Failed to ${task ? "update" : "create"} task`)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px] glass-panel border-white/10">
        <DialogHeader>
          <DialogTitle className="text-2xl text-white">
            {task ? "Edit Task" : "Create Task"}
          </DialogTitle>
          <DialogDescription className="text-slate-400">
            {task ? "Update the task details" : "Add a new task for this application"}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title" className="text-slate-300">
              Title <span className="text-red-400">*</span>
            </Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="Follow up with recruiter"
              required
              className="bg-white/5 border-white/10 focus-visible:ring-indigo-500"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description" className="text-slate-300">
              Description
            </Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Additional details..."
              rows={3}
              className="bg-white/5 border-white/10 focus-visible:ring-indigo-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="dueDate" className="text-slate-300">
                Due Date
              </Label>
              <Input
                id="dueDate"
                type="date"
                value={formData.dueDate}
                onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                className="bg-white/5 border-white/10 focus-visible:ring-indigo-500"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="priority" className="text-slate-300">
                Priority
              </Label>
              <Select
                value={formData.priority}
                onValueChange={(value) => setFormData({ ...formData, priority: value as any })}
              >
                <SelectTrigger className="bg-white/5 border-white/10 focus:ring-indigo-500">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="glass-panel border-white/10">
                  <SelectItem value="LOW">Low</SelectItem>
                  <SelectItem value="MEDIUM">Medium</SelectItem>
                  <SelectItem value="HIGH">High</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <Button
              type="button"
              variant="ghost"
              onClick={() => onOpenChange(false)}
              disabled={isSubmitting}
              className="hover:bg-white/5"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
              className="bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  {task ? "Updating..." : "Creating..."}
                </>
              ) : (
                task ? "Update Task" : "Create Task"
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
