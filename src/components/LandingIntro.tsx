"use client";

import React, { useEffect, useCallback, useRef } from "react";
import { motion } from "framer-motion";
import MarqueeAlongSvgPath from "@/components/fancy/blocks/marquee-along-svg-path";

const MARQUEE_PATH =
  "M1 209.434C58.5872 255.935 387.926 325.938 482.583 209.434C600.905 63.8051 525.516 -43.2211 427.332 19.9613C329.149 83.1436 352.902 242.723 515.041 267.302C644.752 286.966 943.56 181.94 995 156.5";

// ─── LandingIntro ───────────────────────────────────────────────────────────
export default function LandingIntro({ onEnter }: { onEnter: () => void }) {
  const entered = useRef(false);

  const handleEnter = useCallback(() => {
    if (entered.current) return;
    entered.current = true;
    onEnter();
  }, [onEnter]);

  // Wheel, touch swipe-up, and keyboard triggers
  useEffect(() => {
    const onWheel = (e: WheelEvent) => {
      if (e.deltaY > 0) handleEnter();
    };
    let touchStartY = 0;
    const onTouchStart = (e: TouchEvent) => {
      touchStartY = e.touches[0].clientY;
    };
    const onTouchEnd = (e: TouchEvent) => {
      if (touchStartY - e.changedTouches[0].clientY > 40) handleEnter();
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowDown" || e.key === " " || e.key === "Enter") {
        e.preventDefault();
        handleEnter();
      }
    };

    window.addEventListener("wheel", onWheel, { passive: true });
    window.addEventListener("touchstart", onTouchStart, { passive: true });
    window.addEventListener("touchend", onTouchEnd, { passive: true });
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("wheel", onWheel);
      window.removeEventListener("touchstart", onTouchStart);
      window.removeEventListener("touchend", onTouchEnd);
      window.removeEventListener("keydown", onKey);
    };
  }, [handleEnter]);

  const marqueeImages = [
    "/images/alviso%2C%20sj/cover.jpeg",
    "/images/bali%2C%20id/06.jpeg",
    "/images/cal%20academy%2C%20sf/cover.jpeg",
    "/images/cheng%20chau%20island%2C%20hk/cover.jpeg",
    "/images/dali%2C%20yunnan/06.jpeg",
    "/images/cavallo%20point%2C%20sf/cover.jpeg",
    "/images/hong%20kong%20misc./05.jpeg",
    "/images/jiufen%2C%20tw/cover.jpeg",
    "/images/hangzhou%2C%20cn/cover.jpeg",
    "/images/kowloon%20walled%20city%2C%20hk/cover.jpeg",
    "/images/kyoto%2C%20jp/cover.jpeg",
    "/images/nara%2C%20jp/cover.jpeg",
    "/images/sandy%20eggo/01.jpeg",
  ];

  return (
    <motion.div
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.55, ease: "easeInOut" }}
      style={{
        position: "fixed",
        inset: 0,
        backgroundColor: "#f7f4ef",
        overflow: "hidden",
        zIndex: 200,
      }}
    >
      {/* Marquee strip */}
      <motion.div
        initial={{ clipPath: "inset(0 100% 0 0)" }}
        animate={{ clipPath: "inset(0 0% 0 0)" }}
        transition={{ duration: 1.1, ease: [0.25, 0.1, 0.25, 1], delay: 0.35 }}
        style={{ position: "absolute", inset: 0 }}
      >
        {marqueeImages.length > 0 && (
          <MarqueeAlongSvgPath
            path={MARQUEE_PATH}
            viewBox="0 0 996 330"
            baseVelocity={8}
            slowdownOnHover
            draggable
            repeat={2}
            dragSensitivity={0.1}
            className="w-full h-full scale-105"
            responsive
            grabCursor
          >
            {marqueeImages.map((src, i) => (
              <div
                key={i}
                className="hover:scale-150 duration-300 ease-in-out"
                style={{
                  width: 64,
                  height: 64,
                  overflow: "hidden",
                  flexShrink: 0,
                }}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={src}
                  alt=""
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                    display: "block",
                  }}
                  draggable={false}
                />
              </div>
            ))}
          </MarqueeAlongSvgPath>
        )}
      </motion.div>

      {/* Curved text — follows the same wavy SVG path as the marquee strip */}
      <svg
        viewBox="0 0 996 330"
        preserveAspectRatio="xMidYMid meet"
        overflow="visible"
        style={{
          position: "absolute",
          inset: 0,
          width: "100%",
          height: "100%",
          pointerEvents: "none",
          zIndex: 10,
        }}
      >
        <defs>
          <path id="marquee-text-curve" d={MARQUEE_PATH} />
        </defs>

        <g transform="translate(0, -51)">
          <motion.text
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{
              delay: 1.15,
              duration: 0.65,
              ease: [0.22, 1, 0.36, 1],
            }}
            style={{
              fontFamily: "var(--font-sans), sans-serif",
              fontSize: "27px",
              fontWeight: 600,
              fill: "#2c5ccd",
            }}
          >
            <textPath href="#marquee-text-curve" startOffset="75%">
              welcome to kylie&apos;s life.
            </textPath>
          </motion.text>
        </g>

        <g transform="translate(0, 80)">
          <motion.text
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{
              delay: 1.3,
              duration: 0.65,
              ease: [0.22, 1, 0.36, 1],
            }}
            style={{
              fontFamily: "var(--font-sans), sans-serif",
              fontSize: "27px",
              fontWeight: 700,
              fill: "#f5c518",
            }}
          >
            <textPath href="#marquee-text-curve" startOffset="88%">
              #kylife
            </textPath>
          </motion.text>
        </g>
      </svg>

      <motion.button
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2.1, duration: 0.7 }}
        onClick={handleEnter}
        style={{
          position: "absolute",
          bottom: 32,
          left: "50%",
          transform: "translateX(-50%)",
          background: "none",
          border: "none",
          cursor: "pointer",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 8,
          zIndex: 30,
          padding: "8px 16px",
        }}
      >
        <span
          style={{
            fontFamily: "var(--font-geist-mono), monospace",
            fontSize: 16,
            letterSpacing: "0.14em",
            color: "#414141",
            userSelect: "none",
          }}
        >
          scroll to explore
        </span>
        <motion.div
          animate={{ y: [0, 5, 0] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
          style={{
            width: 1,
            height: 22,
            background: "#828282",
            borderRadius: 1,
          }}
        />
      </motion.button>
    </motion.div>
  );
}
