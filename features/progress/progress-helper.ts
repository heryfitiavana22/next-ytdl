import { Progress } from "@/lib/ytdl/ytdl-contract";
import { MediaType } from "../data-type";

export async function fetchProgress(
  videoUrl: string,
  options: FetchProgressOptions
) {
  const queryParams = new URLSearchParams({
    type: options.type,
    url: encodeURIComponent(videoUrl),
  });

  return await fetch(`/api/progress?${queryParams.toString()}`, {
    signal: options.signal,
  });
}

type FetchProgressOptions = {
  signal?: AbortSignal | null;
  type: MediaType;
};

export function parseProgress(data: string): Progress | null {
  try {
    const parsed: Progress = JSON.parse(data);
    if (parsed && parsed.progress !== undefined) return parsed;
    return null;
  } catch (error) {
    return null;
  }
}
