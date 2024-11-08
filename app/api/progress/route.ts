import { NextResponse } from "next/server";
import { Youtubedl } from "@/lib/ytdl/youtubedl";

const youtubedl = new Youtubedl();

export async function GET(request: Request) {
  const url = new URL(request.url);
  const urlParams = url.searchParams.get("url");

  if (!urlParams) {
    return new Response("Missing URL parameter", { status: 400 });
  }
  const videoUrl = decodeURIComponent(urlParams);

  const stream = new ReadableStream({
    async start(controller) {
      try {
        youtubedl.onProgress({
          url: videoUrl,
          fn: (data) => {
            controller.enqueue(
              JSON.stringify({
                progress: data.progress,
                completed: false,
              }) + ";"
            );
          },
        });

        youtubedl.onDownloadComplete({
          url: videoUrl,
          fn: () => {
            controller.enqueue(
              JSON.stringify({
                progress: 100,
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
