"use client"

import { mockApplications } from "@/lib/mock-data"

export function AnalyticsDashboard() {
  const stats = {
    total: mockApplications.length,
    applied: mockApplications.filter((a) => a.status === "applied").length,
    interviews: mockApplications.filter((a) => a.status === "interview").length,
    offers: mockApplications.filter((a) => a.status === "offer").length,
    rejected: mockApplications.filter((a) => a.status === "rejected").length,
  }

  const cards = [
    {
      title: "Total Applications",
      value: stats.total,
      icon: (
        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <rect x="2" y="7" width="20" height="14" rx="2" ry="2" />
          <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
        </svg>
      ),
      color: "from-blue-500 to-indigo-600",
    },
    {
      title: "Active Applications",
      value: stats.applied,
      icon: (
        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <polyline points="23 6 13.5 15.5 8.5 10.5 1 18" />
          <polyline points="17 6 23 6 23 12" />
        </svg>
      ),
      color: "from-purple-500 to-pink-600",
    },
    {
      title: "Interviews",
      value: stats.interviews,
      icon: (
        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
          <polyline points="22 4 12 14.01 9 11.01" />
        </svg>
      ),
      color: "from-green-500 to-emerald-600",
    },
    {
      title: "Offers",
      value: stats.offers,
      icon: (
        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
          <polyline points="22 4 12 14.01 9 11.01" />
        </svg>
      ),
      color: "from-yellow-500 to-orange-600",
    },
  ]

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-4 gap-6">
        {cards.map((card) => (
          <div key={card.title} className="glass-card rounded-3xl p-6">
            <div className="flex items-center justify-between mb-4">
              <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${card.color} flex items-center justify-center`}>
                {card.icon}
              </div>
            </div>
            <div className="text-3xl font-bold text-gray-900 mb-1">{card.value}</div>
            <div className="text-sm text-gray-600">{card.title}</div>
          </div>
        ))}
      </div>

      <div className="glass-card rounded-3xl p-6">
        <h3 className="text-xl font-bold text-gray-900 mb-6">Application Status Breakdown</h3>
        <div className="space-y-4">
          {Object.entries(stats).map(([key, value]) => {
            if (key === "total") return null
            const percentage = (value / stats.total) * 100

            return (
              <div key={key}>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-700 capitalize">{key}</span>
                  <span className="text-sm font-semibold text-gray-900">
                    {value} ({percentage.toFixed(0)}%)
                  </span>
                </div>
                <div className="h-3 bg-white/50 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full ${
                      key === "applied"
                        ? "bg-gradient-to-r from-blue-500 to-indigo-600"
                        : key === "interviews"
                          ? "bg-gradient-to-r from-purple-500 to-pink-600"
                          : key === "offers"
                            ? "bg-gradient-to-r from-green-500 to-emerald-600"
                            : "bg-gradient-to-r from-red-500 to-rose-600"
                    }`}
                    style={{ width: `${percentage}%` }}
                  />
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
