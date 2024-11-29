import { removeIfExists } from "@/lib/file-manager";
import { Youtubedl } from "@/lib/ytdl/youtubedl";

const youtubedl = new Youtubedl();

export async function GET(request: Request) {
  const url = new URL(request.url);
  const urlParams = url.searchParams.get("url");
  const actionParams = url.searchParams.get("action");
  const mediaTypeParams = url.searchParams.get("type");

  if (!urlParams || !mediaTypeParams) {
    return new Response("Missing URL parameter", { status: 400 });
  }

  if (mediaTypeParams !== "mp4" && mediaTypeParams !== "mp3") {
    return new Response("Media type not supported", { status: 400 });
  }

  const videoUrl = decodeURIComponent(urlParams);

  const { originalFilename, outputPath } = await youtubedl.getInfo({
    url: videoUrl,
    mediaType: mediaTypeParams,
  });

  if (actionParams == "deleteIfExist") {
    removeIfExists(outputPath);
    removeIfExists(outputPath.replace(".mp3", ".webm"));
  }

  return Response.json({
    title: originalFilename.replace(".mp3", ""),
    outputFilename: originalFilename,
    outputPath,
  });
}
