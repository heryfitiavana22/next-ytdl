import { NextResponse } from "next/server";
import { normalizeFilename } from "@/lib/utils";
import { removeIfExists } from "@/lib/file-manager";

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
    removeIfExists(filename);
    return NextResponse.json(
      { message: "File removed successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("File not found:", error);
    return new Response("File not found", { status: 404 });
  }
}
