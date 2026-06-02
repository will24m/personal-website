import { useState, useEffect } from "react";
import {
  fetchGalleryPhotosFromApi,
  fetchGalleryPhotosFromDirectoryIndex,
  getStaticGalleryPhotos,
  type GalleryPhoto,
} from "../utils/gallery.js";

const staticGalleryPhotos = getStaticGalleryPhotos();

export function useGalleryPhotos(): GalleryPhoto[] {
  const [photos, setPhotos] = useState<GalleryPhoto[]>(() => staticGalleryPhotos);

  useEffect(() => {
    if (staticGalleryPhotos.length) return undefined;

    const controller = new AbortController();

    const loadPhotos = async () => {
      let discovered: GalleryPhoto[] = [];

      try {
        discovered = await fetchGalleryPhotosFromApi(controller.signal);
      } catch {
        discovered = [];
      }

      if (!discovered.length) {
        try {
          discovered = await fetchGalleryPhotosFromDirectoryIndex(controller.signal);
        } catch {
          discovered = [];
        }
      }

      setPhotos(discovered);
    };

    void loadPhotos();
    return () => controller.abort();
  }, []);

  return photos;
}
