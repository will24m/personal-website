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
  | "POUNCING"
  | "SLEEPING"
  | "PLAYING";

export type EyeShape = "normal" | "wide" | "sleepy" | "heart" | "squint";

export interface CursorVector {
  x: number;
  y: number;
  distance: number;
}

export interface PetBrainOutput {
  petX: MotionValue<number>;
  petY: MotionValue<number>;
  gazeX: MotionValue<number>;
  gazeY: MotionValue<number>;
  state: PetState;
  bondLevel: BondLevel;
  eyeShape: EyeShape;
  isWagging: boolean;
  cursorVector: CursorVector;
  playWithPet: () => void;
}

interface SpringConfig { stiffness: number; damping: number }
const SPRING_FOLLOW: SpringConfig  = { stiffness: 150, damping: 19 };
const SPRING_EXCITED: SpringConfig = { stiffness: 520, damping: 16 };
const SPRING_POUNCE: SpringConfig  = { stiffness: 720, damping: 13 };
const SPRING_WANDER: SpringConfig  = { stiffness: 60,  damping: 24 };
const TICK_MS = 180;
const CLOSE_DISTANCE = 112;
const FAST_POINTER_SPEED = 980;
const DEFAULT_CURSOR_VECTOR: CursorVector = { x: 0, y: 0, distance: 0 };

function shouldUpdateCursorVector(previous: CursorVector, next: CursorVector): boolean {
  return (
    Math.abs(previous.x - next.x) > 0.04 ||
    Math.abs(previous.y - next.y) > 0.04 ||
    Math.abs(previous.distance - next.distance) > 6
  );
}

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
  if (state === "POUNCING") return "wide";
  if (state === "EXCITED") return dist < 60 ? "heart" : "wide";
  if (state === "PLAYING") return "wide";
  if (state === "GREETING") return bondLevel >= 3 ? "heart" : "wide";
  if (state === "FOLLOWING" && dist < 40) return "squint";
  return "normal";
}

export function usePetBrain(): PetBrainOutput {
  const petX = useMotionValue(typeof window !== "undefined" ? window.innerWidth / 2 : 400);
  const petY = useMotionValue(typeof window !== "undefined" ? window.innerHeight + 80 : 600);
  const gazeX = useMotionValue(0);
  const gazeY = useMotionValue(-0.18);

  const [state, setState] = useState<PetState>("FOLLOWING");
  const [eyeShape, setEyeShape] = useState<EyeShape>("normal");
  const [bondLevel, setBondLevel] = useState<BondLevel>(0);
  const [cursorVector, setCursorVector] = useState<CursorVector>(DEFAULT_CURSOR_VECTOR);

  const stateRef = useRef<PetState>("FOLLOWING");
  const stateEnteredAt = useRef(Date.now());
  const cursorX = useRef(typeof window !== "undefined" ? window.innerWidth / 2 : 400);
  const cursorY = useRef(typeof window !== "undefined" ? window.innerHeight / 2 : 300);
  const lastCursorMoveTime = useRef(Date.now());
  const lastPointerSampleTime = useRef(Date.now());
  const pointerSpeed = useRef(0);
  const pointerDirection = useRef({ x: 0, y: 0 });
  const lastReactiveMoveTime = useRef(0);
  const lastBoopAt = useRef(0);
  const wanderTarget = useRef<{ x: number; y: number } | null>(null);
  const hasGreeted = useRef(false);
  const relationship = useRef<PetRelationship>(loadRelationship());
  const bondLevelRef = useRef<BondLevel>(computeBondLevel(relationship.current));
  const wasClose = useRef(false);
  const pettingAccumulatorMs = useRef(0);
  const pendingNearMs = useRef(0);
  const nearProximityStart = useRef<number | null>(null);
  const animControls = useRef<{ stop: () => void } | null>(null);
  const cursorVectorRef = useRef<CursorVector>(DEFAULT_CURSOR_VECTOR);

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
    (tx: number, ty: number, cfg: SpringConfig) => {
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

  const updateGaze = useCallback(
    (targetX = cursorX.current, targetY = cursorY.current) => {
      const dx = targetX - petX.get();
      const dy = targetY - petY.get();
      const dist = Math.hypot(dx, dy);

      if (dist < 1) {
        gazeX.set(0);
        gazeY.set(0);
        return;
      }

      gazeX.set(dx / dist);
      gazeY.set(dy / dist);
    },
    [gazeX, gazeY, petX, petY]
  );

  const rewardInteraction = useCallback(() => {
    relationship.current.pettingCount++;
    const newBond = computeBondLevel(relationship.current);
    if (newBond !== bondLevelRef.current) {
      bondLevelRef.current = newBond;
      setBondLevel(newBond);
    }
  }, []);

  const playWithPet = useCallback(() => {
    const now = Date.now();
    if (now - lastBoopAt.current < 420) return;
    lastBoopAt.current = now;
    lastReactiveMoveTime.current = now;
    rewardInteraction();
    transitionTo("POUNCING");
  }, [rewardInteraction, transitionTo]);

  // The page spotlight follows the pet's center, not the pointer.
  useEffect(() => {
    const root = document.documentElement;
    const syncX = (x: number) => root.style.setProperty("--spotlight-x", `${x}px`);
    const syncY = (y: number) => root.style.setProperty("--spotlight-y", `${y - 4}px`);
    const syncPetMotion = () => updateGaze();

    syncX(petX.get());
    syncY(petY.get());
    syncPetMotion();

    const unsubscribeX = petX.on("change", (x) => {
      syncX(x);
      syncPetMotion();
    });
    const unsubscribeY = petY.on("change", (y) => {
      syncY(y);
      syncPetMotion();
    });
    return () => {
      unsubscribeX();
      unsubscribeY();
    };
  }, [petX, petY, updateGaze]);

  useEffect(() => {
    const root = document.documentElement;
    const active = state === "GREETING" || state === "EXCITED" || state === "POUNCING" || state === "PLAYING";
    root.style.setProperty(
      "--spotlight-size",
      active ? "clamp(340px, 38vw, 620px)" : "clamp(280px, 32vw, 520px)"
    );
    root.style.setProperty(
      "--spotlight-opacity",
      state === "SLEEPING" ? "0.5" : active ? "0.96" : "0.82"
    );
  }, [state]);

  // Cursor tracking
  useEffect(() => {
    const handleMove = (e: PointerEvent) => {
      const now = Date.now();
      const dx = e.clientX - cursorX.current;
      const dy = e.clientY - cursorY.current;
      const moved = Math.hypot(dx, dy);
      const dtSeconds = Math.max(16, now - lastPointerSampleTime.current) / 1000;
      const instantSpeed = moved / dtSeconds;

      pointerSpeed.current = pointerSpeed.current * 0.32 + instantSpeed * 0.68;
      if (moved > 0) {
        pointerDirection.current = { x: dx / moved, y: dy / moved };
      }
      lastPointerSampleTime.current = now;
      cursorX.current = e.clientX;
      cursorY.current = e.clientY;
      updateGaze(e.clientX, e.clientY);

      if (moved > 2) {
        lastCursorMoveTime.current = now;
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
        if (dist > 28 || pointerSpeed.current > 120) transitionTo("FOLLOWING");
      } else if (
        hasGreeted.current &&
        pointerSpeed.current > FAST_POINTER_SPEED &&
        now - lastReactiveMoveTime.current > 780 &&
        stateRef.current !== "GREETING"
      ) {
        lastReactiveMoveTime.current = now;
        const dist = Math.hypot(e.clientX - petX.get(), e.clientY - petY.get());
        transitionTo(dist < CLOSE_DISTANCE ? "POUNCING" : "EXCITED");
      }
    };

    const handlePointerDown = (e: PointerEvent) => {
      const target = e.target instanceof Element ? e.target : null;
      const interactiveTarget = target?.closest(
        "a, button, input, textarea, select, summary, [role='button']"
      );
      const dist = Math.hypot(e.clientX - petX.get(), e.clientY - petY.get());

      cursorX.current = e.clientX;
      cursorY.current = e.clientY;
      lastCursorMoveTime.current = Date.now();
      updateGaze(e.clientX, e.clientY);

      if (dist < CLOSE_DISTANCE) {
        playWithPet();
      } else if (!interactiveTarget) {
        lastReactiveMoveTime.current = Date.now();
        transitionTo("POUNCING");
      }
    };

    window.addEventListener("pointermove", handleMove, { passive: true });
    window.addEventListener("pointerdown", handlePointerDown, { passive: true });
    return () => {
      window.removeEventListener("pointermove", handleMove);
      window.removeEventListener("pointerdown", handlePointerDown);
    };
  }, [petX, petY, playWithPet, transitionTo, updateGaze]);

  // State machine tick
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
      const speed = pointerSpeed.current;
      const fallbackDirection = pointerDirection.current;
      const toCursor =
        dist > 1
          ? { x: (cx - px) / dist, y: (cy - py) / dist }
          : { x: fallbackDirection.x, y: fallbackDirection.y };
      const nextCursorVector = { ...toCursor, distance: dist };

      if (shouldUpdateCursorVector(cursorVectorRef.current, nextCursorVector)) {
        cursorVectorRef.current = nextCursorVector;
        setCursorVector(nextCursorVector);
      }

      let targetX = px;
      let targetY = py;
      let springCfg: SpringConfig = SPRING_FOLLOW;

      if (idleMs > 260) {
        pointerSpeed.current *= 0.72;
      }

      switch (current) {
        case "GREETING": {
          if (stateAge > 2000) transitionTo("FOLLOWING");
          targetX = cx - toCursor.x * 18;
          targetY = cy + 58;
          springCfg = SPRING_EXCITED;
          break;
        }

        case "FOLLOWING": {
          // → SLEEPING: cursor idle
          if (idleMs > 9000) {
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
          if (stateAge > 2200 && idleMs < 1000) {
            const excitedProb = 0.08 + 0.01 * bond;
            const boost = speed > FAST_POINTER_SPEED && dist > 160 ? 2.6 : 1;
            if (Math.random() < excitedProb * boost) {
              transitionTo(speed > FAST_POINTER_SPEED ? "POUNCING" : "EXCITED");
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
          {
            const stalkDistance = speed > FAST_POINTER_SPEED ? 74 : 54 + bond * 3;
            const sideStep = Math.sin(now / 420) * (speed > 360 ? 16 : 8);
            targetX = cx - pointerDirection.current.x * stalkDistance - pointerDirection.current.y * sideStep;
            targetY = cy - pointerDirection.current.y * stalkDistance + pointerDirection.current.x * sideStep;
            springCfg = speed > FAST_POINTER_SPEED ? SPRING_EXCITED : SPRING_FOLLOW;
          }
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
          if (stateAge > 3400) {
            transitionTo("FOLLOWING");
            break;
          }
          if (stateAge > 900 && dist < CLOSE_DISTANCE && Math.random() < 0.42) {
            transitionTo("POUNCING");
            break;
          }
          targetX = cx - pointerDirection.current.x * 30 - pointerDirection.current.y * 10;
          targetY = cy - pointerDirection.current.y * 30 + pointerDirection.current.x * 10;
          springCfg = SPRING_EXCITED;
          break;
        }

        case "POUNCING": {
          if (stateAge > 720) {
            transitionTo(dist < CLOSE_DISTANCE ? "PLAYING" : "FOLLOWING");
            break;
          }
          targetX = cx - toCursor.x * 10;
          targetY = cy - toCursor.y * 10;
          springCfg = SPRING_POUNCE;
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
          const radius = Math.max(18, 42 - bond * 5);
          targetX = cx + Math.cos(angle) * radius;
          targetY = cy + Math.sin(angle) * radius;
          springCfg = speed > 520 ? SPRING_EXCITED : SPRING_FOLLOW;
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

    const id = setInterval(tick, TICK_MS);
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
      const cursorVelocity = pointerSpeed.current;
      if (dist < 80 && cursorVelocity < 160) {
        pettingAccumulatorMs.current += 200;
        if (pettingAccumulatorMs.current > 600) {
          rewardInteraction();
          pettingAccumulatorMs.current = 0;
        }
      } else {
        pettingAccumulatorMs.current = 0;
      }
    };

    const id = setInterval(accumulateTick, 200);
    return () => clearInterval(id);
  }, [petX, petY, rewardInteraction]);

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

  const isWagging = state !== "SLEEPING" && state !== "WANDERING";

  return { petX, petY, gazeX, gazeY, state, bondLevel, eyeShape, isWagging, cursorVector, playWithPet };
}
