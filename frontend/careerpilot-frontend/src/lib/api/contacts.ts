import { mockDelay } from "./client"

export interface Contact {
  id: string
  name: string
  email: string
  role: string
  company: string
}

const mockContacts: Contact[] = [
  {
    id: "1",
    name: "Jane Smith",
    email: "jane@vercel.com",
    role: "Engineering Manager",
    company: "Vercel",
  },
]

export async function getContacts(): Promise<Contact[]> {
  await mockDelay(500)
  return mockContacts
}
