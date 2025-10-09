"use client"

import { useState, useEffect } from "react"
import { Section } from "@/components/layout/Section"
import { FilterBar } from "./FilterBar"
import type { Application } from "@/types/domain"
import { getApplications } from "@/lib/api/applications"
import { Badge } from "@/components/ui/badge"
import { STAGE_CONFIG } from "@/lib/constants/stages"
import Link from "next/link"
import { ExternalLink } from "lucide-react"

export function ApplicationTable() {
  const [applications, setApplications] = useState<Application[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadApplications()
  }, [])

  const loadApplications = async () => {
    try {
      const data = await getApplications()
      setApplications(data)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <Section>
        <div className="text-slate-400">Loading...</div>
      </Section>
    )
  }

  return (
    <Section>
      <FilterBar />
      <div className="mt-6 overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-white/10">
              <th className="text-left py-3 px-4 text-sm font-medium text-slate-400">Company</th>
              <th className="text-left py-3 px-4 text-sm font-medium text-slate-400">Position</th>
              <th className="text-left py-3 px-4 text-sm font-medium text-slate-400">Stage</th>
              <th className="text-left py-3 px-4 text-sm font-medium text-slate-400">Location</th>
              <th className="text-left py-3 px-4 text-sm font-medium text-slate-400">Salary</th>
              <th className="text-left py-3 px-4 text-sm font-medium text-slate-400">Applied</th>
              <th className="text-right py-3 px-4 text-sm font-medium text-slate-400">Actions</th>
            </tr>
          </thead>
          <tbody>
            {applications.map((app) => {
              const stageConfig = STAGE_CONFIG[app.stage as keyof typeof STAGE_CONFIG]
              return (
                <tr key={app.id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                  <td className="py-3 px-4 text-white font-medium">{app.company}</td>
                  <td className="py-3 px-4 text-slate-300">{app.position}</td>
                  <td className="py-3 px-4">
                    <Badge
                      className="px-2 py-1"
                      style={{
                        backgroundColor: `rgb(${stageConfig.color} / 0.15)`,
                        color: `rgb(${stageConfig.color})`,
                        border: `1px solid rgb(${stageConfig.color} / 0.3)`,
                      }}
                    >
                      {stageConfig.label}
                    </Badge>
                  </td>
                  <td className="py-3 px-4 text-slate-400">{app.location || "—"}</td>
                  <td className="py-3 px-4 text-slate-400">{app.salary || "—"}</td>
                  <td className="py-3 px-4 text-slate-400">{app.appliedDate}</td>
                  <td className="py-3 px-4 text-right">
                    <Link
                      href={`/applications/${app.id}`}
                      className="inline-flex items-center gap-1 text-indigo-400 hover:text-indigo-300 transition-colors"
                    >
                      <span className="text-sm">View</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </Link>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </Section>
  )
}
