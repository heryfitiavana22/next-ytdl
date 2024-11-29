import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export type Theme = "light" | "dark";

export function normalizeFilename(filename: string) {
  let normalized = filename.normalize("NFC");

  normalized = normalized.replace(/[^a-zA-Z0-9.\-_ ()]/g, "_");

  normalized = normalized.replace(/\s+/g, " ").replace(/_+/g, "_").trim();

  if (normalized.length > 255) {
    const extensionIndex = normalized.lastIndexOf(".");
    const extension =
      extensionIndex > -1 ? normalized.slice(extensionIndex) : "";
    normalized = normalized.slice(0, 255 - extension.length) + extension;
  }

  return normalized;
}
