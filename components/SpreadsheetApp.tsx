"use client"

import { useState, useCallback, useRef, useEffect } from "react"
import { SpreadsheetHeader } from "./SpreadsheetHeader"
import { SpreadsheetToolbar } from "./SpreadsheetToolbar"
import { SpreadsheetFilters } from "./SpreadsheetFilters"
import { SpreadsheetTable } from "./SpreadsheetTable"
import { SpreadsheetTabs } from "./SpreadsheetTabs"
import type { SpreadsheetRow, FilterState, SortState } from "@/types/spreadsheet"
import { initialData } from "@/data/spreadsheetData"

export default function SpreadsheetApp() {
  const [data, setData] = useState<SpreadsheetRow[]>(initialData)
  const [searchTerm, setSearchTerm] = useState("")
  const [filters, setFilters] = useState<FilterState>({
    status: "all",
    priority: "all",
  })
  const [sort, setSort] = useState<SortState>({
    field: null,
    direction: "asc",
  })
  const [hiddenColumns, setHiddenColumns] = useState<Set<string>>(new Set())
  const [activeTab, setActiveTab] = useState("all-orders")
  const [selectedCell, setSelectedCell] = useState<{ row: number; col: string } | null>(null)
  const tableRef = useRef<HTMLDivElement>(null)

  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!selectedCell) return

      const { row, col } = selectedCell
      const columns = ["task", "status", "submitter", "url", "assignee", "priority", "dueDate", "value"]
      const currentColIndex = columns.indexOf(col)

      switch (e.key) {
        case "ArrowUp":
          e.preventDefault()
          if (row > 0) {
            setSelectedCell({ row: row - 1, col })
          }
          break
        case "ArrowDown":
          e.preventDefault()
          if (row < data.length - 1) {
            setSelectedCell({ row: row + 1, col })
          }
          break
        case "ArrowLeft":
          e.preventDefault()
          if (currentColIndex > 0) {
            setSelectedCell({ row, col: columns[currentColIndex - 1] })
          }
          break
        case "ArrowRight":
          e.preventDefault()
          if (currentColIndex < columns.length - 1) {
            setSelectedCell({ row, col: columns[currentColIndex + 1] })
          }
          break
        case "Enter":
          e.preventDefault()
          // Focus the input in the selected cell
          const cellInput = document.querySelector(`[data-cell="${row}-${col}"]`) as HTMLInputElement
          if (cellInput) {
            cellInput.focus()
          }
          break
        case "Escape":
          e.preventDefault()
          setSelectedCell(null)
          break
      }
    }

    document.addEventListener("keydown", handleKeyDown)
    return () => document.removeEventListener("keydown", handleKeyDown)
  }, [selectedCell, data.length])

  const handleCellUpdate = useCallback((id: number, field: keyof SpreadsheetRow, value: string) => {
    setData((prev) => prev.map((row) => (row.id === id ? { ...row, [field]: value } : row)))
    console.log(`Updated cell: Row ${id}, Field ${field}, Value: ${value}`)
  }, [])

  const handleSort = useCallback((field: keyof SpreadsheetRow) => {
    setSort((prev) => ({
      field,
      direction: prev.field === field && prev.direction === "asc" ? "desc" : "asc",
    }))
    console.log(`Sorting by ${field}`)
  }, [])

  const handleAddRow = useCallback(() => {
    const newRow: SpreadsheetRow = {
      id: Math.max(...data.map((r) => r.id)) + 1,
      task: "",
      date: new Date().toLocaleDateString("en-GB"),
      status: "Need to start",
      submitter: "",
      url: "",
      assignee: "",
      priority: "Medium",
      dueDate: "",
      value: "",
    }
    setData((prev) => [...prev, newRow])
    console.log("Added new row")
  }, [data])

  const handleToggleColumn = useCallback((column: string) => {
    setHiddenColumns((prev) => {
      const newSet = new Set(prev)
      if (newSet.has(column)) {
        newSet.delete(column)
      } else {
        newSet.add(column)
      }
      console.log(`Toggled column visibility: ${column}`)
      return newSet
    })
  }, [])

  const handleExport = useCallback(() => {
    console.log("Exporting data...")
    // In a real app, this would trigger a CSV/Excel download
  }, [])

  const handleImport = useCallback(() => {
    console.log("Importing data...")
    // In a real app, this would open a file picker
  }, [])

  const handleShare = useCallback(() => {
    console.log("Sharing spreadsheet...")
    // In a real app, this would open a share dialog
  }, [])

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <SpreadsheetHeader searchTerm={searchTerm} onSearchChange={setSearchTerm} />

      <SpreadsheetToolbar
        onToggleColumn={handleToggleColumn}
        onSort={() => console.log("Sort clicked")}
        onFilter={() => console.log("Filter clicked")}
        onImport={handleImport}
        onExport={handleExport}
        onShare={handleShare}
        onAddRow={handleAddRow}
      />

      <SpreadsheetFilters filters={filters} onFiltersChange={setFilters} />

      <div className="flex-1 p-4">
        <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
          <SpreadsheetTable
            ref={tableRef}
            data={data}
            searchTerm={searchTerm}
            filters={filters}
            sort={sort}
            hiddenColumns={hiddenColumns}
            selectedCell={selectedCell}
            onCellUpdate={handleCellUpdate}
            onSort={handleSort}
            onCellSelect={setSelectedCell}
          />
        </div>
      </div>

      <SpreadsheetTabs activeTab={activeTab} onTabChange={setActiveTab} />
    </div>
  )
}
