import { mockDelay } from "./client"

export interface Task {
  id: string
  applicationId: string
  title: string
  dueDate: string
  completed: boolean
}

const mockTasks: Task[] = [
  {
    id: "1",
    applicationId: "1",
    title: "Prepare coding challenge",
    dueDate: "2025-01-24",
    completed: false,
  },
]

export async function getTasks(): Promise<Task[]> {
  await mockDelay(500)
  return mockTasks
}
