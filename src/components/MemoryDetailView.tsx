"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import type { Memory } from "@/data/memories";
import DragElements from "@/components/fancy/blocks/drag-elements";

// Portrait polaroid (2:3)
const PORT_CARD_W = 200;
const PORT_IMG_W = 180;
const PORT_IMG_H = 270; // 180 × 3/2 = exact 2:3

// Landscape polaroid (3:2)
const LAND_CARD_W = 260;
const LAND_IMG_W = 240;
const LAND_IMG_H = 160; // 240 / 1.5 = exact 3:2

const SCATTER_OFFSETS = [
  { x: 0,    y: -30,  rotate: 0  },
  { x: -215, y: -50,  rotate: -7 },
  { x: 202,  y: -20,  rotate: 5  },
  { x: -100, y:  28,  rotate: -3 },
  { x:  118, y:  40,  rotate: 8  },
  { x: -258, y:  48,  rotate: -11},
];

interface MemoryDetailViewProps {
  memory: Memory;
  onClose: () => void;
}

export default function MemoryDetailView({ memory, onClose }: MemoryDetailViewProps) {
  const [closing, setClosing] = useState(false);

  const handleClose = () => {
    setClosing(true);
    onClose();
  };

  const [initialPositions] = useState(() => {
    const vw = typeof window !== "undefined" ? window.innerWidth : 1440;
    const vh = typeof window !== "undefined" ? window.innerHeight : 900;
    const areaH = Math.max(vh - 90, 600);
    // Use portrait dims as anchor (larger card = safer center estimate)
    const centerX = vw / 2 - PORT_CARD_W / 2;
    const centerY = areaH / 2 - (10 + PORT_IMG_H + 34) / 2;
    return SCATTER_OFFSETS.map(({ x, y, rotate }) => ({
      x: centerX + x,
      y: centerY + y,
      rotate,
    }));
  });

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setClosing(true);
        onClose();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  return (
    <motion.div
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
        pointerEvents: closing ? "none" : "auto",
      }}
    >
      {/* Close button */}
      <button
        onClick={handleClose}
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
          paddingBottom: 4,
          flexShrink: 0,
          fontFamily: "var(--font-lora), Georgia, serif",
          fontSize: 16,
          fontWeight: 600,
          color: "var(--text-title)",
          letterSpacing: "0.04em",
          zIndex: 111,
          position: "relative",
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

      {/* Draggable polaroid stack */}
      <div style={{ flex: 1, position: "relative", minHeight: 0 }}>
        <DragElements
          initialPositions={initialPositions}
          dragMomentum={true}
          dragTransition={{ bounceStiffness: 140, bounceDamping: 18 }}
          dragElastic={0.08}
          selectedOnTop={true}
          className=""
        >
          {memory.images.map((img, i) => (
            <PolaroidCard
              key={i}
              src={img.src}
              landscape={img.landscape}
              title={memory.title}
              date={memory.date}
              animDelay={i * 0.06}
            />
          ))}
        </DragElements>
      </div>
    </motion.div>
  );
}

function PolaroidCard({
  src,
  landscape,
  title,
  date,
  animDelay,
}: {
  src: string;
  landscape?: boolean;
  title: string;
  date: string;
  animDelay: number;
}) {
  const cardW = landscape ? LAND_CARD_W : PORT_CARD_W;
  const imgW = landscape ? LAND_IMG_W : PORT_IMG_W;
  const imgH = landscape ? LAND_IMG_H : PORT_IMG_H;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.85 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: animDelay, duration: 0.3, ease: "easeOut" }}
      style={{
        width: cardW,
        backgroundColor: "#ffffff",
        boxShadow: "0 4px 20px rgba(0,0,0,0.13), 0 1px 4px rgba(0,0,0,0.08)",
        padding: "10px 10px 0 10px",
        willChange: "transform",
        touchAction: "none",
      }}
    >
      <Image
        src={src}
        alt={title}
        width={imgW}
        height={imgH}
        style={{
          display: "block",
          width: "100%",
          height: imgH,
        }}
        draggable={false}
        unoptimized={src.startsWith("https://picsum")}
      />
      <div style={{ padding: "10px 4px 14px" }}>
        <div
          style={{
            fontFamily: "var(--font-geist-mono), monospace",
            fontSize: 11,
            color: "#6b6560",
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
