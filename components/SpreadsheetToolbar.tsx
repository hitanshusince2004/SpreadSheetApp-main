"use client"

import { Button } from "@/components/ui/button"
import { EyeOff, ArrowUpDown, Filter, Eye, Upload, Download, Share, Plus } from "lucide-react"

interface SpreadsheetToolbarProps {
  onToggleColumn: (column: string) => void
  onSort: () => void
  onFilter: () => void
  onImport: () => void
  onExport: () => void
  onShare: () => void
  onAddRow: () => void
}

export function SpreadsheetToolbar({
  onToggleColumn,
  onSort,
  onFilter,
  onImport,
  onExport,
  onShare,
  onAddRow,
}: SpreadsheetToolbarProps) {
  return (
    <div className="bg-white border-b px-4 py-2">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <span className="text-sm font-medium text-gray-700">Tool bar</span>
          <Button variant="ghost" size="sm" onClick={() => onToggleColumn("example")}>
            <EyeOff className="w-4 h-4 mr-1" />
            Hide fields
          </Button>
          <Button variant="ghost" size="sm" onClick={onSort}>
            <ArrowUpDown className="w-4 h-4 mr-1" />
            Sort
          </Button>
          <Button variant="ghost" size="sm" onClick={onFilter}>
            <Filter className="w-4 h-4 mr-1" />
            Filter
          </Button>
          <Button variant="ghost" size="sm">
            <Eye className="w-4 h-4 mr-1" />
            Cell view
          </Button>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="ghost" size="sm" onClick={onImport}>
            <Upload className="w-4 h-4 mr-1" />
            Import
          </Button>
          <Button variant="ghost" size="sm" onClick={onExport}>
            <Download className="w-4 h-4 mr-1" />
            Export
          </Button>
          <Button variant="ghost" size="sm" onClick={onShare}>
            <Share className="w-4 h-4 mr-1" />
            Share
          </Button>
          <Button size="sm" onClick={onAddRow} className="bg-green-600 hover:bg-green-700">
            <Plus className="w-4 h-4 mr-1" />
            New Action
          </Button>
        </div>
      </div>
    </div>
  )
}
