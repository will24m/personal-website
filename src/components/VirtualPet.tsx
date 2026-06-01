import { motion, useTransform } from "framer-motion";
import type { MotionValue, TargetAndTransition } from "framer-motion";
import { usePetBrain, type PetState, type EyeShape, type CursorVector } from "../hooks/usePetBrain.js";
import type { BondLevel } from "../utils/petStorage.js";
import "../../styles/virtual-pet.css";

// Blob body path — organic cubic bezier, same point count for morphing
const BODY_PATH =
  "M 36 8 C 52 8 64 18 64 34 C 64 46 58 56 48 61 C 44 63 40 64 36 64 C 32 64 28 63 24 61 C 14 56 8 46 8 34 C 8 18 20 8 36 8 Z";

const BODY_COLORS: Record<BondLevel, string> = {
  0: "rgba(200,210,220,0.92)",
  1: "rgba(210,218,228,0.93)",
  2: "rgba(220,228,235,0.95)",
  3: "rgba(235,240,245,0.97)",
  4: "rgba(245,248,252,1.0)",
};

const MOUTH_PATHS: Record<PetState, string> = {
  FOLLOWING: "M 26 44 Q 36 50 46 44",
  WANDERING: "M 28 44 Q 36 48 44 44",
  EXCITED:   "M 24 42 Q 36 54 48 42",
  POUNCING:  "M 24 42 Q 36 56 48 42",
  SLEEPING:  "M 30 44 Q 36 46 42 44",
  PLAYING:   "M 24 42 Q 36 54 48 42",
  GREETING:  "M 24 42 Q 36 54 48 42",
};

const BODY_ANIMATE: Record<PetState, TargetAndTransition> = {
  FOLLOWING: { scale: 1,    rotate: 0 },
  WANDERING: { scale: 0.92, rotate: 0 },
  EXCITED:   { scale: [1, 1.22, 0.9, 1.08, 1], rotate: 0 },
  POUNCING:  { scale: [1, 1.24, 0.92, 1.08], rotate: [0, -10, 8, 0] },
  SLEEPING:  { scale: 0.85, rotate: 12 },
  PLAYING:   { rotate: [0, 14, -14, 9, -9, 0], scale: 1.05 },
  GREETING:  { scale: [0, 1.28, 0.9, 1.1, 1], rotate: 0 },
};

const BODY_TRANSITION: Record<PetState, object> = {
  FOLLOWING: { type: "spring", stiffness: 200, damping: 20 },
  WANDERING: { type: "spring", stiffness: 150, damping: 25 },
  EXCITED:   { duration: 0.55, ease: "easeInOut" },
  POUNCING:  { duration: 0.42, ease: "easeInOut" },
  SLEEPING:  { type: "spring", stiffness: 80,  damping: 18 },
  PLAYING:   { duration: 0.8,  ease: "easeInOut", repeat: Infinity, repeatType: "loop" as const },
  GREETING:  { duration: 0.6,  ease: "easeOut" },
};

const SPARK_POINTS = [
  { cx: 13, cy: 20, r: 2.2, delay: 0 },
  { cx: 57, cy: 17, r: 1.8, delay: 0.12 },
  { cx: 10, cy: 48, r: 1.6, delay: 0.24 },
  { cx: 62, cy: 46, r: 2, delay: 0.08 },
];

function TailPath({ isWagging }: { isWagging: boolean }) {
  return (
    <motion.path
      d="M 50 56 Q 62 68 56 78 Q 50 88 58 94"
      fill="none"
      strokeLinecap="round"
      strokeWidth={5}
      style={{ stroke: "inherit", transformOrigin: "50px 56px" }}
      animate={{ rotate: isWagging ? [0, 35, -35, 28, -28, 0] : [0, 15, -15, 0] }}
      transition={
        isWagging
          ? { duration: 0.6, repeat: Infinity, repeatType: "loop", ease: "easeInOut" }
          : { duration: 2.2, repeat: Infinity, repeatType: "loop", ease: "easeInOut" }
      }
    />
  );
}

function EarLeft({ bondLevel }: { bondLevel: BondLevel }) {
  const perked = bondLevel >= 2;
  return (
    <motion.path
      d="M 18 20 L 12 6 L 26 14 Z"
      fill="inherit"
      animate={{ rotate: perked ? -12 : 0, scaleY: perked ? 1.15 : 1 }}
      transition={{ type: "spring", stiffness: 160, damping: 18 }}
      style={{ transformOrigin: "20px 16px" }}
    />
  );
}

function EarRight({ bondLevel }: { bondLevel: BondLevel }) {
  const perked = bondLevel >= 2;
  return (
    <motion.path
      d="M 54 20 L 60 6 L 46 14 Z"
      fill="inherit"
      animate={{ rotate: perked ? 12 : 0, scaleY: perked ? 1.15 : 1 }}
      transition={{ type: "spring", stiffness: 160, damping: 18 }}
      style={{ transformOrigin: "52px 16px" }}
    />
  );
}

function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}

function FrontPaw({
  bodyColor,
  cursorVector,
  side,
  state,
  strokeColor,
}: {
  bodyColor: string;
  cursorVector: CursorVector;
  side: -1 | 1;
  state: PetState;
  strokeColor: string;
}) {
  const reactive = state === "GREETING" || state === "EXCITED" || state === "POUNCING" || state === "PLAYING";
  const activeSide = cursorVector.x < 0 ? -1 : 1;
  const isActive = side === activeSide || cursorVector.distance < 44;
  const normalizedX = cursorVector.distance > 2 ? cursorVector.x : side * 0.35;
  const normalizedY = cursorVector.distance > 2 ? cursorVector.y : 0.45;
  const reachBase =
    state === "POUNCING"
      ? 24
      : state === "PLAYING"
        ? 20
        : state === "EXCITED" || state === "GREETING"
          ? 17
          : cursorVector.distance < 120
            ? 14
            : 7;
  const reach = isActive ? reachBase : reachBase * 0.48;
  const shoulderX = side === -1 ? 23 : 49;
  const shoulderY = 42;
  const pawX = shoulderX + side * 6 + normalizedX * reach + (isActive ? side * 4 : 0);
  const pawY = shoulderY + 13 + clamp(normalizedY, -0.8, 0.9) * reach;
  const elbowX = (shoulderX + pawX) / 2 + side * (isActive ? 4 : 6);
  const elbowY = Math.min(62, (shoulderY + pawY) / 2 + (isActive ? 8 : 5));
  const path = `M ${shoulderX} ${shoulderY} Q ${elbowX} ${elbowY} ${pawX} ${pawY}`;
  const swatPawX = pawX + side * (isActive ? 8 : 2) + normalizedX * 4;
  const swatPawY = pawY - (isActive ? 5 : 1);
  const swatPath = `M ${shoulderX} ${shoulderY} Q ${elbowX + side * 3} ${elbowY - 3} ${swatPawX} ${swatPawY}`;
  const clawPath = `M ${pawX - 2.8} ${pawY + 1.2} L ${pawX - 1.4} ${pawY + 4.2} M ${pawX + 1.4} ${pawY + 4.2} L ${pawX + 2.8} ${pawY + 1.2}`;
  const swatClawPath = `M ${swatPawX - 2.8} ${swatPawY + 1.2} L ${swatPawX - 1.4} ${swatPawY + 4.2} M ${swatPawX + 1.4} ${swatPawY + 4.2} L ${swatPawX + 2.8} ${swatPawY + 1.2}`;
  const isSwatting = reactive && (state === "POUNCING" || state === "PLAYING") && isActive;
  const swatTransition = {
    duration: state === "POUNCING" ? 0.34 : 0.62,
    ease: "easeInOut",
    repeat: state === "PLAYING" ? Infinity : 0,
    repeatDelay: state === "PLAYING" ? 0.2 : 0,
  };

  return (
    <motion.g>
      <motion.path
        fill="none"
        stroke={strokeColor}
        strokeLinecap="round"
        strokeWidth={5.4}
        animate={{ d: isSwatting ? [path, swatPath, path] : path }}
        transition={swatTransition}
      />
      <motion.circle
        r={6.2}
        fill={bodyColor}
        stroke={strokeColor}
        strokeWidth={1.4}
        animate={{
          cx: isSwatting ? [pawX, swatPawX, pawX] : pawX,
          cy: isSwatting ? [pawY, swatPawY, pawY] : pawY,
          scale: isSwatting ? [1, 1.16, 0.98, 1] : isActive && reactive ? 1.05 : 0.96,
        }}
        transition={swatTransition}
      />
      <motion.path
        fill="none"
        stroke="rgba(28,30,34,0.42)"
        strokeLinecap="round"
        strokeWidth={1.1}
        animate={{
          d: isSwatting ? [clawPath, swatClawPath, clawPath] : clawPath,
          opacity: reactive ? 0.72 : 0.42,
        }}
        transition={swatTransition}
      />
    </motion.g>
  );
}

function Eye({
  cx,
  cy,
  gazeX,
  gazeY,
  shape,
}: {
  cx: number;
  cy: number;
  gazeX: MotionValue<number>;
  gazeY: MotionValue<number>;
  shape: EyeShape;
}) {
  const r = shape === "wide" ? 5.4 : shape === "squint" ? 3.4 : 4.4;
  const scaleY = shape === "squint" ? 0.55 : 1;
  const pupilR = shape === "wide" ? 2.65 : shape === "squint" ? 1.9 : 2.35;
  const travel = shape === "wide" ? 2.85 : shape === "squint" ? 1.35 : 2.25;
  const pupilCx = useTransform(gazeX, (x) => cx + x * travel);
  const pupilCy = useTransform(gazeY, (y) => cy + y * travel);
  const glintCx = useTransform(gazeX, (x) => cx + x * travel - pupilR * 0.35);
  const glintCy = useTransform(gazeY, (y) => cy + y * travel - pupilR * 0.35);
  const heartX = useTransform(gazeX, (x) => x * 1.8);
  const heartY = useTransform(gazeY, (y) => y * 1.6);

  if (shape === "heart") {
    // Heart shape using two bumps
    const hx = cx - 5;
    const hy = cy - 4;
    return (
      <motion.g
        initial={{ scale: 0.5, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", stiffness: 300, damping: 18 }}
        style={{ x: heartX, y: heartY, transformOrigin: `${cx}px ${cy}px` }}
      >
        <path
          d={`M ${hx + 5} ${hy + 2} C ${hx + 5} ${hy} ${hx + 2} ${hy - 2} ${hx} ${hy} C ${hx - 3} ${hy} ${hx - 5} ${hy + 2} ${hx - 5} ${hy + 4} C ${hx - 5} ${hy + 7} ${hx} ${hy + 10} ${hx + 5} ${hy + 13} C ${hx + 10} ${hy + 10} ${hx + 15} ${hy + 7} ${hx + 15} ${hy + 4} C ${hx + 15} ${hy + 2} ${hx + 13} ${hy} ${hx + 10} ${hy} C ${hx + 8} ${hy} ${hx + 5} ${hy + 2} ${hx + 5} ${hy + 2} Z`}
          fill="#e05070"
          transform={`translate(${cx - hx - 5} ${cy - hy - 5}) scale(0.52)`}
        />
      </motion.g>
    );
  }

  if (shape === "sleepy") {
    return (
      <g>
        <circle cx={cx} cy={cy} r={4} fill="#1a1c20" />
        {/* Droopy lid covers top half */}
        <rect
          x={cx - 5}
          y={cy - 5}
          width={10}
          height={5.5}
          fill="inherit"
          rx={2}
        />
      </g>
    );
  }

  return (
    <motion.g
      animate={{ scaleY }}
      transition={{ type: "spring", stiffness: 200, damping: 20 }}
      style={{ transformOrigin: `${cx}px ${cy}px` }}
    >
      <circle cx={cx} cy={cy} r={r} fill="rgba(255,255,255,0.82)" stroke="#1a1c20" strokeWidth={1.05} />
      <motion.circle
        cx={pupilCx}
        cy={pupilCy}
        r={pupilR}
        fill="#1a1c20"
        stroke="none"
        data-eye-pupil={`${cx}-${cy}`}
      />
      <motion.circle cx={glintCx} cy={glintCy} r={pupilR * 0.28} fill="rgba(255,255,255,0.62)" stroke="none" />
    </motion.g>
  );
}

function Whiskers({ cursorVector, state }: { cursorVector: CursorVector; state: PetState }) {
  const twitch = state === "POUNCING" || state === "PLAYING";
  const offset = clamp(cursorVector.x * 2.6, -2.4, 2.4);

  return (
    <motion.g
      animate={{
        x: twitch ? [0, offset, -offset * 0.5, 0] : offset,
        opacity: state === "SLEEPING" ? 0.34 : 0.58,
      }}
      transition={{
        duration: twitch ? 0.5 : 0.22,
        repeat: twitch ? Infinity : 0,
        repeatDelay: 0.28,
        ease: "easeInOut",
      }}
      stroke="#1a1c20"
      strokeLinecap="round"
      strokeWidth={1.15}
    >
      <path d="M 21 38 L 9 35" />
      <path d="M 21 41 L 8 41" />
      <path d="M 21 44 L 10 48" />
      <path d="M 51 38 L 63 35" />
      <path d="M 51 41 L 64 41" />
      <path d="M 51 44 L 62 48" />
    </motion.g>
  );
}

function ReactionSparks({ state }: { state: PetState }) {
  const isReactive = state === "GREETING" || state === "EXCITED" || state === "POUNCING" || state === "PLAYING";
  const isPlaying = state === "POUNCING" || state === "PLAYING";

  return (
    <motion.g
      animate={{ opacity: isReactive ? 1 : 0 }}
      transition={{ duration: 0.16 }}
      style={{ transformOrigin: "36px 36px" }}
    >
      {SPARK_POINTS.map((spark, index) => (
        <motion.circle
          key={`${spark.cx}-${spark.cy}`}
          cx={spark.cx}
          cy={spark.cy}
          r={spark.r}
          fill={index % 2 === 0 ? "rgba(255,255,255,0.9)" : "rgba(180,210,255,0.75)"}
          stroke="none"
          animate={{
            opacity: isReactive ? [0.25, 1, 0.25] : 0,
            scale: isReactive ? [0.7, isPlaying ? 1.55 : 1.25, 0.7] : 0.6,
            y: isReactive ? [0, -5, 0] : 0,
          }}
          transition={{
            duration: isPlaying ? 0.62 : 0.9,
            delay: spark.delay,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      ))}
    </motion.g>
  );
}

export function VirtualPet() {
  const { petX, petY, gazeX, gazeY, state, bondLevel, eyeShape, isWagging, cursorVector } = usePetBrain();

  const bodyColor = BODY_COLORS[bondLevel];
  const strokeColor =
    bondLevel >= 3 ? "rgba(190,200,215,0.85)" : "rgba(170,185,200,0.7)";

  return (
    <div className="virtual-pet-layer" aria-hidden="true">
      <motion.div
        className={`virtual-pet virtual-pet--${state.toLowerCase()}`}
        style={{ x: petX, y: petY }}
      >
        <motion.svg
          width="72"
          height="72"
          viewBox="0 0 72 72"
          overflow="visible"
          animate={BODY_ANIMATE[state]}
          transition={BODY_TRANSITION[state]}
          style={{ fill: bodyColor, stroke: strokeColor, overflow: "visible" }}
        >
          {/* Shadow */}
          <ellipse
            cx={36}
            cy={70}
            rx={18}
            ry={4}
            fill="rgba(0,0,0,0.18)"
            stroke="none"
          />

          <ReactionSparks state={state} />

          {/* Tail (behind body) */}
          <TailPath isWagging={isWagging} />

          {/* Ears (behind body) */}
          <EarLeft bondLevel={bondLevel} />
          <EarRight bondLevel={bondLevel} />

          {/* Body blob */}
          <path d={BODY_PATH} strokeWidth={1.5} />

          <FrontPaw
            bodyColor={bodyColor}
            cursorVector={cursorVector}
            side={-1}
            state={state}
            strokeColor={strokeColor}
          />
          <FrontPaw
            bodyColor={bodyColor}
            cursorVector={cursorVector}
            side={1}
            state={state}
            strokeColor={strokeColor}
          />

          {/* Blush marks (EXCITED / PLAYING) */}
          <motion.g
            animate={{
              opacity: state === "EXCITED" || state === "PLAYING" ? 1 : 0,
              scale:   state === "EXCITED" || state === "PLAYING" ? 1 : 0.4,
            }}
            transition={{ duration: 0.3 }}
            style={{ transformOrigin: "36px 44px" }}
          >
            <circle cx={22} cy={44} r={5} fill="rgba(230,130,140,0.45)" stroke="none" />
            <circle cx={50} cy={44} r={5} fill="rgba(230,130,140,0.45)" stroke="none" />
          </motion.g>

          {/* Eyes */}
          <Eye cx={26} cy={34} gazeX={gazeX} gazeY={gazeY} shape={eyeShape} />
          <Eye cx={46} cy={34} gazeX={gazeX} gazeY={gazeY} shape={eyeShape} />

          {/* Mouth */}
          <motion.path
            animate={{ d: MOUTH_PATHS[state] }}
            transition={{ duration: 0.35, ease: "easeInOut" }}
            fill="none"
            stroke="#1a1c20"
            strokeWidth={2}
            strokeLinecap="round"
          />

          <Whiskers cursorVector={cursorVector} state={state} />

          {/* Sleeping Zzz */}
          {state === "SLEEPING" && (
            <motion.text
              x={52}
              y={16}
              fontSize={10}
              fontFamily="Sora, sans-serif"
              fontWeight="700"
              fill="rgba(160,175,195,0.8)"
              stroke="none"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: [0, 1, 1, 0], y: [20, 14, 8, 2] }}
              transition={{ duration: 2.4, repeat: Infinity, ease: "easeOut" }}
            >
              z
            </motion.text>
          )}
        </motion.svg>
      </motion.div>
    </div>
  );
}
