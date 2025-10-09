import { z } from "zod"
import { ApplicationStage, ApplicationStatus } from "@prisma/client"

/**
 * Schema for creating a new application
 */
export const createApplicationSchema = z.object({
  companyId: z.string().cuid("Invalid company ID"),
  roleTitle: z.string().min(1, "Role title is required"),
  location: z.string().optional(),
  employmentType: z.string().optional(),
  source: z.string().optional(),
  postingUrl: z.string().url("Invalid URL").optional().or(z.literal("")),
  stage: z.nativeEnum(ApplicationStage).optional(),
  status: z.nativeEnum(ApplicationStatus).optional(),
  externalAtsUrl: z.string().url("Invalid URL").optional().or(z.literal("")),
  externalApplicationId: z.string().optional(),
  resumeVersion: z.string().optional(),
  coverLetter: z.string().optional(),
  salaryMin: z.number().int().nonnegative().optional(),
  salaryMax: z.number().int().nonnegative().optional(),
  salaryCurrency: z.string().length(3).optional(),
  offerDeadline: z.string().datetime().optional().or(z.literal("")),
  notes: z.string().optional(),
  tags: z.array(z.string()).optional(),
})

/**
 * Schema for updating an existing application
 */
export const updateApplicationSchema = z.object({
  companyId: z.string().cuid("Invalid company ID").optional(),
  roleTitle: z.string().min(1, "Role title is required").optional(),
  location: z.string().optional(),
  employmentType: z.string().optional(),
  source: z.string().optional(),
  postingUrl: z.string().url("Invalid URL").optional().or(z.literal("")),
  stage: z.nativeEnum(ApplicationStage).optional(),
  status: z.nativeEnum(ApplicationStatus).optional(),
  externalAtsUrl: z.string().url("Invalid URL").optional().or(z.literal("")),
  externalApplicationId: z.string().optional(),
  resumeVersion: z.string().optional(),
  coverLetter: z.string().optional(),
  salaryMin: z.number().int().nonnegative().optional(),
  salaryMax: z.number().int().nonnegative().optional(),
  salaryCurrency: z.string().length(3).optional(),
  offerDeadline: z.string().datetime().optional().or(z.literal("")),
  notes: z.string().optional(),
  tags: z.array(z.string()).optional(),
})

/**
 * Schema for listing/filtering applications
 */
export const listApplicationsSchema = z.object({
  stage: z.nativeEnum(ApplicationStage).optional(),
  status: z.nativeEnum(ApplicationStatus).optional(),
  companyId: z.string().cuid().optional(),
  source: z.string().optional(),
  search: z.string().optional(),
  tags: z.array(z.string()).optional(),
  page: z.coerce.number().int().positive().optional(),
  limit: z.coerce.number().int().positive().max(100).optional(),
  sortBy: z.enum(["createdAt", "appliedAt", "updatedAt", "roleTitle"]).optional(),
  sortOrder: z.enum(["asc", "desc"]).optional(),
})
