import { ActivityType, ApplicationStage } from "@prisma/client"
import { prisma } from "@/lib/db/prisma"

/**
 * Log an activity for an application
 */
export async function logActivity(
  userId: string,
  applicationId: string | null,
  type: ActivityType,
  description: string,
  metadata?: Record<string, unknown>
) {
  try {
    await prisma.activity.create({
      data: {
        userId,
        applicationId,
        type,
        description,
        metadata: metadata ? JSON.stringify(metadata) : null,
      },
    })
  } catch (error) {
    console.error("Failed to log activity:", error)
    // Don't throw - activity logging should not break the main operation
  }
}

/**
 * Log stage change with timestamp updates
 */
export async function logStageChange(
  userId: string,
  applicationId: string,
  oldStage: ApplicationStage,
  newStage: ApplicationStage
) {
  const stageTimestampMap: Record<ApplicationStage, string> = {
    [ApplicationStage.DISCOVERED]: "discoveredAt",
    [ApplicationStage.APPLIED]: "appliedAt",
    [ApplicationStage.PHONE_SCREEN]: "phoneAt",
    [ApplicationStage.TECHNICAL]: "techAt",
    [ApplicationStage.ONSITE]: "onsiteAt",
    [ApplicationStage.OFFER]: "offerAt",
    [ApplicationStage.ACCEPTED]: "acceptedAt",
    [ApplicationStage.REJECTED]: "rejectedAt",
    [ApplicationStage.WITHDRAWN]: "rejectedAt", // Reuse rejectedAt for withdrawn
  }

  await logActivity(
    userId,
    applicationId,
    ActivityType.STAGE_CHANGED,
    `Stage changed from ${oldStage} to ${newStage}`,
    { oldStage, newStage }
  )

  // Update the corresponding timestamp field
  const timestampField = stageTimestampMap[newStage]
  if (timestampField) {
    await prisma.application.update({
      where: { id: applicationId },
      data: {
        [timestampField]: new Date(),
      },
    })
  }
}
