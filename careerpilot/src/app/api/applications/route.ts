import { NextRequest } from "next/server"
import { requireAuth } from "@/lib/auth/apiAuth"
import { prisma } from "@/lib/db/prisma"
import {
  createApplicationSchema,
  listApplicationsSchema,
} from "@/lib/validations/application"
import {
  successResponse,
  paginatedResponse,
  handleApiError,
} from "@/lib/utils/api-response"
import { logActivity } from "@/lib/utils/activity-logger"
import { ActivityType, Prisma } from "@prisma/client"

/**
 * GET /api/applications
 * List applications with filtering, sorting, and pagination
 */
export async function GET(req: NextRequest) {
  try {
    const { user, response } = await requireAuth(req)
    if (response) return response

    // Parse query parameters
    const { searchParams } = new URL(req.url)
    const queryParams = Object.fromEntries(searchParams.entries())

    const filters = listApplicationsSchema.parse(queryParams)

    // Build where clause
    const where: Prisma.ApplicationWhereInput = {
      userId: user!.id,
    }

    if (filters.stage) {
      where.stage = filters.stage
    }

    if (filters.status) {
      where.status = filters.status
    }

    if (filters.companyId) {
      where.companyId = filters.companyId
    }

    if (filters.source) {
      where.source = filters.source
    }

    if (filters.tags) {
      const tagArray = filters.tags.split(",").map((t) => t.trim())
      where.tags = {
        hasSome: tagArray,
      }
    }

    if (filters.search) {
      where.OR = [
        {
          roleTitle: {
            contains: filters.search,
            mode: "insensitive",
          },
        },
        {
          company: {
            name: {
              contains: filters.search,
              mode: "insensitive",
            },
          },
        },
      ]
    }

    // Build orderBy
    const orderBy: Prisma.ApplicationOrderByWithRelationInput = {
      [filters.sortBy]: filters.sortOrder,
    }

    // Calculate pagination
    const skip = (filters.page - 1) * filters.limit

    // Fetch applications with related data
    const [applications, total] = await Promise.all([
      prisma.application.findMany({
        where,
        orderBy,
        skip,
        take: filters.limit,
        include: {
          company: {
            select: {
              id: true,
              name: true,
              website: true,
              industry: true,
              size: true,
            },
          },
          _count: {
            select: {
              interviews: true,
              tasks: true,
              activities: true,
            },
          },
        },
      }),
      prisma.application.count({ where }),
    ])

    return paginatedResponse(applications, filters.page, filters.limit, total)
  } catch (error) {
    return handleApiError(error)
  }
}

/**
 * POST /api/applications
 * Create a new application
 */
export async function POST(req: NextRequest) {
  try {
    const { user, response } = await requireAuth(req)
    if (response) return response

    const body = await req.json()
    const data = createApplicationSchema.parse(body)

    // Verify company belongs to user
    const company = await prisma.company.findFirst({
      where: {
        id: data.companyId,
        userId: user!.id,
      },
    })

    if (!company) {
      return successResponse(
        { error: "Company not found or access denied" },
        404
      )
    }

    // Convert date strings to Date objects if needed
    const applicationData: Prisma.ApplicationCreateInput = {
      user: { connect: { id: user!.id } },
      company: { connect: { id: data.companyId } },
      roleTitle: data.roleTitle,
      location: data.location,
      employmentType: data.employmentType,
      source: data.source,
      postingUrl: data.postingUrl || undefined,
      stage: data.stage,
      status: data.status,
      externalAtsUrl: data.externalAtsUrl || undefined,
      externalApplicationId: data.externalApplicationId,
      resumeVersion: data.resumeVersion,
      coverLetter: data.coverLetter,
      salaryMin: data.salaryMin,
      salaryMax: data.salaryMax,
      salaryCurrency: data.salaryCurrency || "USD",
      offerDeadline: data.offerDeadline
        ? new Date(data.offerDeadline)
        : undefined,
      notes: data.notes,
      tags: data.tags || [],
      // Set initial stage timestamp
      discoveredAt: new Date(),
    }

    const application = await prisma.application.create({
      data: applicationData,
      include: {
        company: {
          select: {
            id: true,
            name: true,
            website: true,
            industry: true,
            size: true,
          },
        },
      },
    })

    // Log activity
    await logActivity(
      user!.id,
      application.id,
      ActivityType.CREATED,
      `Created application for ${data.roleTitle} at ${company.name}`
    )

    return successResponse(application, 201)
  } catch (error) {
    return handleApiError(error)
  }
}
