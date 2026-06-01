const statsConfig = {
  clickBase: 2478,
  viewBase: 1094,
  epochMs: Date.UTC(2026, 3, 16, 16, 0, 0),
};

function getAmbientStats() {
  const elapsedMinutes = Math.max(0, Math.floor((Date.now() - statsConfig.epochMs) / 60000));

  return {
    clicks: statsConfig.clickBase + Math.floor(elapsedMinutes / 103),
    views: statsConfig.viewBase + Math.floor(elapsedMinutes / 181),
  };
}

function getStore() {
  if (!globalThis.__willWuVisitorStats) {
    const ambient = getAmbientStats();
    globalThis.__willWuVisitorStats = {
      clicks: ambient.clicks,
      views: ambient.views,
      updatedAt: Date.now(),
    };
  }

  const ambient = getAmbientStats();
  globalThis.__willWuVisitorStats.clicks = Math.max(globalThis.__willWuVisitorStats.clicks, ambient.clicks);
  globalThis.__willWuVisitorStats.views = Math.max(globalThis.__willWuVisitorStats.views, ambient.views);

  return globalThis.__willWuVisitorStats;
}

function sendStats(res, stats) {
  res.setHeader("Cache-Control", "no-store");
  res.status(200).json({
    clicks: stats.clicks,
    views: stats.views,
    updatedAt: stats.updatedAt,
  });
}

async function readJsonBody(req) {
  if (req.body && typeof req.body === "object") {
    return req.body;
  }

  if (typeof req.body === "string") {
    return JSON.parse(req.body || "{}");
  }

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

module.exports = async function handler(req, res) {
  const stats = getStore();

  if (req.method === "GET") {
    sendStats(res, stats);
    return;
  }

  if (req.method !== "POST") {
    res.setHeader("Allow", "GET, POST");
    res.status(405).json({ error: "Method not allowed." });
    return;
  }

  try {
    const body = await readJsonBody(req);
    const eventType = body?.eventType;

    if (eventType === "click") {
      stats.clicks += 1;
    } else if (eventType === "view") {
      stats.views += 1;
    } else {
      res.status(400).json({ error: "Unknown stats event." });
      return;
    }

    stats.updatedAt = Date.now();
    sendStats(res, stats);
  } catch (_error) {
    res.status(400).json({ error: "Invalid stats payload." });
  }
};
