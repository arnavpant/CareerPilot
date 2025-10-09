"use client"

import { motion } from "framer-motion"
import { TrendingUp, TrendingDown, Briefcase, CheckCircle, Clock, XCircle } from "lucide-react"

const kpis = [
  {
    label: "Total Applications",
    value: "47",
    change: "+12%",
    trend: "up",
    icon: Briefcase,
    color: "from-blue-500 to-cyan-500",
  },
  {
    label: "Active",
    value: "32",
    change: "+8%",
    trend: "up",
    icon: Clock,
    color: "from-indigo-500 to-purple-500",
  },
  {
    label: "Offers",
    value: "3",
    change: "+2",
    trend: "up",
    icon: CheckCircle,
    color: "from-green-500 to-emerald-500",
  },
  {
    label: "Rejected",
    value: "12",
    change: "-5%",
    trend: "down",
    icon: XCircle,
    color: "from-red-500 to-pink-500",
  },
]

export function KPICards() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {kpis.map((kpi, index) => {
        const Icon = kpi.icon
        const TrendIcon = kpi.trend === "up" ? TrendingUp : TrendingDown

        return (
          <motion.div
            key={kpi.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="glass-panel glass-panel-hover rounded-[var(--radius-md)] p-5"
          >
            <div className="flex items-start justify-between mb-3">
              <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${kpi.color} flex items-center justify-center`}>
                <Icon className="w-5 h-5 text-white" />
              </div>
              <div
                className={`flex items-center gap-1 text-xs ${kpi.trend === "up" ? "text-green-400" : "text-red-400"}`}
              >
                <TrendIcon className="w-3.5 h-3.5" />
                <span>{kpi.change}</span>
              </div>
            </div>
            <div className="text-3xl font-bold text-white mb-1">{kpi.value}</div>
            <div className="text-sm text-slate-400">{kpi.label}</div>
          </motion.div>
        )
      })}
    </div>
  )
}
