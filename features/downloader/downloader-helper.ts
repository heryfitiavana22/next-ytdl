export const downloadFile = async (
  filename: string,
  options: DownloadFileOptions = {}
) => {
  const response = await fetch(
    `/api/download?filename=${encodeURIComponent(filename)}`,
    {
      signal: options.signal,
    }
  );
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

type DownloadFileOptions = {
  signal?: AbortSignal | null;
};
