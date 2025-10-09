import { z } from "zod"

export const settingsSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email"),
  timezone: z.string(),
  emailNotifications: z.boolean(),
  interviewReminders: z.boolean(),
  weeklySummary: z.boolean(),
  dataRetention: z.number().min(30).max(730),
})

export type SettingsFormData = z.infer<typeof settingsSchema>
