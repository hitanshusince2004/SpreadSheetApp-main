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
  value: number
}

export interface SortConfig {
  key: keyof SpreadsheetRow | null
  direction: "asc" | "desc" | null
}

export interface FilterConfig {
  status: string[]
  priority: string[]
  assignee: string[]
}

export interface CellPosition {
  rowIndex: number
  colIndex: number
}

export interface EditingCell {
  rowId: number
  field: keyof SpreadsheetRow
}
