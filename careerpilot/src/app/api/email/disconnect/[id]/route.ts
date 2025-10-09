import { NextRequest } from "next/server"
import { requireAuth } from "@/lib/auth/apiAuth"
import { prisma } from "@/lib/db/prisma"
import {
  successResponse,
  errorResponse,
  handleApiError,
} from "@/lib/utils/api-response"
import { ActivityType } from "@prisma/client"

/**
 * DELETE /api/email/disconnect/[id]
 * Disconnect an email connection
 */
export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { user, response } = await requireAuth(req)
    if (response) return response

    // Verify connection belongs to user
    const connection = await prisma.emailConnection.findFirst({
      where: {
        id: params.id,
        userId: user!.id,
      },
    })

    if (!connection) {
      return errorResponse("Email connection not found", 404)
    }

    // Delete the connection
    await prisma.emailConnection.delete({
      where: { id: params.id },
    })

    // Log activity
    await prisma.activity.create({
      data: {
        userId: user!.id,
        type: ActivityType.EMAIL_SENT, // Using EMAIL_SENT as closest match for now
        description: `Disconnected ${connection.provider} account (${connection.email})`,
      },
    })

    return successResponse(null, 204)
  } catch (error) {
    return handleApiError(error)
  }
}

