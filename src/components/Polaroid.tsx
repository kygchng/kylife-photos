'use client'

import { motion } from 'framer-motion'
import type { Memory } from '@/data/memories'

interface PolaroidProps {
  memory: Memory
  onClick: () => void
  isBlurred: boolean
  style?: React.CSSProperties
}

export default function Polaroid({ memory, onClick, isBlurred, style }: PolaroidProps) {
  return (
    <motion.div
      data-polaroid
      layoutId={memory.id}
      onClick={isBlurred ? undefined : onClick}
      // Use Framer Motion's decomposed transform to avoid conflicts with whileHover scale
      initial={{ rotate: memory.rotation, scale: 1 }}
      animate={{
        filter: isBlurred ? 'blur(3px)' : 'blur(0px)',
        opacity: isBlurred ? 0.4 : 1,
        scale: 1,
        rotate: memory.rotation,
      }}
      whileHover={
        isBlurred
          ? {}
          : {
              scale: 1.04,
              zIndex: 10,
              boxShadow: '0 8px 32px rgba(0,0,0,0.16), 0 2px 8px rgba(0,0,0,0.10)',
            }
      }
      transition={{ duration: 0.2, ease: 'easeOut' }}
      style={{
        position: 'absolute',
        left: memory.canvasX,
        top: memory.canvasY,
        width: 200,
        backgroundColor: 'var(--polaroid-white)',
        boxShadow: 'var(--polaroid-shadow)',
        padding: '10px 10px 0 10px',
        paddingBottom: 0,
        cursor: isBlurred ? 'default' : 'pointer',
        pointerEvents: isBlurred ? 'none' : 'auto',
        willChange: 'transform',
        ...style,
      }}
    >
      {/* Image area */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={memory.coverImage}
        alt={memory.title}
        style={{
          width: '100%',
          height: 220,
          objectFit: 'cover',
          display: 'block',
        }}
        draggable={false}
        loading="lazy"
      />
      {/* Caption footer */}
      <div
        style={{
          padding: '10px 4px 14px',
          fontFamily: 'var(--font-geist-mono), monospace',
          fontSize: 11,
          color: 'var(--text-caption)',
          lineHeight: 1.4,
          whiteSpace: 'nowrap',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
        }}
      >
        {memory.title}
        <div style={{ fontSize: 9, color: '#aaa', marginTop: 2 }}>{memory.date}</div>
      </div>
    </motion.div>
  )
}

/** Enlarged version used inside MemoryDetailView */
export function PolaroidLarge({
  memory,
  style,
}: {
  memory: Memory
  style?: React.CSSProperties
}) {
  return (
    <div
      style={{
        width: 280,
        backgroundColor: 'var(--polaroid-white)',
        boxShadow: 'var(--polaroid-shadow-hover)',
        padding: '12px 12px 0 12px',
        ...style,
      }}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={memory.coverImage}
        alt={memory.title}
        style={{ width: '100%', height: 340, objectFit: 'cover', display: 'block' }}
        draggable={false}
      />
      <div style={{ padding: '12px 4px 16px' }}>
        <div
          style={{
            fontFamily: 'var(--font-lora), Georgia, serif',
            fontSize: 15,
            color: 'var(--text-title)',
            fontWeight: 600,
          }}
        >
          {memory.title}
        </div>
        <div
          style={{
            fontFamily: 'var(--font-geist-mono), monospace',
            fontSize: 10,
            color: '#aaa',
            marginTop: 3,
          }}
        >
          {memory.date}
        </div>
      </div>
    </div>
  )
}
