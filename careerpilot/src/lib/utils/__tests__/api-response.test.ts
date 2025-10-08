import { ZodError } from "zod"
import { Prisma } from "@prisma/client"
import {
  errorResponse,
  successResponse,
  paginatedResponse,
  handleZodError,
  handlePrismaError,
  handleApiError,
} from "../api-response"

describe("API Response Utilities", () => {
  describe("errorResponse", () => {
    it("should return error response with correct structure", async () => {
      const response = errorResponse("Test error", 400)
      const data = await response.json()

      expect(response.status).toBe(400)
      expect(data.error).toBe("Test error")
    })

    it("should include details if provided", async () => {
      const details = { field: "email", message: "Invalid" }
      const response = errorResponse("Validation error", 400, details)
      const data = await response.json()

      expect(data.details).toEqual(details)
    })

    it("should default to 500 status", async () => {
      const response = errorResponse("Server error")
      expect(response.status).toBe(500)
    })
  })

  describe("successResponse", () => {
    it("should return success response with data", async () => {
      const testData = { id: "123", name: "Test" }
      const response = successResponse(testData)
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data).toEqual(testData)
    })

    it("should support custom status codes", async () => {
      const response = successResponse({ created: true }, 201)
      expect(response.status).toBe(201)
    })
  })

  describe("paginatedResponse", () => {
    it("should return paginated data with metadata", async () => {
      const items = [{ id: "1" }, { id: "2" }]
      const response = paginatedResponse(items, 1, 10, 25)
      const data = await response.json()

      expect(data.data).toEqual(items)
      expect(data.pagination).toEqual({
        page: 1,
        limit: 10,
        total: 25,
        totalPages: 3,
        hasNext: true,
        hasPrev: false,
      })
    })

    it("should calculate hasNext correctly", async () => {
      const response = paginatedResponse([], 3, 10, 25)
      const data = await response.json()

      expect(data.pagination.hasNext).toBe(false)
    })

    it("should calculate hasPrev correctly", async () => {
      const response = paginatedResponse([], 2, 10, 25)
      const data = await response.json()

      expect(data.pagination.hasPrev).toBe(true)
    })
  })

  describe("handleZodError", () => {
    it("should format Zod validation errors", async () => {
      const zodError = new ZodError([
        {
          code: "invalid_type",
          expected: "string",
          received: "number",
          path: ["email"],
          message: "Expected string, received number",
        },
      ])

      const response = handleZodError(zodError)
      const data = await response.json()

      expect(response.status).toBe(400)
      expect(data.error).toBe("Validation failed")
      expect(data.details).toHaveLength(1)
      expect(data.details[0]).toEqual({
        field: "email",
        message: "Expected string, received number",
      })
    })
  })

  describe("handlePrismaError", () => {
    it("should handle P2002 unique constraint error", async () => {
      const error = new Prisma.PrismaClientKnownRequestError(
        "Unique constraint failed",
        {
          code: "P2002",
          clientVersion: "5.0.0",
        }
      )

      const response = handlePrismaError(error)
      const data = await response.json()

      expect(response.status).toBe(409)
      expect(data.error).toContain("already exists")
    })

    it("should handle P2025 record not found error", async () => {
      const error = new Prisma.PrismaClientKnownRequestError(
        "Record not found",
        {
          code: "P2025",
          clientVersion: "5.0.0",
        }
      )

      const response = handlePrismaError(error)
      const data = await response.json()

      expect(response.status).toBe(404)
      expect(data.error).toBe("Record not found")
    })

    it("should handle P2003 foreign key constraint error", async () => {
      const error = new Prisma.PrismaClientKnownRequestError(
        "Foreign key constraint failed",
        {
          code: "P2003",
          clientVersion: "5.0.0",
        }
      )

      const response = handlePrismaError(error)
      const data = await response.json()

      expect(response.status).toBe(404)
      expect(data.error).toBe("Related record not found")
    })

    it("should handle validation errors", () => {
      const error = new Prisma.PrismaClientValidationError(
        "Validation failed",
        { clientVersion: "5.0.0" }
      )

      const response = handlePrismaError(error)
      expect(response.status).toBe(400)
    })

    it("should return generic error for unknown Prisma errors", async () => {
      const error = new Prisma.PrismaClientKnownRequestError("Unknown error", {
        code: "P9999",
        clientVersion: "5.0.0",
      })

      const response = handlePrismaError(error)
      const data = await response.json()

      expect(response.status).toBe(500)
      expect(data.error).toBe("Database error")
    })
  })

  describe("handleApiError", () => {
    it("should handle ZodError", () => {
      const error = new ZodError([])
      const response = handleApiError(error)
      expect(response.status).toBe(400)
    })

    it("should handle Prisma errors", () => {
      const error = new Prisma.PrismaClientKnownRequestError("Error", {
        code: "P2002",
        clientVersion: "5.0.0",
      })
      const response = handleApiError(error)
      expect(response.status).toBe(409)
    })

    it("should handle generic Error objects", async () => {
      const error = new Error("Something went wrong")
      const response = handleApiError(error)
      const data = await response.json()

      expect(response.status).toBe(500)
      expect(data.error).toBe("Something went wrong")
    })

    it("should handle unknown errors", async () => {
      const error = "string error"
      const response = handleApiError(error)
      const data = await response.json()

      expect(response.status).toBe(500)
      expect(data.error).toBe("An unexpected error occurred")
    })
  })
})
