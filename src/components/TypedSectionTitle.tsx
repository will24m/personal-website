import { useState, useEffect, useRef, useMemo } from "react";
import { Typography, type TypographyProps } from "@mui/material";
import { useInView } from "framer-motion";
import { buildTypingFrames, typingDelay } from "../utils/typing.js";

interface TypedSectionTitleProps {
  text: string;
  className?: string;
  variant?: TypographyProps["variant"];
}

export function TypedSectionTitle({
  text,
  className = "section-title",
  variant = "h2",
}: TypedSectionTitleProps) {
  const ref = useRef<HTMLElement>(null);
  const visible = useInView(ref, { amount: 0.3, margin: "0px 0px -40px 0px" });
  const [displayText, setDisplayText] = useState("");
  const displayTextRef = useRef("");
  displayTextRef.current = displayText;
  const timerRef = useRef<number>(0);
  const typingFrames = useMemo(() => buildTypingFrames(text), [text]);

  useEffect(() => {
    const prefersReducedMotion =
      typeof window !== "undefined" &&
      typeof window.matchMedia === "function" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    window.clearTimeout(timerRef.current);

    if (prefersReducedMotion) {
      setDisplayText(text);
      return undefined;
    }

    if (visible) {
      let frameIndex = 0;
      const runTyping = () => {
        if (frameIndex >= typingFrames.length) return;
        const currentFrame = typingFrames[frameIndex];
        const nextFrame = typingFrames[frameIndex + 1];
        setDisplayText(currentFrame);
        frameIndex += 1;
        timerRef.current = window.setTimeout(runTyping, typingDelay(currentFrame, nextFrame));
      };
      setDisplayText("");
      runTyping();
    } else {
      let current = displayTextRef.current;
      const erase = () => {
        if (!current.length) {
          setDisplayText("");
          return;
        }
        current = current.slice(0, -1);
        setDisplayText(current);
        timerRef.current = window.setTimeout(erase, 14);
      };
      erase();
    }

    return () => window.clearTimeout(timerRef.current);
  }, [visible, text, typingFrames]);

  return (
    <Typography
      ref={ref}
      className={`${className} typed-title`}
      variant={variant}
    >
      <span>{displayText}</span>
      <span className="typed-title-caret" aria-hidden="true" />
    </Typography>
  );
}
