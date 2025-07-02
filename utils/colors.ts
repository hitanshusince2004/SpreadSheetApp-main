export const statusColors = {
  "In-process": "bg-orange-100 text-orange-800 border-orange-200",
  "Need to start": "bg-blue-100 text-blue-800 border-blue-200",
  Complete: "bg-green-100 text-green-800 border-green-200",
  Blocked: "bg-red-100 text-red-800 border-red-200",
} as const

export const priorityColors = {
  High: "bg-red-100 text-red-800 border-red-200",
  Medium: "bg-yellow-100 text-yellow-800 border-yellow-200",
  Low: "bg-green-100 text-green-800 border-green-200",
} as const
