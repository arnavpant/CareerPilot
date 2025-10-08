import { NextRequest } from "next/server"
import { requireAuth } from "@/lib/auth/apiAuth"
import { prisma } from "@/lib/db/prisma"
import {
  createTaskSchema,
  listTasksSchema,
} from "@/lib/validations/task"
import {
  successResponse,
  paginatedResponse,
  errorResponse,
  handleApiError,
} from "@/lib/utils/api-response"
import { logActivity } from "@/lib/utils/activity-logger"
import { ActivityType, Prisma } from "@prisma/client"

/**
 * GET /api/tasks
 * List tasks with filtering, sorting, and pagination
 */
export async function GET(req: NextRequest) {
  try {
    const { user, response } = await requireAuth(req)
    if (response) return response

    // Parse query parameters
    const { searchParams } = new URL(req.url)
    const queryParams = Object.fromEntries(searchParams.entries())

    const filters = listTasksSchema.parse(queryParams)

    // Build where clause
    const where: Prisma.TaskWhereInput = {
      userId: user!.id,
    }

    if (filters.applicationId) {
      where.applicationId = filters.applicationId
    }

    if (filters.status) {
      where.status = filters.status
    }

    if (filters.priority) {
      where.priority = filters.priority
    }

    // Date range filtering and overdue filter
    const dueDateFilter: Prisma.DateTimeNullableFilter = {}
    
    if (filters.dueBefore) {
      dueDateFilter.lte = new Date(filters.dueBefore)
    }
    if (filters.dueAfter) {
      dueDateFilter.gte = new Date(filters.dueAfter)
    }
    if (filters.overdue) {
      dueDateFilter.lt = new Date()
      where.status = {
        in: ["PENDING", "IN_PROGRESS"],
      }
    }
    
    if (Object.keys(dueDateFilter).length > 0) {
      where.dueDate = dueDateFilter
    }

    // Build orderBy
    const orderBy: Prisma.TaskOrderByWithRelationInput = {
      [filters.sortBy]: filters.sortOrder,
    }

    // Calculate pagination
    const skip = (filters.page - 1) * filters.limit

    // Fetch tasks with related data
    const [tasks, total] = await Promise.all([
      prisma.task.findMany({
        where,
        orderBy,
        skip,
        take: filters.limit,
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
      }),
      prisma.task.count({ where }),
    ])

    return paginatedResponse(tasks, filters.page, filters.limit, total)
  } catch (error) {
    return handleApiError(error)
  }
}

/**
 * POST /api/tasks
 * Create a new task
 */
export async function POST(req: NextRequest) {
  try {
    const { user, response } = await requireAuth(req)
    if (response) return response

    const body = await req.json()
    const data = createTaskSchema.parse(body)

    // Verify application belongs to user if provided
    if (data.applicationId) {
      const application = await prisma.application.findFirst({
        where: {
          id: data.applicationId,
          userId: user!.id,
        },
      })

      if (!application) {
        return errorResponse("Application not found or access denied", 404)
      }
    }

    // Verify interview belongs to user if provided
    if (data.interviewId) {
      const interview = await prisma.interview.findFirst({
        where: {
          id: data.interviewId,
          userId: user!.id,
        },
      })

      if (!interview) {
        return errorResponse("Interview not found or access denied", 404)
      }
    }

    const task = await prisma.task.create({
      data: {
        userId: user!.id,
        applicationId: data.applicationId || null,
        interviewId: data.interviewId || null,
        title: data.title,
        description: data.description || null,
        dueDate: data.dueDate ? new Date(data.dueDate) : null,
        priority: data.priority || "MEDIUM",
        status: data.status || "PENDING",
        recurrence: data.recurrence || null,
        notifyInApp: data.notifyInApp ?? true,
        notifyEmail: data.notifyEmail ?? false,
        notifySlack: data.notifySlack ?? false,
        notifyDiscord: data.notifyDiscord ?? false,
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

    // Log activity if task is linked to an application
    if (data.applicationId) {
      await logActivity(
        user!.id,
        data.applicationId,
        ActivityType.TASK_CREATED,
        `Created task: ${data.title}`
      )
    }

    return successResponse(task, 201)
  } catch (error) {
    return handleApiError(error)
  }
}
