import { NextRequest } from "next/server"
import { requireAuth } from "@/lib/auth/apiAuth"
import { prisma } from "@/lib/db/prisma"
import {
  createInterviewSchema,
  listInterviewsSchema,
} from "@/lib/validations/interview"
import {
  successResponse,
  paginatedResponse,
  errorResponse,
  handleApiError,
} from "@/lib/utils/api-response"
import { logActivity } from "@/lib/utils/activity-logger"
import { ActivityType, Prisma } from "@prisma/client"

/**
 * GET /api/interviews
 * List interviews with filtering, sorting, and pagination
 */
export async function GET(req: NextRequest) {
  try {
    const { user, response } = await requireAuth(req)
    if (response) return response

    // Parse query parameters
    const { searchParams } = new URL(req.url)
    const queryParams = Object.fromEntries(searchParams.entries())

    const filters = listInterviewsSchema.parse(queryParams)

    // Build where clause
    const where: Prisma.InterviewWhereInput = {
      userId: user!.id,
    }

    if (filters.applicationId) {
      where.applicationId = filters.applicationId
    }

    if (filters.type) {
      where.type = filters.type
    }

    if (filters.outcome) {
      where.outcome = filters.outcome
    }

    // Date range filtering
    if (filters.startDate || filters.endDate) {
      where.scheduledAt = {}
      if (filters.startDate) {
        where.scheduledAt.gte = new Date(filters.startDate)
      }
      if (filters.endDate) {
        where.scheduledAt.lte = new Date(filters.endDate)
      }
    }

    // Build orderBy
    const orderBy: Prisma.InterviewOrderByWithRelationInput = {
      [filters.sortBy]: filters.sortOrder,
    }

    // Calculate pagination
    const skip = (filters.page - 1) * filters.limit

    // Fetch interviews with related data
    const [interviews, total] = await Promise.all([
      prisma.interview.findMany({
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
          panelMembers: {
            include: {
              contact: {
                select: {
                  id: true,
                  name: true,
                  email: true,
                  role: true,
                },
              },
            },
          },
          _count: {
            select: {
              panelMembers: true,
              attachments: true,
            },
          },
        },
      }),
      prisma.interview.count({ where }),
    ])

    return paginatedResponse(interviews, filters.page, filters.limit, total)
  } catch (error) {
    return handleApiError(error)
  }
}

/**
 * POST /api/interviews
 * Create a new interview
 */
export async function POST(req: NextRequest) {
  try {
    const { user, response } = await requireAuth(req)
    if (response) return response

    const body = await req.json()
    const data = createInterviewSchema.parse(body)

    // Verify application belongs to user
    const application = await prisma.application.findFirst({
      where: {
        id: data.applicationId,
        userId: user!.id,
      },
      include: {
        company: {
          select: {
            name: true,
          },
        },
      },
    })

    if (!application) {
      return errorResponse("Application not found or access denied", 404)
    }

    // If panel members have contactIds, verify they belong to user
    if (data.panelMembers && data.panelMembers.length > 0) {
      const contactIds = data.panelMembers
        .map((pm) => pm.contactId)
        .filter((id): id is string => id !== null && id !== undefined)

      if (contactIds.length > 0) {
        const contacts = await prisma.contact.findMany({
          where: {
            id: { in: contactIds },
            userId: user!.id,
          },
        })

        if (contacts.length !== contactIds.length) {
          return errorResponse("One or more contacts not found or access denied", 404)
        }
      }
    }

    // Create interview with panel members
    const interview = await prisma.interview.create({
      data: {
        userId: user!.id,
        applicationId: data.applicationId,
        roundName: data.roundName,
        type: data.type || null,
        scheduledAt: new Date(data.scheduledAt),
        duration: data.duration || null,
        location: data.location || null,
        virtualLink: data.virtualLink || null,
        instructions: data.instructions || null,
        outcome: data.outcome || "PENDING",
        notes: data.notes || null,
        panelMembers: data.panelMembers
          ? {
              create: data.panelMembers.map((pm) => ({
                contactId: pm.contactId || null,
                name: pm.name,
                role: pm.role || null,
              })),
            }
          : undefined,
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
        panelMembers: {
          include: {
            contact: {
              select: {
                id: true,
                name: true,
                email: true,
                role: true,
              },
            },
          },
        },
      },
    })

    // Log activity
    await logActivity(
      user!.id,
      data.applicationId,
      ActivityType.INTERVIEW_SCHEDULED,
      `Scheduled ${data.roundName} for ${application.roleTitle} at ${application.company.name}`
    )

    return successResponse(interview, 201)
  } catch (error) {
    return handleApiError(error)
  }
}
