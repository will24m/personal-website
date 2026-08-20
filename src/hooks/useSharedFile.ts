import { useCallback, useEffect, useState } from "react";
import {
  isSharedFileConfigured,
  uploadSharedFile,
  validateFile,
  type CurrentSharedFile,
} from "../utils/sharedFile.js";

export type SharedFileStatus = "idle" | "loading" | "ready" | "uploading" | "error";

interface UseSharedFileReturn {
  current: CurrentSharedFile | null;
  status: SharedFileStatus;
  error: string | null;
  isConfigured: boolean;
  replace: (file: File) => Promise<void>;
}

async function requestCurrent(method: "GET" | "POST"): Promise<CurrentSharedFile | null> {
  const response = await fetch("/api/shared-file", {
    method,
    cache: "no-store",
    headers: method === "POST" ? { "Content-Type": "application/json" } : undefined,
    body: method === "POST" ? "{}" : undefined,
  });
  if (!response.ok) {
    throw new Error(`Shared file request failed (${response.status})`);
  }
  const data = (await response.json()) as { file?: CurrentSharedFile | null };
  return data.file ?? null;
}

export function useSharedFile(): UseSharedFileReturn {
  const isConfigured = isSharedFileConfigured();
  const [current, setCurrent] = useState<CurrentSharedFile | null>(null);
  const [status, setStatus] = useState<SharedFileStatus>(isConfigured ? "loading" : "idle");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!isConfigured) return;
    let cancelled = false;

    requestCurrent("GET")
      .then((file) => {
        if (cancelled) return;
        setCurrent(file);
        setStatus("ready");
      })
      .catch(() => {
        if (cancelled) return;
        setStatus("error");
        setError("Couldn't load the shared file.");
      });

    return () => {
      cancelled = true;
    };
  }, [isConfigured]);

  const replace = useCallback(async (file: File) => {
    setError(null);

    const check = validateFile(file);
    if (!check.ok) {
      setError(check.reason ?? "That file can't be uploaded.");
      setStatus("error");
      return;
    }

    setStatus("uploading");
    try {
      await uploadSharedFile(file);
      // Finalize server-side: prune to a single file and return fresh info.
      const finalized = await requestCurrent("POST");
      setCurrent(finalized);
      setStatus("ready");
    } catch (err) {
      setStatus("error");
      setError(err instanceof Error ? err.message : "Upload failed.");
    }
  }, []);

  return { current, status, error, isConfigured, replace };
}
