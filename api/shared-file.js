const { createClient } = require("@supabase/supabase-js");

const BUCKET = "shared-file";
const PREFIX = "current";
const PLACEHOLDER = ".emptyFolderPlaceholder";

function getClient() {
  const url = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !serviceKey) return null;
  return createClient(url, serviceKey, { auth: { persistSession: false } });
}

function downloadUrl(client, name) {
  const { data } = client.storage
    .from(BUCKET)
    .getPublicUrl(`${PREFIX}/${name}`, { download: name });
  return data.publicUrl;
}

async function listObjects(client) {
  const { data, error } = await client.storage.from(BUCKET).list(PREFIX, {
    limit: 100,
    sortBy: { column: "updated_at", order: "desc" },
  });
  if (error) throw new Error(error.message);
  return (data || []).filter((entry) => entry && entry.name && entry.name !== PLACEHOLDER);
}

function toFileInfo(client, entry) {
  const size = entry.metadata && typeof entry.metadata.size === "number" ? entry.metadata.size : 0;
  return {
    name: entry.name,
    downloadUrl: downloadUrl(client, entry.name),
    size,
    uploadedAt: entry.updated_at || entry.created_at || null,
  };
}

async function getCurrent(client) {
  const objects = await listObjects(client);
  return objects.length ? toFileInfo(client, objects[0]) : null;
}

// Keep exactly one file: delete everything under the prefix except the newest object.
async function pruneToNewest(client) {
  const objects = await listObjects(client);
  if (objects.length === 0) return null;

  const [newest, ...stale] = objects;
  if (stale.length) {
    const paths = stale.map((entry) => `${PREFIX}/${entry.name}`);
    const { error } = await client.storage.from(BUCKET).remove(paths);
    if (error) throw new Error(error.message);
  }
  return toFileInfo(client, newest);
}

module.exports = async function handler(req, res) {
  res.setHeader("Cache-Control", "no-store");

  const client = getClient();
  if (!client) {
    res.status(503).json({ error: "File sharing is not configured." });
    return;
  }

  try {
    if (req.method === "GET") {
      res.status(200).json({ file: await getCurrent(client) });
      return;
    }

    if (req.method === "POST") {
      res.status(200).json({ file: await pruneToNewest(client) });
      return;
    }

    res.setHeader("Allow", "GET, POST");
    res.status(405).json({ error: "Method not allowed." });
  } catch (error) {
    res.status(500).json({ error: error && error.message ? error.message : "Shared file error." });
  }
};
