import { useEffect, useRef, useState, useCallback } from "react";
import { useMotionValue, animate } from "framer-motion";
import type { MotionValue } from "framer-motion";
import {
  loadRelationship,
  saveRelationship,
  computeBondLevel,
  type PetRelationship,
  type BondLevel,
} from "../utils/petStorage.js";

export type PetState =
  | "GREETING"
  | "FOLLOWING"
  | "WANDERING"
  | "EXCITED"
  | "SLEEPING"
  | "PLAYING";

export type EyeShape = "normal" | "wide" | "sleepy" | "heart" | "squint";

export interface PetBrainOutput {
  petX: MotionValue<number>;
  petY: MotionValue<number>;
  state: PetState;
  bondLevel: BondLevel;
  eyeShape: EyeShape;
  isWagging: boolean;
}

interface SpringConfig { stiffness: number; damping: number }
const SPRING_FOLLOW: SpringConfig  = { stiffness: 80,  damping: 20 };
const SPRING_EXCITED: SpringConfig = { stiffness: 400, damping: 15 };
const SPRING_WANDER: SpringConfig  = { stiffness: 40,  damping: 25 };

function pickWanderTarget(bondLevel: BondLevel): { x: number; y: number } {
  const pad = 60;
  const w = window.innerWidth - pad * 2;
  const h = window.innerHeight - pad * 2;

  if (bondLevel >= 2) {
    // Stay within 40% of viewport center
    const cx = window.innerWidth / 2;
    const cy = window.innerHeight / 2;
    const rx = window.innerWidth * 0.4;
    const ry = window.innerHeight * 0.4;
    return {
      x: cx + (Math.random() * 2 - 1) * rx,
      y: cy + (Math.random() * 2 - 1) * ry,
    };
  }
  return {
    x: pad + Math.random() * w,
    y: pad + Math.random() * h,
  };
}

function deriveEyeShape(
  state: PetState,
  dist: number,
  bondLevel: BondLevel
): EyeShape {
  if (state === "SLEEPING") return "sleepy";
  if (state === "EXCITED") return dist < 60 ? "heart" : "wide";
  if (state === "PLAYING") return "wide";
  if (state === "GREETING") return bondLevel >= 3 ? "heart" : "wide";
  if (state === "FOLLOWING" && dist < 40) return "squint";
  return "normal";
}

export function usePetBrain(): PetBrainOutput {
  const petX = useMotionValue(typeof window !== "undefined" ? window.innerWidth / 2 : 400);
  const petY = useMotionValue(typeof window !== "undefined" ? window.innerHeight + 80 : 600);

  const [state, setState] = useState<PetState>("FOLLOWING");
  const [eyeShape, setEyeShape] = useState<EyeShape>("normal");
  const [bondLevel, setBondLevel] = useState<BondLevel>(0);

  const stateRef = useRef<PetState>("FOLLOWING");
  const stateEnteredAt = useRef(Date.now());
  const cursorX = useRef(typeof window !== "undefined" ? window.innerWidth / 2 : 400);
  const cursorY = useRef(typeof window !== "undefined" ? window.innerHeight / 2 : 300);
  const lastCursorMoveTime = useRef(Date.now());
  const lastCursorX = useRef(cursorX.current);
  const lastCursorY = useRef(cursorY.current);
  const wanderTarget = useRef<{ x: number; y: number } | null>(null);
  const hasGreeted = useRef(false);
  const relationship = useRef<PetRelationship>(loadRelationship());
  const bondLevelRef = useRef<BondLevel>(computeBondLevel(relationship.current));
  const wasClose = useRef(false);
  const pettingAccumulatorMs = useRef(0);
  const pendingNearMs = useRef(0);
  const nearProximityStart = useRef<number | null>(null);
  const animControls = useRef<{ stop: () => void } | null>(null);

  const transitionTo = useCallback(
    (next: PetState) => {
      if (stateRef.current === next) return;
      stateRef.current = next;
      stateEnteredAt.current = Date.now();
      setState(next);

      if (next === "WANDERING") {
        wanderTarget.current = pickWanderTarget(bondLevelRef.current);
      }
    },
    []
  );

  const animatePet = useCallback(
    (tx: number, ty: number, cfg: typeof SPRING_FOLLOW) => {
      animControls.current?.stop();
      const cx = animate(petX, tx, { type: "spring", ...cfg });
      const cy = animate(petY, ty, { type: "spring", ...cfg });
      animControls.current = {
        stop: () => {
          cx.stop();
          cy.stop();
        },
      };
    },
    [petX, petY]
  );

  // Cursor tracking
  useEffect(() => {
    const handleMove = (e: PointerEvent) => {
      cursorX.current = e.clientX;
      cursorY.current = e.clientY;

      const dx = e.clientX - lastCursorX.current;
      const dy = e.clientY - lastCursorY.current;
      if (Math.hypot(dx, dy) > 4) {
        lastCursorMoveTime.current = Date.now();
        lastCursorX.current = e.clientX;
        lastCursorY.current = e.clientY;
      }

      // First pointer enter — trigger greeting
      if (!hasGreeted.current) {
        hasGreeted.current = true;
        // Start pet near cursor's entry point at bottom
        petX.set(e.clientX);
        petY.set(window.innerHeight + 80);
        transitionTo("GREETING");
      }

      // Wake from sleep if cursor has moved significantly
      if (stateRef.current === "SLEEPING") {
        const sleepStartX = petX.get();
        const sleepStartY = petY.get();
        const dist = Math.hypot(e.clientX - sleepStartX, e.clientY - sleepStartY);
        if (dist > 40) transitionTo("FOLLOWING");
      }
    };

    window.addEventListener("pointermove", handleMove, { passive: true });
    return () => window.removeEventListener("pointermove", handleMove);
  }, [petX, petY, transitionTo]);

  // State machine tick (500ms)
  useEffect(() => {
    const tick = () => {
      const now = Date.now();
      const current = stateRef.current;
      const stateAge = now - stateEnteredAt.current;
      const cx = cursorX.current;
      const cy = cursorY.current;
      const px = petX.get();
      const py = petY.get();
      const dist = Math.hypot(cx - px, cy - py);
      const idleMs = now - lastCursorMoveTime.current;
      const bond = bondLevelRef.current;

      let targetX = px;
      let targetY = py;
      let springCfg: typeof SPRING_FOLLOW = SPRING_FOLLOW;

      switch (current) {
        case "GREETING": {
          if (stateAge > 2000) transitionTo("FOLLOWING");
          targetX = cx;
          targetY = cy + 60;
          springCfg = SPRING_EXCITED;
          break;
        }

        case "FOLLOWING": {
          // → SLEEPING: cursor idle
          if (idleMs > 8000) {
            transitionTo("SLEEPING");
            break;
          }
          // → WANDERING
          if (stateAge > 8000) {
            const wanderProb = Math.max(0.02, 0.08 - 0.015 * bond);
            if (Math.random() < wanderProb) {
              transitionTo("WANDERING");
              break;
            }
          }
          // → EXCITED
          if (stateAge > 5000 && idleMs < 1000) {
            const excitedProb = 0.05 + 0.008 * bond;
            const cursorVelocity = Math.hypot(
              cx - lastCursorX.current,
              cy - lastCursorY.current
            );
            const boost = cursorVelocity > 20 && dist > 200 ? 2 : 1;
            if (Math.random() < excitedProb * boost) {
              transitionTo("EXCITED");
              break;
            }
          }
          // → PLAYING: prolonged proximity
          if (nearProximityStart.current !== null) {
            const nearMs = now - nearProximityStart.current;
            if (nearMs > 15000 && Math.random() < 0.12) {
              transitionTo("PLAYING");
              break;
            }
          }
          targetX = cx;
          targetY = cy;
          springCfg = SPRING_FOLLOW;
          break;
        }

        case "WANDERING": {
          const wt = wanderTarget.current;
          if (wt) {
            const distToTarget = Math.hypot(px - wt.x, py - wt.y);
            if (distToTarget < 20 || stateAge > 12000) {
              transitionTo("FOLLOWING");
              break;
            }
            // Bonded pet notices cursor even while wandering
            if (bond >= 3 && dist < 80 && Math.random() < 0.15) {
              transitionTo("FOLLOWING");
              break;
            }
            targetX = wt.x;
            targetY = wt.y;
          }
          springCfg = SPRING_WANDER;
          break;
        }

        case "EXCITED": {
          if (stateAge > 3000) {
            transitionTo("FOLLOWING");
            break;
          }
          if (stateAge > 1500 && dist < 60 && Math.random() < 0.3) {
            transitionTo("PLAYING");
            break;
          }
          targetX = cx;
          targetY = cy;
          springCfg = SPRING_EXCITED;
          break;
        }

        case "SLEEPING": {
          // Wake handled by pointermove listener; keep still
          targetX = px;
          targetY = py;
          springCfg = SPRING_FOLLOW;
          break;
        }

        case "PLAYING": {
          if (stateAge > 18000) {
            transitionTo("FOLLOWING");
            break;
          }
          if (stateAge > 6000 && Math.random() < 0.15) {
            transitionTo("FOLLOWING");
            break;
          }
          const angle = ((now / 1200) % (2 * Math.PI));
          const radius = Math.max(15, 35 - bond * 4);
          targetX = cx + Math.cos(angle) * radius;
          targetY = cy + Math.sin(angle) * radius;
          springCfg = SPRING_FOLLOW;
          break;
        }
      }

      animatePet(targetX, targetY, springCfg);

      // Update eye shape
      setEyeShape(deriveEyeShape(stateRef.current, dist, bond));

      // Track near-proximity start time
      if (dist < 120) {
        if (nearProximityStart.current === null) nearProximityStart.current = now;
      } else {
        nearProximityStart.current = null;
      }
    };

    const id = setInterval(tick, 500);
    return () => clearInterval(id);
  }, [petX, petY, transitionTo, animatePet]);

  // Relationship accumulation (200ms)
  useEffect(() => {
    const accumulateTick = () => {
      const cx = cursorX.current;
      const cy = cursorY.current;
      const px = petX.get();
      const py = petY.get();
      const dist = Math.hypot(cx - px, cy - py);

      if (dist < 120) {
        pendingNearMs.current += 200;
        if (pendingNearMs.current >= 2000) {
          relationship.current.totalNearMs += pendingNearMs.current;
          pendingNearMs.current = 0;
          const newBond = computeBondLevel(relationship.current);
          if (newBond !== bondLevelRef.current) {
            bondLevelRef.current = newBond;
            setBondLevel(newBond);
          }
        }
      }

      if (dist < 60 && !wasClose.current) {
        relationship.current.closeEncounters++;
        wasClose.current = true;
        const newBond = computeBondLevel(relationship.current);
        if (newBond !== bondLevelRef.current) {
          bondLevelRef.current = newBond;
          setBondLevel(newBond);
        }
      } else if (dist >= 60) {
        wasClose.current = false;
      }

      // Petting detection: slow movement while close
      const cursorVelocity = Math.hypot(
        cx - lastCursorX.current,
        cy - lastCursorY.current
      );
      if (dist < 80 && cursorVelocity < 2) {
        pettingAccumulatorMs.current += 200;
        if (pettingAccumulatorMs.current > 600) {
          relationship.current.pettingCount++;
          pettingAccumulatorMs.current = 0;
        }
      } else {
        pettingAccumulatorMs.current = 0;
      }
    };

    const id = setInterval(accumulateTick, 200);
    return () => clearInterval(id);
  }, [petX, petY]);

  // Persist relationship on hide/unload
  useEffect(() => {
    const save = () => {
      if (pendingNearMs.current > 0) {
        relationship.current.totalNearMs += pendingNearMs.current;
        pendingNearMs.current = 0;
      }
      saveRelationship(relationship.current);
    };
    document.addEventListener("visibilitychange", save);
    window.addEventListener("beforeunload", save);
    return () => {
      document.removeEventListener("visibilitychange", save);
      window.removeEventListener("beforeunload", save);
    };
  }, []);

  // Initialize bond level from storage
  useEffect(() => {
    const initialBond = computeBondLevel(relationship.current);
    bondLevelRef.current = initialBond;
    setBondLevel(initialBond);
  }, []);

  const isWagging = state === "EXCITED" || state === "PLAYING" || state === "GREETING";

  return { petX, petY, state, bondLevel, eyeShape, isWagging };
}
