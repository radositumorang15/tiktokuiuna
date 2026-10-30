import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, "..");
const mediaDir = path.join(projectRoot, "content", "media");
const manifestPath = path.join(projectRoot, "content", "manifest.json");

console.log("Media Pipeline: scanning content/media/...");

if (!fs.existsSync(mediaDir)) {
  fs.mkdirSync(mediaDir, { recursive: true });
}

// Ensure default slot directories exist
const expectedSlots = [
  "slot-01", "slot-02", "slot-03", "slot-04", "slot-05",
  "slot-06", "slot-07", "slot-08", "slot-09", "slot-10",
  "bonus", "finale"
];

for (const slotId of expectedSlots) {
  const slotDir = path.join(mediaDir, slotId);
  if (!fs.existsSync(slotDir)) {
    fs.mkdirSync(slotDir, { recursive: true });
  }
}

const manifest = {
  slots: {},
  generatedAt: new Date().toISOString(),
};

const entries = fs.readdirSync(mediaDir, { withFileTypes: true });

for (const entry of entries) {
  if (!entry.isDirectory()) continue;
  const slotId = entry.name;
  const slotPath = path.join(mediaDir, slotId);
  const files = fs.readdirSync(slotPath).filter((f) => !f.startsWith("."));

  if (files.length === 0) {
    console.log(`[EMPTY] ${slotId} is empty.`);
    continue;
  }

  const videoFile = files.find((f) => f.endsWith(".mp4") || f.endsWith(".webm") || f.endsWith(".mov"));
  const imageFiles = files
    .filter((f) => /\.(jpg|jpeg|png|webp|avif)$/i.test(f) && !f.includes("poster"))
    .sort();
  const posterFile = files.find((f) => f.includes("poster") || /\.(webp|jpg|jpeg|png)$/i.test(f));

  if (videoFile) {
    manifest.slots[slotId] = {
      type: "video",
      src: `/media/${slotId}/${videoFile}`,
      poster: posterFile ? `/media/${slotId}/${posterFile}` : `/media/${slotId}/${videoFile}.webp`,
      files: [videoFile],
      width: 720,
      height: 1280,
    };
    console.log(`[VIDEO] ${slotId} -> ${videoFile}`);
  } else if (imageFiles.length > 0) {
    manifest.slots[slotId] = {
      type: "photo",
      files: imageFiles.map((f) => `/media/${slotId}/${f}`),
      poster: `/media/${slotId}/${imageFiles[0]}`,
      width: 720,
      height: 1280,
    };
    console.log(`[PHOTO] ${slotId} -> ${imageFiles.length} photos`);
  }
}

fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 2), "utf-8");
console.log(`Manifest updated at ${manifestPath}`);

