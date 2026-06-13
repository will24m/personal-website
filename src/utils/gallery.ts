export interface GalleryPhoto {
  src: string;
  alt: string;
}

const galleryImagePattern = /\.(avif|bmp|gif|jpe?g|png|webp)$/i;
const staticGalleryModules = import.meta.glob("../../images/*", {
  eager: true,
  query: "?url",
  import: "default",
}) as Record<string, string>;

function filenameToAlt(filename: string): string {
  const base = filename.replace(/\.[^/.]+$/, "");
  const normalized = base.replace(/[_-]+/g, " ").replace(/\s+/g, " ").trim();
  if (!normalized) return "Gallery photo";
  return normalized.charAt(0).toUpperCase() + normalized.slice(1);
}

export function getStaticGalleryPhotos(): GalleryPhoto[] {
  return Object.entries(staticGalleryModules)
    .map(([modulePath, src]) => {
      const name = modulePath.split("/").pop() ?? "";
      return { name, src };
    })
    .filter(({ name }) => galleryImagePattern.test(name))
    .sort((a, b) => a.name.localeCompare(b.name, undefined, { sensitivity: "base" }))
    .map(({ name, src }) => ({
      src,
      alt: filenameToAlt(name),
    }));
}
