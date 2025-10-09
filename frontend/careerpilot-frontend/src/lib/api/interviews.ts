import { mockDelay } from "./client"

export interface Interview {
  id: string
  applicationId: string
  type: string
  scheduledAt: string
  duration: number
  notes?: string
}

const mockInterviews: Interview[] = [
  {
    id: "1",
    applicationId: "1",
    type: "Technical",
    scheduledAt: "2025-01-25T14:00:00",
    duration: 90,
  },
]

export async function getInterviews(): Promise<Interview[]> {
  await mockDelay(500)
  return mockInterviews
}
