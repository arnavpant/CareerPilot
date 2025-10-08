import { NextRequest, NextResponse } from "next/server"
import { getToken } from "next-auth/jwt"

/**
 * Middleware to protect API routes
 * Returns the user if authenticated, otherwise returns an error response
 */
export async function requireAuth(req: NextRequest) {
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET })

  if (!token || !token.email) {
    return {
      user: null,
      response: NextResponse.json({ error: "Unauthorized" }, { status: 401 }),
    }
  }

  return {
    user: {
      id: token.id as string,
      email: token.email as string,
      name: token.name as string | undefined,
    },
    response: null,
  }
}

/**
 * Helper to check if user is authenticated (for server components)
 */
export async function getUserFromRequest(req: NextRequest) {
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET })

  if (!token || !token.email) {
    return null
  }

  return {
    id: token.id as string,
    email: token.email as string,
    name: token.name as string | undefined,
  }
}

