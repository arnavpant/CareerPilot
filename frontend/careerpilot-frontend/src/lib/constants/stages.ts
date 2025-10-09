export const STAGES = ["discovered", "applied", "phone", "tech", "onsite", "offer", "accepted", "rejected"] as const

export const STAGE_CONFIG = {
  discovered: { label: "Discovered", color: "226 232 240" },
  applied: { label: "Applied", color: "59 130 246" },
  phone: { label: "Phone Screen", color: "99 102 241" },
  tech: { label: "Technical", color: "168 85 247" },
  onsite: { label: "Onsite", color: "139 92 246" },
  offer: { label: "Offer", color: "251 191 36" },
  accepted: { label: "Accepted", color: "34 197 94" },
  rejected: { label: "Rejected", color: "239 68 68" },
} as const
