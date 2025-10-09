"use client"

import { mockApplications } from "@/lib/mock-data"

export function ApplicationsTable() {
  return (
    <div className="glass-card rounded-3xl overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-white/30">
              <th className="text-left p-4 font-semibold text-gray-700">Company</th>
              <th className="text-left p-4 font-semibold text-gray-700">Position</th>
              <th className="text-left p-4 font-semibold text-gray-700">Status</th>
              <th className="text-left p-4 font-semibold text-gray-700">Location</th>
              <th className="text-left p-4 font-semibold text-gray-700">Salary</th>
              <th className="text-left p-4 font-semibold text-gray-700">Applied</th>
              <th className="text-left p-4 font-semibold text-gray-700">Priority</th>
            </tr>
          </thead>
          <tbody>
            {mockApplications.map((app) => (
              <tr key={app.id} className="border-b border-white/20 hover:bg-white/30 transition-colors cursor-pointer">
                <td className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-bold">
                      {app.company.charAt(0)}
                    </div>
                    <span className="font-medium text-gray-900">{app.company}</span>
                  </div>
                </td>
                <td className="p-4 text-gray-700">{app.position}</td>
                <td className="p-4">
                  <span
                    className={`px-3 py-1 rounded-lg text-xs font-medium ${
                      app.status === "offer"
                        ? "bg-green-100 text-green-700"
                        : app.status === "interview"
                          ? "bg-purple-100 text-purple-700"
                          : app.status === "applied"
                            ? "bg-blue-100 text-blue-700"
                            : app.status === "rejected"
                              ? "bg-red-100 text-red-700"
                              : "bg-gray-100 text-gray-700"
                    }`}
                  >
                    {app.status}
                  </span>
                </td>
                <td className="p-4">
                  <div className="flex items-center gap-1 text-gray-600 text-sm">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                      <circle cx="12" cy="10" r="3" />
                    </svg>
                    <span>{app.location}</span>
                  </div>
                </td>
                <td className="p-4 text-gray-700">{app.salary || "N/A"}</td>
                <td className="p-4 text-gray-600 text-sm">{new Date(app.appliedDate).toLocaleDateString()}</td>
                <td className="p-4">
                  <span
                    className={`px-3 py-1 rounded-lg text-xs font-medium ${
                      app.priority === "high"
                        ? "bg-red-100 text-red-700"
                        : app.priority === "medium"
                          ? "bg-yellow-100 text-yellow-700"
                          : "bg-green-100 text-green-700"
                    }`}
                  >
                    {app.priority}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
