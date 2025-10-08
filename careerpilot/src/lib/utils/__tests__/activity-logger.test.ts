import { ActivityType, ApplicationStage } from "@prisma/client"
import { logActivity, logStageChange } from "../activity-logger"
import { prisma } from "@/lib/db/prisma"

jest.mock("@/lib/db/prisma", () => ({
  prisma: {
    activity: {
      create: jest.fn(),
    },
    application: {
      update: jest.fn(),
    },
  },
}))

describe("Activity Logger", () => {
  beforeEach(() => {
    jest.clearAllMocks()
    // Mock console.error to avoid cluttering test output
    jest.spyOn(console, "error").mockImplementation(() => {})
  })

  afterEach(() => {
    ;(console.error as jest.Mock).mockRestore()
  })

  describe("logActivity", () => {
    it("should create activity log", async () => {
      ;(prisma.activity.create as jest.Mock).mockResolvedValue({
        id: "activity123",
      })

      await logActivity(
        "user123",
        "app123",
        ActivityType.CREATED,
        "Created application"
      )

      expect(prisma.activity.create).toHaveBeenCalledWith({
        data: {
          userId: "user123",
          applicationId: "app123",
          type: ActivityType.CREATED,
          description: "Created application",
          metadata: null,
        },
      })
    })

    it("should include metadata when provided", async () => {
      const metadata = { stage: "APPLIED", date: "2024-01-01" }

      await logActivity(
        "user123",
        "app123",
        ActivityType.STAGE_CHANGED,
        "Stage changed",
        metadata
      )

      expect(prisma.activity.create).toHaveBeenCalledWith({
        data: expect.objectContaining({
          metadata: JSON.stringify(metadata),
        }),
      })
    })

    it("should handle null applicationId", async () => {
      await logActivity(
        "user123",
        null,
        ActivityType.CREATED,
        "General activity"
      )

      expect(prisma.activity.create).toHaveBeenCalledWith({
        data: expect.objectContaining({
          applicationId: null,
        }),
      })
    })

    it("should not throw if logging fails", async () => {
      ;(prisma.activity.create as jest.Mock).mockRejectedValue(
        new Error("DB error")
      )

      await expect(
        logActivity("user123", "app123", ActivityType.CREATED, "Test")
      ).resolves.not.toThrow()

      expect(console.error).toHaveBeenCalledWith(
        "Failed to log activity:",
        expect.any(Error)
      )
    })
  })

  describe("logStageChange", () => {
    it("should log stage change and update timestamp", async () => {
      ;(prisma.activity.create as jest.Mock).mockResolvedValue({})
      ;(prisma.application.update as jest.Mock).mockResolvedValue({})

      await logStageChange(
        "user123",
        "app123",
        ApplicationStage.DISCOVERED,
        ApplicationStage.APPLIED
      )

      expect(prisma.activity.create).toHaveBeenCalledWith({
        data: expect.objectContaining({
          type: ActivityType.STAGE_CHANGED,
          description: "Stage changed from DISCOVERED to APPLIED",
          metadata: JSON.stringify({
            oldStage: ApplicationStage.DISCOVERED,
            newStage: ApplicationStage.APPLIED,
          }),
        }),
      })

      expect(prisma.application.update).toHaveBeenCalledWith({
        where: { id: "app123" },
        data: {
          appliedAt: expect.any(Date),
        },
      })
    })

    it("should update phoneAt for PHONE_SCREEN stage", async () => {
      ;(prisma.activity.create as jest.Mock).mockResolvedValue({})
      ;(prisma.application.update as jest.Mock).mockResolvedValue({})

      await logStageChange(
        "user123",
        "app123",
        ApplicationStage.APPLIED,
        ApplicationStage.PHONE_SCREEN
      )

      expect(prisma.application.update).toHaveBeenCalledWith({
        where: { id: "app123" },
        data: {
          phoneAt: expect.any(Date),
        },
      })
    })

    it("should update techAt for TECHNICAL stage", async () => {
      ;(prisma.activity.create as jest.Mock).mockResolvedValue({})
      ;(prisma.application.update as jest.Mock).mockResolvedValue({})

      await logStageChange(
        "user123",
        "app123",
        ApplicationStage.PHONE_SCREEN,
        ApplicationStage.TECHNICAL
      )

      expect(prisma.application.update).toHaveBeenCalledWith({
        where: { id: "app123" },
        data: {
          techAt: expect.any(Date),
        },
      })
    })

    it("should update offerAt for OFFER stage", async () => {
      ;(prisma.activity.create as jest.Mock).mockResolvedValue({})
      ;(prisma.application.update as jest.Mock).mockResolvedValue({})

      await logStageChange(
        "user123",
        "app123",
        ApplicationStage.ONSITE,
        ApplicationStage.OFFER
      )

      expect(prisma.application.update).toHaveBeenCalledWith({
        where: { id: "app123" },
        data: {
          offerAt: expect.any(Date),
        },
      })
    })

    it("should update acceptedAt for ACCEPTED stage", async () => {
      ;(prisma.activity.create as jest.Mock).mockResolvedValue({})
      ;(prisma.application.update as jest.Mock).mockResolvedValue({})

      await logStageChange(
        "user123",
        "app123",
        ApplicationStage.OFFER,
        ApplicationStage.ACCEPTED
      )

      expect(prisma.application.update).toHaveBeenCalledWith({
        where: { id: "app123" },
        data: {
          acceptedAt: expect.any(Date),
        },
      })
    })

    it("should update rejectedAt for REJECTED stage", async () => {
      ;(prisma.activity.create as jest.Mock).mockResolvedValue({})
      ;(prisma.application.update as jest.Mock).mockResolvedValue({})

      await logStageChange(
        "user123",
        "app123",
        ApplicationStage.TECHNICAL,
        ApplicationStage.REJECTED
      )

      expect(prisma.application.update).toHaveBeenCalledWith({
        where: { id: "app123" },
        data: {
          rejectedAt: expect.any(Date),
        },
      })
    })
  })
})
