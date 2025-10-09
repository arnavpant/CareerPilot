import { mockDelay } from "./client"

export interface Company {
  id: string
  name: string
  website: string
  industry: string
}

const mockCompanies: Company[] = [
  { id: "1", name: "Vercel", website: "vercel.com", industry: "Developer Tools" },
  { id: "2", name: "Stripe", website: "stripe.com", industry: "Payments" },
  { id: "3", name: "OpenAI", website: "openai.com", industry: "AI" },
]

export async function getCompanies(): Promise<Company[]> {
  await mockDelay(500)
  return mockCompanies
}
