import { NextRequest } from "next/server"
import { requireAuth } from "@/lib/auth/apiAuth"
import { prisma } from "@/lib/db/prisma"
import { updateApplicationSchema } from "@/lib/validations/application"
import {
  successResponse,
  errorResponse,
  handleApiError,
} from "@/lib/utils/api-response"
import { logActivity, logStageChange } from "@/lib/utils/activity-logger"
import { ActivityType, Prisma } from "@prisma/client"

/**
 * GET /api/applications/[id]
 * Get a single application by ID
 */
export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { user, response } = await requireAuth(req)
    if (response) return response

    const application = await prisma.application.findFirst({
      where: {
        id: params.id,
        userId: user!.id,
      },
      include: {
        company: true,
        contacts: {
          include: {
            contact: true,
          },
        },
        interviews: {
          orderBy: {
            scheduledAt: "asc",
          },
          include: {
            panelMembers: {
              include: {
                contact: true,
              },
            },
          },
        },
        tasks: {
          orderBy: {
            dueDate: "asc",
          },
        },
        offer: true,
        activities: {
          orderBy: {
            createdAt: "desc",
          },
          take: 50, // Limit activities to recent 50
        },
        attachments: {
          orderBy: {
            uploadedAt: "desc",
          },
        },
        _count: {
          select: {
            interviews: true,
            tasks: true,
            activities: true,
            attachments: true,
          },
        },
      },
    })

    if (!application) {
      return errorResponse("Application not found", 404)
    }

    return successResponse(application)
  } catch (error) {
    return handleApiError(error)
  }
}

/**
 * PATCH /api/applications/[id]
 * Update an application
 */
export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { user, response } = await requireAuth(req)
    if (response) return response

    // Verify application belongs to user
    const existingApplication = await prisma.application.findFirst({
      where: {
        id: params.id,
        userId: user!.id,
      },
      include: {
        company: true,
      },
    })

    if (!existingApplication) {
      return errorResponse("Application not found", 404)
    }

    const body = await req.json()
    const data = updateApplicationSchema.parse(body)

    // If companyId is being changed, verify new company belongs to user
    if (data.companyId && data.companyId !== existingApplication.companyId) {
      const company = await prisma.company.findFirst({
        where: {
          id: data.companyId,
          userId: user!.id,
        },
      })

      if (!company) {
        return errorResponse("Company not found or access denied", 404)
      }
    }

    // Prepare update data
    const updateData: Prisma.ApplicationUpdateInput = {}

    // Map all possible fields
    if (data.companyId !== undefined)
      updateData.company = { connect: { id: data.companyId } }
    if (data.roleTitle !== undefined) updateData.roleTitle = data.roleTitle
    if (data.location !== undefined) updateData.location = data.location
    if (data.employmentType !== undefined)
      updateData.employmentType = data.employmentType
    if (data.source !== undefined) updateData.source = data.source
    if (data.postingUrl !== undefined) updateData.postingUrl = data.postingUrl
    if (data.stage !== undefined) updateData.stage = data.stage
    if (data.status !== undefined) updateData.status = data.status
    if (data.externalAtsUrl !== undefined)
      updateData.externalAtsUrl = data.externalAtsUrl
    if (data.externalApplicationId !== undefined)
      updateData.externalApplicationId = data.externalApplicationId
    if (data.resumeVersion !== undefined)
      updateData.resumeVersion = data.resumeVersion
    if (data.coverLetter !== undefined) updateData.coverLetter = data.coverLetter
    if (data.salaryMin !== undefined) updateData.salaryMin = data.salaryMin
    if (data.salaryMax !== undefined) updateData.salaryMax = data.salaryMax
    if (data.salaryCurrency !== undefined)
      updateData.salaryCurrency = data.salaryCurrency
    if (data.offerDeadline !== undefined)
      updateData.offerDeadline = data.offerDeadline
        ? new Date(data.offerDeadline)
        : null
    if (data.notes !== undefined) updateData.notes = data.notes
    if (data.tags !== undefined) updateData.tags = data.tags

    const application = await prisma.application.update({
      where: { id: params.id },
      data: updateData,
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

    // Log stage change if stage was updated
    if (data.stage && data.stage !== existingApplication.stage) {
      await logStageChange(
        user!.id,
        params.id,
        existingApplication.stage,
        data.stage
      )
    } else {
      // Log general update
      await logActivity(
        user!.id,
        params.id,
        ActivityType.UPDATED,
        `Updated application for ${application.roleTitle} at ${application.company.name}`
      )
    }

    return successResponse(application)
  } catch (error) {
    return handleApiError(error)
  }
}

/**
 * DELETE /api/applications/[id]
 * Delete an application
 */
export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { user, response } = await requireAuth(req)
    if (response) return response

    // Verify application belongs to user
    const application = await prisma.application.findFirst({
      where: {
        id: params.id,
        userId: user!.id,
      },
      include: {
        company: true,
      },
    })

    if (!application) {
      return errorResponse("Application not found", 404)
    }

    // Delete the application (cascades to related records)
    await prisma.application.delete({
      where: { id: params.id },
    })

    return successResponse(
      {
        message: "Application deleted successfully",
        id: params.id,
      },
      200
    )
  } catch (error) {
    return handleApiError(error)
  }
}
