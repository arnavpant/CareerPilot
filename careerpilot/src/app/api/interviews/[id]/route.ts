import { NextRequest } from "next/server"
import { requireAuth } from "@/lib/auth/apiAuth"
import { prisma } from "@/lib/db/prisma"
import { updateInterviewSchema } from "@/lib/validations/interview"
import {
  successResponse,
  errorResponse,
  handleApiError,
} from "@/lib/utils/api-response"
import { logActivity } from "@/lib/utils/activity-logger"
import { ActivityType, InterviewOutcome, Prisma } from "@prisma/client"

/**
 * GET /api/interviews/[id]
 * Get a single interview by ID
 */
export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { user, response } = await requireAuth(req)
    if (response) return response

    const interview = await prisma.interview.findFirst({
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
        panelMembers: {
          include: {
            contact: true,
          },
        },
        attachments: {
          orderBy: {
            uploadedAt: "desc",
          },
        },
      },
    })

    if (!interview) {
      return errorResponse("Interview not found", 404)
    }

    return successResponse(interview)
  } catch (error) {
    return handleApiError(error)
  }
}

/**
 * PATCH /api/interviews/[id]
 * Update an interview (including outcome logging)
 */
export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { user, response } = await requireAuth(req)
    if (response) return response

    // Verify interview belongs to user
    const existingInterview = await prisma.interview.findFirst({
      where: {
        id: params.id,
        userId: user!.id,
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
        panelMembers: true,
      },
    })

    if (!existingInterview) {
      return errorResponse("Interview not found", 404)
    }

    const body = await req.json()
    const data = updateInterviewSchema.parse(body)

    // If panel members are being updated, verify contactIds belong to user
    if (data.panelMembers) {
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

    // Prepare update data
    const updateData: Prisma.InterviewUpdateInput = {}

    if (data.roundName !== undefined) updateData.roundName = data.roundName
    if (data.type !== undefined) updateData.type = data.type
    if (data.scheduledAt !== undefined)
      updateData.scheduledAt = new Date(data.scheduledAt)
    if (data.duration !== undefined) updateData.duration = data.duration
    if (data.location !== undefined) updateData.location = data.location
    if (data.virtualLink !== undefined) updateData.virtualLink = data.virtualLink
    if (data.instructions !== undefined)
      updateData.instructions = data.instructions
    if (data.outcome !== undefined) updateData.outcome = data.outcome
    if (data.notes !== undefined) updateData.notes = data.notes

    // Handle panel members update (replace all)
    if (data.panelMembers !== undefined) {
      // Delete existing panel members and create new ones
      await prisma.interviewPanelMember.deleteMany({
        where: { interviewId: params.id },
      })

      updateData.panelMembers = {
        create: data.panelMembers.map((pm) => ({
          contactId: pm.contactId || null,
          name: pm.name,
          role: pm.role || null,
        })),
      }
    }

    const interview = await prisma.interview.update({
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

    // Log outcome change if outcome was updated and is not PENDING
    if (
      data.outcome &&
      data.outcome !== existingInterview.outcome &&
      data.outcome !== InterviewOutcome.PENDING
    ) {
      const outcomeDescriptions: Record<InterviewOutcome, string> = {
        PENDING: "pending",
        PASSED: "passed",
        FAILED: "failed",
        CANCELLED: "cancelled",
        NO_SHOW: "no-show",
      }

      await logActivity(
        user!.id,
        existingInterview.applicationId,
        ActivityType.INTERVIEW_COMPLETED,
        `Interview ${existingInterview.roundName} outcome: ${outcomeDescriptions[data.outcome]} for ${existingInterview.application.roleTitle} at ${existingInterview.application.company.name}`,
        { outcome: data.outcome, interviewId: params.id }
      )
    }

    return successResponse(interview)
  } catch (error) {
    return handleApiError(error)
  }
}

/**
 * DELETE /api/interviews/[id]
 * Delete an interview
 */
export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { user, response } = await requireAuth(req)
    if (response) return response

    // Verify interview belongs to user
    const interview = await prisma.interview.findFirst({
      where: {
        id: params.id,
        userId: user!.id,
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

    if (!interview) {
      return errorResponse("Interview not found", 404)
    }

    // Delete the interview (cascades to panel members and attachments)
    await prisma.interview.delete({
      where: { id: params.id },
    })

    return successResponse(
      {
        message: "Interview deleted successfully",
        id: params.id,
      },
      200
    )
  } catch (error) {
    return handleApiError(error)
  }
}
