import { NextRequest } from "next/server"
import { requireAuth } from "@/lib/auth/apiAuth"
import { prisma } from "@/lib/db/prisma"
import { completeTaskSchema } from "@/lib/validations/task"
import {
  successResponse,
  errorResponse,
  handleApiError,
} from "@/lib/utils/api-response"
import { logActivity } from "@/lib/utils/activity-logger"
import { ActivityType, TaskStatus } from "@prisma/client"

/**
 * POST /api/tasks/[id]/complete
 * Mark a task as completed or reopen it
 */
export async function POST(
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
    const data = completeTaskSchema.parse(body)

    const task = await prisma.task.update({
      where: { id: params.id },
      data: {
        status: data.completed ? TaskStatus.COMPLETED : TaskStatus.PENDING,
        completedAt: data.completed ? new Date() : null,
      },
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

    // Log completion if task was just completed and is linked to an application
    if (data.completed && existingTask.applicationId) {
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
