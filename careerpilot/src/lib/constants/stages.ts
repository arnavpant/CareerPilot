import { ApplicationStage } from "@prisma/client"

export const STAGE_CONFIG: Record<ApplicationStage, {
  label: string
  color: string
  bgColor: string
  textColor: string
}> = {
  [ApplicationStage.DISCOVERED]: {
    label: "Discovered",
    color: "from-slate-400 to-slate-500",
    bgColor: "bg-slate-500/10",
    textColor: "text-slate-400",
  },
  [ApplicationStage.APPLIED]: {
    label: "Applied",
    color: "from-blue-500 to-blue-600",
    bgColor: "bg-blue-500/10",
    textColor: "text-blue-400",
  },
  [ApplicationStage.PHONE_SCREEN]: {
    label: "Phone Screen",
    color: "from-indigo-500 to-indigo-600",
    bgColor: "bg-indigo-500/10",
    textColor: "text-indigo-400",
  },
  [ApplicationStage.TECHNICAL]: {
    label: "Technical",
    color: "from-purple-500 to-purple-600",
    bgColor: "bg-purple-500/10",
    textColor: "text-purple-400",
  },
  [ApplicationStage.ONSITE]: {
    label: "Onsite",
    color: "from-violet-500 to-violet-600",
    bgColor: "bg-violet-500/10",
    textColor: "text-violet-400",
  },
  [ApplicationStage.OFFER]: {
    label: "Offer",
    color: "from-amber-400 to-amber-500",
    bgColor: "bg-amber-500/10",
    textColor: "text-amber-400",
  },
  [ApplicationStage.ACCEPTED]: {
    label: "Accepted",
    color: "from-green-500 to-green-600",
    bgColor: "bg-green-500/10",
    textColor: "text-green-400",
  },
  [ApplicationStage.REJECTED]: {
    label: "Rejected",
    color: "from-red-500 to-red-600",
    bgColor: "bg-red-500/10",
    textColor: "text-red-400",
  },
  [ApplicationStage.WITHDRAWN]: {
    label: "Withdrawn",
    color: "from-gray-500 to-gray-600",
    bgColor: "bg-gray-500/10",
    textColor: "text-gray-400",
  },
} as const

export const STAGE_ORDER = [
  ApplicationStage.DISCOVERED,
  ApplicationStage.APPLIED,
  ApplicationStage.PHONE_SCREEN,
  ApplicationStage.TECHNICAL,
  ApplicationStage.ONSITE,
  ApplicationStage.OFFER,
  ApplicationStage.ACCEPTED,
  ApplicationStage.REJECTED,
  ApplicationStage.WITHDRAWN,
] as const
