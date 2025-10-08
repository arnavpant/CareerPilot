"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { motion } from "framer-motion"
import { 
  LayoutDashboard, 
  Kanban, 
  Table2, 
  Calendar, 
  Upload, 
  Settings 
} from "lucide-react"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"

const navigation = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { name: "Pipeline", href: "/pipeline", icon: Kanban },
  { name: "Table", href: "/table", icon: Table2 },
  { name: "Calendar", href: "/calendar", icon: Calendar },
  { name: "Import", href: "/imports", icon: Upload },
  { name: "Settings", href: "/settings", icon: Settings },
]

export function Sidebar() {
  const pathname = usePathname()

  return (
    <aside className="fixed left-4 top-4 bottom-4 z-40 w-16 flex flex-col">
      <nav className="glass-panel rounded-2xl p-3 flex flex-col items-center gap-2 h-full">
        <TooltipProvider delayDuration={0}>
          {navigation.map((item) => {
            const isActive = pathname === item.href || pathname.startsWith(item.href + "/")
            const Icon = item.icon

            return (
              <Tooltip key={item.name}>
                <TooltipTrigger asChild>
                  <Link
                    href={item.href}
                    className={`relative w-12 h-12 rounded-xl flex items-center justify-center transition-all duration-200 ${
                      isActive
                        ? "text-white"
                        : "text-slate-400 hover:text-white hover:bg-white/5"
                    }`}
                  >
                    {isActive && (
                      <motion.div
                        layoutId="sidebar-active"
                        className="absolute inset-0 bg-gradient-to-br from-indigo-500/20 to-purple-500/20 rounded-xl"
                        transition={{
                          type: "spring",
                          stiffness: 300,
                          damping: 30,
                        }}
                      />
                    )}
                    <Icon className="w-5 h-5 relative z-10" />
                  </Link>
                </TooltipTrigger>
                <TooltipContent side="right" className="glass-panel border-0">
                  <p>{item.name}</p>
                </TooltipContent>
              </Tooltip>
            )
          })}
        </TooltipProvider>
      </nav>
    </aside>
  )
}
