"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { DragDropContext, DropResult } from "@hello-pangea/dnd"
import { toast } from "sonner"
import { StageColumn } from "./StageColumn"
import { STAGE_ORDER } from "@/lib/constants/stages"
import type { Application, Company, ApplicationStage } from "@prisma/client"

interface KanbanBoardProps {
  initialApplications: (Application & { company: Company | null })[]
}

export function KanbanBoard({ initialApplications }: KanbanBoardProps) {
  const router = useRouter()
  const [applications, setApplications] = useState(initialApplications)
  const [isUpdating, setIsUpdating] = useState(false)

  // Group applications by stage
  const applicationsByStage = STAGE_ORDER.reduce((acc, stage) => {
    acc[stage] = applications.filter((app) => app && app.stage === stage)
    return acc
  }, {} as Record<ApplicationStage, (Application & { company: Company | null })[]>)

  const handleDragEnd = async (result: DropResult) => {
    const { source, destination, draggableId } = result

    // Dropped outside the list or in the same position
    if (!destination || 
        (source.droppableId === destination.droppableId && 
         source.index === destination.index)) {
      return
    }

    const sourceStage = source.droppableId as ApplicationStage
    const destStage = destination.droppableId as ApplicationStage

    // Optimistic update
    setApplications((prev) =>
      prev.map((app) =>
        app.id === draggableId ? { ...app, stage: destStage } : app
      )
    )

    setIsUpdating(true)

    try {
      // Update on server
      const response = await fetch(`/api/applications/${draggableId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ stage: destStage }),
      })

      if (!response.ok) {
        throw new Error("Failed to update application")
      }

      const result = await response.json()
      
      toast.success("Application moved", {
        description: `Moved to ${destStage.toLowerCase()} stage`,
      })

      // Update with server response - ensure we keep the app in the array
      if (result.data) {
        setApplications((prev) =>
          prev.map((app) => 
            app && app.id === draggableId ? { ...app, ...result.data } : app
          )
        )
      }

      // Refresh server data so other pages (like table view) get updated data
      router.refresh()
    } catch (error) {
      // Revert on error
      setApplications((prev) =>
        prev.map((app) =>
          app.id === draggableId ? { ...app, stage: sourceStage } : app
        )
      )
      
      toast.error("Failed to move application", {
        description: "Please try again",
      })
      
      console.error("Error updating application:", error)
    } finally {
      setIsUpdating(false)
    }
  }

  return (
    <DragDropContext onDragEnd={handleDragEnd}>
      <div className="flex gap-4 overflow-x-auto pb-4">
        {STAGE_ORDER.map((stage) => (
          <StageColumn
            key={stage}
            stage={stage}
            applications={applicationsByStage[stage]}
          />
        ))}
      </div>
      
      {/* Loading indicator */}
      {isUpdating && (
        <div className="fixed bottom-4 right-4 glass-panel px-4 py-2 rounded-xl">
          <div className="flex items-center gap-2 text-sm text-white">
            <div className="w-4 h-4 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />
            Updating...
          </div>
        </div>
      )}
    </DragDropContext>
  )
}
