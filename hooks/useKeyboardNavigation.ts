"use client"

import { useEffect, useCallback } from "react"
import type { CellPosition } from "../types/spreadsheet"

interface UseKeyboardNavigationProps {
  focusedCell: CellPosition | null
  setFocusedCell: (position: CellPosition | null) => void
  maxRows: number
  maxCols: number
  onEnterEdit?: (position: CellPosition) => void
  disabled?: boolean
}

export const useKeyboardNavigation = ({
  focusedCell,
  setFocusedCell,
  maxRows,
  maxCols,
  onEnterEdit,
  disabled = false,
}: UseKeyboardNavigationProps) => {
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (disabled || !focusedCell) return

      const { rowIndex, colIndex } = focusedCell

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
            rowIndex: Math.min(maxRows - 1, rowIndex + 1),
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
            colIndex: Math.min(maxCols - 1, colIndex + 1),
          })
          break
        case "Enter":
          e.preventDefault()
          if (onEnterEdit) {
            onEnterEdit(focusedCell)
          }
          break
        case "Escape":
          setFocusedCell(null)
          break
      }
    },
    [focusedCell, setFocusedCell, maxRows, maxCols, onEnterEdit, disabled],
  )

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [handleKeyDown])
}
