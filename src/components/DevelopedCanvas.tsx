"use client";

import { useState, useMemo, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { memories } from "@/data/memories";
import { useCanvasControls } from "@/lib/useCanvasControls";
import MemoryDetailView from "./MemoryDetailView";
import type { Memory } from "@/data/memories";

// target:  5 columns × 3 rows visible at 1440×900
export const CELL_W = 290;
export const CELL_H = 312;

// polaroid card dimensions
const CARD_W = 174;
const PADDING_TOP = 8;
const IMG_H = 202;
const FOOTER_H = 36;
const CARD_H = PADDING_TOP + IMG_H + FOOTER_H; // = 246px

// centering margins within each cell
const MARGIN_X = (CELL_W - CARD_W) / 2; // = 58px
const MARGIN_Y = (CELL_H - CARD_H) / 2; // = 33px

// extra cells to render outside viewport edges (prevents pop-in on fast pan)
const BUFFER = 2;

const TILE_W = 5;
const TILE_H = 3;

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
  onClick,
}: {
  memory: Memory;
  x: number;
  y: number;
  onClick: () => void;
}) {
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
        width: CARD_W,
        backgroundColor: "#ffffff",
        boxShadow: "0 3px 14px rgba(0,0,0,0.09), 0 1px 3px rgba(0,0,0,0.06)",
        paddingTop: PADDING_TOP,
        paddingLeft: 8,
        paddingRight: 8,
        cursor: "pointer",
        willChange: "transform",
      }}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={memory.coverImage}
        alt={memory.title}
        width={CARD_W - 16}
        height={IMG_H}
        style={{
          display: "block",
          width: "100%",
          height: IMG_H,
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
  const [vpSize, setVpSize] = useState({ w: 1440, h: 900 });

  const { panX, panY, canvasRef, panHandlers } = useCanvasControls(
    selectedMemory !== null,
  );

  useEffect(() => {
    setVpSize({ w: window.innerWidth, h: window.innerHeight });
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
          if (!selectedMemory) {
            (e.currentTarget as HTMLDivElement).style.cursor = "grabbing";
          }
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
            const cellOriginX = col * CELL_W;
            const cellOriginY = row * CELL_H;

            if (!memory) {
              return (
                <KylifeCell
                  key={`${col}-${row}`}
                  x={cellOriginX}
                  y={cellOriginY}
                />
              );
            }

            return (
              <GridCard
                key={`${col}-${row}`}
                memory={memory}
                x={cellOriginX + MARGIN_X}
                y={cellOriginY + MARGIN_Y}
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
