/**
 * Generates web-ready derivatives for every photo the site serves:
 *
 *   1. The "Cute Baby Bump Pics" gallery, resized into static/gallery/ with a
 *      manifest the gallery component imports directly.
 *   2. The standalone page images (see STANDALONE) — the social preview card,
 *      the landing hero, and the welcome-section family photo.
 *
 * The site has no Gatsby image plugin, so webpack would ship the camera
 * originals (~40MB) untouched.
 *
 * Both the originals and the derivatives are committed. The derivatives have
 * to be, because Vercel builds from git and never runs this script; the
 * originals are kept so any clone can regenerate them at different sizes.
 * Re-run with `npm run optimize-images` after adding or removing photos.
 */
const fs = require("fs");
const fsp = require("fs/promises");
const path = require("path");
const sharp = require("sharp");

const ROOT = path.join(__dirname, "..", "..");
const SOURCE_DIR = path.join(ROOT, "src", "assets", "photos", "pregnant");
const OUTPUT_DIR = path.join(ROOT, "static", "gallery");
const MANIFEST_PATH = path.join(ROOT, "src", "data", "gallery-manifest.json");

const PHOTOS_DIR = path.join(ROOT, "src", "assets", "photos");

const SOURCE_EXTENSIONS = [".jpg", ".jpeg", ".png"];
const FULL = { suffix: "", maxEdge: 1400, quality: 80 };
const THUMB = { suffix: "-thumb", maxEdge: 700, quality: 78 };
// Serves low-DPR phones via srcset; high-DPR ones still pick the 700px thumb.
const SMALL = { suffix: "-small", maxEdge: 400, quality: 76 };

/**
 * Images that live outside the gallery. These used to be imported straight from
 * src/assets/ and handed to webpack, which shipped the ~1.4MB originals as-is;
 * the landing hero is the page's LCP element, so that was the single biggest
 * thing slowing the site down. Rendering them here instead means the committed
 * derivative is the only copy that ever reaches a browser.
 *
 * Written to static/ under stable names, matching the gallery, so the CSS and
 * the <Head> can reference them by absolute URL.
 */
const STANDALONE = [
  {
    // The social preview card. `crop` rather than `maxEdge`: link previews want
    // exactly 1.91:1, and centring the crop keeps both faces in frame. JPEG
    // because some scrapers still won't decode WebP.
    source: path.join(PHOTOS_DIR, "landing-engagement.jpeg"),
    output: path.join(ROOT, "static", "og-image.jpg"),
    crop: { width: 1200, height: 630 },
    quality: 82,
    format: "jpeg",
  },
  {
    // Full-bleed background for the landing section, so it stays sharp on wide
    // displays even though it is only ever painted at `background-size: cover`.
    source: path.join(PHOTOS_DIR, "landing-engagement.jpeg"),
    output: path.join(ROOT, "static", "photos", "landing-engagement.webp"),
    maxEdge: 2000,
    quality: 80,
  },
  {
    // Rendered at up to 400px tall, so 1100px covers a 2x display with room to
    // spare.
    source: path.join(PHOTOS_DIR, "romeo.jpg"),
    output: path.join(ROOT, "static", "photos", "romeo.webp"),
    maxEdge: 1100,
    quality: 80,
  },
];

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
 *
 * `maxEdge` fits the whole photo inside a box and keeps its aspect ratio;
 * `crop` instead fills an exact size, trimming the overflow from the edges.
 */
async function render(
  sourcePath,
  outputPath,
  { maxEdge, quality, crop, format = "webp" }
) {
  if (await isUpToDate(sourcePath, outputPath)) {
    const { width, height } = await sharp(outputPath).metadata();
    return { width, height, skipped: true };
  }

  const resized = crop
    ? sharp(sourcePath).rotate().resize(crop.width, crop.height, { fit: "cover" })
    : sharp(sourcePath)
        .rotate()
        .resize(maxEdge, maxEdge, { fit: "inside", withoutEnlargement: true });

  const info = await (format === "jpeg"
    ? resized.jpeg({ quality, mozjpeg: true })
    : resized.webp({ quality })
  ).toFile(outputPath);

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
    const smallName = `${parsed.slug}${SMALL.suffix}.webp`;
    expected.add(fullName).add(thumbName).add(smallName);

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
    const small = await render(
      sourcePath,
      path.join(OUTPUT_DIR, smallName),
      SMALL
    );
    if (!full.skipped || !thumb.skipped || !small.skipped) rendered += 1;

    entries.push({
      slug: parsed.slug,
      src: `/gallery/${fullName}`,
      thumb: `/gallery/${thumbName}`,
      thumbSmall: `/gallery/${smallName}`,
      thumbSmallWidth: small.width,
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

  await renderStandalone();
}

async function renderStandalone() {
  for (const image of STANDALONE) {
    await fsp.mkdir(path.dirname(image.output), { recursive: true });
    const { width, height, skipped } = await render(
      image.source,
      image.output,
      image
    );
    const { size } = await fsp.stat(image.output);
    console.log(
      `${path.relative(ROOT, image.output)} — ${width}x${height}, ` +
        `${(size / 1024).toFixed(0)}KB${skipped ? " (cached)" : ""}`
    );
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
