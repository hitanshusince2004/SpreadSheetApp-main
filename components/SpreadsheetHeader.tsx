"use client"

import { Search, ChevronDown } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

interface SpreadsheetHeaderProps {
  searchTerm: string
  onSearchChange: (value: string) => void
}

export function SpreadsheetHeader({ searchTerm, onSearchChange }: SpreadsheetHeaderProps) {
  return (
    <div className="bg-white border-b">
      <div className="flex items-center justify-between px-4 py-2">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <div className="w-6 h-6 bg-green-500 rounded flex items-center justify-center">
              <span className="text-white text-xs font-bold">S</span>
            </div>
            <span className="text-sm text-gray-600">Workspace</span>
            <ChevronDown className="w-4 h-4 text-gray-400" />
            <span className="text-sm text-gray-600">Folder 2</span>
            <ChevronDown className="w-4 h-4 text-gray-400" />
            <span className="text-sm font-medium">Spreadsheet 3</span>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <Input
              placeholder="Search within sheet"
              className="pl-10 w-64 h-8"
              value={searchTerm}
              onChange={(e) => onSearchChange(e.target.value)}
            />
          </div>
          <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
            <div className="w-6 h-6 bg-orange-500 rounded-full flex items-center justify-center">
              <span className="text-white text-xs font-medium">1</span>
            </div>
          </Button>
          <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
            <div className="w-6 h-6 bg-purple-500 rounded-full flex items-center justify-center">
              <span className="text-white text-xs font-medium">J</span>
            </div>
          </Button>
        </div>
      </div>
    </div>
  )
}
