"use client";

import { useState, useMemo, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { memories } from "@/data/memories";
import { useCanvasControls } from "@/lib/useCanvasControls";
import MemoryDetailView from "./MemoryDetailView";
import type { Memory } from "@/data/memories";

// Target: ~5 columns × ~3 rows visible at 1440×900 (no zoom ever)
export const CELL_W = 290;
export const CELL_H = 312;

const PADDING_SIDE = 8;
const PADDING_TOP = 8;
const FOOTER_H = 36;

// Portrait card
const PORT_IMG_W = 160; // inner image width
const PORT_IMG_H = 204;
const PORT_CARD_W = PORT_IMG_W + PADDING_SIDE * 2; // 176
const PORT_CARD_H = PADDING_TOP + PORT_IMG_H + FOOTER_H; // 248

// Landscape card
const LAND_IMG_W = 232; // inner image width
const LAND_IMG_H = 150;
const LAND_CARD_W = LAND_IMG_W + PADDING_SIDE * 2; // 248
const LAND_CARD_H = PADDING_TOP + LAND_IMG_H + FOOTER_H; // 194

// Centering margins per orientation
const PORT_MX = (CELL_W - PORT_CARD_W) / 2; // 57px
const PORT_MY = (CELL_H - PORT_CARD_H) / 2; // 32px
const LAND_MX = (CELL_W - LAND_CARD_W) / 2; // 21px
const LAND_MY = (CELL_H - LAND_CARD_H) / 2; // 59px

const BUFFER = 2;
const TILE_W = 5;
const TILE_H = 3;

function isLandscapeCell(col: number, row: number): boolean {
  if (col === 0 && row === 0) return false; // kylife cell is always portrait-shaped
  const val = col * 127 + row * 311 + col * row * 23;
  return ((val % 4) + 4) % 4 === 1;
}

function getMemoryForCell(col: number, row: number): Memory | null {
  if (col === 0 && row === 0) return null;
  const tileCol = ((col % TILE_W) + TILE_W) % TILE_W;
  const tileRow = ((row % TILE_H) + TILE_H) % TILE_H;
  return memories[(tileRow * TILE_W + tileCol) % memories.length];
}

function GridCard({
  memory,
  x,
  y,
  landscape,
  onClick,
}: {
  memory: Memory;
  x: number;
  y: number;
  landscape: boolean;
  onClick: () => void;
}) {
  const cardW = landscape ? LAND_CARD_W : PORT_CARD_W;
  const imgH = landscape ? LAND_IMG_H : PORT_IMG_H;

  return (
    <motion.div
      data-polaroid
      onClick={onClick}
      whileHover={{
        scale: 1.045,
        zIndex: 10,
        boxShadow: "0 8px 32px rgba(0,0,0,0.16), 0 2px 8px rgba(0,0,0,0.10)",
      }}
      transition={{ duration: 0.16, ease: "easeOut" }}
      style={{
        position: "absolute",
        left: x,
        top: y,
        width: cardW,
        backgroundColor: "#ffffff",
        boxShadow: "0 3px 14px rgba(0,0,0,0.09), 0 1px 3px rgba(0,0,0,0.06)",
        paddingTop: PADDING_TOP,
        paddingLeft: PADDING_SIDE,
        paddingRight: PADDING_SIDE,
        cursor: "pointer",
        willChange: "transform",
      }}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={memory.coverImage}
        alt={memory.title}
        width={cardW - PADDING_SIDE * 2}
        height={imgH}
        style={{
          display: "block",
          width: "100%",
          height: imgH,
          objectFit: "cover",
        }}
        draggable={false}
        loading="lazy"
      />
      <div
        style={{
          height: FOOTER_H,
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          paddingLeft: 2,
          paddingRight: 2,
        }}
      >
        <div
          style={{
            fontFamily: "var(--font-geist-mono), monospace",
            fontSize: 9,
            color: "#6b6560",
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
          }}
        >
          {memory.title}
        </div>
        <div
          style={{
            fontFamily: "var(--font-geist-mono), monospace",
            fontSize: 7.5,
            color: "#bbb",
            marginTop: 2,
          }}
        >
          {memory.date}
        </div>
      </div>
    </motion.div>
  );
}

function KylifeCell({ x, y }: { x: number; y: number }) {
  return (
    <div
      style={{
        position: "absolute",
        left: x,
        top: y,
        width: CELL_W,
        height: CELL_H,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        pointerEvents: "none",
        userSelect: "none",
        gap: 6,
      }}
    >
      <div
        style={{
          fontFamily: "var(--font-handwritten), Caveat, cursive",
          fontSize: 58,
          fontWeight: 700,
          color: "#2c5ccd",
          letterSpacing: "-0.02em",
          lineHeight: 1,
        }}
      >
        kylife
      </div>
      <div
        style={{
          fontFamily: "var(--font-handwritten), Caveat, cursive",
          fontSize: 14,
          fontWeight: 400,
          color: "#2c5ccd",
          opacity: 0.7,
          textAlign: "center",
          maxWidth: 210,
          lineHeight: 1.35,
        }}
      >
        like kylie&apos;s life. haha get it
      </div>
    </div>
  );
}

export default function DevelopedCanvas() {
  const [selectedMemory, setSelectedMemory] = useState<Memory | null>(null);
  // Lazy initializer reads real dimensions on the client; SSR falls back to 1440×900.
  // This avoids a synchronous setState inside the effect body.
  const [vpSize, setVpSize] = useState<{ w: number; h: number }>(() =>
    typeof window !== "undefined"
      ? { w: window.innerWidth, h: window.innerHeight }
      : { w: 1440, h: 900 },
  );

  const { panX, panY, canvasRef, panHandlers } = useCanvasControls(
    selectedMemory !== null,
  );

  useEffect(() => {
    const onResize = () =>
      setVpSize({ w: window.innerWidth, h: window.innerHeight });
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  const visibleCells = useMemo(() => {
    const worldLeft = -panX;
    const worldTop = -panY;
    const worldRight = worldLeft + vpSize.w;
    const worldBottom = worldTop + vpSize.h;

    const colStart = Math.floor(worldLeft / CELL_W) - BUFFER;
    const colEnd = Math.ceil(worldRight / CELL_W) + BUFFER;
    const rowStart = Math.floor(worldTop / CELL_H) - BUFFER;
    const rowEnd = Math.ceil(worldBottom / CELL_H) + BUFFER;

    const cells: { col: number; row: number }[] = [];
    for (let row = rowStart; row <= rowEnd; row++) {
      for (let col = colStart; col <= colEnd; col++) {
        cells.push({ col, row });
      }
    }
    return cells;
  }, [panX, panY, vpSize]);

  return (
    <>
      <div
        style={{
          position: "fixed",
          top: 20,
          left: 24,
          zIndex: 50,
          fontFamily: "var(--font-lora), Georgia, serif",
          fontSize: 13,
          letterSpacing: "0.08em",
          color: "#bbb",
          pointerEvents: "none",
          userSelect: "none",
        }}
      >
        developed.
      </div>

      <div
        ref={canvasRef}
        className="canvas-root"
        {...panHandlers}
        onPointerDown={(e) => {
          if (!selectedMemory)
            (e.currentTarget as HTMLDivElement).style.cursor = "grabbing";
          panHandlers.onPointerDown(e);
        }}
        onPointerUp={(e) => {
          (e.currentTarget as HTMLDivElement).style.cursor = selectedMemory
            ? "default"
            : "grab";
          panHandlers.onPointerUp();
        }}
        style={{
          position: "fixed",
          inset: 0,
          overflow: "hidden",
          backgroundColor: "var(--canvas-bg)",
          backgroundImage:
            "radial-gradient(circle, var(--canvas-dot) 1px, transparent 1px)",
          backgroundSize: "24px 24px",
          cursor: selectedMemory ? "default" : "grab",
        }}
      >
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            transform: `translate(${panX}px, ${panY}px)`,
            opacity: selectedMemory ? 0.2 : 1,
            filter: selectedMemory ? "blur(2px)" : "none",
            transition: "opacity 0.3s ease, filter 0.3s ease",
            willChange: "transform",
          }}
        >
          {visibleCells.map(({ col, row }) => {
            const memory = getMemoryForCell(col, row);
            const landscape = isLandscapeCell(col, row);
            const mx = landscape ? LAND_MX : PORT_MX;
            const my = landscape ? LAND_MY : PORT_MY;

            if (!memory) {
              return (
                <KylifeCell
                  key={`${col}-${row}`}
                  x={col * CELL_W}
                  y={row * CELL_H}
                />
              );
            }

            return (
              <GridCard
                key={`${col}-${row}`}
                memory={memory}
                x={col * CELL_W + mx}
                y={row * CELL_H + my}
                landscape={landscape}
                onClick={() => setSelectedMemory(memory)}
              />
            );
          })}
        </div>
      </div>

      <AnimatePresence>
        {selectedMemory && (
          <MemoryDetailView
            key={selectedMemory.id}
            memory={selectedMemory}
            onClose={() => setSelectedMemory(null)}
          />
        )}
      </AnimatePresence>
    </>
  );
}
