import { NextResponse } from "next/server";
import { removeIfExists } from "@/lib/file-manager";
import { Youtubedl } from "@/lib/ytdl/youtubedl";

const youtubedl = new Youtubedl();

export async function GET(request: Request) {
  const url = new URL(request.url);
  const urlParams = url.searchParams.get("url");

  if (!urlParams) {
    return new Response("Missing URL parameter", { status: 400 });
  }
  const videoUrl = decodeURIComponent(urlParams);

  const { outputFilename, outputPath } = await youtubedl.getInfo(videoUrl);

  removeIfExists(outputPath);

  const stream = new ReadableStream({
    async start(controller) {
      try {
        youtubedl.onProgress({
          filename: outputFilename,
          fn: (data) => {
            controller.enqueue(
              JSON.stringify({
                progress: data.progress,
                filename: outputFilename,
                completed: false,
              }) + ";"
            );
          },
        });

        youtubedl.onDownloadComplete({
          filename: outputFilename,
          fn: () => {
            controller.enqueue(
              JSON.stringify({
                progress: 100,
                filename: outputFilename,
                completed: true,
              }) + ";"
            );
          },
        });

        youtubedl.download(videoUrl);
      } catch (error) {
        // console.error("Download error:", error);
        controller.error(error);
      }
    },
  });

  return new NextResponse(stream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      Connection: "keep-alive",
    },
  });
}
