"use client"

import { motion } from "framer-motion"
import { Sidebar } from "./Sidebar"
import { Topbar } from "./Topbar"

interface AppShellProps {
  children: React.ReactNode
}

export function AppShell({ children }: AppShellProps) {
  return (
    <div className="min-h-screen flex">
      {/* Fixed Sidebar */}
      <Sidebar />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col ml-20">
        <Topbar />
        <motion.main
          initial={{ opacity: 0, scale: 0.98, filter: "blur(4px)" }}
          animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
          exit={{ opacity: 0, scale: 0.98, filter: "blur(4px)" }}
          transition={{ duration: 0.25, ease: [0.4, 0, 0.2, 1] }}
          className="flex-1 px-8 pb-8"
        >
          {children}
        </motion.main>
      </div>

      {/* Noise Overlay */}
      <div className="noise-overlay" />
    </div>
  )
}
