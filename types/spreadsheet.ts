export interface SpreadsheetRow {
  id: number
  task: string
  date: string
  status: "In-process" | "Need to start" | "Complete" | "Blocked"
  submitter: string
  url: string
  assignee: string
  priority: "High" | "Medium" | "Low"
  dueDate: string
  value: string
}

export interface FilterState {
  status: string
  priority: string
}

export interface SortState {
  field: keyof SpreadsheetRow | null
  direction: "asc" | "desc"
}
