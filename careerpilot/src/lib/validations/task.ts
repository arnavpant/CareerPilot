import { z } from "zod"
import { TaskStatus, TaskPriority } from "@prisma/client"

// Schema for creating a new task
export const createTaskSchema = z.object({
  applicationId: z.string().cuid("Invalid application ID").optional(),
  interviewId: z.string().cuid("Invalid interview ID").optional(),
  title: z.string().min(1, "Title is required").max(255),
  description: z.string().optional(),
  dueDate: z.string().datetime("Invalid date/time").optional(),
  priority: z.nativeEnum(TaskPriority).optional().default(TaskPriority.MEDIUM),
  status: z.nativeEnum(TaskStatus).optional().default(TaskStatus.PENDING),
  recurrence: z.string().max(100).optional(), // e.g., "none", "daily", "weekly", "monthly"
  notifyInApp: z.boolean().optional().default(true),
  notifyEmail: z.boolean().optional().default(false),
  notifySlack: z.boolean().optional().default(false),
  notifyDiscord: z.boolean().optional().default(false),
})

// Schema for updating a task
export const updateTaskSchema = z.object({
  title: z.string().min(1, "Title is required").max(255).optional(),
  description: z.string().optional().nullable(),
  dueDate: z.string().datetime("Invalid date/time").optional().nullable(),
  priority: z.nativeEnum(TaskPriority).optional(),
  status: z.nativeEnum(TaskStatus).optional(),
  recurrence: z.string().max(100).optional().nullable(),
  notifyInApp: z.boolean().optional(),
  notifyEmail: z.boolean().optional(),
  notifySlack: z.boolean().optional(),
  notifyDiscord: z.boolean().optional(),
})

// Schema for completing a task
export const completeTaskSchema = z.object({
  completed: z.boolean(),
})

// Schema for snoozing/rescheduling a task
export const rescheduleTaskSchema = z.object({
  dueDate: z.string().datetime("Invalid date/time"),
  snoozeDuration: z.number().int().positive().optional(), // Duration in minutes to snooze
})

// Schema for listing tasks
export const listTasksSchema = z.object({
  page: z.string().optional().default("1").transform(Number),
  limit: z.string().optional().default("50").transform(Number),
  applicationId: z.string().cuid().optional(),
  status: z.nativeEnum(TaskStatus).optional(),
  priority: z.nativeEnum(TaskPriority).optional(),
  dueBefore: z.string().datetime().optional(), // Tasks due before this date
  dueAfter: z.string().datetime().optional(), // Tasks due after this date
  overdue: z.string().optional().transform((val) => val === "true"), // Filter for overdue tasks
  sortBy: z.enum(["dueDate", "priority", "title", "createdAt", "updatedAt", "status"]).optional().default("dueDate"),
  sortOrder: z.enum(["asc", "desc"]).optional().default("asc"),
})

export type CreateTaskInput = z.infer<typeof createTaskSchema>
export type UpdateTaskInput = z.infer<typeof updateTaskSchema>
export type CompleteTaskInput = z.infer<typeof completeTaskSchema>
export type RescheduleTaskInput = z.infer<typeof rescheduleTaskSchema>
export type ListTasksInput = z.infer<typeof listTasksSchema>
