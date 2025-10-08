import { NextRequest } from "next/server"
import { requireAuth } from "@/lib/auth/apiAuth"
import { prisma } from "@/lib/db/prisma"
import { rescheduleTaskSchema } from "@/lib/validations/task"
import {
  successResponse,
  errorResponse,
  handleApiError,
} from "@/lib/utils/api-response"

/**
 * POST /api/tasks/[id]/reschedule
 * Reschedule or snooze a task
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
    const data = rescheduleTaskSchema.parse(body)

    let newDueDate: Date

    if (data.snoozeDuration) {
      // Snooze: add duration in minutes to current time
      newDueDate = new Date()
      newDueDate.setMinutes(newDueDate.getMinutes() + data.snoozeDuration)
    } else {
      // Reschedule: use provided date
      newDueDate = new Date(data.dueDate)
    }

    const task = await prisma.task.update({
      where: { id: params.id },
      data: {
        dueDate: newDueDate,
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

    return successResponse({
      ...task,
      action: data.snoozeDuration ? "snoozed" : "rescheduled",
      message: data.snoozeDuration
        ? `Task snoozed for ${data.snoozeDuration} minutes`
        : "Task rescheduled",
    })
  } catch (error) {
    return handleApiError(error)
  }
}
