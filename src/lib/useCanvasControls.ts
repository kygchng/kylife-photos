'use client'

import { useReducer, useRef, useCallback, useEffect } from 'react'

const CELL_W = 290
const CELL_H = 312

interface CanvasState {
  panX: number
  panY: number
}

type CanvasAction =
  | { type: 'PAN'; dx: number; dy: number }
  | { type: 'RESET'; panX: number; panY: number }

function canvasReducer(state: CanvasState, action: CanvasAction): CanvasState {
  switch (action.type) {
    case 'PAN':
      return { panX: state.panX + action.dx, panY: state.panY + action.dy }
    case 'RESET':
      return { panX: action.panX, panY: action.panY }
  }
}

function centerOnCell0(dispatch: (a: CanvasAction) => void) {
  dispatch({
    type: 'RESET',
    panX: window.innerWidth / 2 - CELL_W / 2,
    panY: window.innerHeight / 2 - CELL_H / 2,
  })
}

export function useCanvasControls(isDetailOpen: boolean) {
  const [state, dispatch] = useReducer(canvasReducer, { panX: 0, panY: 0 })
  const isDragging = useRef(false)
  const lastPos = useRef({ x: 0, y: 0 })
  const canvasRef = useRef<HTMLDivElement>(null)

  // Center cell (0,0) on mount
  useEffect(() => {
    centerOnCell0(dispatch)
  }, [])

  // Wheel → pan (no zoom)
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const handleWheel = (e: WheelEvent) => {
      e.preventDefault()
      if (isDetailOpen) return

      // Normalize delta across deltaMode values
      const LINE = 28
      const PAGE = window.innerHeight || 800
      let dx = e.deltaX
      let dy = e.deltaY
      if (e.deltaMode === 1) { dx *= LINE; dy *= LINE }
      else if (e.deltaMode === 2) { dx *= PAGE; dy *= PAGE }

      dispatch({ type: 'PAN', dx: -dx, dy: -dy })
    }

    canvas.addEventListener('wheel', handleWheel, { passive: false })
    return () => canvas.removeEventListener('wheel', handleWheel)
  }, [isDetailOpen])

  const onPointerDown = useCallback(
    (e: React.PointerEvent<HTMLDivElement>) => {
      if (isDetailOpen) return
      if ((e.target as HTMLElement).closest('[data-polaroid]')) return
      isDragging.current = true
      lastPos.current = { x: e.clientX, y: e.clientY }
      e.currentTarget.setPointerCapture(e.pointerId)
    },
    [isDetailOpen],
  )

  const onPointerMove = useCallback(
    (e: React.PointerEvent<HTMLDivElement>) => {
      if (!isDragging.current || isDetailOpen) return
      const dx = e.clientX - lastPos.current.x
      const dy = e.clientY - lastPos.current.y
      lastPos.current = { x: e.clientX, y: e.clientY }
      dispatch({ type: 'PAN', dx, dy })
    },
    [isDetailOpen],
  )

  const onPointerUp = useCallback(() => {
    isDragging.current = false
  }, [])

  const resetView = useCallback(() => centerOnCell0(dispatch), [])

  return {
    ...state,
    canvasRef,
    panHandlers: { onPointerDown, onPointerMove, onPointerUp },
    resetView,
  }
}
