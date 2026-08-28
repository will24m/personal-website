const { createClient } = require("@supabase/supabase-js");

const statsConfig = {
  clickBase: 2478,
  viewBase: 1094,
  epochMs: Date.UTC(2026, 3, 16, 16, 0, 0),
};

// Ambient value is used only to SEED the persistent row the first time (so the live
// counter starts at the number visitors already see) and as an offline fallback.
function getAmbientStats() {
  const elapsedMinutes = Math.max(0, Math.floor((Date.now() - statsConfig.epochMs) / 60000));
  return {
    clicks: statsConfig.clickBase + Math.floor(elapsedMinutes / 103),
    views: statsConfig.viewBase + Math.floor(elapsedMinutes / 181),
  };
}

// ---- persistent store (Supabase) ----

function getServiceClient() {
  const url = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) return null;
  return createClient(url, key, { auth: { persistSession: false } });
}

// Create the singleton row seeded at the current ambient value if it doesn't exist yet.
async function ensureRow(client) {
  const ambient = getAmbientStats();
  const { error } = await client
    .from("site_stats")
    .upsert(
      { id: 1, clicks: ambient.clicks, views: ambient.views },
      { onConflict: "id", ignoreDuplicates: true }
    );
  if (error) throw new Error(error.message);
}

async function readPersistentStats(client) {
  const existing = await client
    .from("site_stats")
    .select("clicks, views")
    .eq("id", 1)
    .maybeSingle();
  if (existing.error) throw new Error(existing.error.message);
  if (existing.data) return existing.data;

  await ensureRow(client);
  const seeded = await client.from("site_stats").select("clicks, views").eq("id", 1).single();
  if (seeded.error) throw new Error(seeded.error.message);
  return seeded.data;
}

async function bumpPersistentStat(client, kind) {
  await ensureRow(client);
  const { data, error } = await client.rpc("bump_site_stat", { kind });
  if (error) throw new Error(error.message);
  return data;
}

// ---- in-memory fallback (used only when Supabase env is not configured) ----

function getFallbackStore() {
  if (!globalThis.__willWuVisitorStats) {
    const ambient = getAmbientStats();
    globalThis.__willWuVisitorStats = { clicks: ambient.clicks, views: ambient.views };
  }
  const ambient = getAmbientStats();
  const store = globalThis.__willWuVisitorStats;
  store.clicks = Math.max(store.clicks, ambient.clicks);
  store.views = Math.max(store.views, ambient.views);
  return store;
}

function sendStats(res, stats) {
  res.setHeader("Cache-Control", "no-store");
  res.status(200).json({ clicks: stats.clicks, views: stats.views, updatedAt: Date.now() });
}

async function readJsonBody(req) {
  if (req.body && typeof req.body === "object") return req.body;
  if (typeof req.body === "string") return JSON.parse(req.body || "{}");

  return new Promise((resolve, reject) => {
    let raw = "";
    req.on("data", (chunk) => {
      raw += chunk;
    });
    req.on("end", () => {
      try {
        resolve(raw ? JSON.parse(raw) : {});
      } catch (error) {
        reject(error);
      }
    });
    req.on("error", reject);
  });
}

async function readEventType(req, res) {
  let body;
  try {
    body = await readJsonBody(req);
  } catch (_error) {
    res.status(400).json({ error: "Invalid stats payload." });
    return null;
  }
  const eventType = body?.eventType;
  if (eventType !== "click" && eventType !== "view") {
    res.status(400).json({ error: "Unknown stats event." });
    return null;
  }
  return eventType;
}

module.exports = async function handler(req, res) {
  const client = getServiceClient();

  // Fallback path: Supabase not configured (local dev, or env not set yet).
  if (!client) {
    const store = getFallbackStore();
    if (req.method === "GET") return sendStats(res, store);
    if (req.method === "POST") {
      const eventType = await readEventType(req, res);
      if (!eventType) return undefined;
      store[eventType === "click" ? "clicks" : "views"] += 1;
      return sendStats(res, store);
    }
    res.setHeader("Allow", "GET, POST");
    return res.status(405).json({ error: "Method not allowed." });
  }

  // Persistent path (Supabase).
  try {
    if (req.method === "GET") {
      return sendStats(res, await readPersistentStats(client));
    }
    if (req.method === "POST") {
      const eventType = await readEventType(req, res);
      if (!eventType) return undefined;
      return sendStats(res, await bumpPersistentStat(client, eventType));
    }
    res.setHeader("Allow", "GET, POST");
    return res.status(405).json({ error: "Method not allowed." });
  } catch (_error) {
    // Resilience: if Supabase errors, degrade to the ambient value so the UI still renders.
    return sendStats(res, getFallbackStore());
  }
};
