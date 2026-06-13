import { useEffect, useState } from "react";
import { useGalleryPhotos } from "../hooks/useGalleryPhotos.js";

const ROTATE_INTERVAL_MS = 6000;

interface RotatingPhotoGalleryProps {
  onIndexChange?: (index: number) => void;
}

export function RotatingPhotoGallery({ onIndexChange }: RotatingPhotoGalleryProps) {
  const photos = useGalleryPhotos();
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
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

  // Preload the next photo so rotation never flashes.
  useEffect(() => {
    if (!hasPhotos) return;
    const next = photos[(index + 1) % photos.length];
    if (!next) return;
    const image = new Image();
    image.decoding = "async";
    image.src = next.src;
  }, [hasPhotos, index, photos]);

  if (!hasPhotos) return null;

  return (
    <figure
      className="portrait-frame"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <img
        className="portrait-image"
        src={activePhoto.src}
        alt={activePhoto.alt}
        decoding="async"
      />
      <div className="gallery-controls" role="group" aria-label="Photo selector">
        {photos.map((photo, i) => (
          <button
            key={photo.src}
            type="button"
            aria-pressed={i === index}
            aria-label={`Show photo ${i + 1} of ${photos.length}`}
            className={`gallery-dot ${i === index ? "is-active" : ""}`.trim()}
            onClick={() => setIndex(i)}
          />
        ))}
      </div>
    </figure>
  );
}
