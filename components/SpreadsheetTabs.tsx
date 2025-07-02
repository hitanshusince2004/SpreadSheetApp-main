"use client"

import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"

interface SpreadsheetTabsProps {
  activeTab: string
  onTabChange: (tab: string) => void
}

export function SpreadsheetTabs({ activeTab, onTabChange }: SpreadsheetTabsProps) {
  const handleTabChange = (tab: string) => {
    onTabChange(tab)
    console.log(`Switched to tab: ${tab}`)
  }

  const handleAddTab = () => {
    console.log("Add new tab clicked")
  }

  return (
    <div className="bg-white border-t px-4">
      <div className="flex items-center">
        <Tabs value={activeTab} onValueChange={handleTabChange}>
          <TabsList className="bg-transparent border-none p-0 h-auto">
            <TabsTrigger
              value="all-orders"
              className="border-none bg-transparent data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-blue-500 rounded-none px-4 py-2 text-sm"
            >
              All Orders
            </TabsTrigger>
            <TabsTrigger
              value="pending"
              className="border-none bg-transparent data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-blue-500 rounded-none px-4 py-2 text-sm"
            >
              Pending
            </TabsTrigger>
            <TabsTrigger
              value="completed"
              className="border-none bg-transparent data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-blue-500 rounded-none px-4 py-2 text-sm"
            >
              Completed
            </TabsTrigger>
          </TabsList>
        </Tabs>
        <Button variant="ghost" size="sm" className="ml-2 h-8 w-8 p-0" onClick={handleAddTab}>
          <Plus className="w-4 h-4" />
        </Button>
      </div>
    </div>
  )
}
