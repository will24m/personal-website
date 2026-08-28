import { describe, expect, it } from "vitest";
import {
  ALLOWED_EXTENSIONS,
  EXTENSION_MIME,
  MAX_FILE_BYTES,
  fileExtension,
  formatBytes,
  mimeForFilename,
  sanitizeFilename,
  validateFile,
} from "./sharedFile.js";

describe("fileExtension", () => {
  it("returns the lowercased extension", () => {
    expect(fileExtension("Report.PDF")).toBe("pdf");
    expect(fileExtension("photo.JPEG")).toBe("jpeg");
  });

  it("uses only the final segment and handles paths", () => {
    expect(fileExtension("archive.tar.gz")).toBe("gz");
    expect(fileExtension("folder/name.txt")).toBe("txt");
  });

  it("returns empty when there is no usable extension", () => {
    expect(fileExtension("README")).toBe("");
    expect(fileExtension(".gitignore")).toBe("");
    expect(fileExtension("trailingdot.")).toBe("");
  });
});

describe("sanitizeFilename", () => {
  it("keeps safe characters and strips directories", () => {
    expect(sanitizeFilename("../../etc/passwd")).toBe("passwd");
    expect(sanitizeFilename("my resume (final).pdf")).toBe("my_resume_final_.pdf");
  });

  it("never returns an empty name", () => {
    expect(sanitizeFilename("   ")).toBe("file");
    expect(sanitizeFilename("***")).toBe("file");
  });
});

describe("validateFile", () => {
  it("accepts allowed types within the size limit", () => {
    expect(validateFile({ name: "resume.pdf", size: 1024 })).toEqual({ ok: true });
    expect(validateFile({ name: "sheet.xlsx", size: 5000 })).toEqual({ ok: true });
    expect(validateFile({ name: "logo.PNG", size: 200 })).toEqual({ ok: true });
  });

  it("rejects disallowed and dangerous types", () => {
    expect(validateFile({ name: "malware.exe", size: 100 }).ok).toBe(false);
    expect(validateFile({ name: "page.html", size: 100 }).ok).toBe(false);
    expect(validateFile({ name: "icon.svg", size: 100 }).ok).toBe(false);
    expect(validateFile({ name: "noext", size: 100 }).ok).toBe(false);
  });

  it("rejects empty and oversized files", () => {
    expect(validateFile({ name: "empty.pdf", size: 0 }).ok).toBe(false);
    expect(validateFile({ name: "huge.zip", size: MAX_FILE_BYTES + 1 }).ok).toBe(false);
  });
});

describe("mimeForFilename", () => {
  it("maps every allowed extension to a concrete MIME (never octet-stream)", () => {
    for (const ext of ALLOWED_EXTENSIONS) {
      expect(mimeForFilename(`file.${ext}`)).toBe(EXTENSION_MIME[ext]);
      expect(mimeForFilename(`file.${ext}`)).not.toBe("application/octet-stream");
    }
  });

  it("is case-insensitive and falls back for unknown types", () => {
    expect(mimeForFilename("Notes.MD")).toBe("text/markdown");
    expect(mimeForFilename("data.CSV")).toBe("text/csv");
    expect(mimeForFilename("mystery.bin")).toBe("application/octet-stream");
  });
});

describe("formatBytes", () => {
  it("formats across units", () => {
    expect(formatBytes(0)).toBe("0 B");
    expect(formatBytes(512)).toBe("512 B");
    expect(formatBytes(1024)).toBe("1 KB");
    expect(formatBytes(25 * 1024 * 1024)).toBe("25 MB");
  });
});
