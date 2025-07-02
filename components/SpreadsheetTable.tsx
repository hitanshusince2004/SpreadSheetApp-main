"use client"

import { forwardRef, useMemo } from "react"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { ArrowUpDown } from "lucide-react"
import type { SpreadsheetRow, FilterState, SortState } from "@/types/spreadsheet"
import { statusColors, priorityColors } from "@/utils/colors"

interface SpreadsheetTableProps {
  data: SpreadsheetRow[]
  searchTerm: string
  filters: FilterState
  sort: SortState
  hiddenColumns: Set<string>
  selectedCell: { row: number; col: string } | null
  onCellUpdate: (id: number, field: keyof SpreadsheetRow, value: string) => void
  onSort: (field: keyof SpreadsheetRow) => void
  onCellSelect: (cell: { row: number; col: string } | null) => void
}

export const SpreadsheetTable = forwardRef<HTMLDivElement, SpreadsheetTableProps>(
  ({ data, searchTerm, filters, sort, hiddenColumns, selectedCell, onCellUpdate, onSort, onCellSelect }, ref) => {
    const filteredAndSortedData = useMemo(() => {
      const filtered = data.filter((row) => {
        const matchesSearch =
          row.task.toLowerCase().includes(searchTerm.toLowerCase()) ||
          row.submitter.toLowerCase().includes(searchTerm.toLowerCase()) ||
          row.assignee.toLowerCase().includes(searchTerm.toLowerCase())

        const matchesStatus = filters.status === "all" || row.status === filters.status
        const matchesPriority = filters.priority === "all" || row.priority === filters.priority

        return matchesSearch && matchesStatus && matchesPriority
      })

      if (sort.field) {
        filtered.sort((a, b) => {
          const aVal = a[sort.field!]
          const bVal = b[sort.field!]

          if (aVal < bVal) return sort.direction === "asc" ? -1 : 1
          if (aVal > bVal) return sort.direction === "asc" ? 1 : -1
          return 0
        })
      }

      return filtered
    }, [data, searchTerm, filters, sort])

    const columns = [
      { key: "task", label: "Submitted", sortable: true },
      { key: "status", label: "Status", sortable: true },
      { key: "submitter", label: "Submitter", sortable: true },
      { key: "url", label: "URL", sortable: false },
      { key: "assignee", label: "Assignee", sortable: true },
      { key: "priority", label: "Priority", sortable: true },
      { key: "dueDate", label: "Due Date", sortable: true },
      { key: "value", label: "Our Value", sortable: true },
    ]

    const visibleColumns = columns.filter((col) => !hiddenColumns.has(col.key))

    return (
      <div ref={ref} className="overflow-hidden">
        {/* Question Bar */}
        <div className="bg-blue-50 px-4 py-2 border-b flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <span className="text-sm font-medium">ABC</span>
            <span className="text-sm text-blue-600 font-medium">Answer a question</span>
            <span className="text-sm text-orange-600 font-medium">Extract</span>
          </div>
          <div className="flex items-center space-x-2">
            <span className="text-sm font-medium">Our Data</span>
            <span className="text-sm font-medium">Our Value</span>
            <button className="w-6 h-6 rounded bg-gray-200 hover:bg-gray-300 flex items-center justify-center">
              <span className="text-xs">+</span>
            </button>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="w-12 px-3 py-2 text-left text-xs font-medium text-gray-500 border-r">#</th>
                {visibleColumns.map((column) => (
                  <th
                    key={column.key}
                    className="px-4 py-2 text-left text-xs font-medium text-gray-500 border-r cursor-pointer hover:bg-gray-100"
                    onClick={() => column.sortable && onSort(column.key as keyof SpreadsheetRow)}
                  >
                    <div className="flex items-center justify-between">
                      {column.label}
                      {column.sortable && <ArrowUpDown className="w-3 h-3 ml-1 text-gray-400" />}
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filteredAndSortedData.map((row, index) => (
                <tr key={row.id} className="border-b hover:bg-gray-50">
                  <td className="px-3 py-2 text-sm text-gray-500 border-r bg-gray-50">{index + 1}</td>
                  {visibleColumns.map((column) => (
                    <td
                      key={column.key}
                      className={`px-4 py-2 border-r relative ${
                        selectedCell?.row === index && selectedCell?.col === column.key
                          ? "ring-2 ring-blue-500 bg-blue-50"
                          : ""
                      }`}
                      onClick={() => onCellSelect({ row: index, col: column.key })}
                    >
                      {column.key === "status" ? (
                        <Badge className={statusColors[row.status as keyof typeof statusColors]}>{row.status}</Badge>
                      ) : column.key === "priority" ? (
                        <Badge className={priorityColors[row.priority as keyof typeof priorityColors]}>
                          {row.priority}
                        </Badge>
                      ) : (
                        <Input
                          data-cell={`${index}-${column.key}`}
                          value={row[column.key as keyof SpreadsheetRow] as string}
                          onChange={(e) => onCellUpdate(row.id, column.key as keyof SpreadsheetRow, e.target.value)}
                          className="border-none p-0 h-auto text-sm bg-transparent focus:bg-white focus:border focus:border-blue-500"
                          onFocus={() => onCellSelect({ row: index, col: column.key })}
                        />
                      )}
                    </td>
                  ))}
                </tr>
              ))}
              {/* Empty rows for visual completeness */}
              {Array.from({ length: Math.max(0, 15 - filteredAndSortedData.length) }).map((_, index) => (
                <tr key={`empty-${index}`} className="border-b">
                  <td className="px-3 py-2 text-sm text-gray-400 border-r bg-gray-50">
                    {filteredAndSortedData.length + index + 1}
                  </td>
                  {visibleColumns.map((column) => (
                    <td key={column.key} className="px-4 py-2 h-10 border-r"></td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    )
  },
)

SpreadsheetTable.displayName = "SpreadsheetTable"
