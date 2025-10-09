"use client"

import { motion } from "framer-motion"

interface Tab {
  id: string
  label: string
}

interface SegmentedTabsProps {
  tabs: Tab[]
  activeTab: string
  onChange: (tabId: string) => void
}

export function SegmentedTabs({ tabs, activeTab, onChange }: SegmentedTabsProps) {
  return (
    <div className="inline-flex items-center gap-1 p-1 glass-panel rounded-[var(--radius-md)]">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => onChange(tab.id)}
          className="relative px-4 py-2 text-sm font-medium transition-colors rounded-lg"
        >
          {activeTab === tab.id && (
            <motion.div
              layoutId="segmented-tab-active"
              className="absolute inset-0 bg-gradient-to-br from-indigo-500/20 to-purple-500/20 rounded-lg border border-indigo-400/30"
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
            />
          )}
          <span className={`relative z-10 ${activeTab === tab.id ? "text-white" : "text-slate-400"}`}>{tab.label}</span>
        </button>
      ))}
    </div>
  )
}
