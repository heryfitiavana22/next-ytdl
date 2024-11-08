import { removeIfExists } from "@/lib/file-manager";
import { Youtubedl } from "@/lib/ytdl/youtubedl";

const youtubedl = new Youtubedl();

export async function GET(request: Request) {
  const url = new URL(request.url);
  const urlParams = url.searchParams.get("url");
  const actionParams = url.searchParams.get("action");

  if (!urlParams) {
    return new Response("Missing URL parameter", { status: 400 });
  }
  const videoUrl = decodeURIComponent(urlParams);

  const { outputFilename, outputPath } = await youtubedl.getInfo(videoUrl);

  if (actionParams == "deleteIfExist") {
    removeIfExists(outputPath);
    removeIfExists(outputPath.replace(".mp3", ".webm"));
  }

  return Response.json({
    title: outputFilename.replace(".mp3", ""),
    outputFilename,
    outputPath,
  });
}
