import { tmpdir } from "os";
import {
  CbDownloadComplete,
  CbProgress,
  InfoMedia,
  SubscriberProgress,
  SubscriberDownloadComplete,
  Ytdl,
} from "./ytdl-contract";
import path, { join } from "path";
import { create as createYoutubeDl } from "youtube-dl-exec";

const executablePath = path.resolve(
  process.cwd(),
  "node_modules/youtube-dl-exec/bin/yt-dlp"
);

export class Youtubedl implements Ytdl {
  private subscribersProgress: SubscriberProgress[] = [];
  private subscribersCompleted: SubscriberDownloadComplete[] = [];

  download = async (id: string, videoUrl: string) => {
    const youtubedl = createYoutubeDl(executablePath);

    const { outputFilename, outputPath } = await this.getInfo(videoUrl);
    const subprocess = youtubedl.exec(videoUrl, {
      extractAudio: true,
      audioFormat: "mp3",
      output: outputPath,
    });

    if (subprocess.stdout) {
      subprocess.stdout.on("data", (data) => {
        const output = data.toString();
        const match = output.match(/\[download\]\s+([\d.]+)%/);
        if (match) {
          const progress = parseInt(match[1]);
          this.subscribersProgress.forEach((subscriber) => {
            if (subscriber.id === id) {
              subscriber.fn({
                progress,
                filename: outputFilename,
                completed: false,
              });
            }
          });
        }
      });
      subprocess.stdout.on("end", () => {
        this.subscribersCompleted.forEach((subscriber) => {
          if (subscriber.id === id) {
            subscriber.fn();
          }
        });
      });
    }
  };

  getInfo = async (url: string): Promise<InfoMedia> => {
    const youtubedl = createYoutubeDl(executablePath);

    const info = await youtubedl.exec(url, {
      dumpSingleJson: true,
      noCheckCertificates: true,
      noWarnings: true,
      preferFreeFormats: true,
      addHeader: ["referer:youtube.com", "user-agent:googlebot"],
    });
    const originalTitle = info.stdout
      ? JSON.parse(info.stdout).title
      : `audio-default-${Date.now()}`;

    const outputFilename = `${originalTitle}.mp3`;
    const outputPath = join(tmpdir(), outputFilename);
    return { title: originalTitle, outputFilename, outputPath };
  };

  onProgress = (id: string, fn: CbProgress) => {
    this.subscribersProgress.push({ id, fn });
  };

  onDownloadComplete = (id: string, fn: CbDownloadComplete) => {
    this.subscribersCompleted.push({ id, fn });
  };
}
