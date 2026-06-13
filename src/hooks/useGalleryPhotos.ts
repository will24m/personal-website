import { getStaticGalleryPhotos, type GalleryPhoto } from "../utils/gallery.js";

const staticGalleryPhotos = getStaticGalleryPhotos();

export function useGalleryPhotos(): GalleryPhoto[] {
  return staticGalleryPhotos;
}
