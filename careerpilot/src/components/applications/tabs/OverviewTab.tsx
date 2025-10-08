import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import type { Application, Company } from "@prisma/client"

interface OverviewTabProps {
  application: Application & { company: Company | null }
}

export function OverviewTab({ application }: OverviewTabProps) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Main Content */}
      <div className="lg:col-span-2 space-y-6">
        {/* Company Info */}
        {application.company && (
          <div className="glass-panel rounded-2xl p-6">
            <h3 className="text-xl font-bold text-white mb-4">Company Information</h3>
            <div className="space-y-3">
              <div>
                <div className="text-sm text-slate-400 mb-1">Name</div>
                <div className="text-white">{application.company.name}</div>
              </div>
              {application.company.website && (
                <div>
                  <div className="text-sm text-slate-400 mb-1">Website</div>
                  <a
                    href={application.company.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-indigo-400 hover:text-indigo-300"
                  >
                    {application.company.website}
                  </a>
                </div>
              )}
              {application.company.industry && (
                <div>
                  <div className="text-sm text-slate-400 mb-1">Industry</div>
                  <div className="text-white">{application.company.industry}</div>
                </div>
              )}
              {application.company.size && (
                <div>
                  <div className="text-sm text-slate-400 mb-1">Company Size</div>
                  <div className="text-white">{application.company.size}</div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Job Details */}
        <div className="glass-panel rounded-2xl p-6">
          <h3 className="text-xl font-bold text-white mb-4">Job Details</h3>
          <div className="space-y-3">
            {application.employmentType && (
              <div>
                <div className="text-sm text-slate-400 mb-1">Employment Type</div>
                <div className="text-white">{application.employmentType}</div>
              </div>
            )}
            {application.source && (
              <div>
                <div className="text-sm text-slate-400 mb-1">Source</div>
                <div className="text-white">{application.source}</div>
              </div>
            )}
            {application.externalAtsUrl && (
              <div>
                <div className="text-sm text-slate-400 mb-1">ATS Link</div>
                <a
                  href={application.externalAtsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-indigo-400 hover:text-indigo-300"
                >
                  View Application Portal
                </a>
              </div>
            )}
          </div>
        </div>

        {/* Notes */}
        {application.notes && (
          <div className="glass-panel rounded-2xl p-6">
            <h3 className="text-xl font-bold text-white mb-4">Notes</h3>
            <div className="text-slate-300 whitespace-pre-wrap">{application.notes}</div>
          </div>
        )}
      </div>

      {/* Sidebar */}
      <div className="space-y-6">
        {/* Tags */}
        {application.tags && application.tags.length > 0 && (
          <div className="glass-panel rounded-2xl p-6">
            <h3 className="text-lg font-semibold text-white mb-3">Tags</h3>
            <div className="flex flex-wrap gap-2">
              {application.tags.map((tag) => (
                <Badge
                  key={tag}
                  className="bg-white/10 text-slate-300 border-0"
                >
                  {tag}
                </Badge>
              ))}
            </div>
          </div>
        )}

        {/* Application Materials */}
        <div className="glass-panel rounded-2xl p-6">
          <h3 className="text-lg font-semibold text-white mb-3">Materials</h3>
          <div className="space-y-3">
            {application.resumeVersion && (
              <div>
                <div className="text-sm text-slate-400 mb-1">Resume Version</div>
                <div className="text-white">{application.resumeVersion}</div>
              </div>
            )}
            {application.coverLetter && (
              <div>
                <div className="text-sm text-slate-400 mb-1">Cover Letter</div>
                <div className="text-white">Submitted</div>
              </div>
            )}
          </div>
        </div>

        {/* Compensation */}
        <div className="glass-panel rounded-2xl p-6">
          <h3 className="text-lg font-semibold text-white mb-3">Compensation</h3>
          <div className="space-y-3">
            {(application.salaryMin || application.salaryMax) && (
              <div>
                <div className="text-sm text-slate-400 mb-1">Salary Range</div>
                <div className="text-white">
                  {application.salaryMin && application.salaryMax
                    ? `$${(application.salaryMin / 1000).toFixed(0)}k - $${(application.salaryMax / 1000).toFixed(0)}k`
                    : application.salaryMin
                    ? `$${(application.salaryMin / 1000).toFixed(0)}k+`
                    : `Up to $${(application.salaryMax! / 1000).toFixed(0)}k`}
                </div>
              </div>
            )}
            {application.salaryCurrency && application.salaryCurrency !== "USD" && (
              <div>
                <div className="text-sm text-slate-400 mb-1">Currency</div>
                <div className="text-white">{application.salaryCurrency}</div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
