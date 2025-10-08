import { z } from "zod"
import { ApplicationStage, ApplicationStatus } from "@prisma/client"

// Schema for creating a new application
export const createApplicationSchema = z.object({
  companyId: z.string().cuid("Invalid company ID"),
  roleTitle: z.string().min(1, "Role title is required").max(255),
  location: z.string().max(255).optional(),
  employmentType: z.string().max(100).optional(),
  source: z.string().max(100).optional(),
  postingUrl: z.string().url("Invalid URL").optional().or(z.literal("")),
  stage: z.nativeEnum(ApplicationStage).optional().default(ApplicationStage.DISCOVERED),
  status: z.nativeEnum(ApplicationStatus).optional().default(ApplicationStatus.ACTIVE),
  externalAtsUrl: z.string().url("Invalid URL").optional().or(z.literal("")),
  externalApplicationId: z.string().max(255).optional(),
  resumeVersion: z.string().max(255).optional(),
  coverLetter: z.string().optional(),
  salaryMin: z.number().int().positive().optional(),
  salaryMax: z.number().int().positive().optional(),
  salaryCurrency: z.string().max(10).optional(),
  offerDeadline: z.string().datetime().optional().or(z.date().optional()),
  notes: z.string().optional(),
  tags: z.array(z.string()).optional(),
})

// Schema for updating an application
export const updateApplicationSchema = z.object({
  companyId: z.string().cuid("Invalid company ID").optional(),
  roleTitle: z.string().min(1, "Role title is required").max(255).optional(),
  location: z.string().max(255).optional(),
  employmentType: z.string().max(100).optional(),
  source: z.string().max(100).optional(),
  postingUrl: z.string().url("Invalid URL").optional().or(z.literal("")),
  stage: z.nativeEnum(ApplicationStage).optional(),
  status: z.nativeEnum(ApplicationStatus).optional(),
  externalAtsUrl: z.string().url("Invalid URL").optional().or(z.literal("")),
  externalApplicationId: z.string().max(255).optional(),
  resumeVersion: z.string().max(255).optional(),
  coverLetter: z.string().optional(),
  salaryMin: z.number().int().positive().optional(),
  salaryMax: z.number().int().positive().optional(),
  salaryCurrency: z.string().max(10).optional(),
  offerDeadline: z.string().datetime().optional().or(z.date().optional()),
  notes: z.string().optional(),
  tags: z.array(z.string()).optional(),
})

// Schema for listing applications with filters
export const listApplicationsSchema = z.object({
  page: z.string().optional().default("1").transform(Number),
  limit: z.string().optional().default("50").transform(Number),
  stage: z.nativeEnum(ApplicationStage).optional(),
  status: z.nativeEnum(ApplicationStatus).optional(),
  companyId: z.string().cuid().optional(),
  source: z.string().optional(),
  tags: z.string().optional(), // Comma-separated tags
  search: z.string().optional(), // Search in roleTitle, company name
  sortBy: z.enum(["createdAt", "updatedAt", "appliedAt", "roleTitle", "stage"]).optional().default("updatedAt"),
  sortOrder: z.enum(["asc", "desc"]).optional().default("desc"),
})

export type CreateApplicationInput = z.infer<typeof createApplicationSchema>
export type UpdateApplicationInput = z.infer<typeof updateApplicationSchema>
export type ListApplicationsInput = z.infer<typeof listApplicationsSchema>
