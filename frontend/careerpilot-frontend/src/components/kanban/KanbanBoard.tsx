"use client"

import { useState, useEffect } from "react"
import { DragDropContext, Droppable, type DropResult } from "@hello-pangea/dnd"
import { StageColumn } from "./StageColumn"
import { STAGES } from "@/lib/constants/stages"
import type { Application } from "@/types/domain"
import { getApplications, updateApplication } from "@/lib/api/applications"
import { toast } from "sonner"

export function KanbanBoard() {
  const [applications, setApplications] = useState<Application[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadApplications()
  }, [])

  const loadApplications = async () => {
    try {
      const data = await getApplications()
      setApplications(data)
    } finally {
      setLoading(false)
    }
  }

  const handleDragEnd = async (result: DropResult) => {
    const { destination, source, draggableId } = result

    if (!destination) return
    if (destination.droppableId === source.droppableId && destination.index === source.index) {
      return
    }

    const application = applications.find((app) => app.id === draggableId)
    if (!application) return

    // Optimistic update
    const updatedApplications = applications.map((app) =>
      app.id === draggableId ? { ...app, stage: destination.droppableId } : app,
    )
    setApplications(updatedApplications)

    try {
      await updateApplication(draggableId, { stage: destination.droppableId })
      toast.success("Application moved successfully")
    } catch (error) {
      // Revert on error
      setApplications(applications)
      toast.error("Failed to move application")
    }
  }

  if (loading) {
    return <div className="text-slate-400">Loading...</div>
  }

  return (
    <DragDropContext onDragEnd={handleDragEnd}>
      <div className="flex gap-4 overflow-x-auto pb-4">
        {STAGES.map((stage) => {
          const stageApplications = applications.filter((app) => app.stage === stage)
          return (
            <Droppable key={stage} droppableId={stage}>
              {(provided, snapshot) => (
                <StageColumn
                  stage={stage}
                  applications={stageApplications}
                  provided={provided}
                  isDraggingOver={snapshot.isDraggingOver}
                />
              )}
            </Droppable>
          )
        })}
      </div>
    </DragDropContext>
  )
}
