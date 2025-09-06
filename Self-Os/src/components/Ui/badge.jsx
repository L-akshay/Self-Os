import React from "react"

export function Badge({ children, className = "" }) {
  return (
    <span
      className={`inline-flex items-center rounded px-2 py-1 text-xs font-medium bg-gray-700 text-white ${className}`}
    >
      {children}
    </span>
  )
}
