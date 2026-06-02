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

function buildGalleryPhotosFromNames(photoNames: string[]): GalleryPhoto[] {
  const uniqueNames = [...new Set(photoNames)]
    .filter((name) => galleryImagePattern.test(name))
    .sort((a, b) => a.localeCompare(b, undefined, { sensitivity: "base" }));

  return uniqueNames.map((name) => ({
    src: encodeURI(`images/${name}`),
    alt: filenameToAlt(name),
  }));
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

function buildGalleryPhotosFromIndex(indexHtml: string): GalleryPhoto[] {
  const parser = new DOMParser();
  const doc = parser.parseFromString(indexHtml, "text/html");
  const photoNames = Array.from(doc.querySelectorAll("a[href]"))
    .map((anchor) => anchor.getAttribute("href") ?? "")
    .map((href) => href.split("#")[0].split("?")[0])
    .filter(Boolean)
    .map((href) => {
      try {
        return decodeURIComponent(href);
      } catch {
        return href;
      }
    })
    .map((href) => href.replace(/\\/g, "/"))
    .filter((href) => !href.endsWith("/"))
    .map((href) => href.split("/").pop() ?? "")
    .filter(Boolean);

  return buildGalleryPhotosFromNames(photoNames);
}

export async function fetchGalleryPhotosFromApi(signal: AbortSignal): Promise<GalleryPhoto[]> {
  const response = await fetch("/api/gallery", { signal, cache: "no-store" });
  if (!response.ok) throw new Error(`Gallery API request failed (${response.status})`);

  const payload = (await response.json()) as { photos?: unknown };
  const photoNames = Array.isArray(payload?.photos) ? (payload.photos as string[]) : [];
  return buildGalleryPhotosFromNames(photoNames);
}

export async function fetchGalleryPhotosFromDirectoryIndex(
  signal: AbortSignal
): Promise<GalleryPhoto[]> {
  const response = await fetch("images/", { signal, cache: "no-store" });
  if (!response.ok) throw new Error(`Gallery index request failed (${response.status})`);

  const indexHtml = await response.text();
  return buildGalleryPhotosFromIndex(indexHtml);
}
