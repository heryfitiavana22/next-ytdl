import { removeIfExists } from "@/lib/file-manager";
import { Youtubedl } from "@/lib/ytdl/youtubedl";
import { withUrlAndType } from "../with-url-and-type";

const youtubedl = new Youtubedl();

export const GET = withUrlAndType(
  async ({ params: { url, action, mediaType } }) => {
    const videoUrl = decodeURIComponent(url);

    const { originalFilename, outputPath, title } = await youtubedl.getInfo({
      url: videoUrl,
      mediaType: mediaType,
    });

    if (action == "deleteIfExist") {
      removeIfExists(outputPath);
      removeIfExists(outputPath.replace(".mp3", ".webm"));
    }

    return Response.json({
      title,
      outputFilename: originalFilename,
      outputPath,
    });
  }
);
