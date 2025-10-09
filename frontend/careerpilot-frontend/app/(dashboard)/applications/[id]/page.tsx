"use client"

import { useState } from "react"
import { useParams } from "next/navigation"
import { PageHeader } from "@/components/layout/PageHeader"
import { Section } from "@/components/layout/Section"
import { SegmentedTabs } from "@/components/layout/SegmentedTabs"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Building2, MapPin, DollarSign, Calendar, ExternalLink } from "lucide-react"
import { STAGE_CONFIG } from "@/lib/constants/stages"

const tabs = [
  { id: "overview", label: "Overview" },
  { id: "activity", label: "Activity" },
  { id: "interviews", label: "Interviews" },
  { id: "tasks", label: "Tasks" },
  { id: "files", label: "Files" },
]

export default function ApplicationDetailPage() {
  const params = useParams()
  const [activeTab, setActiveTab] = useState("overview")

  // Mock data
  const application = {
    id: params.id,
    company: "Vercel",
    position: "Senior Frontend Engineer",
    stage: "tech",
    location: "Remote",
    salary: "$150k - $200k",
    appliedDate: "2025-01-15",
    url: "https://vercel.com/careers",
  }

  const stageConfig = STAGE_CONFIG[application.stage as keyof typeof STAGE_CONFIG]

  return (
    <div className="space-y-8">
      <PageHeader
        title={application.position}
        description={application.company}
        actions={
          <Button variant="outline" size="sm">
            <ExternalLink className="w-4 h-4 mr-2" />
            View Posting
          </Button>
        }
      />

      <Section>
        <div className="flex flex-wrap items-center gap-4 mb-6">
          <Badge
            className="px-3 py-1"
            style={{
              backgroundColor: `rgb(${stageConfig.color} / 0.15)`,
              color: `rgb(${stageConfig.color})`,
              border: `1px solid rgb(${stageConfig.color} / 0.3)`,
            }}
          >
            {stageConfig.label}
          </Badge>
          <div className="flex items-center gap-2 text-slate-400">
            <Building2 className="w-4 h-4" />
            <span>{application.company}</span>
          </div>
          <div className="flex items-center gap-2 text-slate-400">
            <MapPin className="w-4 h-4" />
            <span>{application.location}</span>
          </div>
          <div className="flex items-center gap-2 text-slate-400">
            <DollarSign className="w-4 h-4" />
            <span>{application.salary}</span>
          </div>
          <div className="flex items-center gap-2 text-slate-400">
            <Calendar className="w-4 h-4" />
            <span>Applied {application.appliedDate}</span>
          </div>
        </div>

        <SegmentedTabs tabs={tabs} activeTab={activeTab} onChange={setActiveTab} />

        <div className="mt-6">
          {activeTab === "overview" && (
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-semibold text-white mb-2">Job Description</h3>
                <p className="text-slate-400 leading-relaxed">
                  We're looking for a Senior Frontend Engineer to join our team and help build the future of web
                  development. You'll work on cutting-edge projects using React, Next.js, and modern web technologies.
                </p>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-white mb-2">Notes</h3>
                <p className="text-slate-400 leading-relaxed">
                  Great company culture. Spoke with the hiring manager at a conference. They're looking for someone with
                  strong TypeScript skills.
                </p>
              </div>
            </div>
          )}
          {activeTab === "activity" && <div className="text-slate-400">Activity timeline coming soon...</div>}
          {activeTab === "interviews" && <div className="text-slate-400">Interview schedule coming soon...</div>}
          {activeTab === "tasks" && <div className="text-slate-400">Task list coming soon...</div>}
          {activeTab === "files" && <div className="text-slate-400">File attachments coming soon...</div>}
        </div>
      </Section>
    </div>
  )
}
