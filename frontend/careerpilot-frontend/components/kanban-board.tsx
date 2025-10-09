"use client"

import { mockApplications } from "@/lib/mock-data"
import { ApplicationCard } from "./application-card"

const columns = [
  { id: "wishlist", title: "Wishlist", color: "from-gray-400 to-gray-500" },
  { id: "applied", title: "Applied", color: "from-blue-400 to-blue-500" },
  { id: "interview", title: "Interview", color: "from-purple-400 to-purple-500" },
  { id: "offer", title: "Offer", color: "from-green-400 to-green-500" },
  { id: "rejected", title: "Rejected", color: "from-red-400 to-red-500" },
]

export function KanbanBoard() {
  return (
    <div className="grid grid-cols-5 gap-4 h-full">
      {columns.map((column) => {
        const apps = mockApplications.filter((app) => app.status === column.id)

        return (
          <div key={column.id} className="flex flex-col">
            <div className="glass-card p-4 mb-4 rounded-2xl">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold text-gray-900">{column.title}</h3>
                <span className="text-sm font-medium text-gray-500 bg-white/50 px-2 py-1 rounded-lg">
                  {apps.length}
                </span>
              </div>
              <div className={`h-1 rounded-full bg-gradient-to-r ${column.color} mt-3`} />
            </div>

            <div className="space-y-3 flex-1 overflow-y-auto">
              {apps.map((app) => (
                <ApplicationCard key={app.id} application={app} />
              ))}
            </div>
          </div>
        )
      })}
    </div>
  )
}
