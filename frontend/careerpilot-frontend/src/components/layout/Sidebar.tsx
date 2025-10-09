"use client"

import { motion } from "framer-motion"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { LayoutDashboard, Kanban, Table2, Calendar, Upload, Settings } from "lucide-react"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

const navItems = [
  { icon: LayoutDashboard, label: "Dashboard", href: "/dashboard" },
  { icon: Kanban, label: "Pipeline", href: "/pipeline" },
  { icon: Table2, label: "Table", href: "/table" },
  { icon: Calendar, label: "Calendar", href: "/calendar" },
  { icon: Upload, label: "Import", href: "/imports" },
  { icon: Settings, label: "Settings", href: "/settings" },
]

export function Sidebar() {
  const pathname = usePathname()

  return (
    <aside className="fixed left-4 top-4 bottom-4 w-16 glass-panel rounded-[var(--radius-lg)] p-3 flex flex-col items-center gap-2 z-50">
      <TooltipProvider delayDuration={0}>
        {navItems.map((item) => {
          const isActive = pathname === item.href
          const Icon = item.icon

          return (
            <Tooltip key={item.href}>
              <TooltipTrigger asChild>
                <Link
                  href={item.href}
                  className="relative w-full aspect-square flex items-center justify-center rounded-xl transition-colors hover:bg-white/10"
                >
                  {isActive && (
                    <motion.div
                      layoutId="sidebar-active"
                      className="absolute inset-0 bg-gradient-to-br from-indigo-500/20 to-purple-500/20 rounded-xl border border-indigo-400/30"
                      transition={{ type: "spring", stiffness: 300, damping: 30 }}
                    />
                  )}
                  <Icon className={`w-5 h-5 relative z-10 ${isActive ? "text-indigo-400" : "text-slate-400"}`} />
                </Link>
              </TooltipTrigger>
              <TooltipContent side="right">
                <p>{item.label}</p>
              </TooltipContent>
            </Tooltip>
          )
        })}
      </TooltipProvider>
    </aside>
  )
}
