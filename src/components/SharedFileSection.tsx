import { useRef, useState } from "react";
import { useSharedFile } from "../hooks/useSharedFile.js";
import { ALLOWED_EXTENSIONS, MAX_FILE_BYTES, acceptAttribute, formatBytes } from "../utils/sharedFile.js";

function formatUploadedAt(iso: string | null): string | null {
  if (!iso) return null;
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return null;
  return date.toLocaleDateString(undefined, { year: "numeric", month: "short", day: "numeric" });
}

const HINT = `Allowed: ${ALLOWED_EXTENSIONS.map((ext) => ext.toUpperCase()).join(", ")} · max ${formatBytes(MAX_FILE_BYTES)}`;

export function SharedFileSection() {
  const { current, status, error, isConfigured, replace } = useSharedFile();
  const inputRef = useRef<HTMLInputElement>(null);
  const [chosenName, setChosenName] = useState<string | null>(null);
  const [uploaded, setUploaded] = useState(false);

  if (!isConfigured) return null;

  const uploading = status === "uploading";
  const uploadedAt = current ? formatUploadedAt(current.uploadedAt) : null;

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const file = inputRef.current?.files?.[0];
    if (!file) return;
    setUploaded(false);
    await replace(file);
    if (inputRef.current) inputRef.current.value = "";
    setChosenName(null);
    setUploaded(true);
  };

  return (
    <section className="section shared-file" aria-label="Shared file">
      <h2 className="shared-file__label">Shared file</h2>
      <p className="shared-file__intro">
        One file anyone can download — or replace with your own. The latest upload wins.
      </p>

      <div className="shared-file__current">
        {status === "loading" ? (
          <span className="shared-file__meta">Loading…</span>
        ) : current ? (
          <>
            <a className="shared-file__download" href={current.downloadUrl}>
              ↓ {current.name}
            </a>
            <span className="shared-file__meta">
              {formatBytes(current.size)}
              {uploadedAt ? ` · updated ${uploadedAt}` : ""}
            </span>
          </>
        ) : status !== "error" ? (
          <span className="shared-file__meta">No file shared yet — be the first.</span>
        ) : null}
      </div>

      <form className="shared-file__form" onSubmit={handleSubmit}>
        <label className="shared-file__choose">
          <input
            ref={inputRef}
            className="shared-file__input"
            type="file"
            accept={acceptAttribute()}
            disabled={uploading}
            onChange={(event) => {
              setChosenName(event.target.files?.[0]?.name ?? null);
              setUploaded(false);
            }}
          />
          <span className="button">Choose file…</span>
        </label>
        <span className="shared-file__chosen shared-file__meta">
          {chosenName ?? "No file selected"}
        </span>
        <button className="button" type="submit" disabled={uploading || !chosenName}>
          {uploading ? "Uploading…" : "Replace file"}
        </button>
      </form>

      <p className="shared-file__hint">{HINT}</p>

      {error ? (
        <p className="shared-file__error" role="alert">
          {error}
        </p>
      ) : uploaded && status === "ready" ? (
        <p className="shared-file__notice" role="status">
          Uploaded.
        </p>
      ) : null}
    </section>
  );
}
