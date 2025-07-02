"use client"

import { useState, useCallback, useMemo, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Search,
  Download,
  Upload,
  Share,
  Plus,
  Filter,
  ArrowUpDown,
  Eye,
  EyeOff,
  ChevronDown,
  ArrowUp,
  ArrowDown,
  X,
} from "lucide-react"

interface SpreadsheetRow {
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

interface SortConfig {
  key: keyof SpreadsheetRow | null
  direction: "asc" | "desc" | null
}

interface FilterConfig {
  status: string[]
  priority: string[]
  assignee: string[]
}

const initialData: SpreadsheetRow[] = [
  {
    id: 1,
    task: "Launch social media campaign for product launch",
    date: "2024-11-15",
    status: "In-process",
    submitter: "Asha Patel",
    url: "https://www.ashapatel.com",
    assignee: "Sophie Choudhury",
    priority: "Medium",
    dueDate: "2024-11-20",
    value: 6200000,
  },
  {
    id: 2,
    task: "Update press kit for company redesign",
    date: "2024-10-28",
    status: "Need to start",
    submitter: "Irfan Khan",
    url: "https://www.irfankhan.com",
    assignee: "Rachel Thompson",
    priority: "High",
    dueDate: "2024-10-30",
    value: 3500000,
  },
  {
    id: 3,
    task: "Finalize user testing feedback for app update",
    date: "2024-12-05",
    status: "In-process",
    submitter: "Mark Johnson",
    url: "https://www.markjohnson.co",
    assignee: "Rachel Lee",
    priority: "Medium",
    dueDate: "2024-12-10",
    value: 4750000,
  },
  {
    id: 4,
    task: "Design new features for the website",
    date: "2025-01-10",
    status: "Complete",
    submitter: "Emily Green",
    url: "https://www.emilygreen.dev",
    assignee: "Tom Wright",
    priority: "Low",
    dueDate: "2025-01-15",
    value: 5800000,
  },
  {
    id: 5,
    task: "Prepare financial report for Q4",
    date: "2025-01-25",
    status: "Blocked",
    submitter: "Jessica Brown",
    url: "https://www.jessicabrown.finance",
    assignee: "Kevin Smith",
    priority: "Low",
    dueDate: "2025-01-30",
    value: 2800000,
  },
]

const statusConfig = {
  "In-process": { color: "bg-orange-100 text-orange-800 border-orange-200", dot: "bg-orange-500" },
  "Need to start": { color: "bg-blue-100 text-blue-800 border-blue-200", dot: "bg-blue-500" },
  Complete: { color: "bg-green-100 text-green-800 border-green-200", dot: "bg-green-500" },
  Blocked: { color: "bg-red-100 text-red-800 border-red-200", dot: "bg-red-500" },
}

const priorityConfig = {
  High: { color: "bg-red-50 text-red-700 border-red-200", dot: "bg-red-500" },
  Medium: { color: "bg-yellow-50 text-yellow-700 border-yellow-200", dot: "bg-yellow-500" },
  Low: { color: "bg-green-50 text-green-700 border-green-200", dot: "bg-green-500" },
}

const COLUMNS = [
  { key: "task", label: "Task", width: "w-80", resizable: true },
  { key: "date", label: "Date", width: "w-32", resizable: true },
  { key: "status", label: "Status", width: "w-36", resizable: true },
  { key: "submitter", label: "Submitter", width: "w-40", resizable: true },
  { key: "url", label: "URL", width: "w-48", resizable: true },
  { key: "assignee", label: "Assignee", width: "w-40", resizable: true },
  { key: "priority", label: "Priority", width: "w-28", resizable: true },
  { key: "dueDate", label: "Due Date", width: "w-32", resizable: true },
  { key: "value", label: "Value", width: "w-32", resizable: true },
] as const

export default function SpreadsheetApp() {
  const [data, setData] = useState<SpreadsheetRow[]>(initialData)
  const [searchTerm, setSearchTerm] = useState("")
  const [sortConfig, setSortConfig] = useState<SortConfig>({ key: null, direction: null })
  const [filterConfig, setFilterConfig] = useState<FilterConfig>({
    status: [],
    priority: [],
    assignee: [],
  })
  const [hiddenColumns, setHiddenColumns] = useState<Set<string>>(new Set())
  const [activeTab, setActiveTab] = useState("all-orders")
  const [selectedRows, setSelectedRows] = useState<Set<number>>(new Set())
  const [editingCell, setEditingCell] = useState<{ rowId: number; field: keyof SpreadsheetRow } | null>(null)
  const [showFilters, setShowFilters] = useState(false)
  const [focusedCell, setFocusedCell] = useState<{ rowIndex: number; colIndex: number } | null>(null)

  const inputRef = useRef<HTMLInputElement>(null)

  const filteredAndSortedData = useMemo(() => {
    const filtered = data.filter((row) => {
      const matchesSearch = Object.values(row).some((value) =>
        value.toString().toLowerCase().includes(searchTerm.toLowerCase()),
      )

      const matchesStatus = filterConfig.status.length === 0 || filterConfig.status.includes(row.status)

      const matchesPriority = filterConfig.priority.length === 0 || filterConfig.priority.includes(row.priority)

      const matchesAssignee = filterConfig.assignee.length === 0 || filterConfig.assignee.includes(row.assignee)

      return matchesSearch && matchesStatus && matchesPriority && matchesAssignee
    })

    if (sortConfig.key && sortConfig.direction) {
      filtered.sort((a, b) => {
        const aVal = a[sortConfig.key!]
        const bVal = b[sortConfig.key!]

        if (aVal < bVal) return sortConfig.direction === "asc" ? -1 : 1
        if (aVal > bVal) return sortConfig.direction === "asc" ? 1 : -1
        return 0
      })
    }

    return filtered
  }, [data, searchTerm, sortConfig, filterConfig])

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!focusedCell || editingCell) return

      const { rowIndex, colIndex } = focusedCell
      const visibleColumns = COLUMNS.filter((col) => !hiddenColumns.has(col.key))

      switch (e.key) {
        case "ArrowUp":
          e.preventDefault()
          setFocusedCell({
            rowIndex: Math.max(0, rowIndex - 1),
            colIndex,
          })
          break
        case "ArrowDown":
          e.preventDefault()
          setFocusedCell({
            rowIndex: Math.min(filteredAndSortedData.length - 1, rowIndex + 1),
            colIndex,
          })
          break
        case "ArrowLeft":
          e.preventDefault()
          setFocusedCell({
            rowIndex,
            colIndex: Math.max(0, colIndex - 1),
          })
          break
        case "ArrowRight":
          e.preventDefault()
          setFocusedCell({
            rowIndex,
            colIndex: Math.min(visibleColumns.length - 1, colIndex + 1),
          })
          break
        case "Enter":
          e.preventDefault()
          const column = visibleColumns[colIndex]
          const row = filteredAndSortedData[rowIndex]
          if (column && row) {
            setEditingCell({ rowId: row.id, field: column.key as keyof SpreadsheetRow })
          }
          break
        case "Escape":
          setFocusedCell(null)
          break
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [focusedCell, editingCell, hiddenColumns])

  const handleSort = useCallback((key: keyof SpreadsheetRow) => {
    console.log(`Sorting by ${key}`)
    setSortConfig((prev) => ({
      key,
      direction: prev.key === key && prev.direction === "asc" ? "desc" : "asc",
    }))
  }, [])

  const handleCellEdit = useCallback((rowId: number, field: keyof SpreadsheetRow, value: string | number) => {
    setData((prev) => prev.map((row) => (row.id === rowId ? { ...row, [field]: value } : row)))
    setEditingCell(null)
  }, [])

  const handleAddRow = useCallback(() => {
    console.log("Adding new row")
    const newId = Math.max(...data.map((r) => r.id)) + 1
    const newRow: SpreadsheetRow = {
      id: newId,
      task: "New Task",
      date: new Date().toISOString().split("T")[0],
      status: "Need to start",
      submitter: "",
      url: "",
      assignee: "",
      priority: "Medium",
      dueDate: "",
      value: 0,
    }
    setData((prev) => [...prev, newRow])
  }, [data])

  const toggleRowSelection = useCallback((rowId: number) => {
    setSelectedRows((prev) => {
      const newSet = new Set(prev)
      if (newSet.has(rowId)) {
        newSet.delete(rowId)
      } else {
        newSet.add(rowId)
      }
      return newSet
    })
  }, [])

  const formatValue = (value: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    })
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="flex items-center justify-between px-6 py-3">
          <div className="flex items-center space-x-3">
            <div className="flex items-center space-x-2">
              <div className="w-7 h-7 bg-emerald-500 rounded-md flex items-center justify-center">
                <span className="text-white text-sm font-semibold">S</span>
              </div>
              <span className="text-sm text-gray-600">Workspace</span>
              <ChevronDown className="w-4 h-4 text-gray-400" />
              <span className="text-sm text-gray-600">Folder 2</span>
              <ChevronDown className="w-4 h-4 text-gray-400" />
              <span className="text-sm font-medium text-gray-900">Spreadsheet 3</span>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <Input
                placeholder="Search within sheet"
                className="pl-10 w-64 h-9"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-7 h-7 bg-orange-500 rounded-full flex items-center justify-center relative">
                <span className="text-white text-xs font-medium">1</span>
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full flex items-center justify-center">
                  <span className="text-white text-xs">!</span>
                </div>
              </div>
              <div className="w-7 h-7 bg-purple-500 rounded-full flex items-center justify-center">
                <span className="text-white text-xs font-medium">J</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Toolbar */}
      <div className="bg-white border-b border-gray-200 px-6 py-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-1">
            <Button
              variant="ghost"
              size="sm"
              className="text-gray-600 hover:text-gray-900"
              onClick={() => console.log("Tool bar clicked")}
            >
              Tool bar
              <ChevronDown className="w-4 h-4 ml-1" />
            </Button>
            <div className="h-4 w-px bg-gray-300 mx-2" />
            <Button variant="ghost" size="sm" onClick={() => console.log("Hide fields clicked")}>
              <EyeOff className="w-4 h-4 mr-1" />
              Hide fields
            </Button>
            <Button variant="ghost" size="sm" onClick={() => console.log("Sort clicked")}>
              <ArrowUpDown className="w-4 h-4 mr-1" />
              Sort
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                console.log("Filter clicked")
                setShowFilters(!showFilters)
              }}
            >
              <Filter className="w-4 h-4 mr-1" />
              Filter
            </Button>
            <Button variant="ghost" size="sm" onClick={() => console.log("Cell view clicked")}>
              <Eye className="w-4 h-4 mr-1" />
              Cell view
            </Button>
          </div>
          <div className="flex items-center space-x-2">
            <Button variant="ghost" size="sm" onClick={() => console.log("Import clicked")}>
              <Upload className="w-4 h-4 mr-1" />
              Import
            </Button>
            <Button variant="ghost" size="sm" onClick={() => console.log("Export clicked")}>
              <Download className="w-4 h-4 mr-1" />
              Export
            </Button>
            <Button variant="ghost" size="sm" onClick={() => console.log("Share clicked")}>
              <Share className="w-4 h-4 mr-1" />
              Share
            </Button>
            <Button size="sm" onClick={handleAddRow} className="bg-blue-600 hover:bg-blue-700 text-white">
              <Plus className="w-4 h-4 mr-1" />
              New Action
            </Button>
          </div>
        </div>
      </div>

      {/* Filters Panel */}
      {showFilters && (
        <div className="bg-white border-b border-gray-200 px-6 py-3">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <span className="text-sm font-medium text-gray-700">Filters:</span>
              <Select>
                <SelectTrigger className="w-40 h-8">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="in-process">In-process</SelectItem>
                  <SelectItem value="need-to-start">Need to start</SelectItem>
                  <SelectItem value="complete">Complete</SelectItem>
                  <SelectItem value="blocked">Blocked</SelectItem>
                </SelectContent>
              </Select>
              <Select>
                <SelectTrigger className="w-40 h-8">
                  <SelectValue placeholder="Priority" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="high">High</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="low">Low</SelectItem>
                </SelectContent>
              </Select>
              <Button variant="ghost" size="sm" onClick={() => setShowFilters(false)}>
                <X className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="flex-1 p-6">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          {/* Action Bar */}
          <div className="bg-gradient-to-r from-blue-50 to-purple-50 px-6 py-3 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-6">
                <div className="flex items-center space-x-2">
                  <span className="text-sm font-medium text-gray-600">ABC</span>
                </div>
                <div className="flex items-center space-x-4">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-blue-600 hover:text-blue-800"
                    onClick={() => console.log("Answer a question clicked")}
                  >
                    Answer a question
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-orange-600 hover:text-orange-800"
                    onClick={() => console.log("Extract clicked")}
                  >
                    Extract
                  </Button>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <span className="text-sm text-gray-600">Our Data</span>
                <span className="text-sm text-gray-600">Our Value</span>
                <Button variant="ghost" size="sm" onClick={() => console.log("Add section clicked")}>
                  <Plus className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>

          {/* Spreadsheet */}
          <div className="overflow-auto" style={{ maxHeight: "70vh" }}>
            <table className="w-full">
              <thead className="bg-gray-50 sticky top-0">
                <tr>
                  <th className="w-12 px-3 py-3 text-left">
                    <Checkbox
                      checked={selectedRows.size === data.length && data.length > 0}
                      onCheckedChange={(checked) => {
                        if (checked) {
                          setSelectedRows(new Set(data.map((row) => row.id)))
                        } else {
                          setSelectedRows(new Set())
                        }
                      }}
                    />
                  </th>
                  <th className="w-12 px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    #
                  </th>
                  {COLUMNS.filter((col) => !hiddenColumns.has(col.key)).map((column) => (
                    <th
                      key={column.key}
                      className={`px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 ${column.width}`}
                      onClick={() => handleSort(column.key as keyof SpreadsheetRow)}
                    >
                      <div className="flex items-center space-x-1">
                        <span>{column.label}</span>
                        {sortConfig.key === column.key && (
                          <span className="ml-1">
                            {sortConfig.direction === "asc" ? (
                              <ArrowUp className="w-3 h-3" />
                            ) : (
                              <ArrowDown className="w-3 h-3" />
                            )}
                          </span>
                        )}
                        <ArrowUpDown className="w-3 h-3 opacity-50" />
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredAndSortedData.map((row, rowIndex) => (
                  <tr
                    key={row.id}
                    className={`hover:bg-gray-50 ${selectedRows.has(row.id) ? "bg-blue-50" : ""}`}
                    onClick={() => setFocusedCell({ rowIndex, colIndex: 0 })}
                  >
                    <td className="px-3 py-3">
                      <Checkbox checked={selectedRows.has(row.id)} onCheckedChange={() => toggleRowSelection(row.id)} />
                    </td>
                    <td className="px-3 py-3 text-sm text-gray-500">{rowIndex + 1}</td>
                    {COLUMNS.filter((col) => !hiddenColumns.has(col.key)).map((column, colIndex) => (
                      <td
                        key={`${row.id}-${column.key}`}
                        className={`px-4 py-3 text-sm ${
                          focusedCell?.rowIndex === rowIndex && focusedCell?.colIndex === colIndex
                            ? "ring-2 ring-blue-500 ring-inset"
                            : ""
                        }`}
                        onClick={(e) => {
                          e.stopPropagation()
                          setFocusedCell({ rowIndex, colIndex })
                        }}
                        onDoubleClick={() => {
                          setEditingCell({ rowId: row.id, field: column.key as keyof SpreadsheetRow })
                        }}
                      >
                        {editingCell?.rowId === row.id && editingCell?.field === column.key ? (
                          <Input
                            ref={inputRef}
                            defaultValue={row[column.key as keyof SpreadsheetRow]?.toString() || ""}
                            onBlur={(e) => handleCellEdit(row.id, column.key as keyof SpreadsheetRow, e.target.value)}
                            onKeyDown={(e) => {
                              if (e.key === "Enter") {
                                handleCellEdit(row.id, column.key as keyof SpreadsheetRow, e.currentTarget.value)
                              } else if (e.key === "Escape") {
                                setEditingCell(null)
                              }
                            }}
                            className="border-none p-0 h-auto text-sm focus:ring-0"
                            autoFocus
                          />
                        ) : (
                          <div className="flex items-center">
                            {column.key === "status" && (
                              <Badge className={`${statusConfig[row.status].color} border text-xs`}>
                                <div className={`w-2 h-2 rounded-full ${statusConfig[row.status].dot} mr-1`} />
                                {row.status}
                              </Badge>
                            )}
                            {column.key === "priority" && (
                              <Badge className={`${priorityConfig[row.priority].color} border text-xs`}>
                                <div className={`w-2 h-2 rounded-full ${priorityConfig[row.priority].dot} mr-1`} />
                                {row.priority}
                              </Badge>
                            )}
                            {column.key === "url" && (
                              <a
                                href={row.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-blue-600 hover:text-blue-800 underline truncate max-w-xs"
                              >
                                {row.url}
                              </a>
                            )}
                            {column.key === "value" && <span className="font-mono">{formatValue(row.value)}</span>}
                            {column.key === "date" && <span>{formatDate(row.date)}</span>}
                            {column.key === "dueDate" && row.dueDate && <span>{formatDate(row.dueDate)}</span>}
                            {!["status", "priority", "url", "value", "date", "dueDate"].includes(column.key) && (
                              <span className="truncate max-w-xs">
                                {row[column.key as keyof SpreadsheetRow]?.toString() || ""}
                              </span>
                            )}
                          </div>
                        )}
                      </td>
                    ))}
                  </tr>
                ))}
                {/* Empty rows for visual consistency */}
                {Array.from({ length: Math.max(0, 15 - filteredAndSortedData.length) }).map((_, index) => (
                  <tr key={`empty-${index}`} className="hover:bg-gray-50">
                    <td className="px-3 py-3">
                      <Checkbox disabled />
                    </td>
                    <td className="px-3 py-3 text-sm text-gray-400">{filteredAndSortedData.length + index + 1}</td>
                    {COLUMNS.filter((col) => !hiddenColumns.has(col.key)).map((column) => (
                      <td key={`empty-${index}-${column.key}`} className="px-4 py-3 h-12" />
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Bottom Tabs */}
      <div className="bg-white border-t border-gray-200">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="px-6">
          <TabsList className="bg-transparent border-none p-0 h-auto">
            <TabsTrigger
              value="all-orders"
              className="border-none bg-transparent data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-blue-500 rounded-none px-4 py-3 text-sm"
              onClick={() => console.log("All Orders tab clicked")}
            >
              All Orders
            </TabsTrigger>
            <TabsTrigger
              value="pending"
              className="border-none bg-transparent data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-blue-500 rounded-none px-4 py-3 text-sm"
              onClick={() => console.log("Pending tab clicked")}
            >
              Pending
            </TabsTrigger>
            <TabsTrigger
              value="completed"
              className="border-none bg-transparent data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-blue-500 rounded-none px-4 py-3 text-sm"
              onClick={() => console.log("Completed tab clicked")}
            >
              Completed
            </TabsTrigger>
            <Button variant="ghost" size="sm" className="ml-2" onClick={() => console.log("Add tab clicked")}>
              <Plus className="w-4 h-4" />
            </Button>
          </TabsList>
        </Tabs>
      </div>
    </div>
  )
}
