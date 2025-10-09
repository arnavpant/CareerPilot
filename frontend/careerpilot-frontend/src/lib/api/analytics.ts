import { mockDelay } from "./client"

export interface Analytics {
  totalApplications: number
  activeApplications: number
  offers: number
  rejections: number
  averageResponseTime: number
  conversionRate: number
}

export async function getAnalytics(): Promise<Analytics> {
  await mockDelay(700)
  return {
    totalApplications: 47,
    activeApplications: 32,
    offers: 3,
    rejections: 12,
    averageResponseTime: 7.5,
    conversionRate: 6.4,
  }
}
