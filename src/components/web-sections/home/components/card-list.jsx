import React from 'react'

export function CardList({ children, className = '' }) {
  return (
    <div
      className={`flex flex-col min-d:flex-row items-stretch gap-[var(--generic-gap-tablet)] min-d:gap-[var(--generic-gap-desktop)] py-[var(--pading-y)] ${className}`}
    >
      {children}
    </div>
  )
}
