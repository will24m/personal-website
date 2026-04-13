const fs = require("fs/promises");
const path = require("path");

const imagePattern = /\.(avif|bmp|gif|jpe?g|png|webp)$/i;

module.exports = async function handler(_req, res) {
  try {
    const imagesDir = path.join(process.cwd(), "images");
    const entries = await fs.readdir(imagesDir, { withFileTypes: true });
    const photoNames = entries
      .filter((entry) => entry.isFile() && imagePattern.test(entry.name))
      .map((entry) => entry.name)
      .sort((a, b) => a.localeCompare(b, undefined, { sensitivity: "base" }));

    res.setHeader("Cache-Control", "no-store");
    res.status(200).json({ photos: photoNames });
  } catch (_error) {
    res.status(500).json({ photos: [], error: "Failed to read images directory." });
  }
};
