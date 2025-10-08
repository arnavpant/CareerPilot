import { NextRequest } from "next/server"
import { requireAuth } from "@/lib/auth/apiAuth"
import { prisma } from "@/lib/db/prisma"
import {
  createOfferSchema,
  listOffersSchema,
} from "@/lib/validations/offer"
import {
  successResponse,
  paginatedResponse,
  errorResponse,
  handleApiError,
} from "@/lib/utils/api-response"
import { logActivity } from "@/lib/utils/activity-logger"
import { ActivityType, Prisma } from "@prisma/client"

/**
 * GET /api/offers
 * List offers with filtering, sorting, and pagination
 */
export async function GET(req: NextRequest) {
  try {
    const { user, response } = await requireAuth(req)
    if (response) return response

    // Parse query parameters
    const { searchParams } = new URL(req.url)
    const queryParams = Object.fromEntries(searchParams.entries())

    const filters = listOffersSchema.parse(queryParams)

    // Build where clause - must join through application to filter by userId
    const where: Prisma.OfferWhereInput = {
      application: {
        userId: user!.id,
      },
    }

    if (filters.decision) {
      where.decision = filters.decision
    }

    // Salary range filtering
    if (filters.minSalary !== undefined || filters.maxSalary !== undefined) {
      where.baseSalary = {}
      if (filters.minSalary !== undefined) {
        where.baseSalary.gte = filters.minSalary
      }
      if (filters.maxSalary !== undefined) {
        where.baseSalary.lte = filters.maxSalary
      }
    }

    // Deadline filtering
    if (filters.deadlineBefore) {
      where.deadline = {
        lte: new Date(filters.deadlineBefore),
      }
    }

    // Build orderBy
    const orderBy: Prisma.OfferOrderByWithRelationInput = {
      [filters.sortBy]: filters.sortOrder,
    }

    // Calculate pagination
    const skip = (filters.page - 1) * filters.limit

    // Fetch offers with related data
    const [offers, total] = await Promise.all([
      prisma.offer.findMany({
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
      prisma.offer.count({ where }),
    ])

    return paginatedResponse(offers, filters.page, filters.limit, total)
  } catch (error) {
    return handleApiError(error)
  }
}

/**
 * POST /api/offers
 * Create a new offer
 */
export async function POST(req: NextRequest) {
  try {
    const { user, response } = await requireAuth(req)
    if (response) return response

    const body = await req.json()
    const data = createOfferSchema.parse(body)

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
        offer: true, // Check if offer already exists
      },
    })

    if (!application) {
      return errorResponse("Application not found or access denied", 404)
    }

    // Check if application already has an offer (one-to-one relationship)
    if (application.offer) {
      return errorResponse(
        "Application already has an offer. Update the existing offer or delete it first.",
        409
      )
    }

    const offer = await prisma.offer.create({
      data: {
        applicationId: data.applicationId,
        baseSalary: data.baseSalary || null,
        bonus: data.bonus || null,
        equity: data.equity || null,
        currency: data.currency || "USD",
        benefits: data.benefits || null,
        location: data.location || null,
        deadline: data.deadline ? new Date(data.deadline) : null,
        decision: data.decision || "PENDING",
        decisionDate: data.decisionDate ? new Date(data.decisionDate) : null,
        notes: data.notes || null,
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

    // Log activity
    await logActivity(
      user!.id,
      data.applicationId,
      ActivityType.OFFER_RECEIVED,
      `Received offer from ${application.company.name}`,
      {
        baseSalary: data.baseSalary,
        bonus: data.bonus,
        equity: data.equity,
        currency: data.currency,
      }
    )

    return successResponse(offer, 201)
  } catch (error) {
    return handleApiError(error)
  }
}
