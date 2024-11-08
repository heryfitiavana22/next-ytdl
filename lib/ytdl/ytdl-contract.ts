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

export type CbProgress = {
  url: string;
  fn: (progress: Progress) => void;
};
export type CbDownloadComplete = {
  url: string;
  fn: () => void;
};

export interface Ytdl {
  download(url: string): void;
  getInfo(url: string): Promise<InfoMedia>;
  onProgress(callback: CbProgress): void;
  onDownloadComplete(callback: CbDownloadComplete): void;
}
