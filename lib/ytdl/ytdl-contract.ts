import { ChildProcess } from "child_process";

export type Progress = {
  progress: number;
  filename: string;
  completed: boolean;
};

export type InfoMedia = {
  title: string;
  outputFilename: string;
  originalFilename: string;
  outputPath: string;
  extension: string;
};

export type SubscriberProgress = {
  id: string;
  fn: CbProgress;
};

export type CbProgress = (progress: Progress) => void;

export type SubscriberDownloadComplete = {
  id: string;
  fn: CbDownloadComplete;
};
export type CbDownloadComplete = () => void;

export type Download = {
  id: string;
  url: string;
};

export type DownloadMp4 = {} & Download;

export type DownloadMp3 = {} & Download;

export type DownloadProgress = {
  subprocess: ChildProcess;
  outputFilename: string;
} & Download;

export type MediaType = "mp4" | "mp3";

export type GetInfo = {
  url: string;
  mediaType: MediaType;
}

export interface Ytdl {
  downloadProgress(params: DownloadProgress): void;
  downloadMp4(params: DownloadMp4): void;
  downloadMp3(params: DownloadMp3): void;
  getInfo(params: GetInfo): Promise<InfoMedia>;
  onProgress(id: string, callback: CbProgress): void;
  onDownloadComplete(id: string, callback: CbDownloadComplete): void;
}
