"use client"

import { useState } from "react"
import { Bell, Loader2 } from "lucide-react"
import { toast } from "sonner"

interface NotificationsSectionProps {
  initialData: {
    notifyInApp: boolean
    notifyEmail: boolean
    notifySlack: boolean
    notifyDiscord: boolean
    slackWebhook: string | null
    discordWebhook: string | null
  }
  onUpdate: () => void
}

export function NotificationsSection({ initialData, onUpdate }: NotificationsSectionProps) {
  const [settings, setSettings] = useState(initialData)
  const [isLoading, setIsLoading] = useState(false)

  const handleToggle = (key: keyof typeof settings) => {
    setSettings((prev) => ({ ...prev, [key]: !prev[key] }))
  }

  const handleWebhookChange = (key: "slackWebhook" | "discordWebhook", value: string) => {
    setSettings((prev) => ({ ...prev, [key]: value || null }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const response = await fetch("/api/settings", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(settings),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || "Failed to update notifications")
      }

      toast.success("Notification settings updated successfully")
      onUpdate()
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to update notifications")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="glass-panel rounded-[var(--radius-md)] p-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center">
          <Bell className="w-5 h-5 text-white" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-white">Notifications</h2>
          <p className="text-sm text-slate-400">Choose how you want to be notified</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* In-App Notifications */}
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-medium text-white">In-App Notifications</h3>
            <p className="text-sm text-slate-400">Show notifications within the app</p>
          </div>
          <button
            type="button"
            onClick={() => handleToggle("notifyInApp")}
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
              settings.notifyInApp ? "bg-blue-600" : "bg-white/20"
            }`}
            disabled={isLoading}
          >
            <span
              className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                settings.notifyInApp ? "translate-x-6" : "translate-x-1"
              }`}
            />
          </button>
        </div>

        {/* Email Notifications */}
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-medium text-white">Email Notifications</h3>
            <p className="text-sm text-slate-400">Receive notifications via email</p>
          </div>
          <button
            type="button"
            onClick={() => handleToggle("notifyEmail")}
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
              settings.notifyEmail ? "bg-blue-600" : "bg-white/20"
            }`}
            disabled={isLoading}
          >
            <span
              className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                settings.notifyEmail ? "translate-x-6" : "translate-x-1"
              }`}
            />
          </button>
        </div>

        {/* Slack Notifications */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-medium text-white">Slack Notifications</h3>
              <p className="text-sm text-slate-400">Send notifications to Slack webhook</p>
            </div>
            <button
              type="button"
              onClick={() => handleToggle("notifySlack")}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                settings.notifySlack ? "bg-blue-600" : "bg-white/20"
              }`}
              disabled={isLoading}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  settings.notifySlack ? "translate-x-6" : "translate-x-1"
                }`}
              />
            </button>
          </div>
          {settings.notifySlack && (
            <input
              type="url"
              value={settings.slackWebhook || ""}
              onChange={(e) => handleWebhookChange("slackWebhook", e.target.value)}
              className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all text-sm"
              placeholder="https://hooks.slack.com/services/..."
              disabled={isLoading}
            />
          )}
        </div>

        {/* Discord Notifications */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-medium text-white">Discord Notifications</h3>
              <p className="text-sm text-slate-400">Send notifications to Discord webhook</p>
            </div>
            <button
              type="button"
              onClick={() => handleToggle("notifyDiscord")}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                settings.notifyDiscord ? "bg-blue-600" : "bg-white/20"
              }`}
              disabled={isLoading}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  settings.notifyDiscord ? "translate-x-6" : "translate-x-1"
                }`}
              />
            </button>
          </div>
          {settings.notifyDiscord && (
            <input
              type="url"
              value={settings.discordWebhook || ""}
              onChange={(e) => handleWebhookChange("discordWebhook", e.target.value)}
              className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all text-sm"
              placeholder="https://discord.com/api/webhooks/..."
              disabled={isLoading}
            />
          )}
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full bg-gradient-to-r from-purple-500 to-indigo-600 text-white rounded-xl py-3 font-semibold hover:shadow-lg hover:scale-105 transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 flex items-center justify-center gap-2"
        >
          {isLoading ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              Saving...
            </>
          ) : (
            "Save Notification Settings"
          )}
        </button>
      </form>
    </div>
  )
}

