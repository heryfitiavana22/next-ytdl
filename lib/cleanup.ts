import { readdir, stat } from "fs/promises";
import { join } from "path";
import { removeIfExists } from "./file-manager";
import { DOWNLOAD_DIR } from "../features/constants";

const ONE_HOUR_IN_MS = 3600000;
let running = false;
export async function cleanupTempFiles(maxAge = ONE_HOUR_IN_MS) {
  if (running) return;
  running = true;

  setInterval(async () => {
    await cleanupTmpDir(maxAge);
  }, ONE_HOUR_IN_MS);
}

async function cleanupTmpDir(maxAge = ONE_HOUR_IN_MS) {
  const tempDir = DOWNLOAD_DIR;
  console.log("remove tempdir");

  try {
    const files = await readdir(tempDir);
    const now = Date.now();

    for (const file of files) {
      if (file.endsWith(".mp3") || file.endsWith(".webm")) {
        const filePath = join(tempDir, file);
        try {
          const stats = await stat(filePath);
          if (now - stats.ctimeMs > maxAge) {
            removeIfExists(filePath);
          }
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
        } catch (error) {}
      }
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (error) {}
}
