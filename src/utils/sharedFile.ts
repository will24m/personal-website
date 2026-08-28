import type { SupabaseClient } from "@supabase/supabase-js";

export const SHARED_FILE_BUCKET = "shared-file";
export const SHARED_FILE_PREFIX = "current";
export const MAX_FILE_BYTES = 25 * 1024 * 1024;

// Keep this list in sync with the Supabase bucket's allowed_mime_types.
// Executables and inline-renderable types (html, svg) are intentionally excluded.
export const ALLOWED_EXTENSIONS = [
  "pdf",
  "txt",
  "csv",
  "md",
  "png",
  "jpg",
  "jpeg",
  "gif",
  "webp",
  "docx",
  "xlsx",
  "pptx",
  "zip",
] as const;

export type AllowedExtension = (typeof ALLOWED_EXTENSIONS)[number];

const ALLOWED_SET: ReadonlySet<string> = new Set(ALLOWED_EXTENSIONS);

// Canonical MIME per extension — mirrors the Supabase bucket's allowed_mime_types.
// Browsers frequently report an empty or non-standard File.type for .md/.csv/office
// files, which the bucket's MIME allow-list would then reject; deriving the type from
// the extension keeps every allowed upload acceptable. The Record type guarantees at
// compile time that every allowed extension has a MIME.
export const EXTENSION_MIME: Record<AllowedExtension, string> = {
  pdf: "application/pdf",
  txt: "text/plain",
  csv: "text/csv",
  md: "text/markdown",
  png: "image/png",
  jpg: "image/jpeg",
  jpeg: "image/jpeg",
  gif: "image/gif",
  webp: "image/webp",
  docx: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  xlsx: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  pptx: "application/vnd.openxmlformats-officedocument.presentationml.presentation",
  zip: "application/zip",
};

export interface CurrentSharedFile {
  name: string;
  downloadUrl: string;
  size: number;
  uploadedAt: string | null;
}

export interface ValidationResult {
  ok: boolean;
  reason?: string;
}

interface SharedFileConfig {
  url: string;
  anonKey: string;
}

export function getSharedFileConfig(): SharedFileConfig | null {
  const url = import.meta.env.VITE_SUPABASE_URL;
  const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
  if (!url || !anonKey) return null;
  return { url, anonKey };
}

export function isSharedFileConfigured(): boolean {
  return getSharedFileConfig() !== null;
}

export function fileExtension(name: string): string {
  const base = name.split(/[\\/]/).pop() ?? "";
  const dot = base.lastIndexOf(".");
  if (dot <= 0 || dot === base.length - 1) return "";
  return base.slice(dot + 1).toLowerCase();
}

export function sanitizeFilename(name: string): string {
  const base = name.split(/[\\/]/).pop() ?? "file";
  const cleaned = base
    .trim()
    .replace(/[^A-Za-z0-9._-]+/g, "_")
    .replace(/^[._]+/, "")
    .replace(/_+$/, "");
  return cleaned || "file";
}

export function formatBytes(bytes: number): string {
  if (!Number.isFinite(bytes) || bytes <= 0) return "0 B";
  const units = ["B", "KB", "MB", "GB"];
  const exponent = Math.min(Math.floor(Math.log(bytes) / Math.log(1024)), units.length - 1);
  const value = bytes / Math.pow(1024, exponent);
  const rounded = exponent === 0 ? Math.round(value) : Math.round(value * 10) / 10;
  return `${rounded} ${units[exponent]}`;
}

export function validateFile(file: { name: string; size: number }): ValidationResult {
  if (file.size <= 0) {
    return { ok: false, reason: "That file is empty." };
  }
  if (file.size > MAX_FILE_BYTES) {
    return { ok: false, reason: `That file is too large (max ${formatBytes(MAX_FILE_BYTES)}).` };
  }
  const ext = fileExtension(file.name);
  if (!ext) {
    return { ok: false, reason: "That file needs a recognized extension." };
  }
  if (!ALLOWED_SET.has(ext)) {
    return { ok: false, reason: `".${ext}" files aren't allowed.` };
  }
  return { ok: true };
}

export function acceptAttribute(): string {
  return ALLOWED_EXTENSIONS.map((ext) => `.${ext}`).join(",");
}

// Content-Type to send on upload — derived from the extension so it always matches the
// bucket's allowed_mime_types, regardless of what the browser reports for File.type.
export function mimeForFilename(name: string): string {
  const ext = fileExtension(name);
  return EXTENSION_MIME[ext as AllowedExtension] ?? "application/octet-stream";
}

let cachedClient: SupabaseClient | null = null;

// Loaded lazily via dynamic import so the ~200 KB supabase-js bundle is only fetched
// when a visitor actually uploads — not on first paint or for downloads.
async function getClient(): Promise<SupabaseClient | null> {
  const config = getSharedFileConfig();
  if (!config) return null;
  if (!cachedClient) {
    const { createClient } = await import("@supabase/supabase-js");
    cachedClient = createClient(config.url, config.anonKey, {
      auth: { persistSession: false },
    });
  }
  return cachedClient;
}

// Uploads directly from the browser to Supabase Storage (bypasses the ~4.5 MB
// serverless body limit). Overwrites the same path; the API POST prunes stale files.
export async function uploadSharedFile(file: File): Promise<void> {
  const client = await getClient();
  if (!client) {
    throw new Error("File sharing isn't configured.");
  }
  const path = `${SHARED_FILE_PREFIX}/${sanitizeFilename(file.name)}`;
  const { error } = await client.storage.from(SHARED_FILE_BUCKET).upload(path, file, {
    upsert: true,
    contentType: mimeForFilename(file.name),
  });
  if (error) {
    throw new Error(error.message || "Upload failed.");
  }
}
