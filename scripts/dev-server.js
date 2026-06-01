const fs = require("fs/promises");
const http = require("http");
const path = require("path");
const { URL } = require("url");

const rootDir = path.resolve(__dirname, "..");
const preferredPort = Number(process.env.PORT || 5173);
const hostname = process.env.HOST || "127.0.0.1";

const mimeTypes = {
  ".css": "text/css; charset=utf-8",
  ".gif": "image/gif",
  ".html": "text/html; charset=utf-8",
  ".jpeg": "image/jpeg",
  ".jpg": "image/jpeg",
  ".js": "text/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".pdf": "application/pdf",
  ".png": "image/png",
  ".svg": "image/svg+xml",
  ".webp": "image/webp",
};

function setNoStore(res) {
  res.setHeader("Cache-Control", "no-store");
}

function sendJson(res, statusCode, payload) {
  setNoStore(res);
  res.statusCode = statusCode;
  res.setHeader("Content-Type", "application/json; charset=utf-8");
  res.end(JSON.stringify(payload));
}

function decorateResponse(res) {
  res.status = (statusCode) => {
    res.statusCode = statusCode;
    return res;
  };

  res.json = (payload) => {
    if (!res.getHeader("Content-Type")) {
      res.setHeader("Content-Type", "application/json; charset=utf-8");
    }
    res.end(JSON.stringify(payload));
  };

  return res;
}

async function readRequestBody(req) {
  if (!["POST", "PUT", "PATCH"].includes(req.method)) {
    return undefined;
  }

  const chunks = [];
  for await (const chunk of req) {
    chunks.push(chunk);
  }

  const rawBody = Buffer.concat(chunks).toString("utf8");
  if (!rawBody) {
    return {};
  }

  if ((req.headers["content-type"] || "").includes("application/json")) {
    return JSON.parse(rawBody);
  }

  return rawBody;
}

async function serveApi(req, res, pathname) {
  const routeName = pathname.replace(/^\/api\//, "").replace(/\/$/, "");
  if (!/^[a-z0-9_-]+$/i.test(routeName)) {
    sendJson(res, 404, { error: "API route not found." });
    return;
  }

  const routePath = path.join(rootDir, "api", `${routeName}.js`);
  if (!routePath.startsWith(path.join(rootDir, "api"))) {
    sendJson(res, 404, { error: "API route not found." });
    return;
  }

  try {
    req.body = await readRequestBody(req);
    const handler = require(routePath);
    await handler(req, decorateResponse(res));
  } catch (error) {
    if (error.code === "MODULE_NOT_FOUND") {
      sendJson(res, 404, { error: "API route not found." });
      return;
    }

    console.error(error);
    sendJson(res, 500, { error: "API route failed." });
  }
}

function resolveStaticPath(pathname) {
  const cleanPathname = decodeURIComponent(pathname);
  const candidates = [];

  if (cleanPathname === "/") {
    candidates.push("index.html");
  } else {
    const withoutLeadingSlash = cleanPathname.replace(/^\/+/, "");
    candidates.push(withoutLeadingSlash);

    if (!path.extname(withoutLeadingSlash)) {
      candidates.push(`${withoutLeadingSlash}.html`);
    }
  }

  return candidates.map((candidate) => path.normalize(path.join(rootDir, candidate)));
}

async function serveStatic(req, res, pathname) {
  const candidates = resolveStaticPath(pathname);

  for (const filePath of candidates) {
    if (!filePath.startsWith(rootDir)) {
      continue;
    }

    try {
      const stat = await fs.stat(filePath);
      if (!stat.isFile()) {
        continue;
      }

      const extension = path.extname(filePath).toLowerCase();
      res.statusCode = 200;
      res.setHeader("Content-Type", mimeTypes[extension] || "application/octet-stream");
      res.end(await fs.readFile(filePath));
      return;
    } catch (error) {
      if (error.code !== "ENOENT") {
        console.error(error);
        res.statusCode = 500;
        res.end("Internal server error");
        return;
      }
    }
  }

  res.statusCode = 404;
  res.setHeader("Content-Type", "text/plain; charset=utf-8");
  res.end("Not found");
}

const server = http.createServer(async (req, res) => {
  try {
    const requestUrl = new URL(req.url, `http://${req.headers.host || `${hostname}:${port}`}`);
    const pathname = requestUrl.pathname;

    if (pathname.startsWith("/api/")) {
      await serveApi(req, res, pathname);
      return;
    }

    await serveStatic(req, res, pathname);
  } catch (error) {
    console.error(error);
    res.statusCode = 500;
    res.setHeader("Content-Type", "text/plain; charset=utf-8");
    res.end("Internal server error");
  }
});

server.on("error", (error) => {
  if (error.code === "EADDRINUSE" && !process.env.PORT) {
    listen(currentPort + 1, attemptsLeft - 1);
    return;
  }

  throw error;
});

server.on("listening", () => {
  const address = server.address();
  const activePort = typeof address === "object" && address ? address.port : currentPort;
  console.log(`Dev server running at http://${hostname}:${activePort}/`);
});

let currentPort = preferredPort;
let attemptsLeft = 20;

function listen(port, nextAttemptsLeft = attemptsLeft) {
  if (nextAttemptsLeft < 0) {
    throw new Error("No available dev server ports found.");
  }

  currentPort = port;
  attemptsLeft = nextAttemptsLeft;
  server.listen(currentPort, hostname);
}

listen(preferredPort);
