"use client"

import { useState } from "react"
import { Search, Bell } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { UserMenu } from "./UserMenu"
import { QuickAddDialog } from "@/components/forms/QuickAddDialog"

export function Topbar() {
  const [hasNotifications, setHasNotifications] = useState(true)

  return (
    <header className="sticky top-4 z-30 mx-4 mb-8">
      <div className="glass-panel rounded-2xl px-6 py-3">
        <div className="flex items-center justify-between gap-4">
          {/* Search Bar */}
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <Input
              type="search"
              placeholder="Search applications..."
              className="pl-10 bg-white/5 border-white/10 focus-visible:ring-indigo-500 h-10"
            />
          </div>

          {/* Right Side Actions */}
          <div className="flex items-center gap-3">
            {/* Quick Add Dialog */}
            <QuickAddDialog />

            {/* Notifications */}
            <Button variant="ghost" size="icon" className="relative">
              <Bell className="w-5 h-5" />
              {hasNotifications && (
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
              )}
            </Button>

            {/* User Menu */}
            <UserMenu />
          </div>
        </div>
      </div>
    </header>
  )
}
