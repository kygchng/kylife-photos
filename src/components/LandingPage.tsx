"use client";

import { useState, useCallback } from "react";
import { AnimatePresence } from "framer-motion";
import LandingIntro from "./LandingIntro";
import DevelopedCanvas from "./DevelopedCanvas";
import type { Memory } from "@/data/memories";

export default function LandingPage({ memories }: { memories: Memory[] }) {
  const [phase, setPhase] = useState<"intro" | "grid">("intro");
  const handleEnter = useCallback(() => setPhase("grid"), []);

  return (
    <>
      <AnimatePresence>
        {phase === "intro" && (
          <LandingIntro key="intro" onEnter={handleEnter} />
        )}
      </AnimatePresence>
      {phase === "grid" && <DevelopedCanvas memories={memories} entering />}
    </>
  );
}
