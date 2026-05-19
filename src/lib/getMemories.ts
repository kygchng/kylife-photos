import fs from "fs";
import path from "path";
import sharp from "sharp";
import type { Memory } from "@/data/memories";

const IMAGES_DIR = path.join(process.cwd(), "public", "images");

const IMAGE_EXT = /\.(jpeg|jpg|png|webp)$/i;

function folderToId(name: string): string {
  return name.toLowerCase().replace(/\s+/g, "-");
}

function folderToTitle(name: string): string {
  return name;
}

async function isLandscape(filePath: string): Promise<boolean> {
  const { width = 0, height = 0 } = await sharp(filePath).metadata();
  return width > height;
}

export async function getMemories(): Promise<Memory[]> {
  if (!fs.existsSync(IMAGES_DIR)) return [];

  const folders = fs
    .readdirSync(IMAGES_DIR, { withFileTypes: true })
    .filter((d) => d.isDirectory())
    .map((d) => d.name)
    .sort();

  const results: Array<Memory | null> = await Promise.all(
    folders.map(async (folder): Promise<Memory | null> => {
      const folderPath = path.join(IMAGES_DIR, folder);

      // Optional metadata.json for title / location / date overrides
      let meta: { title?: string; location?: string; date?: string } = {};
      const metaPath = path.join(folderPath, "metadata.json");
      if (fs.existsSync(metaPath)) {
        try {
          meta = JSON.parse(fs.readFileSync(metaPath, "utf-8"));
        } catch {
          // ignore malformed metadata
        }
      }

      // Require a cover image
      const allFiles = fs
        .readdirSync(folderPath)
        .filter((f) => IMAGE_EXT.test(f))
        .sort();

      const coverFile = allFiles.find((f) => /^cover\./i.test(f));
      if (!coverFile) return null;

      const coverPath = path.join(folderPath, coverFile);
      const coverLandscape = await isLandscape(coverPath);

      // All images in sorted order (cover + numbered)
      const images: Memory["images"] = await Promise.all(
        allFiles.map(async (file) => {
          const landscape = await isLandscape(path.join(folderPath, file));
          const img: Memory["images"][number] = {
            src: `/images/${encodeURIComponent(folder)}/${encodeURIComponent(file)}`,
          };
          if (landscape) img.landscape = true;
          return img;
        }),
      );

      const memory: Memory = {
        id: folderToId(folder),
        title: meta.title ?? folderToTitle(folder),
        location: meta.location ?? "",
        date: meta.date ?? "",
        coverImage: `/images/${encodeURIComponent(folder)}/${encodeURIComponent(coverFile)}`,
        images,
      };
      if (coverLandscape) memory.coverLandscape = true;
      return memory;
    }),
  );

  return results.filter((m): m is Memory => m !== null);
}
