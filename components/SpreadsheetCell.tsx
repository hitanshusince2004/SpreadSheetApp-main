"use client"

import type React from "react"

import { useRef, useEffect } from "react"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"

interface SpreadsheetCellProps {
  value: any
  isEditing: boolean
  onEdit: (value: string) => void
  onStartEdit: () => void
  onStopEdit: () => void
  type: "text" | "status" | "priority" | "url" | "currency" | "date"
  isFocused?: boolean
}

export const SpreadsheetCell = ({
  value,
  isEditing,
  onEdit,
  onStartEdit,
  onStopEdit,
  type,
  isFocused,
}: SpreadsheetCellProps) => {
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus()
      inputRef.current.select()
    }
  }, [isEditing])

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      onEdit(e.currentTarget.value)
    } else if (e.key === "Escape") {
      onStopEdit()
    }
  }

  const renderValue = () => {
    switch (type) {
      case "status":
        return (
          <Badge variant="secondary" className="text-xs">
            {value}
          </Badge>
        )
      case "priority":
        return (
          <Badge variant="outline" className="text-xs">
            {value}
          </Badge>
        )
      case "url":
        return (
          <a
            href={value}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 hover:text-blue-800 underline truncate"
          >
            {value}
          </a>
        )
      case "currency":
        return (
          <span className="font-mono">
            {new Intl.NumberFormat("en-US", {
              style: "currency",
              currency: "USD",
            }).format(value)}
          </span>
        )
      case "date":
        return new Date(value).toLocaleDateString()
      default:
        return value?.toString() || ""
    }
  }

  if (isEditing) {
    return (
      <Input
        ref={inputRef}
        defaultValue={value?.toString() || ""}
        onBlur={(e) => onEdit(e.target.value)}
        onKeyDown={handleKeyDown}
        className="border-none p-0 h-auto text-sm focus:ring-0"
      />
    )
  }

  return (
    <div
      className={`cursor-pointer p-1 rounded ${isFocused ? "ring-2 ring-blue-500" : ""}`}
      onDoubleClick={onStartEdit}
    >
      {renderValue()}
    </div>
  )
}
