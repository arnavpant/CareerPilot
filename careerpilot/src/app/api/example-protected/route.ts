import { NextRequest, NextResponse } from "next/server"
import { requireAuth } from "@/lib/auth/apiAuth"

/**
 * Example protected API route
 * This demonstrates how to protect API endpoints with authentication
 */
export async function GET(req: NextRequest) {
  const { user, response } = await requireAuth(req)

  // If not authenticated, return the error response
  if (response) {
    return response
  }

  // User is authenticated, proceed with the request
  return NextResponse.json({
    message: "This is a protected endpoint",
    user: {
      id: user!.id,
      email: user!.email,
      name: user!.name,
    },
  })
}

export async function POST(req: NextRequest) {
  const { user, response } = await requireAuth(req)

  if (response) {
    return response
  }

  const body = await req.json()

  return NextResponse.json({
    message: "Data received successfully",
    user: user!.email,
    data: body,
  })
}

