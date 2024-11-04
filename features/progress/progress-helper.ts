export type Progress = {
  progress: number;
  filename: string;
};

export async function fetchProgress(url: string) {
  return await fetch(`/api/progress?url=${encodeURIComponent(url)}`);
}

export function parseProgress(data: string): Progress | null {
  try {
    const parsed: Progress = JSON.parse(data);
    if (parsed && parsed.progress !== undefined && parsed.filename)
      return parsed;
    return null;
  } catch (error) {
    return null;
  }
}
