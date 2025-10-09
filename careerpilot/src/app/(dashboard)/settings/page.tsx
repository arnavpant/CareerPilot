"use client"

import { useEffect, useState } from "react"
import { Settings as SettingsIcon, Loader2 } from "lucide-react"
import { ProfileSection } from "@/components/settings/ProfileSection"
import { TimezoneSection } from "@/components/settings/TimezoneSection"
import { EmailConnectionsSection } from "@/components/settings/EmailConnectionsSection"
import { NotificationsSection } from "@/components/settings/NotificationsSection"
import { DataRetentionSection } from "@/components/settings/DataRetentionSection"
import { toast } from "sonner"

interface UserSettings {
  id: string
  name: string
  email: string
  avatar: string | null
  timezone: string
  notifyInApp: boolean
  notifyEmail: boolean
  notifySlack: boolean
  notifyDiscord: boolean
  slackWebhook: string | null
  discordWebhook: string | null
  dataRetentionDays: number | null
  createdAt: string
}

export default function SettingsPage() {
  const [settings, setSettings] = useState<UserSettings | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  const fetchSettings = async () => {
    try {
      const response = await fetch("/api/settings", {
        credentials: "include", // Ensure cookies are sent
      })
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        console.error("Settings fetch error:", response.status, errorData)
        throw new Error(errorData.error || `Failed to fetch settings (${response.status})`)
      }
      
      const data = await response.json()
      setSettings(data)
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Failed to load settings"
      toast.error(errorMessage)
      console.error("Settings fetch failed:", error)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchSettings()
  }, [])

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center p-8">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-12 h-12 animate-spin text-blue-500" />
          <p className="text-slate-400">Loading settings...</p>
        </div>
      </div>
    )
  }

  if (!settings) {
    return (
      <div className="min-h-screen flex items-center justify-center p-8">
        <div className="glass-card p-8 max-w-md w-full text-center space-y-4">
          <div className="w-16 h-16 mx-auto rounded-2xl bg-red-500/20 flex items-center justify-center mb-4">
            <SettingsIcon className="w-8 h-8 text-red-400" />
          </div>
          <h2 className="text-2xl font-bold text-white">Failed to Load Settings</h2>
          <p className="text-slate-400">
            There was a problem loading your settings. Please check the browser console for more details.
          </p>
          <div className="flex gap-3 justify-center mt-6">
            <button
              onClick={fetchSettings}
              className="px-6 py-2 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-xl font-semibold hover:shadow-lg transition-all"
            >
              Try Again
            </button>
            <button
              onClick={() => window.location.href = "/dashboard"}
              className="px-6 py-2 bg-white/10 text-white rounded-xl font-semibold hover:bg-white/20 transition-all"
            >
              Back to Dashboard
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen p-8">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Page Header */}
        <div className="flex items-center gap-4 mb-8">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center">
            <SettingsIcon className="w-7 h-7 text-white" />
          </div>
          <div>
            <h1 className="text-4xl font-bold text-white">Settings</h1>
            <p className="text-lg text-slate-400">Manage your account and preferences</p>
          </div>
        </div>

        {/* Profile Section */}
        <ProfileSection
          initialData={{
            name: settings.name,
            email: settings.email,
          }}
          onUpdate={fetchSettings}
        />

        {/* Timezone Section */}
        <TimezoneSection initialTimezone={settings.timezone} onUpdate={fetchSettings} />

        {/* Email Connections Section */}
        <EmailConnectionsSection onUpdate={fetchSettings} />

        {/* Notifications Section */}
        <NotificationsSection
          initialData={{
            notifyInApp: settings.notifyInApp,
            notifyEmail: settings.notifyEmail,
            notifySlack: settings.notifySlack,
            notifyDiscord: settings.notifyDiscord,
            slackWebhook: settings.slackWebhook,
            discordWebhook: settings.discordWebhook,
          }}
          onUpdate={fetchSettings}
        />

        {/* Data Retention Section */}
        <DataRetentionSection
          initialRetentionDays={settings.dataRetentionDays}
          onUpdate={fetchSettings}
        />

        {/* Account Info */}
        <div className="glass-panel rounded-[var(--radius-md)] p-6">
          <h3 className="text-lg font-semibold text-white mb-4">Account Information</h3>
          <div className="space-y-2 text-sm text-slate-400">
            <p>
              <span className="font-medium text-slate-300">Account ID:</span> {settings.id}
            </p>
            <p>
              <span className="font-medium text-slate-300">Member since:</span>{" "}
              {new Date(settings.createdAt).toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

