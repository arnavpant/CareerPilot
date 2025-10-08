import { z } from "zod"

// Schema for creating a new contact
export const createContactSchema = z.object({
  name: z.string().min(1, "Contact name is required").max(255),
  email: z.string().email("Invalid email address"),
  companyId: z.string().cuid("Invalid company ID").optional(),
  role: z.string().max(255).optional(), // Job title at company
  relationship: z.string().max(255).optional(), // e.g., "Recruiter", "Hiring Manager"
  notes: z.string().optional(),
})

// Schema for updating a contact
export const updateContactSchema = z.object({
  name: z.string().min(1, "Contact name is required").max(255).optional(),
  email: z.string().email("Invalid email address").optional(),
  companyId: z.string().cuid("Invalid company ID").optional().nullable(),
  role: z.string().max(255).optional().nullable(),
  relationship: z.string().max(255).optional().nullable(),
  notes: z.string().optional().nullable(),
})

// Schema for listing contacts
export const listContactsSchema = z.object({
  page: z.string().optional().default("1").transform(Number),
  limit: z.string().optional().default("50").transform(Number),
  search: z.string().optional(), // Search in name, email
  companyId: z.string().cuid().optional(),
  relationship: z.string().optional(),
  sortBy: z.enum(["name", "email", "createdAt", "updatedAt"]).optional().default("name"),
  sortOrder: z.enum(["asc", "desc"]).optional().default("asc"),
})

export type CreateContactInput = z.infer<typeof createContactSchema>
export type UpdateContactInput = z.infer<typeof updateContactSchema>
export type ListContactsInput = z.infer<typeof listContactsSchema>
