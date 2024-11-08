import { InfoMedia } from "@/lib/ytdl/ytdl-contract";

export async function getInfo(url: string, options: InfoOptions = {}) {
  const queryParams = new URLSearchParams();
  queryParams.append("url", encodeURIComponent(url));
  if (options.action) queryParams.append("action", options.action);

  const response = await fetch(`/api/info?${queryParams.toString()}`);
  if (!response.ok) throw new Error("Getting info failed");

  return (await response.json()) as InfoMedia;
}

type InfoOptions = {
  action?: "delete";
};
