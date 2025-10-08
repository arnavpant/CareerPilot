import { NextRequest } from "next/server"
import { GET, POST } from "../route"
import { prisma } from "@/lib/db/prisma"
import * as apiAuth from "@/lib/auth/apiAuth"

// Mock dependencies
jest.mock("@/lib/db/prisma", () => ({
  prisma: {
    application: {
      findMany: jest.fn(),
      count: jest.fn(),
      create: jest.fn(),
    },
    company: {
      findFirst: jest.fn(),
    },
    activity: {
      create: jest.fn(),
    },
  },
}))

jest.mock("@/lib/auth/apiAuth")

describe("Applications API", () => {
  const mockUser = {
    id: "user123",
    email: "test@example.com",
    name: "Test User",
  }

  const mockCompany = {
    id: "company123",
    userId: "user123",
    name: "Test Company",
  }

  const mockApplication = {
    id: "app123",
    userId: "user123",
    companyId: "company123",
    roleTitle: "Software Engineer",
    stage: "DISCOVERED",
    status: "ACTIVE",
    company: mockCompany,
    _count: {
      interviews: 0,
      tasks: 0,
      activities: 0,
    },
  }

  beforeEach(() => {
    jest.clearAllMocks()
    ;(apiAuth.requireAuth as jest.Mock).mockResolvedValue({
      user: mockUser,
      response: null,
    })
  })

  describe("GET /api/applications", () => {
    it("should return paginated applications", async () => {
      ;(prisma.application.findMany as jest.Mock).mockResolvedValue([
        mockApplication,
      ])
      ;(prisma.application.count as jest.Mock).mockResolvedValue(1)

      const req = new NextRequest("http://localhost:3000/api/applications")
      const response = await GET(req)
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.data).toHaveLength(1)
      expect(data.pagination).toBeDefined()
      expect(data.pagination.total).toBe(1)
      expect(data.pagination.page).toBe(1)
    })

    it("should filter applications by stage", async () => {
      ;(prisma.application.findMany as jest.Mock).mockResolvedValue([])
      ;(prisma.application.count as jest.Mock).mockResolvedValue(0)

      const req = new NextRequest(
        "http://localhost:3000/api/applications?stage=APPLIED"
      )
      await GET(req)

      expect(prisma.application.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({
            userId: mockUser.id,
            stage: "APPLIED",
          }),
        })
      )
    })

    it("should handle search query", async () => {
      ;(prisma.application.findMany as jest.Mock).mockResolvedValue([])
      ;(prisma.application.count as jest.Mock).mockResolvedValue(0)

      const req = new NextRequest(
        "http://localhost:3000/api/applications?search=engineer"
      )
      await GET(req)

      expect(prisma.application.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({
            OR: expect.arrayContaining([
              expect.objectContaining({
                roleTitle: expect.objectContaining({
                  contains: "engineer",
                }),
              }),
            ]),
          }),
        })
      )
    })

    it("should return 401 if not authenticated", async () => {
      ;(apiAuth.requireAuth as jest.Mock).mockResolvedValue({
        user: null,
        response: new Response(JSON.stringify({ error: "Unauthorized" }), {
          status: 401,
        }),
      })

      const req = new NextRequest("http://localhost:3000/api/applications")
      const response = await GET(req)

      expect(response.status).toBe(401)
    })
  })

  describe("POST /api/applications", () => {
    it("should create a new application", async () => {
      ;(prisma.company.findFirst as jest.Mock).mockResolvedValue(mockCompany)
      ;(prisma.application.create as jest.Mock).mockResolvedValue(
        mockApplication
      )

      const req = new NextRequest("http://localhost:3000/api/applications", {
        method: "POST",
        body: JSON.stringify({
          companyId: "company123",
          roleTitle: "Software Engineer",
          stage: "DISCOVERED",
        }),
      })

      const response = await POST(req)
      const data = await response.json()

      expect(response.status).toBe(201)
      expect(data.roleTitle).toBe("Software Engineer")
      expect(prisma.application.create).toHaveBeenCalled()
    })

    it("should return 404 if company not found", async () => {
      ;(prisma.company.findFirst as jest.Mock).mockResolvedValue(null)

      const req = new NextRequest("http://localhost:3000/api/applications", {
        method: "POST",
        body: JSON.stringify({
          companyId: "clxxxxxxxxxxxxxxxxxxxxxxxx", // Valid CUID format but doesn't exist
          roleTitle: "Software Engineer",
        }),
      })

      const response = await POST(req)
      const data = await response.json()

      expect(response.status).toBe(404)
      expect(data.error).toBeDefined()
    })

    it("should validate required fields", async () => {
      const req = new NextRequest("http://localhost:3000/api/applications", {
        method: "POST",
        body: JSON.stringify({
          companyId: "company123",
          // Missing roleTitle
        }),
      })

      const response = await POST(req)
      const data = await response.json()

      expect(response.status).toBe(400)
      expect(data.error).toContain("Validation failed")
    })

    it("should return 401 if not authenticated", async () => {
      ;(apiAuth.requireAuth as jest.Mock).mockResolvedValue({
        user: null,
        response: new Response(JSON.stringify({ error: "Unauthorized" }), {
          status: 401,
        }),
      })

      const req = new NextRequest("http://localhost:3000/api/applications", {
        method: "POST",
        body: JSON.stringify({
          companyId: "company123",
          roleTitle: "Software Engineer",
        }),
      })

      const response = await POST(req)
      expect(response.status).toBe(401)
    })
  })
})
