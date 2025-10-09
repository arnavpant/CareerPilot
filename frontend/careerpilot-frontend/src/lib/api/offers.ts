import { mockDelay } from "./client"

export interface Offer {
  id: string
  applicationId: string
  salary: string
  equity: string
  startDate: string
  deadline: string
}

const mockOffers: Offer[] = []

export async function getOffers(): Promise<Offer[]> {
  await mockDelay(500)
  return mockOffers
}
