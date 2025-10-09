"use client"

import { useState, useEffect } from "react"
import { Mail, Trash2, CheckCircle, XCircle, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { toast } from "sonner"
import type { EmailProvider } from "@prisma/client"

interface EmailConnection {
  id: string
  provider: EmailProvider
  email: string
  lastSyncAt: Date | null
  createdAt: Date
}

interface EmailConnectionsSectionProps {
  onUpdate?: () => void
}

export function EmailConnectionsSection({ onUpdate }: EmailConnectionsSectionProps) {
  const [connections, setConnections] = useState<EmailConnection[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isConnecting, setIsConnecting] = useState(false)
  const [disconnecting, setDisconnecting] = useState<string | null>(null)
  const [confirmDisconnect, setConfirmDisconnect] = useState<EmailConnection | null>(null)

  const fetchConnections = async () => {
    setIsLoading(true)
    try {
      const response = await fetch("/api/email/connections")
      if (!response.ok) {
        throw new Error("Failed to fetch email connections")
      }
      const data = await response.json()
      setConnections(data)
    } catch (error) {
      console.error("Error fetching email connections:", error)
      toast.error("Failed to load email connections")
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchConnections()
  }, [])

  const handleConnect = async (provider: EmailProvider) => {
    setIsConnecting(true)
    try {
      // Initiate OAuth flow
      const response = await fetch("/api/email/connect", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ provider }),
      })

      if (!response.ok) {
        throw new Error("Failed to initiate connection")
      }

      const { authUrl } = await response.json()
      
      // Redirect to OAuth provider
      window.location.href = authUrl
    } catch (error) {
      console.error("Error connecting email:", error)
      toast.error("Failed to connect email account")
      setIsConnecting(false)
    }
  }

  const handleDisconnect = async (connection: EmailConnection) => {
    setDisconnecting(connection.id)
    try {
      const response = await fetch(`/api/email/disconnect/${connection.id}`, {
        method: "DELETE",
      })

      if (!response.ok) {
        throw new Error("Failed to disconnect email")
      }

      toast.success(`${connection.provider} disconnected`)
      await fetchConnections()
      onUpdate?.()
    } catch (error) {
      console.error("Error disconnecting email:", error)
      toast.error("Failed to disconnect email account")
    } finally {
      setDisconnecting(null)
      setConfirmDisconnect(null)
    }
  }

  const hasGmail = connections.some(c => c.provider === "GMAIL")
  const hasOutlook = connections.some(c => c.provider === "OUTLOOK")

  return (
    <div className="glass-panel rounded-2xl p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-xl font-semibold text-white mb-2">Email Connections</h3>
          <p className="text-sm text-slate-400">
            Connect your email accounts to automatically track job applications
          </p>
        </div>
        <Mail className="w-6 h-6 text-slate-400" />
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-8">
          <Loader2 className="w-6 h-6 animate-spin text-indigo-500" />
        </div>
      ) : (
        <div className="space-y-4">
          {/* Connected Accounts */}
          {connections.length > 0 && (
            <div className="space-y-3">
              <h4 className="text-sm font-medium text-slate-300">Connected Accounts</h4>
              {connections.map((connection) => (
                <div
                  key={connection.id}
                  className="flex items-center justify-between p-4 bg-white/5 rounded-xl"
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                      connection.provider === "GMAIL"
                        ? "bg-red-500/20 text-red-400"
                        : "bg-blue-500/20 text-blue-400"
                    }`}>
                      <Mail className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="text-white font-medium">{connection.email}</p>
                        <Badge variant="outline" className="text-xs border-green-500/30 text-green-400">
                          <CheckCircle className="w-3 h-3 mr-1" />
                          Connected
                        </Badge>
                      </div>
                      <p className="text-xs text-slate-400">
                        {connection.provider}
                        {connection.lastSyncAt && (
                          <> • Last synced {new Date(connection.lastSyncAt).toLocaleDateString()}</>
                        )}
                      </p>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setConfirmDisconnect(connection)}
                    disabled={disconnecting === connection.id}
                    className="text-red-400 hover:text-red-300 hover:bg-red-500/10"
                  >
                    {disconnecting === connection.id ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <>
                        <Trash2 className="w-4 h-4 mr-2" />
                        Disconnect
                      </>
                    )}
                  </Button>
                </div>
              ))}
            </div>
          )}

          {/* Connect New Account */}
          <div className="space-y-3">
            <h4 className="text-sm font-medium text-slate-300">
              {connections.length > 0 ? "Add Another Account" : "Connect an Account"}
            </h4>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {/* Gmail */}
              <Button
                onClick={() => handleConnect("GMAIL")}
                disabled={hasGmail || isConnecting}
                className="flex items-center justify-between p-4 h-auto bg-white/5 hover:bg-white/10 border border-white/10 disabled:opacity-50"
                variant="outline"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-red-500/20 flex items-center justify-center">
                    <Mail className="w-5 h-5 text-red-400" />
                  </div>
                  <div className="text-left">
                    <p className="text-white font-medium">Gmail</p>
                    <p className="text-xs text-slate-400">
                      {hasGmail ? "Already connected" : "Connect your Gmail account"}
                    </p>
                  </div>
                </div>
                {hasGmail ? (
                  <CheckCircle className="w-5 h-5 text-green-400" />
                ) : isConnecting ? (
                  <Loader2 className="w-5 h-5 animate-spin text-indigo-500" />
                ) : (
                  <span className="text-xs text-indigo-400">Connect →</span>
                )}
              </Button>

              {/* Outlook */}
              <Button
                onClick={() => handleConnect("OUTLOOK")}
                disabled={hasOutlook || isConnecting}
                className="flex items-center justify-between p-4 h-auto bg-white/5 hover:bg-white/10 border border-white/10 disabled:opacity-50"
                variant="outline"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-blue-500/20 flex items-center justify-center">
                    <Mail className="w-5 h-5 text-blue-400" />
                  </div>
                  <div className="text-left">
                    <p className="text-white font-medium">Outlook</p>
                    <p className="text-xs text-slate-400">
                      {hasOutlook ? "Already connected" : "Connect your Outlook account"}
                    </p>
                  </div>
                </div>
                {hasOutlook ? (
                  <CheckCircle className="w-5 h-5 text-green-400" />
                ) : isConnecting ? (
                  <Loader2 className="w-5 h-5 animate-spin text-indigo-500" />
                ) : (
                  <span className="text-xs text-indigo-400">Connect →</span>
                )}
              </Button>
            </div>
          </div>

          {/* Info */}
          <div className="mt-4 p-4 bg-blue-500/10 border border-blue-500/20 rounded-xl">
            <p className="text-sm text-blue-300">
              <strong>Note:</strong> We only request read-only access to scan for job-related emails.
              Your emails are never stored, and you can disconnect anytime.
            </p>
          </div>
        </div>
      )}

      {/* Disconnect Confirmation Dialog */}
      <AlertDialog open={confirmDisconnect !== null} onOpenChange={(open) => !open && setConfirmDisconnect(null)}>
        <AlertDialogContent className="glass-panel border-white/10">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-white">Disconnect {confirmDisconnect?.provider}?</AlertDialogTitle>
            <AlertDialogDescription className="text-slate-400">
              This will stop syncing emails from <strong>{confirmDisconnect?.email}</strong>.
              You can reconnect anytime.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="bg-white/5 border-white/10 hover:bg-white/10">
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={() => confirmDisconnect && handleDisconnect(confirmDisconnect)}
              className="bg-red-600 hover:bg-red-700 text-white"
            >
              Disconnect
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}

