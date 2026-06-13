import { useEffect, useRef, useState, useCallback } from "react";
import { useMotionValue } from "framer-motion";
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

interface Point {
  x: number;
  y: number;
}

interface RectBounds {
  left: number;
  top: number;
  right: number;
  bottom: number;
}

interface ObstacleRect extends RectBounds {
  base: RectBounds;
  element: HTMLElement | null;
  shiftable: boolean;
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
}

interface MovementConfig {
  maxSpeed: number;
  acceleration: number;
}
// On-screen the pet ambles calmly toward the cursor while routing around
// components. When it falls off-screen it gets a 2x boost to catch back up.
const MOVEMENT_FOLLOW: MovementConfig = { maxSpeed: 126, acceleration: 448 };
const MOVEMENT_EXCITED: MovementConfig = { maxSpeed: 154, acceleration: 504 };
const MOVEMENT_POUNCE: MovementConfig = { maxSpeed: 175, acceleration: 571 };
const MOVEMENT_WANDER: MovementConfig = { maxSpeed: 98, acceleration: 370 };
const OFFSCREEN_SPEED_MULTIPLIER = 2;
const TICK_MS = 120;
const CLOSE_DISTANCE = 112;
const FAST_POINTER_SPEED = 980;
const DEFAULT_CURSOR_VECTOR: CursorVector = { x: 0, y: 0, distance: 0 };
const PET_RADIUS = 46;
const OBSTACLE_GAP = 10;
const OBSTACLE_INFLATE = PET_RADIUS + OBSTACLE_GAP;
const ROUTE_CLEARANCE = 6;
const OBSTACLE_REFRESH_MS = 280;
const PAGE_EDGE_MARGIN = PET_RADIUS * 1.6;
// Components only shift when the pet is actually squeezing through them, and
// only by a hair — the nudge should read as a gentle brush, never a shove.
const COMPONENT_NUDGE_MAX = 12;
const COMPONENT_NUDGE_RADIUS = PET_RADIUS * 1.4;
const COMPONENT_NUDGE_LOOKAHEAD = PET_RADIUS * 2.2;
// Once the pet is this close to the cursor it stops short, resting on the side
// it approached from so it hugs the pointer without ever covering it.
const SETTLE_OFFSET = 36;
const SETTLE_ENGAGE_DISTANCE = 96;
// Fraction of the gap to the freshly computed route waypoint that the eased
// steering target closes each frame. Lower = smoother/floatier glide.
const TARGET_SMOOTHING = 0.12;
const OBSTACLE_SELECTOR = [
  ".site-header__inner",
  ".site-footer__inner",
  ".surface-card",
  ".contact-sidebar__card",
  ".portrait-frame",
  ".gallery-controls",
  "input",
  "textarea",
  "select",
  "button:not(.virtual-pet)",
].join(",");

function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}

function distance(a: Point, b: Point): number {
  return Math.hypot(a.x - b.x, a.y - b.y);
}

function getPageBounds(): { width: number; height: number } {
  const documentElement = document.documentElement;
  return {
    width: Math.max(documentElement.scrollWidth, documentElement.clientWidth, window.innerWidth),
    height: Math.max(documentElement.scrollHeight, documentElement.clientHeight, window.innerHeight),
  };
}

function clampToPage(point: Point): Point {
  const { width, height } = getPageBounds();
  return {
    x: clamp(point.x, -PAGE_EDGE_MARGIN, width + PAGE_EDGE_MARGIN),
    y: clamp(point.y, -PAGE_EDGE_MARGIN, height + PAGE_EDGE_MARGIN),
  };
}

// True when the pet (document coords) sits outside the current viewport, so it
// can sprint back into view at the off-screen speed.
function isPetOffscreen(point: Point): boolean {
  if (typeof window === "undefined") return false;
  const left = window.scrollX;
  const top = window.scrollY;
  const right = left + window.innerWidth;
  const bottom = top + window.innerHeight;
  return point.x < left || point.x > right || point.y < top || point.y > bottom;
}

function pointInRect(point: Point, rect: RectBounds): boolean {
  return point.x >= rect.left && point.x <= rect.right && point.y >= rect.top && point.y <= rect.bottom;
}

function isBlocked(point: Point, obstacles: RectBounds[]): boolean {
  return obstacles.some((rect) => pointInRect(point, rect));
}

function isShiftableObstacle(element: HTMLElement): boolean {
  if (element.closest(".site-header") || element.closest(".site-footer")) return false;
  if (element.matches("input, textarea, select, button, a, summary, [role='button']")) return false;
  if (element.closest("input, textarea, select, button, a, summary, [role='button']")) return false;
  return true;
}

function inflateBounds(base: RectBounds, amount: number): RectBounds {
  const { width: pageWidth, height: pageHeight } = getPageBounds();
  return {
    left: clamp(base.left - amount, -PAGE_EDGE_MARGIN, pageWidth + PAGE_EDGE_MARGIN),
    top: clamp(base.top - amount, -PAGE_EDGE_MARGIN, pageHeight + PAGE_EDGE_MARGIN),
    right: clamp(base.right + amount, -PAGE_EDGE_MARGIN, pageWidth + PAGE_EDGE_MARGIN),
    bottom: clamp(base.bottom + amount, -PAGE_EDGE_MARGIN, pageHeight + PAGE_EDGE_MARGIN),
  };
}

function collectObstacleRects(): ObstacleRect[] {
  if (typeof document === "undefined") return [];

  const { width: pageWidth, height: pageHeight } = getPageBounds();
  const scrollX = window.scrollX;
  const scrollY = window.scrollY;
  const elements = Array.from(document.querySelectorAll(OBSTACLE_SELECTOR));

  return elements.flatMap((element) => {
    if (!(element instanceof HTMLElement)) return [];
    if (element.closest(".virtual-pet-layer")) return [];

    const styles = window.getComputedStyle(element);
    if (styles.display === "none" || styles.visibility === "hidden" || Number(styles.opacity) < 0.05) {
      return [];
    }

    const rect = element.getBoundingClientRect();
    if (rect.width < 8 || rect.height < 8) return [];

    const docRect = {
      left: rect.left + scrollX,
      top: rect.top + scrollY,
      right: rect.right + scrollX,
      bottom: rect.bottom + scrollY,
    };

    const inflated = inflateBounds(docRect, OBSTACLE_INFLATE);

    const inflatedWidth = inflated.right - inflated.left;
    const inflatedHeight = inflated.bottom - inflated.top;
    if (inflatedWidth > pageWidth * 0.96 && inflatedHeight > pageHeight * 0.72) return [];

    return [
      {
        ...inflated,
        base: docRect,
        element,
        shiftable: isShiftableObstacle(element),
      },
    ];
  });
}

function pushOutOfObstacles(point: Point, obstacles: ObstacleRect[]): Point {
  let next = clampToPage(point);

  for (let iteration = 0; iteration < 6; iteration += 1) {
    const rect = obstacles.find((obstacle) => pointInRect(next, obstacle));
    if (!rect) return next;

    const candidates = [
      { x: rect.left - ROUTE_CLEARANCE, y: next.y },
      { x: rect.right + ROUTE_CLEARANCE, y: next.y },
      { x: next.x, y: rect.top - ROUTE_CLEARANCE },
      { x: next.x, y: rect.bottom + ROUTE_CLEARANCE },
    ].map(clampToPage);

    next = candidates.reduce((best, candidate) => {
      const candidatePenalty = isBlocked(candidate, obstacles) ? 1000 : 0;
      const bestPenalty = isBlocked(best, obstacles) ? 1000 : 0;
      const candidateScore = distance(candidate, point) + candidatePenalty;
      const bestScore = distance(best, point) + bestPenalty;
      return candidateScore < bestScore ? candidate : best;
    }, candidates[0]);
  }

  return next;
}

function segmentHitsRect(start: Point, end: Point, rect: RectBounds): boolean {
  const length = distance(start, end);
  const steps = Math.max(2, Math.ceil(length / 12));

  for (let step = 1; step <= steps; step += 1) {
    const t = step / steps;
    if (
      pointInRect(
        {
          x: start.x + (end.x - start.x) * t,
          y: start.y + (end.y - start.y) * t,
        },
        rect
      )
    ) {
      return true;
    }
  }

  return false;
}

function hasClearSegment(start: Point, end: Point, obstacles: ObstacleRect[]): boolean {
  return obstacles.every((rect) => !segmentHitsRect(start, end, rect));
}

function findBlockingRect(start: Point, end: Point, obstacles: ObstacleRect[]): ObstacleRect | null {
  let blockingRect: ObstacleRect | null = null;
  let bestDistance = Number.POSITIVE_INFINITY;

  for (const rect of obstacles) {
    if (!segmentHitsRect(start, end, rect)) continue;
    const center = { x: (rect.left + rect.right) / 2, y: (rect.top + rect.bottom) / 2 };
    const rectDistance = distance(start, center);
    if (rectDistance < bestDistance) {
      blockingRect = rect;
      bestDistance = rectDistance;
    }
  }

  return blockingRect;
}

function getRectSkirtCandidates(rect: RectBounds, current: Point, desired: Point): Point[] {
  const xSamples = [current.x, desired.x, (current.x + desired.x) / 2].map((x) =>
    clamp(x, rect.left - OBSTACLE_GAP, rect.right + OBSTACLE_GAP)
  );
  const ySamples = [current.y, desired.y, (current.y + desired.y) / 2].map((y) =>
    clamp(y, rect.top - OBSTACLE_GAP, rect.bottom + OBSTACLE_GAP)
  );

  return [
    { x: rect.left - ROUTE_CLEARANCE, y: ySamples[0] },
    { x: rect.left - ROUTE_CLEARANCE, y: ySamples[1] },
    { x: rect.right + ROUTE_CLEARANCE, y: ySamples[0] },
    { x: rect.right + ROUTE_CLEARANCE, y: ySamples[1] },
    { x: xSamples[0], y: rect.top - ROUTE_CLEARANCE },
    { x: xSamples[1], y: rect.top - ROUTE_CLEARANCE },
    { x: xSamples[0], y: rect.bottom + ROUTE_CLEARANCE },
    { x: xSamples[1], y: rect.bottom + ROUTE_CLEARANCE },
    { x: rect.left - ROUTE_CLEARANCE, y: rect.top - ROUTE_CLEARANCE },
    { x: rect.right + ROUTE_CLEARANCE, y: rect.top - ROUTE_CLEARANCE },
    { x: rect.left - ROUTE_CLEARANCE, y: rect.bottom + ROUTE_CLEARANCE },
    { x: rect.right + ROUTE_CLEARANCE, y: rect.bottom + ROUTE_CLEARANCE },
  ].map(clampToPage);
}

function findNavigableTarget(current: Point, desired: Point, obstacles: ObstacleRect[]): Point {
  const safeCurrent = pushOutOfObstacles(current, obstacles);
  const safeDesired = pushOutOfObstacles(desired, obstacles);

  if (hasClearSegment(safeCurrent, safeDesired, obstacles)) {
    return safeDesired;
  }

  const desiredAngle = Math.atan2(safeDesired.y - safeCurrent.y, safeDesired.x - safeCurrent.x);
  const desiredDistance = distance(safeCurrent, safeDesired);
  const stepDistance = clamp(desiredDistance, 24, 64);
  const angleOffsets = [0, -0.28, 0.28, -0.58, 0.58, -0.9, 0.9, -1.24, 1.24, -1.57, 1.57, Math.PI];
  const localCandidates = angleOffsets.map((offset) =>
    clampToPage({
      x: safeCurrent.x + Math.cos(desiredAngle + offset) * stepDistance,
      y: safeCurrent.y + Math.sin(desiredAngle + offset) * stepDistance,
    })
  );
  const blockingRect = findBlockingRect(safeCurrent, safeDesired, obstacles);
  const nearbyObstacleCandidates = obstacles
    .map((rect) => ({
      rect,
      score:
        distance(safeCurrent, { x: (rect.left + rect.right) / 2, y: (rect.top + rect.bottom) / 2 }) +
        distance(safeDesired, { x: (rect.left + rect.right) / 2, y: (rect.top + rect.bottom) / 2 }),
    }))
    .filter(({ rect, score }) => segmentHitsRect(safeCurrent, safeDesired, rect) || score < desiredDistance + 760)
    .sort((a, b) => a.score - b.score)
    .slice(0, 10)
    .flatMap(({ rect }) => getRectSkirtCandidates(rect, safeCurrent, safeDesired));
  const blockingSkirtCandidates = blockingRect ? getRectSkirtCandidates(blockingRect, safeCurrent, safeDesired) : [];
  const radialEscapeCandidates = [88, 150, 230, 340].flatMap((radius) =>
    angleOffsets.map((offset) =>
      clampToPage({
        x: safeCurrent.x + Math.cos(desiredAngle + offset) * radius,
        y: safeCurrent.y + Math.sin(desiredAngle + offset) * radius,
      })
    )
  );
  const candidates = [
    safeDesired,
    ...localCandidates,
    ...blockingSkirtCandidates,
    ...nearbyObstacleCandidates,
    ...radialEscapeCandidates,
  ].map((candidate) =>
    pushOutOfObstacles(candidate, obstacles)
  );

  let best = safeCurrent;
  let bestScore = Number.POSITIVE_INFINITY;

  for (const candidate of candidates) {
    if (isBlocked(candidate, obstacles)) continue;
    if (desiredDistance > 8 && distance(safeCurrent, candidate) < 4) continue;
    const blockedPathPenalty = hasClearSegment(safeCurrent, candidate, obstacles) ? 0 : 5000;
    if (blockedPathPenalty > 0) continue;

    const candidateAngle = Math.atan2(candidate.y - safeCurrent.y, candidate.x - safeCurrent.x);
    const turnPenalty = Math.abs(Math.atan2(Math.sin(candidateAngle - desiredAngle), Math.cos(candidateAngle - desiredAngle))) * 24;
    const score = distance(candidate, safeDesired) + distance(safeCurrent, candidate) * 0.18 + turnPenalty;
    if (score < bestScore) {
      best = candidate;
      bestScore = score;
    }
  }

  return best;
}

function closestPointOnSegment(point: Point, start: Point, end: Point): Point {
  const dx = end.x - start.x;
  const dy = end.y - start.y;
  const lengthSquared = dx * dx + dy * dy;
  if (lengthSquared <= 0.001) return start;

  const t = clamp(((point.x - start.x) * dx + (point.y - start.y) * dy) / lengthSquared, 0, 1);
  return {
    x: start.x + dx * t,
    y: start.y + dy * t,
  };
}

function pointToSegmentDistance(point: Point, start: Point, end: Point): number {
  return distance(point, closestPointOnSegment(point, start, end));
}

function pointToRectDistance(point: Point, rect: RectBounds): number {
  const dx = Math.max(rect.left - point.x, 0, point.x - rect.right);
  const dy = Math.max(rect.top - point.y, 0, point.y - rect.bottom);
  return Math.hypot(dx, dy);
}

function segmentDistanceToRect(start: Point, end: Point, rect: RectBounds): number {
  if (segmentHitsRect(start, end, rect)) return 0;

  const corners = [
    { x: rect.left, y: rect.top },
    { x: rect.right, y: rect.top },
    { x: rect.left, y: rect.bottom },
    { x: rect.right, y: rect.bottom },
  ];

  return Math.min(
    pointToRectDistance(start, rect),
    pointToRectDistance(end, rect),
    ...corners.map((corner) => pointToSegmentDistance(corner, start, end))
  );
}

function computeComponentNudges(current: Point, routeTarget: Point, obstacles: ObstacleRect[]): Map<HTMLElement, Point> {
  const nudges = new Map<HTMLElement, Point>();
  const fullRouteLength = distance(current, routeTarget);
  const pathEnd =
    fullRouteLength > COMPONENT_NUDGE_LOOKAHEAD
      ? {
          x: current.x + ((routeTarget.x - current.x) / fullRouteLength) * COMPONENT_NUDGE_LOOKAHEAD,
          y: current.y + ((routeTarget.y - current.y) / fullRouteLength) * COMPONENT_NUDGE_LOOKAHEAD,
        }
      : routeTarget;
  const routeLength = distance(current, pathEnd);
  if (routeLength < 4) return nudges;

  const pathDirection = {
    x: (pathEnd.x - current.x) / routeLength,
    y: (pathEnd.y - current.y) / routeLength,
  };
  const perpendicular = { x: -pathDirection.y, y: pathDirection.x };

  for (const obstacle of obstacles) {
    if (!obstacle.shiftable || !obstacle.element) continue;

    const pathDistance = segmentDistanceToRect(current, pathEnd, obstacle.base);
    if (pathDistance > COMPONENT_NUDGE_RADIUS) continue;

    const center = {
      x: (obstacle.base.left + obstacle.base.right) / 2,
      y: (obstacle.base.top + obstacle.base.bottom) / 2,
    };
    const closest = closestPointOnSegment(center, current, pathEnd);
    let away = { x: center.x - closest.x, y: center.y - closest.y };
    let awayLength = Math.hypot(away.x, away.y);

    if (awayLength < 0.001) {
      const side = Math.sign((center.x - current.x) * perpendicular.x + (center.y - current.y) * perpendicular.y) || 1;
      away = { x: perpendicular.x * side, y: perpendicular.y * side };
      awayLength = 1;
    }

    // Only move a component when the pet's actual route runs through it (a real
    // squeeze). Components the pet merely passes near are left alone so cursor
    // movement on its own never disturbs the layout.
    const directHit = segmentHitsRect(current, pathEnd, obstacle.base);
    if (!directHit) continue;
    const pressure = clamp((COMPONENT_NUDGE_RADIUS - pathDistance) / COMPONENT_NUDGE_RADIUS, 0, 1);
    const amount = COMPONENT_NUDGE_MAX * pressure;
    if (amount < 0.5) continue;

    nudges.set(obstacle.element, {
      x: (away.x / awayLength) * amount,
      y: (away.y / awayLength) * amount,
    });
  }

  return nudges;
}

function setComponentNudge(element: HTMLElement, nudge: Point): void {
  element.classList.add("pet-soft-obstacle");
  element.style.setProperty("--pet-nudge-x", `${nudge.x.toFixed(2)}px`);
  element.style.setProperty("--pet-nudge-y", `${nudge.y.toFixed(2)}px`);
}

function clearComponentNudge(element: HTMLElement): void {
  element.style.setProperty("--pet-nudge-x", "0px");
  element.style.setProperty("--pet-nudge-y", "0px");
  window.setTimeout(() => {
    if (element.style.getPropertyValue("--pet-nudge-x") !== "0px") return;
    if (element.style.getPropertyValue("--pet-nudge-y") !== "0px") return;
    element.classList.remove("pet-soft-obstacle");
    element.style.removeProperty("--pet-nudge-x");
    element.style.removeProperty("--pet-nudge-y");
  }, 220);
}

function clearAllComponentNudges(elements: Set<HTMLElement>): void {
  for (const element of elements) {
    clearComponentNudge(element);
    element.classList.remove("pet-soft-obstacle");
    element.style.removeProperty("--pet-nudge-x");
    element.style.removeProperty("--pet-nudge-y");
  }
  elements.clear();
}

function stepToward(current: Point, target: Point, maxStep: number): Point {
  const targetDistance = distance(current, target);
  if (targetDistance <= maxStep) return target;

  return {
    x: current.x + ((target.x - current.x) / targetDistance) * maxStep,
    y: current.y + ((target.y - current.y) / targetDistance) * maxStep,
  };
}

function toDocumentPoint(clientX: number, clientY: number): Point {
  return {
    x: clientX + window.scrollX,
    y: clientY + window.scrollY,
  };
}

function shouldUpdateCursorVector(previous: CursorVector, next: CursorVector): boolean {
  return (
    Math.abs(previous.x - next.x) > 0.04 ||
    Math.abs(previous.y - next.y) > 0.04 ||
    Math.abs(previous.distance - next.distance) > 6
  );
}

function pickWanderTarget(bondLevel: BondLevel): Point {
  const pad = PAGE_EDGE_MARGIN;
  const { width, height } = getPageBounds();
  const wanderWidth = Math.max(1, width - pad * 2);
  const wanderHeight = Math.max(1, height - pad * 2);

  if (bondLevel >= 2) {
    // Stay near the visible area, but use document coordinates so scrolling does not jump the pet.
    const cx = window.scrollX + window.innerWidth / 2;
    const cy = window.scrollY + window.innerHeight / 2;
    const rx = window.innerWidth * 0.4;
    const ry = window.innerHeight * 0.4;
    return clampToPage({
      x: cx + (Math.random() * 2 - 1) * rx,
      y: cy + (Math.random() * 2 - 1) * ry,
    });
  }
  return clampToPage({
    x: pad + Math.random() * wanderWidth,
    y: pad + Math.random() * wanderHeight,
  });
}

// Rest point beside the cursor: back off along the pet's own approach direction
// so it hugs the pointer from whichever side it travelled in from, never
// covering the exact cursor point.
function settleBesideCursor(pet: Point, cursor: Point): Point {
  const dx = cursor.x - pet.x;
  const dy = cursor.y - pet.y;
  const dist = Math.hypot(dx, dy);
  if (dist <= SETTLE_OFFSET) {
    // Already within arm's reach — hold position rather than backing away.
    return pet;
  }
  return {
    x: cursor.x - (dx / dist) * SETTLE_OFFSET,
    y: cursor.y - (dy / dist) * SETTLE_OFFSET,
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
  const petX = useMotionValue(typeof window !== "undefined" ? window.scrollX + window.innerWidth / 2 : 400);
  const petY = useMotionValue(typeof window !== "undefined" ? window.scrollY + window.innerHeight + 80 : 600);
  const gazeX = useMotionValue(0);
  const gazeY = useMotionValue(-0.18);

  const [state, setState] = useState<PetState>("FOLLOWING");
  const [eyeShape, setEyeShape] = useState<EyeShape>("normal");
  const [bondLevel, setBondLevel] = useState<BondLevel>(0);
  const [cursorVector, setCursorVector] = useState<CursorVector>(DEFAULT_CURSOR_VECTOR);

  const stateRef = useRef<PetState>("FOLLOWING");
  const stateEnteredAt = useRef(Date.now());
  const cursorX = useRef(typeof window !== "undefined" ? window.scrollX + window.innerWidth / 2 : 400);
  const cursorY = useRef(typeof window !== "undefined" ? window.scrollY + window.innerHeight / 2 : 300);
  const cursorClientX = useRef(typeof window !== "undefined" ? window.innerWidth / 2 : 400);
  const cursorClientY = useRef(typeof window !== "undefined" ? window.innerHeight / 2 : 300);
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
  const cursorVectorRef = useRef<CursorVector>(DEFAULT_CURSOR_VECTOR);
  const obstaclesRef = useRef<ObstacleRect[]>([]);
  const lastObstacleRefreshAt = useRef(0);
  const targetRef = useRef<Point>({ x: cursorX.current, y: cursorY.current });
  // Eased steering target: the raw pathfinder waypoint can flip between frames
  // near obstacle edges, so we glide this toward it to keep motion smooth.
  const smoothTargetRef = useRef<Point | null>(null);
  const movementConfigRef = useRef<MovementConfig>(MOVEMENT_FOLLOW);
  const velocityRef = useRef<Point>({ x: 0, y: 0 });
  const lastFrameAt = useRef<number | null>(null);
  const pendingSpotlightFrame = useRef<number | null>(null);
  const pendingViewportSyncFrame = useRef<number | null>(null);
  const nudgedElementsRef = useRef<Set<HTMLElement>>(new Set());
  // True while the pet's target is the live cursor (any following state), so the
  // movement frame knows to apply settle-beside and guaranteed-reach behavior.
  const followingCursorRef = useRef(true);

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

  const refreshObstacles = useCallback(() => {
    obstaclesRef.current = collectObstacleRects();
    lastObstacleRefreshAt.current = Date.now();
  }, []);

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
    const syncPetMotion = () => {
      pendingSpotlightFrame.current = null;
      root.style.setProperty("--spotlight-x", `${petX.get() - window.scrollX}px`);
      root.style.setProperty("--spotlight-y", `${petY.get() - window.scrollY - 4}px`);
      updateGaze();
    };
    const schedulePetMotionSync = () => {
      if (pendingSpotlightFrame.current !== null) return;
      pendingSpotlightFrame.current = window.requestAnimationFrame(syncPetMotion);
    };

    syncPetMotion();

    const unsubscribeX = petX.on("change", schedulePetMotionSync);
    const unsubscribeY = petY.on("change", schedulePetMotionSync);
    window.addEventListener("scroll", schedulePetMotionSync, { passive: true });
    window.addEventListener("resize", schedulePetMotionSync);
    return () => {
      unsubscribeX();
      unsubscribeY();
      window.removeEventListener("scroll", schedulePetMotionSync);
      window.removeEventListener("resize", schedulePetMotionSync);
      if (pendingSpotlightFrame.current !== null) {
        window.cancelAnimationFrame(pendingSpotlightFrame.current);
        pendingSpotlightFrame.current = null;
      }
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
    const setImmediateCursorTarget = (documentPoint: Point) => {
      if (stateRef.current !== "WANDERING" && stateRef.current !== "SLEEPING") {
        targetRef.current = clampToPage(documentPoint);
      }
    };

    const updateCursorDocumentPoint = (documentPoint: Point, markActive: boolean) => {
      const now = Date.now();
      const dx = documentPoint.x - cursorX.current;
      const dy = documentPoint.y - cursorY.current;
      const moved = Math.hypot(dx, dy);

      if (moved > 0) {
        pointerDirection.current = { x: dx / moved, y: dy / moved };
      }

      cursorX.current = documentPoint.x;
      cursorY.current = documentPoint.y;
      updateGaze(documentPoint.x, documentPoint.y);

      if (markActive && moved > 2) {
        lastCursorMoveTime.current = now;
      }

      setImmediateCursorTarget(documentPoint);
      return { moved, now };
    };

    const handleMove = (e: PointerEvent) => {
      cursorClientX.current = e.clientX;
      cursorClientY.current = e.clientY;

      const documentPoint = toDocumentPoint(e.clientX, e.clientY);
      const { moved, now } = updateCursorDocumentPoint(documentPoint, true);
      const dtSeconds = Math.max(16, now - lastPointerSampleTime.current) / 1000;
      const instantSpeed = moved / dtSeconds;

      pointerSpeed.current = pointerSpeed.current * 0.32 + instantSpeed * 0.68;
      lastPointerSampleTime.current = now;

      // First pointer enter — trigger greeting
      if (!hasGreeted.current) {
        hasGreeted.current = true;
        transitionTo("GREETING");
      }

      // Wake from sleep if cursor has moved significantly
      if (stateRef.current === "SLEEPING") {
        const sleepStartX = petX.get();
        const sleepStartY = petY.get();
        const dist = Math.hypot(documentPoint.x - sleepStartX, documentPoint.y - sleepStartY);
        if (dist > 28 || pointerSpeed.current > 120) {
          transitionTo("FOLLOWING");
          setImmediateCursorTarget(documentPoint);
        }
      } else if (
        hasGreeted.current &&
        pointerSpeed.current > FAST_POINTER_SPEED &&
        now - lastReactiveMoveTime.current > 780 &&
        stateRef.current !== "GREETING"
      ) {
        lastReactiveMoveTime.current = now;
        const dist = Math.hypot(documentPoint.x - petX.get(), documentPoint.y - petY.get());
        transitionTo(dist < CLOSE_DISTANCE ? "POUNCING" : "EXCITED");
      }
    };

    const handlePointerDown = (e: PointerEvent) => {
      const target = e.target instanceof Element ? e.target : null;
      const interactiveTarget = target?.closest(
        "a, button, input, textarea, select, summary, [role='button']"
      );
      const documentPoint = toDocumentPoint(e.clientX, e.clientY);
      const dist = Math.hypot(documentPoint.x - petX.get(), documentPoint.y - petY.get());

      cursorClientX.current = e.clientX;
      cursorClientY.current = e.clientY;
      updateCursorDocumentPoint(documentPoint, true);
      lastCursorMoveTime.current = Date.now();

      if (dist < CLOSE_DISTANCE) {
        playWithPet();
      } else if (!interactiveTarget) {
        lastReactiveMoveTime.current = Date.now();
        transitionTo("POUNCING");
      }
    };

    const syncCursorAfterViewportChange = () => {
      pendingViewportSyncFrame.current = null;
      const documentPoint = toDocumentPoint(cursorClientX.current, cursorClientY.current);
      const { moved } = updateCursorDocumentPoint(documentPoint, true);
      if (moved > 0) {
        pointerSpeed.current *= 0.42;
      }
      refreshObstacles();
    };

    const handleViewportChange = () => {
      if (pendingViewportSyncFrame.current !== null) return;
      pendingViewportSyncFrame.current = window.requestAnimationFrame(syncCursorAfterViewportChange);
    };

    window.addEventListener("pointermove", handleMove, { passive: true });
    window.addEventListener("pointerdown", handlePointerDown, { passive: true });
    window.addEventListener("scroll", handleViewportChange, { passive: true });
    window.addEventListener("resize", handleViewportChange);
    return () => {
      window.removeEventListener("pointermove", handleMove);
      window.removeEventListener("pointerdown", handlePointerDown);
      window.removeEventListener("scroll", handleViewportChange);
      window.removeEventListener("resize", handleViewportChange);
      if (pendingViewportSyncFrame.current !== null) {
        window.cancelAnimationFrame(pendingViewportSyncFrame.current);
        pendingViewportSyncFrame.current = null;
      }
    };
  }, [petX, petY, playWithPet, refreshObstacles, transitionTo, updateGaze]);

  // Smooth page-space steering. The pet never teleports toward a new target; even after
  // fast scrolls or delayed frames, it advances by a small capped distance.
  useEffect(() => {
    refreshObstacles();

    let frameId = 0;
    const moveFrame = (timestamp: number) => {
      if (document.visibilityState === "hidden") {
        lastFrameAt.current = timestamp;
        velocityRef.current = { x: 0, y: 0 };
        clearAllComponentNudges(nudgedElementsRef.current);
        frameId = window.requestAnimationFrame(moveFrame);
        return;
      }

      const previousTimestamp = lastFrameAt.current ?? timestamp;
      const dt = clamp((timestamp - previousTimestamp) / 1000, 0, 0.04);
      lastFrameAt.current = timestamp;

      if (Date.now() - lastObstacleRefreshAt.current > OBSTACLE_REFRESH_MS) {
        refreshObstacles();
      }

      const current = { x: petX.get(), y: petY.get() };
      const obstacles = obstaclesRef.current;

      if (stateRef.current === "SLEEPING" || dt <= 0) {
        velocityRef.current = stepToward(velocityRef.current, { x: 0, y: 0 }, MOVEMENT_FOLLOW.acceleration * dt);
        clearAllComponentNudges(nudgedElementsRef.current);
        frameId = window.requestAnimationFrame(moveFrame);
        return;
      }

      const baseCfg = movementConfigRef.current;
      // Off-screen the pet doubles its pace to rejoin the viewport; on-screen it
      // ambles toward the cursor at the calm base speed.
      const offscreen = isPetOffscreen(current);
      const cfg: MovementConfig = offscreen
        ? {
            maxSpeed: baseCfg.maxSpeed * OFFSCREEN_SPEED_MULTIPLIER,
            acceleration: baseCfg.acceleration * OFFSCREEN_SPEED_MULTIPLIER,
          }
        : baseCfg;
      const followingCursor = followingCursorRef.current;
      // While following, steer toward the live cursor (fresher than the 120ms
      // state-machine target) and settle just beside it from the approach side.
      const liveCursor = clampToPage({ x: cursorX.current, y: cursorY.current });
      const followTarget =
        distance(current, liveCursor) < SETTLE_ENGAGE_DISTANCE
          ? settleBesideCursor(current, liveCursor)
          : liveCursor;
      const desired = clampToPage(followingCursor ? followTarget : targetRef.current);
      // The pet ALWAYS routes around components and never overlaps them. When the
      // cursor sits on/behind a component (or is otherwise unreachable by going
      // around), the route resolves to the nearest reachable open point and the
      // pet simply waits there — it never cuts through.
      const movementObstacles = obstacles;
      const currentBlocked = isBlocked(current, movementObstacles);
      const rawRouteTarget = currentBlocked
        ? pushOutOfObstacles(current, movementObstacles)
        : findNavigableTarget(current, desired, movementObstacles);

      // Glide the steering target toward the raw waypoint so frame-to-frame
      // flips near obstacle edges don't make the pet jerk. If the eased target
      // would land inside an obstacle, snap it back out so we never steer into one.
      // Re-anchor the eased target near the pet after big discontinuities (scroll
      // jumps, target teleports) so it never crawls across the whole page.
      const previousSmooth =
        smoothTargetRef.current && distance(smoothTargetRef.current, current) < 800
          ? smoothTargetRef.current
          : current;
      let routeTarget = {
        x: previousSmooth.x + (rawRouteTarget.x - previousSmooth.x) * TARGET_SMOOTHING,
        y: previousSmooth.y + (rawRouteTarget.y - previousSmooth.y) * TARGET_SMOOTHING,
      };
      if (isBlocked(routeTarget, movementObstacles)) {
        routeTarget = rawRouteTarget;
      }
      smoothTargetRef.current = routeTarget;

      const nudges = computeComponentNudges(current, routeTarget, obstacles);
      for (const element of nudgedElementsRef.current) {
        if (!nudges.has(element)) {
          clearComponentNudge(element);
        }
      }
      for (const [element, nudge] of nudges) {
        setComponentNudge(element, nudge);
      }
      nudgedElementsRef.current = new Set(nudges.keys());

      const routeDistance = distance(current, routeTarget);
      let nextVelocity = velocityRef.current;
      let nextPosition = current;

      // Always blend velocity toward the desired heading and decelerate smoothly
      // near the target — never hard-zero it, which is what caused the stutter.
      const desiredVelocity =
        routeDistance < 0.5
          ? { x: 0, y: 0 }
          : {
              x: ((routeTarget.x - current.x) / routeDistance) * cfg.maxSpeed,
              y: ((routeTarget.y - current.y) / routeDistance) * cfg.maxSpeed,
            };
      nextVelocity = stepToward(nextVelocity, desiredVelocity, cfg.acceleration * dt);
      nextPosition = {
        x: current.x + nextVelocity.x * dt,
        y: current.y + nextVelocity.y * dt,
      };

      // Don't overshoot the target.
      if (routeDistance > 0.5 && distance(current, nextPosition) > routeDistance) {
        nextPosition = routeTarget;
      }

      // If the step would clip an obstacle, slide to the last clear point along
      // the way instead of stopping dead — keeps the glide continuous.
      if (!currentBlocked && (isBlocked(nextPosition, movementObstacles) || !hasClearSegment(current, nextPosition, movementObstacles))) {
        const stepLength = distance(current, nextPosition);
        let safe = current;
        const probes = 6;
        for (let p = 1; p <= probes; p += 1) {
          const t = p / probes;
          const probe = { x: current.x + (nextPosition.x - current.x) * t, y: current.y + (nextPosition.y - current.y) * t };
          if (isBlocked(probe, movementObstacles) || !hasClearSegment(current, probe, movementObstacles)) break;
          safe = probe;
        }
        nextPosition = safe;
        // Bleed off velocity gently rather than snapping to zero.
        const reached = stepLength > 0.001 ? distance(current, safe) / stepLength : 0;
        nextVelocity = { x: nextVelocity.x * reached * 0.5, y: nextVelocity.y * reached * 0.5 };
      }

      if (distance(current, nextPosition) > 0.01) {
        petX.set(nextPosition.x);
        petY.set(nextPosition.y);
      }
      velocityRef.current = nextVelocity;
      frameId = window.requestAnimationFrame(moveFrame);
    };

    frameId = window.requestAnimationFrame(moveFrame);
    return () => {
      window.cancelAnimationFrame(frameId);
      lastFrameAt.current = null;
      velocityRef.current = { x: 0, y: 0 };
      smoothTargetRef.current = null;
      clearAllComponentNudges(nudgedElementsRef.current);
    };
  }, [petX, petY, refreshObstacles]);

  // State machine tick
  useEffect(() => {
    const tick = () => {
      if (document.visibilityState === "hidden") return;

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
      let movementCfg: MovementConfig = MOVEMENT_FOLLOW;

      if (idleMs > 260) {
        pointerSpeed.current *= 0.72;
      }

      switch (current) {
        case "GREETING": {
          if (stateAge > 2000) transitionTo("FOLLOWING");
          targetX = cx;
          targetY = cy;
          movementCfg = MOVEMENT_EXCITED;
          break;
        }

        case "FOLLOWING": {
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
          targetX = cx;
          targetY = cy;
          movementCfg = speed > FAST_POINTER_SPEED ? MOVEMENT_EXCITED : MOVEMENT_FOLLOW;
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
          movementCfg = MOVEMENT_WANDER;
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
          targetX = cx;
          targetY = cy;
          movementCfg = MOVEMENT_EXCITED;
          break;
        }

        case "POUNCING": {
          if (stateAge > 720) {
            transitionTo(dist < CLOSE_DISTANCE ? "PLAYING" : "FOLLOWING");
            break;
          }
          targetX = cx;
          targetY = cy;
          movementCfg = MOVEMENT_POUNCE;
          break;
        }

        case "SLEEPING": {
          // Wake handled by pointermove listener; keep still
          targetX = px;
          targetY = py;
          movementCfg = MOVEMENT_FOLLOW;
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
          targetX = cx;
          targetY = cy;
          movementCfg = speed > 520 ? MOVEMENT_EXCITED : MOVEMENT_FOLLOW;
          break;
        }
      }

      targetRef.current = clampToPage({ x: targetX, y: targetY });
      movementConfigRef.current = movementCfg;
      const activeState = stateRef.current;
      followingCursorRef.current = activeState !== "WANDERING" && activeState !== "SLEEPING";

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
  }, [petX, petY, transitionTo]);

  // Relationship accumulation (200ms)
  useEffect(() => {
    const accumulateTick = () => {
      if (document.visibilityState === "hidden") return;

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

  return { petX, petY, gazeX, gazeY, state, bondLevel, eyeShape, isWagging, cursorVector };
}
