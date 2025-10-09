import type { Application } from "@/types/domain"
import { mockDelay } from "./client"

let mockApplications: Application[] = [
  {
    id: "1",
    company: "Vercel",
    position: "Senior Frontend Engineer",
    stage: "tech",
    location: "Remote",
    salary: "$150k - $200k",
    appliedDate: "2025-01-15",
    url: "https://vercel.com/careers",
    tags: ["React", "Next.js", "TypeScript"],
  },
  {
    id: "2",
    company: "Stripe",
    position: "Full Stack Engineer",
    stage: "phone",
    location: "San Francisco, CA",
    salary: "$160k - $220k",
    appliedDate: "2025-01-10",
    url: "https://stripe.com/jobs",
    tags: ["Ruby", "React", "API"],
  },
  {
    id: "3",
    company: "OpenAI",
    position: "ML Engineer",
    stage: "onsite",
    location: "San Francisco, CA",
    salary: "$180k - $250k",
    appliedDate: "2025-01-05",
    url: "https://openai.com/careers",
    tags: ["Python", "ML", "AI"],
  },
  {
    id: "4",
    company: "Anthropic",
    position: "Research Engineer",
    stage: "applied",
    location: "Remote",
    salary: "$170k - $240k",
    appliedDate: "2025-01-20",
    url: "https://anthropic.com/careers",
    tags: ["Python", "Research"],
  },
  {
    id: "5",
    company: "Linear",
    position: "Product Engineer",
    stage: "discovered",
    location: "Remote",
    salary: "$140k - $190k",
    appliedDate: "2025-01-22",
    url: "https://linear.app/careers",
    tags: ["React", "TypeScript"],
  },
]

export async function getApplications(): Promise<Application[]> {
  await mockDelay(600)
  return mockApplications
}

export async function getApplication(id: string): Promise<Application | null> {
  await mockDelay(400)
  return mockApplications.find((app) => app.id === id) || null
}

export async function createApplication(data: Omit<Application, "id">): Promise<Application> {
  await mockDelay(500)
  const newApp: Application = {
    ...data,
    id: String(Date.now()),
  }
  mockApplications.push(newApp)
  return newApp
}

export async function updateApplication(id: string, data: Partial<Application>): Promise<Application> {
  await mockDelay(400)
  const index = mockApplications.findIndex((app) => app.id === id)
  if (index === -1) throw new Error("Application not found")

  mockApplications[index] = { ...mockApplications[index], ...data }
  return mockApplications[index]
}

export async function deleteApplication(id: string): Promise<void> {
  await mockDelay(400)
  mockApplications = mockApplications.filter((app) => app.id !== id)
}
