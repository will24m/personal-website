import { motion } from "framer-motion";
import type { TargetAndTransition } from "framer-motion";
import { usePetBrain, type PetState, type EyeShape } from "../hooks/usePetBrain.js";
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
  SLEEPING:  "M 30 44 Q 36 46 42 44",
  PLAYING:   "M 24 42 Q 36 54 48 42",
  GREETING:  "M 24 42 Q 36 54 48 42",
};

const BODY_ANIMATE: Record<PetState, TargetAndTransition> = {
  FOLLOWING: { scale: 1,    rotate: 0 },
  WANDERING: { scale: 0.92, rotate: 0 },
  EXCITED:   { scale: [1, 1.22, 0.9, 1.08, 1], rotate: 0 },
  SLEEPING:  { scale: 0.85, rotate: 12 },
  PLAYING:   { rotate: [0, 14, -14, 9, -9, 0], scale: 1.05 },
  GREETING:  { scale: [0, 1.28, 0.9, 1.1, 1], rotate: 0 },
};

const BODY_TRANSITION: Record<PetState, object> = {
  FOLLOWING: { type: "spring", stiffness: 200, damping: 20 },
  WANDERING: { type: "spring", stiffness: 150, damping: 25 },
  EXCITED:   { duration: 0.55, ease: "easeInOut" },
  SLEEPING:  { type: "spring", stiffness: 80,  damping: 18 },
  PLAYING:   { duration: 0.8,  ease: "easeInOut", repeat: Infinity, repeatType: "loop" as const },
  GREETING:  { duration: 0.6,  ease: "easeOut" },
};

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

function Eye({ cx, cy, shape }: { cx: number; cy: number; shape: EyeShape }) {
  if (shape === "heart") {
    // Heart shape using two bumps
    const hx = cx - 5;
    const hy = cy - 4;
    return (
      <motion.g
        initial={{ scale: 0.5, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", stiffness: 300, damping: 18 }}
        style={{ transformOrigin: `${cx}px ${cy}px` }}
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

  const r = shape === "wide" ? 5 : shape === "squint" ? 3.2 : 4;
  const scaleY = shape === "squint" ? 0.55 : 1;
  const pupilR = r * 0.52;

  return (
    <motion.g
      animate={{ scaleY }}
      transition={{ type: "spring", stiffness: 200, damping: 20 }}
      style={{ transformOrigin: `${cx}px ${cy}px` }}
    >
      <circle cx={cx} cy={cy} r={r} fill="#1a1c20" />
      <circle cx={cx - pupilR * 0.3} cy={cy - pupilR * 0.3} r={pupilR * 0.45} fill="rgba(255,255,255,0.55)" />
    </motion.g>
  );
}

export function VirtualPet() {
  const { petX, petY, state, bondLevel, eyeShape, isWagging } = usePetBrain();

  const bodyColor = BODY_COLORS[bondLevel];
  const strokeColor =
    bondLevel >= 3 ? "rgba(190,200,215,0.85)" : "rgba(170,185,200,0.7)";

  return (
    <div className="virtual-pet-layer" aria-hidden="true">
      <motion.div
        className="virtual-pet"
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

          {/* Tail (behind body) */}
          <TailPath isWagging={isWagging} />

          {/* Ears (behind body) */}
          <EarLeft bondLevel={bondLevel} />
          <EarRight bondLevel={bondLevel} />

          {/* Body blob */}
          <path d={BODY_PATH} strokeWidth={1.5} />

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
          <Eye cx={26} cy={34} shape={eyeShape} />
          <Eye cx={46} cy={34} shape={eyeShape} />

          {/* Mouth */}
          <motion.path
            animate={{ d: MOUTH_PATHS[state] }}
            transition={{ duration: 0.35, ease: "easeInOut" }}
            fill="none"
            stroke="#1a1c20"
            strokeWidth={2}
            strokeLinecap="round"
          />

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
