import { InfoMedia } from "@/lib/ytdl/ytdl-contract";

export async function getInfo(videoUrl: string, options: InfoOptions = {}) {
  const queryParams = new URLSearchParams();
  queryParams.append("url", encodeURIComponent(videoUrl));
  if (options.action) queryParams.append("action", options.action);

  const response = await fetch(`/api/info?${queryParams.toString()}`, {
    signal: options.signal,
  });
  if (!response.ok) throw new Error("Getting info failed");

  return (await response.json()) as InfoMedia;
}

type InfoOptions = {
  action?: "deleteIfExist";
  signal?: AbortSignal | null;
};
