import { useState, useEffect } from "react";
import {
  fetchGalleryPhotosFromApi,
  fetchGalleryPhotosFromDirectoryIndex,
  type GalleryPhoto,
} from "../utils/gallery.js";

export function useGalleryPhotos(): GalleryPhoto[] {
  const [photos, setPhotos] = useState<GalleryPhoto[]>([]);

  useEffect(() => {
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
