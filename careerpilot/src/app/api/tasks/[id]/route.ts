import { NextRequest } from "next/server"
import { requireAuth } from "@/lib/auth/apiAuth"
import { prisma } from "@/lib/db/prisma"
import { updateTaskSchema } from "@/lib/validations/task"
import {
  successResponse,
  errorResponse,
  handleApiError,
} from "@/lib/utils/api-response"
import { logActivity } from "@/lib/utils/activity-logger"
import { ActivityType, Prisma, TaskStatus } from "@prisma/client"

/**
 * GET /api/tasks/[id]
 * Get a single task by ID
 */
export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { user, response } = await requireAuth(req)
    if (response) return response

    const task = await prisma.task.findFirst({
      where: {
        id: params.id,
        userId: user!.id,
      },
      include: {
        application: {
          include: {
            company: true,
          },
        },
      },
    })

    if (!task) {
      return errorResponse("Task not found", 404)
    }

    return successResponse(task)
  } catch (error) {
    return handleApiError(error)
  }
}

/**
 * PATCH /api/tasks/[id]
 * Update a task
 */
export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { user, response } = await requireAuth(req)
    if (response) return response

    // Verify task belongs to user
    const existingTask = await prisma.task.findFirst({
      where: {
        id: params.id,
        userId: user!.id,
      },
    })

    if (!existingTask) {
      return errorResponse("Task not found", 404)
    }

    const body = await req.json()
    const data = updateTaskSchema.parse(body)

    // Prepare update data
    const updateData: Prisma.TaskUpdateInput = {}

    if (data.title !== undefined) updateData.title = data.title
    if (data.description !== undefined) updateData.description = data.description
    if (data.dueDate !== undefined)
      updateData.dueDate = data.dueDate ? new Date(data.dueDate) : null
    if (data.priority !== undefined) updateData.priority = data.priority
    if (data.status !== undefined) {
      updateData.status = data.status
      // Set completedAt when status changes to COMPLETED
      if (data.status === TaskStatus.COMPLETED && !existingTask.completedAt) {
        updateData.completedAt = new Date()
      }
      // Clear completedAt if status changes away from COMPLETED
      if (data.status !== TaskStatus.COMPLETED && existingTask.completedAt) {
        updateData.completedAt = null
      }
    }
    if (data.recurrence !== undefined) updateData.recurrence = data.recurrence
    if (data.notifyInApp !== undefined) updateData.notifyInApp = data.notifyInApp
    if (data.notifyEmail !== undefined) updateData.notifyEmail = data.notifyEmail
    if (data.notifySlack !== undefined) updateData.notifySlack = data.notifySlack
    if (data.notifyDiscord !== undefined)
      updateData.notifyDiscord = data.notifyDiscord

    const task = await prisma.task.update({
      where: { id: params.id },
      data: updateData,
      include: {
        application: {
          include: {
            company: {
              select: {
                id: true,
                name: true,
              },
            },
          },
        },
      },
    })

    // Log completion if task was just completed
    if (
      data.status === TaskStatus.COMPLETED &&
      existingTask.status !== TaskStatus.COMPLETED &&
      existingTask.applicationId
    ) {
      await logActivity(
        user!.id,
        existingTask.applicationId,
        ActivityType.TASK_COMPLETED,
        `Completed task: ${task.title}`
      )
    }

    return successResponse(task)
  } catch (error) {
    return handleApiError(error)
  }
}

/**
 * DELETE /api/tasks/[id]
 * Delete a task
 */
export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { user, response } = await requireAuth(req)
    if (response) return response

    // Verify task belongs to user
    const task = await prisma.task.findFirst({
      where: {
        id: params.id,
        userId: user!.id,
      },
    })

    if (!task) {
      return errorResponse("Task not found", 404)
    }

    // Delete the task
    await prisma.task.delete({
      where: { id: params.id },
    })

    return successResponse(
      {
        message: "Task deleted successfully",
        id: params.id,
      },
      200
    )
  } catch (error) {
    return handleApiError(error)
  }
}
