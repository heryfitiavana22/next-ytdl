export type Download = {
  id: string;
  url: string;
  progress: number;
  title: string;
  status: "downloading" | "completed" | "error";
  abortController: AbortController
};
