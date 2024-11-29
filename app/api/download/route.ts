import { NextResponse } from "next/server";
import { createReadStream } from "fs";
import { join } from "path";
import { tmpdir } from "os";
import { stat } from "fs/promises";
import { removeIfExists } from "@/lib/file-manager";
import { normalizeFilename } from "@/lib/utils";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const filenameParams = url.searchParams.get("filename");
  const mediaTypeParams = url.searchParams.get("type");

  if (!filenameParams)
    return new Response("Missing filename parameter", { status: 400 });

  if (mediaTypeParams !== "mp4" && mediaTypeParams !== "mp3") {
    return new Response("Media type not supported", { status: 400 });
  }

  const tempFilename = decodeURIComponent(filenameParams);
  const filename = normalizeFilename(tempFilename);

  try {
    const filePath = join(tmpdir(), filename);
    await stat(filePath);

    const fileStream = createReadStream(filePath);
    const filePathToDelete = filePath;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const response = new NextResponse(fileStream as any, {
      headers: {
        "Content-Type": mediaTypeParams === "mp4" ? "video/mp4" : "audio/mpeg",
        "Content-Disposition": `attachment; filename="${filename}"`,
      },
    });

    fileStream.on("end", () => {
      try {
        setTimeout(() => {
          removeIfExists(filePathToDelete);
        }, 1000);
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
      } catch (error) {}
    });

    return response;
  } catch (error) {
    console.error("File not found:", error);
    return new Response("File not found", { status: 404 });
  }
}
