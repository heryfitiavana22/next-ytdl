import { tmpdir } from "os";
import {
  CbDownloadComplete,
  CbProgress,
  InfoMedia,
  Ytdl,
} from "./ytdl-contract";
import path, { join } from "path";
import { create as createYoutubeDl, Create } from "youtube-dl-exec";

const executablePath = path.resolve(
  process.cwd(),
  "node_modules/youtube-dl-exec/bin/yt-dlp"
);

export class Youtubedl implements Ytdl {
  private youtubedl: ReturnType<Create>;
  private subscribersProgress: CbProgress[] = [];
  private subscribersCompleted: CbDownloadComplete[] = [];

  constructor() {
    this.youtubedl = createYoutubeDl(executablePath);
  }

  download = async (videoUrl: string) => {
    const { outputFilename, outputPath } = await this.getInfo(videoUrl);
    const subprocess = this.youtubedl.exec(videoUrl, {
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
          this.subscribersProgress.forEach((subscriber) =>
            subscriber({ progress, filename: outputFilename })
          );
        }
      });
      subprocess.stdout.on("end", () => {
        this.subscribersCompleted.forEach((subscriber) => subscriber());
      });
    }
  };

  getInfo = async (url: string): Promise<InfoMedia> => {
    const info = await this.youtubedl.exec(url, {
      dumpSingleJson: true,
      noCheckCertificates: true,
      noWarnings: true,
      preferFreeFormats: true,
    });
    const originalTitle = info.stdout
      ? JSON.parse(info.stdout).title
      : `audio-default-${Date.now()}`;

    const outputFilename = `${originalTitle}.mp3`;
    const outputPath = join(tmpdir(), outputFilename);
    return { title: originalTitle, outputFilename, outputPath };
  };

  onProgress = (callback: CbProgress) => {
    this.subscribersProgress.push(callback);
  };

  onDownloadComplete = (callback: CbDownloadComplete) => {
    this.subscribersCompleted.push(callback);
  };
}
