import { MediaType } from "../data-type";

export type Download = {
  id: string;
  url: string;
  progress: number;
  title: string;
  outputFilename: string;
  status: "downloading" | "completed" | "error";
  abortController: AbortController;
  mediaType: MediaType;
};
