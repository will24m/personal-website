import { useEffect, useRef, useState } from "react";
import { useGalleryPhotos } from "../hooks/useGalleryPhotos.js";

const ROTATE_INTERVAL_MS = 6000;
const SWIPE_THRESHOLD_PX = 34;

interface TouchState {
  active: boolean;
  horizontal: boolean;
  startX: number;
  startY: number;
  startIndex: number;
}

interface RotatingPhotoGalleryProps {
  onIndexChange?: (index: number) => void;
}

export function RotatingPhotoGallery({ onIndexChange }: RotatingPhotoGalleryProps) {
  const photos = useGalleryPhotos();
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const touchStateRef = useRef<TouchState>({
    active: false,
    horizontal: false,
    startX: 0,
    startY: 0,
    startIndex: 0,
  });
  const hasPhotos = photos.length > 0;
  const activePhoto = photos[index % Math.max(photos.length, 1)];

  useEffect(() => {
    if (typeof onIndexChange === "function") onIndexChange(index);
  }, [index, onIndexChange]);

  useEffect(() => {
    if (!hasPhotos || paused) return;
    const timer = window.setInterval(() => {
      setIndex((current) => (current + 1) % photos.length);
    }, ROTATE_INTERVAL_MS);
    return () => window.clearInterval(timer);
  }, [hasPhotos, paused, photos.length]);

  // Preload neighbours so scrubbing and rotation never flash.
  useEffect(() => {
    if (!hasPhotos) return;
    for (const offset of [1, -1]) {
      const photo = photos[(index + offset + photos.length) % photos.length];
      if (!photo) continue;
      const image = new Image();
      image.decoding = "async";
      image.src = photo.src;
    }
  }, [hasPhotos, index, photos]);

  // Map a horizontal pointer position across the frame to a photo index.
  const scrubToPointer = (event: React.PointerEvent<HTMLElement>) => {
    if (!hasPhotos) return;
    const rect = event.currentTarget.getBoundingClientRect();
    if (!rect.width) return;
    const ratio = Math.min(Math.max((event.clientX - rect.left) / rect.width, 0), 0.999);
    const next = Math.floor(ratio * photos.length);
    setIndex((current) => (current === next ? current : next));
  };

  const handlePointerEnter = (event: React.PointerEvent<HTMLElement>) => {
    if (event.pointerType === "touch") return;
    setPaused(true);
    scrubToPointer(event);
  };

  const handlePointerMove = (event: React.PointerEvent<HTMLElement>) => {
    if (event.pointerType === "touch") {
      const touch = touchStateRef.current;
      if (!touch.active) return;
      const deltaX = event.clientX - touch.startX;
      const deltaY = event.clientY - touch.startY;
      if (!touch.horizontal && Math.abs(deltaX) > Math.abs(deltaY) + 5) {
        touch.horizontal = true;
      }
      if (touch.horizontal) event.preventDefault();
      return;
    }
    scrubToPointer(event);
  };

  const handlePointerDown = (event: React.PointerEvent<HTMLElement>) => {
    if (event.pointerType !== "touch" || !hasPhotos) return;
    touchStateRef.current = {
      active: true,
      horizontal: false,
      startX: event.clientX,
      startY: event.clientY,
      startIndex: index,
    };
    setPaused(true);
  };

  const handlePointerUp = (event: React.PointerEvent<HTMLElement>) => {
    if (event.pointerType === "touch") {
      const touch = touchStateRef.current;
      if (touch.active && touch.horizontal && hasPhotos) {
        const deltaX = event.clientX - touch.startX;
        if (Math.abs(deltaX) >= SWIPE_THRESHOLD_PX) {
          const direction = deltaX < 0 ? 1 : -1;
          setIndex((touch.startIndex + direction + photos.length) % photos.length);
        }
      }
      touchStateRef.current.active = false;
      setPaused(false);
    }
  };

  const handlePointerLeave = () => {
    touchStateRef.current.active = false;
    setPaused(false);
  };

  if (!hasPhotos) return null;

  return (
    <figure
      className="portrait-frame"
      onPointerEnter={handlePointerEnter}
      onPointerMove={handlePointerMove}
      onPointerDown={handlePointerDown}
      onPointerUp={handlePointerUp}
      onPointerCancel={handlePointerLeave}
      onPointerLeave={handlePointerLeave}
    >
      <img
        className="portrait-image"
        src={activePhoto.src}
        alt={activePhoto.alt}
        decoding="async"
        draggable={false}
      />
      <div className="gallery-controls" role="group" aria-label="Photo selector">
        {photos.map((photo, i) => (
          <button
            key={photo.src}
            type="button"
            aria-pressed={i === index ? "true" : "false"}
            aria-label={`Show photo ${i + 1} of ${photos.length}`}
            className={`gallery-dot ${i === index ? "is-active" : ""}`.trim()}
            onClick={() => setIndex(i)}
          />
        ))}
      </div>
    </figure>
  );
}
