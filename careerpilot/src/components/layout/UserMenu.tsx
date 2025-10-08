"use client"

import { useState } from "react"
import { useSession, signOut } from "next-auth/react"
import { User, Settings, LogOut, ChevronDown } from "lucide-react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"

export function UserMenu() {
  const { data: session } = useSession()
  const router = useRouter()
  const [isOpen, setIsOpen] = useState(false)

  const handleSignOut = async () => {
    try {
      toast.loading("Signing out...")
      await signOut({ redirect: false })
      toast.success("Signed out successfully")
      router.push("/signin")
      router.refresh()
    } catch (error) {
      toast.error("Failed to sign out")
    }
  }

  const getInitials = (name?: string | null, email?: string | null) => {
    if (name) {
      return name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2)
    }
    if (email) {
      return email[0].toUpperCase()
    }
    return "U"
  }

  if (!session?.user) return null

  return (
    <div className="relative">
      {/* User Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-3 px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 transition-all duration-200"
      >
        {/* Avatar */}
        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white text-sm font-bold">
          {getInitials(session.user.name, session.user.email)}
        </div>

        {/* User Info */}
        <div className="hidden md:block text-left">
          <p className="text-sm font-medium text-white">
            {session.user.name || session.user.email?.split("@")[0]}
          </p>
          <p className="text-xs text-slate-400">
            {session.user.email}
          </p>
        </div>

        {/* Dropdown Icon */}
        <ChevronDown
          className={`w-4 h-4 text-slate-400 transition-transform duration-200 ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 z-10"
            onClick={() => setIsOpen(false)}
          />

          {/* Menu */}
          <div className="absolute right-0 mt-2 w-64 rounded-xl bg-slate-800/95 backdrop-blur-lg border border-white/20 shadow-xl z-20 overflow-hidden">
            {/* User Info Header */}
            <div className="p-4 border-b border-white/10">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-bold">
                  {getInitials(session.user.name, session.user.email)}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-white truncate">
                    {session.user.name || "User"}
                  </p>
                  <p className="text-xs text-slate-400 truncate">
                    {session.user.email}
                  </p>
                </div>
              </div>
            </div>

            {/* Menu Items */}
            <div className="py-2">
              <button
                onClick={() => {
                  setIsOpen(false)
                  router.push("/settings")
                }}
                className="w-full flex items-center gap-3 px-4 py-3 text-sm text-slate-300 hover:bg-white/10 transition-colors"
              >
                <Settings className="w-4 h-4" />
                Settings
              </button>

              <button
                onClick={() => {
                  setIsOpen(false)
                  router.push("/dashboard")
                }}
                className="w-full flex items-center gap-3 px-4 py-3 text-sm text-slate-300 hover:bg-white/10 transition-colors"
              >
                <User className="w-4 h-4" />
                Dashboard
              </button>
            </div>

            {/* Sign Out */}
            <div className="border-t border-white/10 py-2">
              <button
                onClick={handleSignOut}
                className="w-full flex items-center gap-3 px-4 py-3 text-sm text-red-400 hover:bg-red-500/10 transition-colors"
              >
                <LogOut className="w-4 h-4" />
                Sign Out
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  )
}
