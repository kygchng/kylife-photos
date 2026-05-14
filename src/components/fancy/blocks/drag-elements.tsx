"use client"

import React, { useEffect, useRef, useState } from "react"
import { InertiaOptions, motion } from "motion/react"

type InitialPosition = {
  x?: number
  y?: number
  rotate?: number
}

type DragElementsProps = {
  children: React.ReactNode
  dragElastic?:
    | number
    | { top?: number; left?: number; right?: number; bottom?: number }
    | boolean
  dragConstraints?:
    | { top?: number; left?: number; right?: number; bottom?: number }
    | React.RefObject<Element | null>
  dragMomentum?: boolean
  dragTransition?: InertiaOptions
  dragPropagation?: boolean
  selectedOnTop?: boolean
  initialPositions?: InitialPosition[]
  className?: string
}

const DragElements: React.FC<DragElementsProps> = ({
  children,
  dragElastic = 0.5,
  dragConstraints,
  dragMomentum = true,
  dragTransition = { bounceStiffness: 200, bounceDamping: 300 },
  dragPropagation = true,
  selectedOnTop = true,
  initialPositions,
  className,
}) => {
  const constraintsRef = useRef<HTMLDivElement>(null)
  const [zIndices, setZIndices] = useState<number[]>([])

  const [isDragging, setIsDragging] = useState(false)

  useEffect(() => {
    setZIndices(
      Array.from({ length: React.Children.count(children) }, (_, i) => i)
    )
  }, [children])

  const bringToFront = (index: number) => {
    if (selectedOnTop) {
      setZIndices((prevIndices) => {
        const newIndices = [...prevIndices]
        const currentIndex = newIndices.indexOf(index)
        newIndices.splice(currentIndex, 1)
        newIndices.push(index)
        return newIndices
      })
    }
  }

  return (
    <div ref={constraintsRef} className={`relative w-full h-full ${className}`}>
      {React.Children.map(children, (child, index) => {
        const pos = initialPositions?.[index]
        return (
          <motion.div
            key={index}
            drag
            dragElastic={dragElastic}
            dragConstraints={dragConstraints || constraintsRef}
            dragMomentum={dragMomentum}
            dragTransition={dragTransition}
            dragPropagation={dragPropagation}
            initial={
              pos
                ? { x: pos.x ?? 0, y: pos.y ?? 0, rotate: pos.rotate ?? 0 }
                : undefined
            }
            style={{
              zIndex: zIndices.length ? zIndices.indexOf(index) : index,
              cursor: isDragging ? "grabbing" : "grab",
            }}
            onDragStart={() => {
              bringToFront(index)
              setIsDragging(true)
            }}
            onDragEnd={() => setIsDragging(false)}
            whileDrag={{ cursor: "grabbing" }}
            className={"absolute"}
          >
            {child}
          </motion.div>
        )
      })}
    </div>
  )
}

export default DragElements
