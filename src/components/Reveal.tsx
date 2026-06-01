import { motion } from "framer-motion";
import type React from "react";

interface RevealProps {
  children: React.ReactNode;
  rotate?: "left" | "right";
}

export function Reveal({ children, rotate = "right" }: RevealProps) {
  return (
    <motion.div
      initial={{ opacity: 0, x: rotate === "left" ? -22 : 22, y: 6, scale: 0.99 }}
      whileInView={{ opacity: 1, x: 0, y: 0, scale: 1 }}
      viewport={{ once: true, margin: "0px 0px -40px 0px" }}
      transition={{ duration: 0.55, ease: [0.2, 0.8, 0.2, 1] }}
    >
      {children}
    </motion.div>
  );
}
