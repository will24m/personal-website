import { useEffect } from "react";

export function useAmbientPointer(): void {
  useEffect(() => {
    const setPointer = (x: number, y: number) => {
      document.documentElement.style.setProperty("--pointer-x", `${x}px`);
      document.documentElement.style.setProperty("--pointer-y", `${y}px`);
    };

    const handleMove = (event: PointerEvent) => setPointer(event.clientX, event.clientY);
    const handleLeave = () => setPointer(window.innerWidth * 0.7, window.innerHeight * 0.2);

    window.addEventListener("pointermove", handleMove, { passive: true });
    if ("onpointerrawupdate" in window) {
      window.addEventListener("pointerrawupdate" as "pointermove", handleMove, { passive: true });
    }
    window.addEventListener("pointerleave", handleLeave);
    window.addEventListener("blur", handleLeave);

    return () => {
      window.removeEventListener("pointermove", handleMove);
      if ("onpointerrawupdate" in window) {
        window.removeEventListener("pointerrawupdate" as "pointermove", handleMove);
      }
      window.removeEventListener("pointerleave", handleLeave);
      window.removeEventListener("blur", handleLeave);
    };
  }, []);
}
