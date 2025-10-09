import { NextRequest } from "next/server"
import { requireAuth } from "@/lib/auth/apiAuth"
import { prisma } from "@/lib/db/prisma"
import { successResponse, handleApiError } from "@/lib/utils/api-response"

/**
 * GET /api/email/connections
 * List all email connections for the authenticated user
 */
export async function GET(req: NextRequest) {
  try {
    const { user, response } = await requireAuth(req)
    if (response) return response

    const connections = await prisma.emailConnection.findMany({
      where: {
        userId: user!.id,
      },
      select: {
        id: true,
        provider: true,
        email: true,
        lastSyncAt: true,
        createdAt: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    })

    return successResponse(connections)
  } catch (error) {
    return handleApiError(error)
  }
}

