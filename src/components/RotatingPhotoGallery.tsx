import { useState, useEffect, useRef } from "react";
import { Box } from "@mui/material";
import { useGalleryPhotos } from "../hooks/useGalleryPhotos.js";

interface TouchState {
  active: boolean;
  horizontal: boolean;
  startX: number;
  startY: number;
  startIndex: number;
}

interface RotatingPhotoGalleryProps {
  topChip?: string;
  bottomChip?: string;
  showSpotlight?: boolean;
  onIndexChange?: (index: number) => void;
}

export function RotatingPhotoGallery({
  topChip,
  bottomChip,
  showSpotlight = false,
  onIndexChange,
}: RotatingPhotoGalleryProps) {
  const galleryPhotos = useGalleryPhotos();
  const [index, setIndex] = useState(0);
  const [isHovering, setIsHovering] = useState(false);
  const touchStateRef = useRef<TouchState>({
    active: false,
    horizontal: false,
    startX: 0,
    startY: 0,
    startIndex: 0,
  });
  const lastPointerStyleRef = useRef({ x: "50%", y: "50%" });
  const hasPhotos = galleryPhotos.length > 0;
  const activePhoto = galleryPhotos[index] ?? galleryPhotos[0];

  const setGalleryCursor = (element: HTMLElement, x: string, y: string) => {
    if (lastPointerStyleRef.current.x !== x) {
      element.style.setProperty("--gallery-cursor-x", x);
      lastPointerStyleRef.current.x = x;
    }
    if (lastPointerStyleRef.current.y !== y) {
      element.style.setProperty("--gallery-cursor-y", y);
      lastPointerStyleRef.current.y = y;
    }
  };

  useEffect(() => {
    if (!hasPhotos) return;
    setIndex((current) => (current >= galleryPhotos.length ? 0 : current));
  }, [galleryPhotos.length, hasPhotos]);

  useEffect(() => {
    if (typeof onIndexChange === "function") onIndexChange(index);
  }, [index, onIndexChange]);

  useEffect(() => {
    if (!hasPhotos) return;

    const preloadTimer = window.setTimeout(() => {
      const preloadIndexes = [
        (index + 1) % galleryPhotos.length,
        (index - 1 + galleryPhotos.length) % galleryPhotos.length,
      ];

      for (const preloadIndex of preloadIndexes) {
        const photo = galleryPhotos[preloadIndex];
        if (!photo) continue;
        const image = new Image();
        image.decoding = "async";
        image.src = photo.src;
      }
    }, 900);

    return () => window.clearTimeout(preloadTimer);
  }, [galleryPhotos, hasPhotos, index]);

  const syncIndexToPointer = (event: React.PointerEvent<HTMLDivElement>) => {
    if (!hasPhotos) return;
    const rect = event.currentTarget.getBoundingClientRect();
    if (!rect.width || !rect.height) return;

    const x = Math.min(Math.max((event.clientX - rect.left) / rect.width, 0), 0.999);
    const y = Math.min(Math.max((event.clientY - rect.top) / rect.height, 0), 0.999);
    const horizontalIndex = Math.floor(x * galleryPhotos.length);
    const verticalOffset = y > 0.62 ? 1 : 0;
    const nextIndex = (horizontalIndex + verticalOffset) % galleryPhotos.length;

    setGalleryCursor(event.currentTarget, `${(x * 100).toFixed(1)}%`, `${(y * 100).toFixed(1)}%`);
    setIndex((current) => (current === nextIndex ? current : nextIndex));
  };

  const handlePointerEnter = (event: React.PointerEvent<HTMLDivElement>) => {
    if (!hasPhotos) return;
    setIsHovering(true);
    syncIndexToPointer(event);
  };

  const handlePointerDown = (event: React.PointerEvent<HTMLDivElement>) => {
    if (!hasPhotos || event.pointerType !== "touch") return;
    touchStateRef.current = {
      active: true,
      horizontal: false,
      startX: event.clientX,
      startY: event.clientY,
      startIndex: index,
    };
    setIsHovering(true);
    syncIndexToPointer(event);
  };

  const handlePointerMove = (event: React.PointerEvent<HTMLDivElement>) => {
    if (event.pointerType === "touch" && touchStateRef.current.active) {
      const deltaX = event.clientX - touchStateRef.current.startX;
      const deltaY = event.clientY - touchStateRef.current.startY;
      if (!touchStateRef.current.horizontal && Math.abs(deltaX) > Math.abs(deltaY) + 5) {
        touchStateRef.current.horizontal = true;
      }
      if (touchStateRef.current.horizontal) {
        event.preventDefault();
        syncIndexToPointer(event);
        return;
      }
    }
    if (!isHovering) setIsHovering(true);
    syncIndexToPointer(event);
  };

  const handlePointerUp = (event: React.PointerEvent<HTMLDivElement>) => {
    if (event.pointerType !== "touch" || !touchStateRef.current.active || !hasPhotos) return;
    const deltaX = event.clientX - touchStateRef.current.startX;
    if (touchStateRef.current.horizontal && Math.abs(deltaX) >= 34) {
      const direction = deltaX < 0 ? 1 : -1;
      const next =
        (touchStateRef.current.startIndex + direction + galleryPhotos.length) %
        galleryPhotos.length;
      setIndex(next);
    }
    touchStateRef.current = {
      active: false,
      horizontal: false,
      startX: 0,
      startY: 0,
      startIndex: 0,
    };
    setIsHovering(false);
    setGalleryCursor(event.currentTarget, "50%", "50%");
  };

  const handlePointerLeave = (event: React.PointerEvent<HTMLDivElement>) => {
    setIsHovering(false);
    touchStateRef.current = {
      active: false,
      horizontal: false,
      startX: 0,
      startY: 0,
      startIndex: 0,
    };
    setGalleryCursor(event.currentTarget, "50%", "50%");
  };

  if (!hasPhotos) {
    return (
      <Box className="portrait-frame portrait-frame--gallery">
        {showSpotlight ? <div className="hero-spotlight" /> : null}
        <Box
          sx={{
            borderRadius: "28px",
            border: "1px dashed rgba(255,255,255,0.22)",
            minHeight: "18rem",
            display: "grid",
            placeItems: "center",
            p: 2,
            color: "text.secondary",
            textAlign: "center",
            background: "rgba(255,255,255,0.02)",
          }}
        >
          Add images to /images to populate the gallery.
        </Box>
      </Box>
    );
  }

  return (
    <Box
      className={`portrait-frame portrait-frame--gallery ${isHovering ? "is-hovering" : ""}`.trim()}
      onPointerDown={handlePointerDown}
      onPointerEnter={handlePointerEnter}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerCancel={handlePointerUp}
      onPointerLeave={handlePointerLeave}
      style={{ "--gallery-count": galleryPhotos.length } as React.CSSProperties}
    >
      {showSpotlight ? <div className="hero-spotlight" /> : null}
      <img
        key={activePhoto.src}
        className="portrait-image portrait-image--rotating"
        src={activePhoto.src}
        alt={activePhoto.alt}
        decoding="async"
      />
      {topChip ? <span className="portrait-chip portrait-chip--top">{topChip}</span> : null}
      {bottomChip ? (
        <span className="portrait-chip portrait-chip--bottom">{bottomChip}</span>
      ) : null}
      <div className="gallery-hover-guide" aria-hidden="true">
        {galleryPhotos.map((photo, i) => (
          <span
            key={`${photo.src}-guide`}
            className={`gallery-hover-guide__segment ${i === index ? "is-active" : ""}`}
          />
        ))}
      </div>
      <div className="gallery-controls" role="tablist" aria-label="Photo gallery">
        {galleryPhotos.map((photo, i) => (
          <button
            key={photo.src}
            type="button"
            role="tab"
            aria-selected={i === index}
            aria-label={`Show photo ${i + 1}`}
            className={`gallery-dot ${i === index ? "is-active" : ""}`}
            onClick={() => setIndex(i)}
          />
        ))}
      </div>
    </Box>
  );
}
