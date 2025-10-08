/**
 * Enums for CareerPilot
 * These are re-exported from Prisma for easier imports
 */

export {
  ApplicationStage,
  ApplicationStatus,
  TaskStatus,
  TaskPriority,
  InterviewType,
  InterviewOutcome,
  OfferDecision,
  ActivityType,
  EmailProvider,
} from "@prisma/client"

// NotificationChannel enum - will be used in future notification system
export enum NotificationChannel {
  IN_APP = "IN_APP",
  EMAIL = "EMAIL",
  SLACK = "SLACK",
  DISCORD = "DISCORD",
}

// Helper functions for display labels

export const ApplicationStageLabels: Record<string, string> = {
  DISCOVERED: "Discovered",
  APPLIED: "Applied",
  PHONE_SCREEN: "Phone Screen",
  TECHNICAL: "Technical Interview",
  ONSITE: "Onsite Interview",
  OFFER: "Offer Received",
  ACCEPTED: "Accepted",
  REJECTED: "Rejected",
  WITHDRAWN: "Withdrawn",
}

export const ApplicationStageColors: Record<string, string> = {
  DISCOVERED: "slate",
  APPLIED: "blue",
  PHONE_SCREEN: "indigo",
  TECHNICAL: "purple",
  ONSITE: "violet",
  OFFER: "amber",
  ACCEPTED: "green",
  REJECTED: "red",
  WITHDRAWN: "gray",
}

export const TaskPriorityLabels: Record<string, string> = {
  LOW: "Low",
  MEDIUM: "Medium",
  HIGH: "High",
  URGENT: "Urgent",
}

export const TaskPriorityColors: Record<string, string> = {
  LOW: "green",
  MEDIUM: "yellow",
  HIGH: "orange",
  URGENT: "red",
}

export const TaskStatusLabels: Record<string, string> = {
  PENDING: "Pending",
  IN_PROGRESS: "In Progress",
  COMPLETED: "Completed",
  CANCELLED: "Cancelled",
}

export const InterviewTypeLabels: Record<string, string> = {
  PHONE: "Phone Screen",
  TECHNICAL: "Technical Interview",
  BEHAVIORAL: "Behavioral Interview",
  ONSITE: "Onsite Interview",
  FINAL: "Final Interview",
  OTHER: "Other",
}

export const InterviewOutcomeLabels: Record<string, string> = {
  PENDING: "Pending",
  PASSED: "Passed",
  FAILED: "Failed",
  CANCELLED: "Cancelled",
  NO_SHOW: "No Show",
}

export const OfferDecisionLabels: Record<string, string> = {
  PENDING: "Pending",
  ACCEPTED: "Accepted",
  DECLINED: "Declined",
}

export const ActivityTypeLabels: Record<string, string> = {
  CREATED: "Created",
  UPDATED: "Updated",
  STAGE_CHANGED: "Stage Changed",
  STATUS_CHANGED: "Status Changed",
  NOTE_ADDED: "Note Added",
  CONTACT_ADDED: "Contact Added",
  INTERVIEW_SCHEDULED: "Interview Scheduled",
  INTERVIEW_COMPLETED: "Interview Completed",
  TASK_CREATED: "Task Created",
  TASK_COMPLETED: "Task Completed",
  OFFER_RECEIVED: "Offer Received",
  OFFER_ACCEPTED: "Offer Accepted",
  OFFER_DECLINED: "Offer Declined",
  EMAIL_RECEIVED: "Email Received",
  EMAIL_SENT: "Email Sent",
  ATTACHMENT_UPLOADED: "Attachment Uploaded",
  APPLICATION_ARCHIVED: "Application Archived",
  APPLICATION_WITHDRAWN: "Application Withdrawn",
}

export const EmailProviderLabels: Record<string, string> = {
  GMAIL: "Gmail",
  OUTLOOK: "Outlook",
}

export const NotificationChannelLabels: Record<string, string> = {
  IN_APP: "In-App",
  EMAIL: "Email",
  SLACK: "Slack",
  DISCORD: "Discord",
}
