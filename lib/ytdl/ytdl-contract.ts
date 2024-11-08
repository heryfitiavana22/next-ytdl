export type Progress = {
  progress: number;
  filename: string;
  completed: boolean;
};

export type InfoMedia = {
  title: string;
  outputFilename: string;
  outputPath: string;
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

export interface Ytdl {
  download(id: string, url: string): void;
  getInfo(url: string): Promise<InfoMedia>;
  onProgress(id: string, callback: CbProgress): void;
  onDownloadComplete(id: string, callback: CbDownloadComplete): void;
}
