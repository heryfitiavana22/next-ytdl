import { NextResponse } from "next/server";
import { createReadStream } from "fs";
import { join } from "path";
import { tmpdir } from "os";
import { stat } from "fs/promises";
import { removeIfExists } from "@/lib/file-manager";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const filename = url.searchParams.get("filename");

  if (!filename)
    return new Response("Missing filename parameter", { status: 400 });

  try {
    const filePath = join(tmpdir(), filename);
    await stat(filePath);

    const fileStream = createReadStream(filePath);
    const filePathToDelete = filePath;

    const response = new NextResponse(fileStream as any, {
      headers: {
        "Content-Type": "audio/mpeg",
        "Content-Disposition": `attachment; filename="${filename}"`,
      },
    });

    fileStream.on("end", () => {
      try {
        setTimeout(() => {
          removeIfExists(filePathToDelete);
        }, 1000);
      } catch (error) {}
    });

    return response;
  } catch (error) {
    console.error("File not found:", error);
    return new Response("File not found", { status: 404 });
  }
}
