"use client";

import { useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { Memory } from "@/data/memories";
import MarqueeStrip from "./MarqueeStrip";

const CARD_POSITIONS = [
  { x: 0, y: -30, rotation: 0, zIndex: 6 },
  { x: -190, y: -50, rotation: -8, zIndex: 5 },
  { x: 175, y: -20, rotation: 6, zIndex: 4 },
  { x: -90, y: 30, rotation: -3, zIndex: 3 },
  { x: 110, y: 40, rotation: 7, zIndex: 2 },
  { x: -230, y: 40, rotation: -12, zIndex: 1 },
];

interface MemoryDetailViewProps {
  memory: Memory;
  onClose: () => void;
}

export default function MemoryDetailView({
  memory,
  onClose,
}: MemoryDetailViewProps) {
  const overlayRef = useRef<HTMLDivElement>(null);

  // Escape key to close
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [onClose]);

  // Click outside (on the overlay background) to close
  const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === overlayRef.current) onClose();
  };

  return (
    <motion.div
      ref={overlayRef}
      onClick={handleOverlayClick}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.25 }}
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 100,
        backgroundColor: "var(--overlay-bg)",
        backdropFilter: "blur(10px)",
        WebkitBackdropFilter: "blur(10px)",
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* Close button */}
      <button
        onClick={onClose}
        style={{
          position: "absolute",
          top: 20,
          right: 24,
          background: "none",
          border: "none",
          fontSize: 28,
          color: "#888",
          cursor: "pointer",
          lineHeight: 1,
          zIndex: 110,
          padding: "4px 8px",
          fontFamily: "var(--font-geist-mono), monospace",
        }}
        aria-label="Close"
      >
        ×
      </button>

      {/* Memory title */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1, duration: 0.3 }}
        style={{
          textAlign: "center",
          paddingTop: 28,
          paddingBottom: 0,
          fontFamily: "var(--font-lora), Georgia, serif",
          fontSize: 16,
          fontWeight: 600,
          color: "var(--text-title)",
          letterSpacing: "0.04em",
        }}
      >
        {memory.title}
        <div
          style={{
            fontFamily: "var(--font-geist-mono), monospace",
            fontWeight: 400,
            fontSize: 11,
            color: "#aaa",
            marginTop: 3,
            letterSpacing: "0.06em",
          }}
        >
          {memory.date} · {memory.location}
        </div>
      </motion.div>

      {/* Draggable polaroid scatter area */}
      <div
        style={{
          flex: 1,
          position: "relative",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          minHeight: 0,
        }}
      >
        {memory.images.map((src, i) => {
          const pos = CARD_POSITIONS[i % CARD_POSITIONS.length];
          return (
            <DraggablePolaroidCard
              key={i}
              src={src}
              title={memory.title}
              date={memory.date}
              initialX={pos.x}
              initialY={pos.y}
              rotation={pos.rotation}
              zIndex={pos.zIndex}
              animDelay={i * 0.05}
            />
          );
        })}
      </div>

      {/* Marquee strip at the bottom */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.35 }}
        style={{
          flexShrink: 0,
          paddingBottom: 0,
          borderTop: "1px solid rgba(0,0,0,0.06)",
        }}
      >
        <div
          style={{
            fontFamily: "var(--font-geist-mono), monospace",
            fontSize: 9,
            color: "#bbb",
            letterSpacing: "0.12em",
            textTransform: "uppercase",
            padding: "8px 16px 4px",
          }}
        >
          full roll
        </div>
        <MarqueeStrip memory={memory} />
      </motion.div>
    </motion.div>
  );
}

interface DraggablePolaroidCardProps {
  src: string;
  title: string;
  date: string;
  initialX: number;
  initialY: number;
  rotation: number;
  zIndex: number;
  animDelay: number;
}

function DraggablePolaroidCard({
  src,
  title,
  date,
  initialX,
  initialY,
  rotation,
  zIndex,
  animDelay,
}: DraggablePolaroidCardProps) {
  return (
    <motion.div
      drag
      dragMomentum={false}
      initial={{
        opacity: 0,
        scale: 0.85,
        x: initialX,
        y: initialY,
        rotate: rotation,
      }}
      animate={{
        opacity: 1,
        scale: 1,
        x: initialX,
        y: initialY,
        rotate: rotation,
      }}
      whileDrag={{ scale: 1.06, zIndex: 200, cursor: "grabbing" }}
      transition={{ delay: animDelay, duration: 0.3, ease: "easeOut" }}
      style={{
        position: "absolute",
        width: 200,
        backgroundColor: "var(--polaroid-white)",
        boxShadow: "var(--polaroid-shadow)",
        padding: "10px 10px 0 10px",
        cursor: "grab",
        zIndex,
        willChange: "transform",
        touchAction: "none",
      }}
      whileHover={{
        boxShadow: "var(--polaroid-shadow-hover)",
        zIndex: zIndex + 10,
      }}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={src}
        alt={title}
        style={{
          width: "100%",
          height: 220,
          objectFit: "cover",
          display: "block",
        }}
        draggable={false}
      />
      <div style={{ padding: "10px 4px 14px" }}>
        <div
          style={{
            fontFamily: "var(--font-geist-mono), monospace",
            fontSize: 11,
            color: "var(--text-caption)",
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
          }}
        >
          {title}
        </div>
        <div
          style={{
            fontFamily: "var(--font-geist-mono), monospace",
            fontSize: 9,
            color: "#aaa",
            marginTop: 2,
          }}
        >
          {date}
        </div>
      </div>
    </motion.div>
  );
}
