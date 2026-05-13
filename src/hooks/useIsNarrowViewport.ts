import { useState, useEffect } from "react";

export function useIsNarrowViewport(maxWidth = 980): boolean {
  const [isNarrow, setIsNarrow] = useState(() => {
    if (typeof window === "undefined") return false;
    return window.innerWidth <= maxWidth;
  });

  useEffect(() => {
    const onResize = () => setIsNarrow(window.innerWidth <= maxWidth);
    onResize();
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, [maxWidth]);

  return isNarrow;
}
