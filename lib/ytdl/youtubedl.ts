import {
  CbDownloadComplete,
  CbProgress,
  InfoMedia,
  SubscriberProgress,
  SubscriberDownloadComplete,
  Ytdl,
  DownloadMp3,
  DownloadMp4,
  DownloadProgress,
  GetInfo,
} from "./ytdl-contract";
import path, { join } from "path";
import { create as createYoutubeDl } from "youtube-dl-exec";
import { normalizeFilename } from "../utils";
import { DOWNLOAD_DIR } from "@/features/constants";

const executablePath = path.resolve(
  process.cwd(),
  "node_modules/youtube-dl-exec/bin/yt-dlp"
);

export class Youtubedl implements Ytdl {
  private subscribersProgress: SubscriberProgress[] = [];
  private subscribersCompleted: SubscriberDownloadComplete[] = [];
  private mapProgress: Map<string, number> = new Map();

  downloadMp4 = async ({ id, url }: DownloadMp4) => {
    const youtubedl = createYoutubeDl(executablePath);

    const { originalFilename, outputPath } = await this.getInfo({
      url,
      mediaType: "mp4",
    });
    const subprocess = youtubedl.exec(url, {
      output: outputPath,
      noPlaylist: true,
      format: "bv*[ext=mp4]+ba[ext=m4a]/b[ext=mp4] / bv*+ba/b",
    });

    this.downloadProgress({
      subprocess,
      id,
      outputFilename: originalFilename,
      url,
    });
  };

  downloadMp3 = async ({ id, url }: DownloadMp3) => {
    const youtubedl = createYoutubeDl(executablePath);

    const { originalFilename, outputPath } = await this.getInfo({
      url,
      mediaType: "mp3",
    });

    const subprocess = youtubedl.exec(url, {
      extractAudio: true,
      audioFormat: "mp3",
      output: outputPath,
      noPlaylist: true,
    });

    this.downloadProgress({
      subprocess,
      id,
      outputFilename: originalFilename,
      url,
    });
  };

  downloadProgress({ subprocess, id, outputFilename }: DownloadProgress): void {
    if (subprocess.stdout) {
      subprocess.stdout.on("data", (data) => {
        const output = data.toString();
        const match = output.match(/\[download\]\s+([\d.]+)%/);
        if (match) {
          const lastProgress = this.mapProgress.get(id) || 0;
          const currentProgress = parseInt(match[1]);
          if (
            lastProgress < currentProgress
            // || (lastProgress === 100 && currentProgress === 0)
          ) {
            this.subscribersProgress.forEach((subscriber) => {
              if (subscriber.id === id) {
                subscriber.fn({
                  progress: currentProgress,
                  filename: outputFilename,
                  completed: false,
                });
                this.mapProgress.set(id, currentProgress);
              }
            });
          }
        }
      });
      subprocess.stdout.on("end", () => {
        this.subscribersCompleted.forEach((subscriber) => {
          if (subscriber.id === id) {
            subscriber.fn();
            this.mapProgress.delete(id);
          }
        });
      });
    }
  }

  getInfo = async ({ url, mediaType }: GetInfo): Promise<InfoMedia> => {
    const youtubedl = createYoutubeDl(executablePath);

    const info = await youtubedl.exec(url, {
      dumpSingleJson: true,
      noCheckCertificates: true,
      noWarnings: true,
      preferFreeFormats: true,
      noPlaylist: true,
      format: "bv*[ext=mp4]+ba[ext=m4a]/b[ext=mp4] / bv*+ba/b",
    });
    const parsed = JSON.parse(info.stdout);

    const originalTitle = parsed.title || `default-${Date.now()}`;
    const extension = mediaType == "mp4" ? "mp4" : "mp3";

    const tempFilename = `${originalTitle}.${extension}`;
    const outputFilename = normalizeFilename(tempFilename);
    const outputPath = join(DOWNLOAD_DIR, outputFilename);
    return {
      title: originalTitle,
      outputFilename,
      outputPath,
      originalFilename: tempFilename,
      extension,
    };
  };

  onProgress = (id: string, fn: CbProgress) => {
    this.subscribersProgress.push({ id, fn });
  };

  onDownloadComplete = (id: string, fn: CbDownloadComplete) => {
    this.subscribersCompleted.push({ id, fn });
  };
}
