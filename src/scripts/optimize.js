/**
 * Generates web-ready WebP derivatives for the "Cute Baby Bump Pics" gallery.
 *
 * The site has no Gatsby image plugin, so webpack would ship the camera
 * originals (~40MB) untouched. This script resizes them into static/gallery/
 * and writes a manifest the gallery component imports directly.
 *
 * Originals live in src/assets/photos/pregnant/ and are gitignored; the
 * derivatives are committed, because Vercel builds from git and never sees
 * the originals. Re-run with `npm run optimize-images` after changing photos.
 */
const fs = require("fs");
const fsp = require("fs/promises");
const path = require("path");
const sharp = require("sharp");

const ROOT = path.join(__dirname, "..", "..");
const SOURCE_DIR = path.join(ROOT, "src", "assets", "photos", "pregnant");
const OUTPUT_DIR = path.join(ROOT, "static", "gallery");
const MANIFEST_PATH = path.join(ROOT, "src", "data", "gallery-manifest.json");

const SOURCE_EXTENSIONS = [".jpg", ".jpeg", ".png"];
const FULL = { suffix: "", maxEdge: 1400, quality: 80 };
const THUMB = { suffix: "-thumb", maxEdge: 700, quality: 78 };

const MONTHS = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

/**
 * Filenames look like `2026-03-21_12-12-48_IMG_0291.jpg`, and some carry the
 * date/time prefix twice (an artifact of the export tool). Strip either form
 * down to a sortable slug: `2026-03-21-img-0291`.
 */
const TIMESTAMP = /^(\d{4})-(\d{2})-(\d{2})_(\d{2}-\d{2}-\d{2})_/;

function parseName(filename) {
  const base = filename.slice(0, -path.extname(filename).length);
  const match = base.match(TIMESTAMP);
  if (!match) return null;

  const [, year, month, day, time] = match;
  // Drop the leading timestamp, then a second one if the tool doubled it up.
  const label = base.slice(match[0].length).replace(TIMESTAMP, "");
  const name = label
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");

  return {
    slug: `${year}-${month}-${day}-${name}`,
    sortKey: `${year}-${month}-${day}_${time}`,
    alt: `Baby T pregnancy photo, ${MONTHS[Number(month) - 1]} ${year}`,
  };
}

async function isUpToDate(sourcePath, outputPath) {
  try {
    const [source, output] = await Promise.all([
      fsp.stat(sourcePath),
      fsp.stat(outputPath),
    ]);
    return output.mtimeMs >= source.mtimeMs;
  } catch {
    return false;
  }
}

/**
 * `.rotate()` bakes in EXIF orientation, so the dimensions sharp reports back
 * are the ones the browser will actually render. We take width/height from the
 * result rather than the source metadata for exactly that reason.
 */
async function render(sourcePath, outputPath, { maxEdge, quality }) {
  if (await isUpToDate(sourcePath, outputPath)) {
    const { width, height } = await sharp(outputPath).metadata();
    return { width, height, skipped: true };
  }

  const info = await sharp(sourcePath)
    .rotate()
    .resize(maxEdge, maxEdge, { fit: "inside", withoutEnlargement: true })
    .webp({ quality })
    .toFile(outputPath);

  return { width: info.width, height: info.height, skipped: false };
}

async function main() {
  if (!fs.existsSync(SOURCE_DIR)) {
    console.error(`No source directory at ${path.relative(ROOT, SOURCE_DIR)}`);
    process.exit(1);
  }

  await fsp.mkdir(OUTPUT_DIR, { recursive: true });
  await fsp.mkdir(path.dirname(MANIFEST_PATH), { recursive: true });

  const files = (await fsp.readdir(SOURCE_DIR))
    .filter((file) =>
      SOURCE_EXTENSIONS.includes(path.extname(file).toLowerCase())
    )
    .sort();

  const entries = [];
  const expected = new Set();
  let rendered = 0;

  for (const file of files) {
    const parsed = parseName(file);
    if (!parsed) {
      console.warn(`Skipping ${file} — no date prefix to derive a slug from`);
      continue;
    }

    const sourcePath = path.join(SOURCE_DIR, file);
    const fullName = `${parsed.slug}${FULL.suffix}.webp`;
    const thumbName = `${parsed.slug}${THUMB.suffix}.webp`;
    expected.add(fullName).add(thumbName);

    const full = await render(
      sourcePath,
      path.join(OUTPUT_DIR, fullName),
      FULL
    );
    const thumb = await render(
      sourcePath,
      path.join(OUTPUT_DIR, thumbName),
      THUMB
    );
    if (!full.skipped || !thumb.skipped) rendered += 1;

    entries.push({
      slug: parsed.slug,
      src: `/gallery/${fullName}`,
      thumb: `/gallery/${thumbName}`,
      width: thumb.width,
      height: thumb.height,
      fullWidth: full.width,
      fullHeight: full.height,
      alt: parsed.alt,
      sortKey: parsed.sortKey,
    });
  }

  // Oldest first, so the gallery reads as a pregnancy progression.
  entries.sort((a, b) => a.sortKey.localeCompare(b.sortKey));

  // Drop derivatives whose source photo has since been deleted.
  const stale = (await fsp.readdir(OUTPUT_DIR)).filter(
    (file) => file.endsWith(".webp") && !expected.has(file)
  );
  await Promise.all(
    stale.map((file) => fsp.unlink(path.join(OUTPUT_DIR, file)))
  );

  const manifest = entries.map(({ sortKey, ...entry }) => entry);
  await fsp.writeFile(MANIFEST_PATH, `${JSON.stringify(manifest, null, 2)}\n`);

  const bytes = (
    await Promise.all(
      [...expected].map((file) => fsp.stat(path.join(OUTPUT_DIR, file)))
    )
  ).reduce((total, { size }) => total + size, 0);

  console.log(
    `${manifest.length} photos — ${rendered} rendered, ${
      manifest.length - rendered
    } cached` + (stale.length ? `, ${stale.length} stale removed` : "")
  );
  console.log(
    `Output ${(bytes / 1024 / 1024).toFixed(1)}MB to static/gallery/`
  );
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
