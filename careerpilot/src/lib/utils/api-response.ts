import { NextResponse } from "next/server"
import { ZodError } from "zod"
import { Prisma } from "@prisma/client"

/**
 * Standard API error response
 */
export function errorResponse(
  message: string,
  status: number = 500,
  details?: unknown
) {
  return NextResponse.json(
    {
      error: message,
      details: details || undefined,
    },
    { status }
  )
}

/**
 * Standard API success response
 */
export function successResponse<T>(data: T, status: number = 200) {
  return NextResponse.json(data, { status })
}

/**
 * Paginated response wrapper
 */
export function paginatedResponse<T>(
  data: T[],
  page: number,
  limit: number,
  total: number
) {
  return NextResponse.json({
    data,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
      hasNext: page * limit < total,
      hasPrev: page > 1,
    },
  })
}

/**
 * Handle Zod validation errors
 */
export function handleZodError(error: ZodError) {
  const issues = error.issues.map((issue) => ({
    field: issue.path.join("."),
    message: issue.message,
  }))

  return errorResponse("Validation failed", 400, issues)
}

/**
 * Handle Prisma errors
 */
export function handlePrismaError(error: unknown) {
  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    switch (error.code) {
      case "P2002":
        return errorResponse("A record with this value already exists", 409)
      case "P2003":
        return errorResponse("Related record not found", 404)
      case "P2025":
        return errorResponse("Record not found", 404)
      default:
        return errorResponse("Database error", 500)
    }
  }

  if (error instanceof Prisma.PrismaClientValidationError) {
    return errorResponse("Invalid data provided", 400)
  }

  return errorResponse("Internal server error", 500)
}

/**
 * Generic error handler for API routes
 */
export function handleApiError(error: unknown) {
  console.error("API Error:", error)

  if (error instanceof ZodError) {
    return handleZodError(error)
  }

  if (
    error instanceof Prisma.PrismaClientKnownRequestError ||
    error instanceof Prisma.PrismaClientValidationError
  ) {
    return handlePrismaError(error)
  }

  if (error instanceof Error) {
    return errorResponse(error.message, 500)
  }

  return errorResponse("An unexpected error occurred", 500)
}
