#!/usr/bin/env bun
import sharp from "sharp";
import { readFile, writeFile } from "node:fs/promises";
import { resolve } from "node:path";

const root = resolve(import.meta.dir, "..");
const svg = await readFile(resolve(root, "public/kilo-icon.svg"));

const targets = [
  { name: "icon-192.png", size: 192 },
  { name: "icon-512.png", size: 512 },
  { name: "apple-touch-icon.png", size: 180 },
];

for (const { name, size } of targets) {
  const out = resolve(root, "public", name);
  const buf = await sharp(svg).resize(size, size).png().toBuffer();
  await writeFile(out, buf);
  console.log(`✓ ${name} (${size}×${size})`);
}
