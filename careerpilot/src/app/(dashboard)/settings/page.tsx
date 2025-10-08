"use client"

import { useEffect, useState } from "react"
import { Settings as SettingsIcon, Loader2 } from "lucide-react"
import { ProfileSection } from "@/components/settings/ProfileSection"
import { TimezoneSection } from "@/components/settings/TimezoneSection"
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
      const response = await fetch("/api/settings")
      if (!response.ok) {
        throw new Error("Failed to fetch settings")
      }
      const data = await response.json()
      setSettings(data)
    } catch (error) {
      toast.error("Failed to load settings")
      console.error(error)
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
        <div className="glass-card p-8 max-w-md w-full text-center">
          <p className="text-white text-lg">Failed to load settings</p>
          <button
            onClick={fetchSettings}
            className="mt-4 px-6 py-2 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-xl font-semibold hover:shadow-lg transition-all"
          >
            Try Again
          </button>
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

