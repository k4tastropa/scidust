#!/usr/bin/env node

import { existsSync, mkdirSync, readdirSync, readFileSync, renameSync, writeFileSync } from "node:fs";
import { basename, dirname, extname, join, resolve } from "node:path";

const args = process.argv.slice(2);
const applyChanges = args.includes("--apply");
const helpRequested = args.includes("--help") || args.includes("-h");
const sourceArgumentIndex = args.indexOf("--source");
const sourceDirectory = resolve(
  process.cwd(),
  sourceArgumentIndex === -1 ? "public/artwork" : args[sourceArgumentIndex + 1],
);

if (helpRequested) {
  console.log(`
Organize downloaded Instagram artwork into portfolio-ready folders.

Usage:
  pnpm artwork:organize                 Preview the proposed file moves.
  pnpm artwork:organize --apply         Create folders and move files.
  pnpm artwork:organize -- --source DIR Use a different source directory.

The source directory must contain flat image files and their matching
<image>.json Instagram metadata files. Posts are ordered oldest to newest and
saved as 1, 2, 3, etc. Each folder receives an editable artwork.json file.
`);
  process.exit(0);
}

if (sourceArgumentIndex !== -1 && !args[sourceArgumentIndex + 1]) {
  throw new Error("--source requires a directory path.");
}

if (!existsSync(sourceDirectory)) {
  throw new Error(`Artwork directory not found: ${sourceDirectory}`);
}

const imageFiles = readdirSync(sourceDirectory)
  .filter((file) => /\.(avif|gif|jpe?g|png|webp)$/i.test(file))
  .sort();

if (imageFiles.length === 0) {
  console.log("No flat image files found. Nothing to organize.");
  process.exit(0);
}

const posts = new Map();

for (const imageFile of imageFiles) {
  const metadataFile = join(sourceDirectory, `${imageFile}.json`);

  if (!existsSync(metadataFile)) {
    throw new Error(`Missing metadata file for ${imageFile}: ${metadataFile}`);
  }

  const metadata = JSON.parse(readFileSync(metadataFile, "utf8"));

  if (!metadata.post_id || !metadata.post_date || !metadata.count || !metadata.num) {
    throw new Error(`Metadata for ${imageFile} is missing Instagram post fields.`);
  }

  const post = posts.get(metadata.post_id) ?? {
    postId: metadata.post_id,
    shortcode: metadata.post_shortcode ?? null,
    url: metadata.post_url ?? null,
    date: metadata.post_date,
    description: metadata.description ?? "",
    likes: metadata.likes ?? null,
    expectedSlideCount: metadata.count,
    slides: [],
  };

  if (post.expectedSlideCount !== metadata.count || post.date !== metadata.post_date) {
    throw new Error(`Inconsistent post metadata for post ${metadata.post_id}.`);
  }

  post.slides.push({
    imageFile,
    metadataFile: basename(metadataFile),
    mediaId: metadata.media_id ?? null,
    position: metadata.num,
    width: metadata.width ?? null,
    height: metadata.height ?? null,
  });
  posts.set(metadata.post_id, post);
}

const orderedPosts = [...posts.values()]
  .map((post) => ({ ...post, slides: post.slides.sort((a, b) => a.position - b.position) }))
  .sort((a, b) => a.date.localeCompare(b.date) || a.postId.localeCompare(b.postId));

const existingFolders = readdirSync(sourceDirectory)
  .filter((file) => /^\d+$/.test(file))
  .map(Number);
const startAt = existingFolders.length ? Math.max(...existingFolders) + 1 : 1;

const plan = orderedPosts.map((post, index) => {
  const folderName = String(startAt + index);
  const folderPath = join(sourceDirectory, folderName);
  const images = post.slides.map((slide, slideIndex) => ({
    ...slide,
    targetFile: `${slideIndex + 1}${extname(slide.imageFile).toLowerCase()}`,
  }));

  return { ...post, folderName, folderPath, images };
});

for (const post of plan) {
  if (existsSync(post.folderPath)) {
    throw new Error(`Target folder already exists: ${post.folderPath}`);
  }
}

const incompletePosts = plan.filter((post) => post.images.length !== post.expectedSlideCount);

console.log(`${applyChanges ? "Organizing" : "Previewing"} ${plan.length} posts and ${imageFiles.length} images.`);
for (const post of plan) {
  const status = post.images.length === post.expectedSlideCount ? "" : ` — incomplete (${post.images.length}/${post.expectedSlideCount})`;
  console.log(`  ${post.folderName}/  ${post.images.length} slide${post.images.length === 1 ? "" : "s"}${status}`);
}

if (!applyChanges) {
  console.log("\nNo files were changed. Re-run with --apply to perform this migration.");
  process.exit(0);
}

for (const post of plan) {
  mkdirSync(post.folderPath);

  const artwork = {
    id: Number(post.folderName),
    title: "",
    description: post.description,
    date: post.date,
    images: post.images.map((image) => ({
      file: image.targetFile,
      alt: "",
      width: image.width,
      height: image.height,
    })),
    instagram: {
      postId: post.postId,
      shortcode: post.shortcode,
      url: post.url,
      likes: post.likes,
    },
  };

  for (const image of post.images) {
    renameSync(join(sourceDirectory, image.imageFile), join(post.folderPath, image.targetFile));
    renameSync(join(sourceDirectory, image.metadataFile), join(post.folderPath, `${image.targetFile}.source.json`));
  }

  const artworkFile = join(post.folderPath, "artwork.json");
  writeFileSync(artworkFile, `${JSON.stringify(artwork, null, 2)}\n`);
}

console.log(`\nOrganized ${plan.length} posts into ${dirname(plan[0].folderPath)}.`);
if (incompletePosts.length) {
  console.log(`Warning: ${incompletePosts.length} carousel${incompletePosts.length === 1 ? "" : "s"} is missing one or more source slides.`);
}
