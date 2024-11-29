import { NextResponse } from "next/server";
import { Youtubedl } from "@/lib/ytdl/youtubedl";

const youtubedl = new Youtubedl();

export async function GET(request: Request) {
  const url = new URL(request.url);
  const urlParams = url.searchParams.get("url");
  const mediaTypeParams = url.searchParams.get("type");

  if (!urlParams || !mediaTypeParams) {
    return new Response("Missing URL parameter", { status: 400 });
  }

  if (mediaTypeParams !== "mp4" && mediaTypeParams !== "mp3") {
    return new Response("Media type not supported", { status: 400 });
  }

  const videoUrl = decodeURIComponent(urlParams);
  const videoId = Date.now().toString();
  const { signal } = request;

  const stream = new ReadableStream({
    async start(controller) {
      try {
        let isControllerClosed = false;

        const abortHandler = () => {
          isControllerClosed = true;
        };
        signal.addEventListener("abort", abortHandler);

        youtubedl.onProgress(videoId, (data) => {
          if (isControllerClosed) return;
          controller.enqueue(
            JSON.stringify({
              progress: data.progress,
              completed: false,
            }) + ";"
          );
        });

        youtubedl.onDownloadComplete(videoId, () => {
          if (isControllerClosed) return;
          controller.enqueue(
            JSON.stringify({
              progress: 100,
              completed: true,
            }) + ";"
          );
          controller.close();
          isControllerClosed = true;
        });

        if (mediaTypeParams === "mp4") {
          youtubedl.downloadMp4({ id: videoId, url: videoUrl });
        } else {
          youtubedl.downloadMp3({ id: videoId, url: videoUrl });
        }
      } catch (error) {
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
