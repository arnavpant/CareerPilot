"use client"

import { useState } from "react"
import { Database, Loader2 } from "lucide-react"
import { toast } from "sonner"

interface DataRetentionSectionProps {
  initialRetentionDays: number | null
  onUpdate: () => void
}

export function DataRetentionSection({ initialRetentionDays, onUpdate }: DataRetentionSectionProps) {
  const [retentionDays, setRetentionDays] = useState(initialRetentionDays?.toString() || "forever")
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const dataRetentionDays = retentionDays === "forever" ? null : parseInt(retentionDays, 10)

      const response = await fetch("/api/settings", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ dataRetentionDays }),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || "Failed to update data retention")
      }

      toast.success("Data retention settings updated successfully")
      onUpdate()
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to update data retention")
    } finally {
      setIsLoading(false)
    }
  }

  const hasChanged = () => {
    const currentValue = retentionDays === "forever" ? null : parseInt(retentionDays, 10)
    return currentValue !== initialRetentionDays
  }

  return (
    <div className="glass-panel rounded-[var(--radius-md)] p-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-orange-500 to-red-600 flex items-center justify-center">
          <Database className="w-5 h-5 text-white" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-white">Data Retention</h2>
          <p className="text-sm text-slate-400">Control how long your data is stored</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-2">
            Retention Period
          </label>
          <select
            value={retentionDays}
            onChange={(e) => setRetentionDays(e.target.value)}
            className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white focus:outline-none focus:ring-2 focus:ring-orange-500 transition-all"
            disabled={isLoading}
          >
            <option value="forever" className="bg-slate-800">
              Keep Forever
            </option>
            <option value="90" className="bg-slate-800">
              90 Days
            </option>
            <option value="180" className="bg-slate-800">
              180 Days (6 Months)
            </option>
            <option value="365" className="bg-slate-800">
              365 Days (1 Year)
            </option>
            <option value="730" className="bg-slate-800">
              730 Days (2 Years)
            </option>
            <option value="1095" className="bg-slate-800">
              1095 Days (3 Years)
            </option>
          </select>
          <p className="text-xs text-slate-500 mt-2">
            {retentionDays === "forever"
              ? "Your data will be stored indefinitely until you delete it manually."
              : `Applications older than ${retentionDays} days will be automatically deleted.`}
          </p>
        </div>

        <button
          type="submit"
          disabled={isLoading || !hasChanged()}
          className="w-full bg-gradient-to-r from-orange-500 to-red-600 text-white rounded-xl py-3 font-semibold hover:shadow-lg hover:scale-105 transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 flex items-center justify-center gap-2"
        >
          {isLoading ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              Saving...
            </>
          ) : (
            "Save Retention Settings"
          )}
        </button>
      </form>
    </div>
  )
}

