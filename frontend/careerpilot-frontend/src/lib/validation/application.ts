import { z } from "zod"

export const applicationSchema = z.object({
  company: z.string().min(1, "Company is required"),
  position: z.string().min(1, "Position is required"),
  stage: z.string(),
  location: z.string().optional(),
  salary: z.string().optional(),
  url: z.string().url().optional(),
  appliedDate: z.string(),
  tags: z.array(z.string()).optional(),
})

export type ApplicationFormData = z.infer<typeof applicationSchema>
