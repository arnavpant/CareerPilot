import { z } from "zod"
import { InterviewType, InterviewOutcome } from "@prisma/client"

// Schema for panel member
export const panelMemberSchema = z.object({
  contactId: z.string().cuid("Invalid contact ID").optional().nullable(),
  name: z.string().min(1, "Name is required").max(255),
  role: z.string().max(255).optional(),
})

// Schema for creating a new interview
export const createInterviewSchema = z.object({
  applicationId: z.string().cuid("Invalid application ID"),
  roundName: z.string().min(1, "Round name is required").max(255),
  type: z.nativeEnum(InterviewType).optional(),
  scheduledAt: z.string().datetime("Invalid date/time"),
  duration: z.number().int().positive("Duration must be positive").optional(),
  location: z.string().max(500).optional(),
  virtualLink: z.string().url("Invalid URL").optional().or(z.literal("")),
  instructions: z.string().optional(),
  outcome: z.nativeEnum(InterviewOutcome).optional(),
  notes: z.string().optional(),
  panelMembers: z.array(panelMemberSchema).optional(),
})

// Schema for updating an interview
export const updateInterviewSchema = z.object({
  roundName: z.string().min(1, "Round name is required").max(255).optional(),
  type: z.nativeEnum(InterviewType).optional().nullable(),
  scheduledAt: z.string().datetime("Invalid date/time").optional(),
  duration: z.number().int().positive("Duration must be positive").optional().nullable(),
  location: z.string().max(500).optional().nullable(),
  virtualLink: z.string().url("Invalid URL").optional().or(z.literal("")).nullable(),
  instructions: z.string().optional().nullable(),
  outcome: z.nativeEnum(InterviewOutcome).optional(),
  notes: z.string().optional().nullable(),
  panelMembers: z.array(panelMemberSchema).optional(),
})

// Schema for listing interviews
export const listInterviewsSchema = z.object({
  page: z.string().optional().default("1").transform(Number),
  limit: z.string().optional().default("50").transform(Number),
  applicationId: z.string().cuid().optional(),
  type: z.nativeEnum(InterviewType).optional(),
  outcome: z.nativeEnum(InterviewOutcome).optional(),
  startDate: z.string().datetime().optional(), // Filter interviews after this date
  endDate: z.string().datetime().optional(), // Filter interviews before this date
  sortBy: z.enum(["scheduledAt", "roundName", "createdAt", "updatedAt"]).optional().default("scheduledAt"),
  sortOrder: z.enum(["asc", "desc"]).optional().default("asc"),
})

export type PanelMemberInput = z.infer<typeof panelMemberSchema>
export type CreateInterviewInput = z.infer<typeof createInterviewSchema>
export type UpdateInterviewInput = z.infer<typeof updateInterviewSchema>
export type ListInterviewsInput = z.infer<typeof listInterviewsSchema>
