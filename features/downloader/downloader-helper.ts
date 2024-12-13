import { MediaType } from "../data-type";

export const downloadFile = async (
  filename: string,
  options: DownloadFileOptions
) => {
  const query = new URLSearchParams({
    filename: encodeURIComponent(filename),
    type: options.type,
  });
  const response = await fetch(`/api/download?${query.toString()}`, {
    signal: options.signal,
  });
  if (!response.ok) throw new Error("Download failed");

  const blob = await response.blob();
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  window.URL.revokeObjectURL(url);
};

export const removeFile = async (filename: string) => {
  const query = new URLSearchParams({
    filename: encodeURIComponent(filename),
  });
  const response = await fetch(`/api/remove?${query.toString()}`);

  return response.ok;
};

type DownloadFileOptions = {
  signal?: AbortSignal | null;
  type: MediaType;
};
