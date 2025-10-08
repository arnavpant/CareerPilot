import { NextRequest } from "next/server"
import { requireAuth } from "@/lib/auth/apiAuth"
import { prisma } from "@/lib/db/prisma"
import { updateOfferSchema } from "@/lib/validations/offer"
import {
  successResponse,
  errorResponse,
  handleApiError,
} from "@/lib/utils/api-response"
import { logActivity } from "@/lib/utils/activity-logger"
import { ActivityType, OfferDecision, Prisma } from "@prisma/client"

/**
 * GET /api/offers/[id]
 * Get a single offer by ID
 */
export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { user, response } = await requireAuth(req)
    if (response) return response

    const offer = await prisma.offer.findFirst({
      where: {
        id: params.id,
        application: {
          userId: user!.id,
        },
      },
      include: {
        application: {
          include: {
            company: true,
            interviews: {
              orderBy: {
                scheduledAt: "asc",
              },
            },
          },
        },
      },
    })

    if (!offer) {
      return errorResponse("Offer not found", 404)
    }

    return successResponse(offer)
  } catch (error) {
    return handleApiError(error)
  }
}

/**
 * PATCH /api/offers/[id]
 * Update an offer (including decision tracking)
 */
export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { user, response } = await requireAuth(req)
    if (response) return response

    // Verify offer belongs to user
    const existingOffer = await prisma.offer.findFirst({
      where: {
        id: params.id,
        application: {
          userId: user!.id,
        },
      },
      include: {
        application: {
          include: {
            company: {
              select: {
                name: true,
              },
            },
          },
        },
      },
    })

    if (!existingOffer) {
      return errorResponse("Offer not found", 404)
    }

    const body = await req.json()
    const data = updateOfferSchema.parse(body)

    // Prepare update data
    const updateData: Prisma.OfferUpdateInput = {}

    if (data.baseSalary !== undefined) updateData.baseSalary = data.baseSalary
    if (data.bonus !== undefined) updateData.bonus = data.bonus
    if (data.equity !== undefined) updateData.equity = data.equity
    if (data.currency !== undefined) updateData.currency = data.currency
    if (data.benefits !== undefined) updateData.benefits = data.benefits
    if (data.location !== undefined) updateData.location = data.location
    if (data.deadline !== undefined)
      updateData.deadline = data.deadline ? new Date(data.deadline) : null
    if (data.decision !== undefined) {
      updateData.decision = data.decision
      // Auto-set decisionDate when decision changes from PENDING
      if (
        data.decision !== OfferDecision.PENDING &&
        existingOffer.decision === OfferDecision.PENDING
      ) {
        updateData.decisionDate = new Date()
      }
    }
    if (data.decisionDate !== undefined)
      updateData.decisionDate = data.decisionDate
        ? new Date(data.decisionDate)
        : null
    if (data.notes !== undefined) updateData.notes = data.notes

    const offer = await prisma.offer.update({
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

    // Log decision change if decision was updated
    if (data.decision && data.decision !== existingOffer.decision) {
      let activityType: ActivityType
      let description: string

      switch (data.decision) {
        case OfferDecision.ACCEPTED:
          activityType = ActivityType.OFFER_ACCEPTED
          description = `Accepted offer from ${existingOffer.application.company.name}`
          break
        case OfferDecision.DECLINED:
          activityType = ActivityType.OFFER_DECLINED
          description = `Declined offer from ${existingOffer.application.company.name}`
          break
        default:
          activityType = ActivityType.UPDATED
          description = `Updated offer from ${existingOffer.application.company.name}`
      }

      await logActivity(
        user!.id,
        existingOffer.applicationId,
        activityType,
        description,
        { decision: data.decision }
      )
    }

    return successResponse(offer)
  } catch (error) {
    return handleApiError(error)
  }
}

/**
 * DELETE /api/offers/[id]
 * Delete an offer
 */
export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { user, response } = await requireAuth(req)
    if (response) return response

    // Verify offer belongs to user
    const offer = await prisma.offer.findFirst({
      where: {
        id: params.id,
        application: {
          userId: user!.id,
        },
      },
      include: {
        application: {
          include: {
            company: {
              select: {
                name: true,
              },
            },
          },
        },
      },
    })

    if (!offer) {
      return errorResponse("Offer not found", 404)
    }

    // Delete the offer
    await prisma.offer.delete({
      where: { id: params.id },
    })

    return successResponse(
      {
        message: "Offer deleted successfully",
        id: params.id,
      },
      200
    )
  } catch (error) {
    return handleApiError(error)
  }
}
