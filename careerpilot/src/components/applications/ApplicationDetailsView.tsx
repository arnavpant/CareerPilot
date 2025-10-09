"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { ArrowLeft, Building2, MapPin, DollarSign, Calendar, ExternalLink, Edit, Trash2 } from "lucide-react"
import { format } from "date-fns"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Separator } from "@/components/ui/separator"
import { STAGE_CONFIG } from "@/lib/constants/stages"
import { OverviewTab } from "./tabs/OverviewTab"
import { ActivityTab } from "./tabs/ActivityTab"
import { InterviewsTab } from "./tabs/InterviewsTab"
import { TasksTab } from "./tabs/TasksTab"
import { FilesTab } from "./tabs/FilesTab"
import { EditApplicationDialog } from "./EditApplicationDialog"
import { DeleteApplicationDialog } from "./DeleteApplicationDialog"
import type { Application, Company, Interview, Task, Activity, Attachment } from "@prisma/client"

interface ApplicationDetailsViewProps {
  application: Application & {
    company: Company | null
    interviews: Interview[]
    tasks: Task[]
    activities: Activity[]
    attachments: Attachment[]
  }
}

export function ApplicationDetailsView({ application }: ApplicationDetailsViewProps) {
  const router = useRouter()
  const [editDialogOpen, setEditDialogOpen] = useState(false)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const stageConfig = STAGE_CONFIG[application.stage]
  
  const salaryRange = 
    application.salaryMin && application.salaryMax
      ? `$${(application.salaryMin / 1000).toFixed(0)}k - $${(application.salaryMax / 1000).toFixed(0)}k`
      : application.salaryMin
      ? `$${(application.salaryMin / 1000).toFixed(0)}k+`
      : application.salaryMax
      ? `Up to $${(application.salaryMax / 1000).toFixed(0)}k`
      : null

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => router.back()}
          className="hover:bg-white/5"
        >
          <ArrowLeft className="w-5 h-5" />
        </Button>
        
        <div className="flex-1">
          <div className="flex items-start justify-between">
            <div className="flex items-start gap-4">
              {/* Company Avatar */}
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-bold text-2xl flex-shrink-0">
                {application.company?.name?.[0] || "?"}
              </div>
              
              <div>
                <h1 className="text-3xl font-bold text-white mb-2">
                  {application.roleTitle}
                </h1>
                <div className="flex items-center gap-3 text-slate-400">
                  <div className="flex items-center gap-1.5">
                    <Building2 className="w-4 h-4" />
                    <span>{application.company?.name || "Unknown Company"}</span>
                  </div>
                  {application.location && (
                    <>
                      <span>•</span>
                      <div className="flex items-center gap-1.5">
                        <MapPin className="w-4 h-4" />
                        <span>{application.location}</span>
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>
            
            {/* Actions */}
            <div className="flex items-center gap-2">
              <Button 
                variant="outline" 
                size="sm" 
                className="bg-white/5 border-white/10 hover:bg-white/10"
                onClick={() => setEditDialogOpen(true)}
              >
                <Edit className="w-4 h-4 mr-2" />
                Edit
              </Button>
              <Button 
                variant="outline" 
                size="sm" 
                className="bg-red-500/10 border-red-500/20 text-red-400 hover:bg-red-500/20"
                onClick={() => setDeleteDialogOpen(true)}
              >
                <Trash2 className="w-4 h-4 mr-2" />
                Delete
              </Button>
            </div>
          </div>
        </div>
      </div>

      <Separator className="bg-white/10" />

      {/* Key Info Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="glass-panel rounded-2xl p-4">
          <div className="text-sm text-slate-400 mb-1">Stage</div>
          <Badge className={`${stageConfig.bgColor} ${stageConfig.textColor} border-0`}>
            {stageConfig.label}
          </Badge>
        </div>
        
        {salaryRange && (
          <div className="glass-panel rounded-2xl p-4">
            <div className="text-sm text-slate-400 mb-1">Salary</div>
            <div className="flex items-center gap-1.5 text-white font-semibold">
              <DollarSign className="w-4 h-4" />
              {salaryRange}
            </div>
          </div>
        )}
        
        <div className="glass-panel rounded-2xl p-4">
          <div className="text-sm text-slate-400 mb-1">Applied</div>
          <div className="flex items-center gap-1.5 text-white font-semibold">
            <Calendar className="w-4 h-4" />
            {format(new Date(application.appliedAt || application.createdAt), "MMM d, yyyy")}
          </div>
        </div>
        
        {application.postingUrl && (
          <div className="glass-panel rounded-2xl p-4">
            <div className="text-sm text-slate-400 mb-1">Job Posting</div>
            <a
              href={application.postingUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 text-indigo-400 hover:text-indigo-300 font-semibold"
            >
              <ExternalLink className="w-4 h-4" />
              View
            </a>
          </div>
        )}
      </div>

      {/* Tabs */}
      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="glass-panel w-full justify-start p-1">
          <TabsTrigger value="overview" className="data-[state=active]:bg-white/10">
            Overview
          </TabsTrigger>
          <TabsTrigger value="activity" className="data-[state=active]:bg-white/10">
            Activity
          </TabsTrigger>
          <TabsTrigger value="interviews" className="data-[state=active]:bg-white/10">
            Interviews ({application.interviews.length})
          </TabsTrigger>
          <TabsTrigger value="tasks" className="data-[state=active]:bg-white/10">
            Tasks ({application.tasks.filter(t => t.status !== "COMPLETED").length})
          </TabsTrigger>
          <TabsTrigger value="files" className="data-[state=active]:bg-white/10">
            Files ({application.attachments.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <OverviewTab application={application} />
        </TabsContent>

        <TabsContent value="activity" className="space-y-6">
          <ActivityTab activities={application.activities} />
        </TabsContent>

        <TabsContent value="interviews" className="space-y-6">
          <InterviewsTab interviews={application.interviews} applicationId={application.id} />
        </TabsContent>

        <TabsContent value="tasks" className="space-y-6">
          <TasksTab tasks={application.tasks} applicationId={application.id} />
        </TabsContent>

        <TabsContent value="files" className="space-y-6">
          <FilesTab attachments={application.attachments} applicationId={application.id} />
        </TabsContent>
      </Tabs>

      {/* Edit Dialog */}
      <EditApplicationDialog
        application={application}
        open={editDialogOpen}
        onOpenChange={setEditDialogOpen}
      />

      {/* Delete Dialog */}
      <DeleteApplicationDialog
        applicationId={application.id}
        applicationTitle={application.roleTitle}
        companyName={application.company?.name || "Unknown Company"}
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
      />
    </div>
  )
}
