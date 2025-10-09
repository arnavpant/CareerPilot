"use client"

import { motion } from "framer-motion"
import type { ReactNode } from "react"

interface SectionProps {
  title?: string
  description?: string
  children: ReactNode
  className?: string
}

export function Section({ title, description, children, className = "" }: SectionProps) {
  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={`glass-panel rounded-[var(--radius-lg)] p-6 ${className}`}
    >
      {(title || description) && (
        <div className="mb-6">
          {title && <h2 className="text-xl font-semibold text-white mb-1">{title}</h2>}
          {description && <p className="text-sm text-slate-400">{description}</p>}
        </div>
      )}
      {children}
    </motion.section>
  )
}
