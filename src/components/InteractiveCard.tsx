import { Card, type CardProps } from "@mui/material";
import { useCallback } from "react";
import type React from "react";

export function InteractiveCard({ children, className = "", sx = {}, ...props }: CardProps) {
  // The card no longer tilts or shifts toward the cursor — only the pet may move
  // components. We keep the soft light-glow that tracks the cursor, since that is
  // lighting rather than movement.
  const handleMove = useCallback((e: React.PointerEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    e.currentTarget.style.setProperty("--card-mouse-x", `${e.clientX - rect.left}px`);
    e.currentTarget.style.setProperty("--card-mouse-y", `${e.clientY - rect.top}px`);
  }, []);

  const handleLeave = useCallback((e: React.PointerEvent<HTMLDivElement>) => {
    e.currentTarget.style.setProperty("--card-mouse-x", "50%");
    e.currentTarget.style.setProperty("--card-mouse-y", "50%");
  }, []);

  return (
    <div className={`mouse-stage ${className}`.trim()} onPointerMove={handleMove} onPointerLeave={handleLeave}>
      <Card sx={{ overflow: "hidden", ...sx }} {...props}>
        {children}
      </Card>
    </div>
  );
}
