import { PageHeader } from "@/components/layout/PageHeader"
import { CalendarView } from "@/components/calendar/CalendarView"
import { getSession } from "@/lib/auth/session"
import { prisma } from "@/lib/db/prisma"
import { redirect } from "next/navigation"

export default async function CalendarPage() {
  const session = await getSession()
  if (!session?.user?.email) {
    redirect("/signin")
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
  })

  if (!user) {
    redirect("/signin")
  }

  // Fetch interviews
  const interviews = await prisma.interview.findMany({
    where: {
      application: {
        userId: user.id,
      },
    },
    include: {
      application: {
        include: {
          company: true,
        },
      },
    },
    orderBy: {
      scheduledAt: "asc",
    },
  })

  // Fetch tasks with due dates
  const tasks = await prisma.task.findMany({
    where: {
      userId: user.id,
      dueDate: {
        not: null,
      },
    },
    include: {
      application: {
        include: {
          company: true,
        },
      },
    },
    orderBy: {
      dueDate: "asc",
    },
  })

  return (
    <div className="space-y-8">
      <PageHeader
        title="Calendar"
        description="Track interviews and important deadlines"
      />
      
      <CalendarView interviews={interviews} tasks={tasks} />
    </div>
  )
}
