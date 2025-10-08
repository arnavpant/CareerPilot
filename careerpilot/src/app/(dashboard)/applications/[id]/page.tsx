import { notFound, redirect } from "next/navigation"
import { getSession } from "@/lib/auth/session"
import { prisma } from "@/lib/db/prisma"
import { ApplicationDetailsView } from "@/components/applications/ApplicationDetailsView"

interface ApplicationPageProps {
  params: {
    id: string
  }
}

export default async function ApplicationPage({ params }: ApplicationPageProps) {
  const session = await getSession()
  
  if (!session?.user?.id) {
    redirect("/signin")
  }

  const application = await prisma.application.findUnique({
    where: {
      id: params.id,
      userId: session.user.id, // Ensure user owns this application
    },
    include: {
      company: true,
      interviews: {
        orderBy: { scheduledAt: "asc" },
      },
      tasks: {
        orderBy: { dueDate: "asc" },
      },
      activities: {
        orderBy: { createdAt: "desc" },
        take: 50,
      },
      attachments: {
        orderBy: { uploadedAt: "desc" },
      },
    },
  })

  if (!application) {
    notFound()
  }

  return <ApplicationDetailsView application={application} />
}
