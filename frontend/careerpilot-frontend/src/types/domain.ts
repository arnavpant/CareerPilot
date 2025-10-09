export interface Application {
  id: string
  company: string
  position: string
  stage: string
  location?: string
  salary?: string
  appliedDate: string
  url?: string
  tags?: string[]
  notes?: string
}

export interface User {
  id: string
  name: string
  email: string
  avatar?: string
}
