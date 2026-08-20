import { useRef, useState } from "react";
import { useSharedFile } from "../hooks/useSharedFile.js";
import { acceptAttribute, formatBytes } from "../utils/sharedFile.js";

export function SharedFileSection() {
  const { current, status, error, isConfigured, replace } = useSharedFile();
  const inputRef = useRef<HTMLInputElement>(null);
  const [hasSelection, setHasSelection] = useState(false);

  if (!isConfigured) return null;

  const uploading = status === "uploading";

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const file = inputRef.current?.files?.[0];
    if (!file) return;
    await replace(file);
    if (inputRef.current) inputRef.current.value = "";
    setHasSelection(false);
  };

  return (
    <section className="section shared-file" aria-label="Shared file">
      <h2 className="shared-file__label">Shared file</h2>
      <p className="shared-file__intro">
        A single file anyone can download — or replace with your own. One file at a time.
      </p>

      {status === "loading" ? (
        <p className="shared-file__status">Loading…</p>
      ) : current ? (
        <p className="shared-file__current">
          <a href={current.downloadUrl}>Download {current.name}</a>{" "}
          <span className="shared-file__meta">({formatBytes(current.size)})</span>
        </p>
      ) : status !== "error" ? (
        <p className="shared-file__current shared-file__meta">No file shared yet.</p>
      ) : null}

      <form className="shared-file__form" onSubmit={handleSubmit}>
        <input
          ref={inputRef}
          type="file"
          accept={acceptAttribute()}
          disabled={uploading}
          onChange={(event) => setHasSelection(Boolean(event.target.files?.length))}
        />
        <button className="button" type="submit" disabled={uploading || !hasSelection}>
          {uploading ? "Uploading…" : "Replace file"}
        </button>
      </form>

      {error ? (
        <p className="shared-file__error" role="alert">
          {error}
        </p>
      ) : null}
    </section>
  );
}
