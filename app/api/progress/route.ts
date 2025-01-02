import { NextResponse } from "next/server";
import { Youtubedl } from "@/lib/ytdl/youtubedl";
import { withUrlAndType } from "../with-url-and-type";

const youtubedl = new Youtubedl();

export const GET = withUrlAndType(
  async ({ request, params: { url, mediaType } }) => {
    const videoUrl = decodeURIComponent(url);
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

          if (mediaType === "mp4") {
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
);
