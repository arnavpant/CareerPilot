import { z } from "zod"
import { OfferDecision } from "@prisma/client"

// Schema for creating a new offer
export const createOfferSchema = z.object({
  applicationId: z.string().cuid("Invalid application ID"),
  baseSalary: z.number().int().positive("Base salary must be positive").optional(),
  bonus: z.number().int().positive("Bonus must be positive").optional(),
  equity: z.string().max(255).optional(), // e.g., "10000 shares", "0.5%"
  currency: z.string().max(10).optional().default("USD"),
  benefits: z.string().optional(), // Summary of benefits
  location: z.string().max(500).optional(),
  deadline: z.string().datetime("Invalid date/time").optional(),
  decision: z.nativeEnum(OfferDecision).optional().default(OfferDecision.PENDING),
  decisionDate: z.string().datetime("Invalid date/time").optional(),
  notes: z.string().optional(),
})

// Schema for updating an offer
export const updateOfferSchema = z.object({
  baseSalary: z.number().int().positive("Base salary must be positive").optional().nullable(),
  bonus: z.number().int().positive("Bonus must be positive").optional().nullable(),
  equity: z.string().max(255).optional().nullable(),
  currency: z.string().max(10).optional(),
  benefits: z.string().optional().nullable(),
  location: z.string().max(500).optional().nullable(),
  deadline: z.string().datetime("Invalid date/time").optional().nullable(),
  decision: z.nativeEnum(OfferDecision).optional(),
  decisionDate: z.string().datetime("Invalid date/time").optional().nullable(),
  notes: z.string().optional().nullable(),
})

// Schema for listing offers
export const listOffersSchema = z.object({
  page: z.string().optional().default("1").transform(Number),
  limit: z.string().optional().default("50").transform(Number),
  decision: z.nativeEnum(OfferDecision).optional(),
  minSalary: z.string().optional().transform((val) => (val ? Number(val) : undefined)),
  maxSalary: z.string().optional().transform((val) => (val ? Number(val) : undefined)),
  deadlineBefore: z.string().datetime().optional(), // Offers with deadline before this date
  sortBy: z.enum(["baseSalary", "deadline", "createdAt", "updatedAt", "decision"]).optional().default("createdAt"),
  sortOrder: z.enum(["asc", "desc"]).optional().default("desc"),
})

export type CreateOfferInput = z.infer<typeof createOfferSchema>
export type UpdateOfferInput = z.infer<typeof updateOfferSchema>
export type ListOffersInput = z.infer<typeof listOffersSchema>
