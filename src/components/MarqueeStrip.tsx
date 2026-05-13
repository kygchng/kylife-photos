"use client";

import { useRef, useEffect } from "react";
import { useAnimationFrame } from "framer-motion";
import type { Memory } from "@/data/memories";

const WAVE_PATH =
  "M-100,80 C100,20 300,140 500,80 C700,20 900,140 1100,80 C1300,20 1500,140 1700,80";

const ITEM_SPACING = 88;
const REPEAT = 5;
const BASE_VELOCITY = 1.2;

const CARD_W = 80;
const CARD_H = 80;
const HALF_W = CARD_W / 2;
const HALF_H = CARD_H / 2;

function indexRotation(i: number): number {
  return ((i % 3) - 1) * 4;
}

export default function MarqueeStrip({ memory }: { memory: Memory }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const pathRef = useRef<SVGPathElement>(null);
  const offsetRef = useRef(0);
  const pathLengthRef = useRef(1850); // fallback before mount
  const isHoveredRef = useRef(false);
  const initializedRef = useRef(false);

  const allImages: string[] = [];
  for (let r = 0; r < REPEAT; r++) {
    for (const img of memory.images) {
      allImages.push(img);
    }
  }

  useEffect(() => {
    if (pathRef.current) {
      pathLengthRef.current = pathRef.current.getTotalLength();
    }
  }, []);

  useAnimationFrame((_, delta) => {
    if (!pathRef.current || !containerRef.current) return;

    const pathLength = pathLengthRef.current;

    if (!isHoveredRef.current) {
      offsetRef.current += BASE_VELOCITY * (delta / 16.67);
      if (offsetRef.current >= pathLength) offsetRef.current -= pathLength;
    }

    const containerWidth = containerRef.current.offsetWidth;
    const scaleX = containerWidth / 1600;
    const scaleY = 200 / 160;

    const items = containerRef.current.querySelectorAll<HTMLElement>(
      "[data-marquee-item]",
    );

    items.forEach((el, i) => {
      let len = (offsetRef.current + i * ITEM_SPACING) % pathLength;
      if (len < 0) len += pathLength;
      const pt = pathRef.current!.getPointAtLength(len);
      const rotation = indexRotation(i);
      el.style.transform = `translate(${pt.x * scaleX - HALF_W}px, ${
        pt.y * scaleY - HALF_H
      }px) rotate(${rotation}deg)`;
      if (!initializedRef.current) {
        el.style.visibility = "visible";
      }
    });

    if (!initializedRef.current) {
      initializedRef.current = true;
    }
  });

  return (
    <div
      ref={containerRef}
      onMouseEnter={() => {
        isHoveredRef.current = true;
      }}
      onMouseLeave={() => {
        isHoveredRef.current = false;
      }}
      style={{
        position: "relative",
        width: "100%",
        height: 200,
        overflow: "hidden",
      }}
    >
      <svg
        viewBox="0 0 1600 160"
        preserveAspectRatio="none"
        style={{
          position: "absolute",
          inset: 0,
          width: "100%",
          height: "100%",
          pointerEvents: "none",
          visibility: "hidden",
        }}
      >
        <path ref={pathRef} d={WAVE_PATH} fill="none" stroke="none" />
      </svg>

      {allImages.map((src, i) => (
        <div
          key={i}
          data-marquee-item
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: CARD_W,
            backgroundColor: "white",
            padding: "5px 5px 0 5px",
            boxShadow: "0 2px 8px rgba(0,0,0,0.12)",
            visibility: "hidden", // shown after first frame
            willChange: "transform",
            cursor: "grab",
          }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={src}
            alt=""
            style={{
              width: "100%",
              height: 52,
              objectFit: "cover",
              display: "block",
            }}
            draggable={false}
          />
          <div
            style={{
              padding: "3px 2px 5px",
              fontSize: 8,
              fontFamily: "var(--font-geist-mono), monospace",
              color: "#999",
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
            }}
          >
            {memory.title}
          </div>
        </div>
      ))}
    </div>
  );
}
