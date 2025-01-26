import { NextResponse } from "next/server";
import { createReadStream } from "fs";
import { join } from "path";
import { stat } from "fs/promises";
import { normalizeFilename } from "@/lib/utils";
import { withFilenameAndType } from "../with-filename-and-type";
import { DOWNLOAD_DIR } from "@/features/constants";

export const GET = withFilenameAndType(
  async ({ params: { filename: filenameParams, mediaType } }) => {
    const tempFilename = decodeURIComponent(filenameParams);
    const filename = normalizeFilename(tempFilename);

    try {
      const filePath = join(DOWNLOAD_DIR, filename);
      await stat(filePath);

      const fileStream = createReadStream(filePath);

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const response = new NextResponse(fileStream as any, {
        headers: {
          "Content-Type": mediaType === "mp4" ? "video/mp4" : "audio/mpeg",
          "Content-Disposition": `attachment; filename="${filename}"`,
        },
      });

      return response;
    } catch (error) {
      console.error("File not found:", error);
      return new Response("File not found", { status: 404 });
    }
  }
);
