import { NextRequest, NextResponse } from "next/server"
import { requireAuth } from "@/lib/auth/apiAuth"
import { prisma } from "@/lib/db/prisma"
import { z } from "zod"

// Validation schema for settings update
const settingsSchema = z.object({
  name: z.string().min(1, "Name is required").max(100, "Name is too long").optional(),
  timezone: z.string().optional(),
  notifyInApp: z.boolean().optional(),
  notifyEmail: z.boolean().optional(),
  notifySlack: z.boolean().optional(),
  notifyDiscord: z.boolean().optional(),
  slackWebhook: z.string().url("Invalid Slack webhook URL").optional().nullable(),
  discordWebhook: z.string().url("Invalid Discord webhook URL").optional().nullable(),
  dataRetentionDays: z.number().int().min(1).max(3650).optional().nullable(),
})

// GET /api/settings - Get current user settings
export async function GET(req: NextRequest) {
  const { user, response } = await requireAuth(req)
  if (response) return response

  try {
    const userData = await prisma.user.findUnique({
      where: { id: user!.id },
      select: {
        id: true,
        name: true,
        email: true,
        avatar: true,
        timezone: true,
        notifyInApp: true,
        notifyEmail: true,
        notifySlack: true,
        notifyDiscord: true,
        slackWebhook: true,
        discordWebhook: true,
        dataRetentionDays: true,
        createdAt: true,
      },
    })

    if (!userData) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    return NextResponse.json(userData)
  } catch (error) {
    console.error("Error fetching settings:", error)
    return NextResponse.json({ error: "Failed to fetch settings" }, { status: 500 })
  }
}

// PATCH /api/settings - Update user settings
export async function PATCH(req: NextRequest) {
  const { user, response } = await requireAuth(req)
  if (response) return response

  try {
    const body = await req.json()

    // Validate input
    const validation = settingsSchema.safeParse(body)
    if (!validation.success) {
      return NextResponse.json(
        { error: validation.error.errors[0].message },
        { status: 400 }
      )
    }

    const updates = validation.data

    // Update user settings
    const updatedUser = await prisma.user.update({
      where: { id: user!.id },
      data: updates,
      select: {
        id: true,
        name: true,
        email: true,
        avatar: true,
        timezone: true,
        notifyInApp: true,
        notifyEmail: true,
        notifySlack: true,
        notifyDiscord: true,
        slackWebhook: true,
        discordWebhook: true,
        dataRetentionDays: true,
      },
    })

    return NextResponse.json({
      message: "Settings updated successfully",
      user: updatedUser,
    })
  } catch (error) {
    console.error("Error updating settings:", error)
    return NextResponse.json({ error: "Failed to update settings" }, { status: 500 })
  }
}

