"use client"

// ---------------------------------------------------------------------------
// [ComponentName]
// ---------------------------------------------------------------------------

interface ComponentNameProps {
  // Required props
  title: string
  // Optional props
  className?: string
}

export function ComponentName({ title, className }: ComponentNameProps) {
  return (
    <div className={className}>
      <h2>{title}</h2>
    </div>
  )
}
