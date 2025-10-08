interface SectionProps {
  title?: string
  description?: string
  children: React.ReactNode
  className?: string
}

export function Section({ title, description, children, className = "" }: SectionProps) {
  return (
    <section className={className}>
      {(title || description) && (
        <div className="mb-6">
          {title && (
            <h2 className="text-2xl font-bold text-white mb-2">{title}</h2>
          )}
          {description && (
            <p className="text-slate-400">{description}</p>
          )}
        </div>
      )}
      {children}
    </section>
  )
}
