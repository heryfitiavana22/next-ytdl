export type Progress = {
  progress: number;
  filename: string;
};

export type InfoMedia = {
  title: string;
  outputFilename: string
  outputPath: string
};

export type CbProgress = (progress: Progress) => void;
export type CbDownloadComplete = () => void;

export interface Ytdl {
  download(url: string): void;
  getInfo(url: string): Promise<InfoMedia>;
  onProgress(callback: CbProgress): void;
  onDownloadComplete(callback: CbDownloadComplete): void;
}
