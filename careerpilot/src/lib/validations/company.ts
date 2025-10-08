import { z } from "zod"

// Schema for creating a new company
export const createCompanySchema = z.object({
  name: z.string().min(1, "Company name is required").max(255),
  website: z.string().url("Invalid URL").optional().or(z.literal("")),
  industry: z.string().max(255).optional(),
  size: z.string().max(100).optional(),
  locations: z.array(z.string()).optional(),
  notes: z.string().optional(),
})

// Schema for updating a company
export const updateCompanySchema = z.object({
  name: z.string().min(1, "Company name is required").max(255).optional(),
  website: z.string().url("Invalid URL").optional().or(z.literal("")),
  industry: z.string().max(255).optional(),
  size: z.string().max(100).optional(),
  locations: z.array(z.string()).optional(),
  notes: z.string().optional(),
})

// Schema for listing companies
export const listCompaniesSchema = z.object({
  page: z.string().optional().default("1").transform(Number),
  limit: z.string().optional().default("50").transform(Number),
  search: z.string().optional(), // Search in name, industry
  industry: z.string().optional(),
  sortBy: z.enum(["name", "createdAt", "updatedAt"]).optional().default("name"),
  sortOrder: z.enum(["asc", "desc"]).optional().default("asc"),
})

export type CreateCompanyInput = z.infer<typeof createCompanySchema>
export type UpdateCompanyInput = z.infer<typeof updateCompanySchema>
export type ListCompaniesInput = z.infer<typeof listCompaniesSchema>
