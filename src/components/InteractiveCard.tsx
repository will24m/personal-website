import { Card, type CardProps } from "@mui/material";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { useCallback } from "react";
import type React from "react";

export function InteractiveCard({ children, className = "", sx = {}, ...props }: CardProps) {
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const rotateX = useSpring(useTransform(y, [-0.5, 0.5], [8, -8]), {
    stiffness: 300,
    damping: 30,
  });
  const rotateY = useSpring(useTransform(x, [-0.5, 0.5], [-8, 8]), {
    stiffness: 300,
    damping: 30,
  });

  const handleMove = useCallback(
    (e: React.PointerEvent<HTMLDivElement>) => {
      const rect = e.currentTarget.getBoundingClientRect();
      const nx = (e.clientX - rect.left) / rect.width - 0.5;
      const ny = (e.clientY - rect.top) / rect.height - 0.5;
      x.set(nx);
      y.set(ny);
      e.currentTarget.style.setProperty("--card-mouse-x", `${e.clientX - rect.left}px`);
      e.currentTarget.style.setProperty("--card-mouse-y", `${e.clientY - rect.top}px`);
      e.currentTarget.style.setProperty("--layer-x", `${nx * 9.6}px`);
      e.currentTarget.style.setProperty("--layer-y", `${ny * 9.6}px`);
    },
    [x, y]
  );

  const handleLeave = useCallback(
    (e: React.PointerEvent<HTMLDivElement>) => {
      x.set(0);
      y.set(0);
      e.currentTarget.style.setProperty("--card-mouse-x", "50%");
      e.currentTarget.style.setProperty("--card-mouse-y", "50%");
      e.currentTarget.style.setProperty("--layer-x", "0px");
      e.currentTarget.style.setProperty("--layer-y", "0px");
    },
    [x, y]
  );

  return (
    <motion.div
      className={`mouse-stage ${className}`.trim()}
      style={{ rotateX, rotateY, transformPerspective: 1100, transformStyle: "preserve-3d" }}
      onPointerMove={handleMove}
      onPointerLeave={handleLeave}
    >
      <Card sx={{ overflow: "hidden", ...sx }} {...props}>
        {children}
      </Card>
    </motion.div>
  );
}
