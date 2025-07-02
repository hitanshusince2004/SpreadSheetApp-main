"use client"

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import type { FilterState } from "@/types/spreadsheet"

interface SpreadsheetFiltersProps {
  filters: FilterState
  onFiltersChange: (filters: FilterState) => void
}

export function SpreadsheetFilters({ filters, onFiltersChange }: SpreadsheetFiltersProps) {
  return (
    <div className="bg-white border-b px-4 py-2">
      <div className="flex items-center space-x-4">
        <Select value={filters.status} onValueChange={(value) => onFiltersChange({ ...filters, status: value })}>
          <SelectTrigger className="w-40 h-8">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="In-process">In-process</SelectItem>
            <SelectItem value="Need to start">Need to start</SelectItem>
            <SelectItem value="Complete">Complete</SelectItem>
            <SelectItem value="Blocked">Blocked</SelectItem>
          </SelectContent>
        </Select>

        <Select value={filters.priority} onValueChange={(value) => onFiltersChange({ ...filters, priority: value })}>
          <SelectTrigger className="w-40 h-8">
            <SelectValue placeholder="Filter by priority" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Priority</SelectItem>
            <SelectItem value="High">High</SelectItem>
            <SelectItem value="Medium">Medium</SelectItem>
            <SelectItem value="Low">Low</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  )
}
