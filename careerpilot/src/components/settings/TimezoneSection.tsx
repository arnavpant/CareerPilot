"use client"

import { useState } from "react"
import { Globe, Loader2 } from "lucide-react"
import { toast } from "sonner"
import { TIMEZONES } from "@/lib/timezones"

interface TimezoneSectionProps {
  initialTimezone: string
  onUpdate: () => void
}

export function TimezoneSection({ initialTimezone, onUpdate }: TimezoneSectionProps) {
  const [timezone, setTimezone] = useState(initialTimezone)
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const response = await fetch("/api/settings", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ timezone }),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || "Failed to update timezone")
      }

      toast.success("Timezone updated successfully")
      onUpdate()
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to update timezone")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="glass-panel rounded-[var(--radius-md)] p-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center">
          <Globe className="w-5 h-5 text-white" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-white">Timezone</h2>
          <p className="text-sm text-slate-400">Set your local timezone for dates and times</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-2">Your Timezone</label>
          <select
            value={timezone}
            onChange={(e) => setTimezone(e.target.value)}
            className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white focus:outline-none focus:ring-2 focus:ring-green-500 transition-all"
            disabled={isLoading}
          >
            {TIMEZONES.map((tz) => (
              <option key={tz.value} value={tz.value} className="bg-slate-800">
                {tz.label}
              </option>
            ))}
          </select>
        </div>

        <button
          type="submit"
          disabled={isLoading || timezone === initialTimezone}
          className="w-full bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-xl py-3 font-semibold hover:shadow-lg hover:scale-105 transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 flex items-center justify-center gap-2"
        >
          {isLoading ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              Saving...
            </>
          ) : (
            "Save Timezone"
          )}
        </button>
      </form>
    </div>
  )
}

