import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { Download } from "./downloader-type";
import { fetchProgress, parseProgress } from "../progress/progress-helper";
import { downloadFile } from "./downloader-helper";

export function useDownloader() {
  const [url, setUrl] = useState("");
  const [downloads, setDownloads] = useState<Download[]>([]);
  const { toast } = useToast();

  const startDownload = async () => {
    if (!url.trim()) return;

    const downloadId = Date.now().toString();
    const newDownload: Download = {
      id: downloadId,
      url,
      progress: 0,
      title: "Chargement...",
      status: "downloading",
    };
    let filename = "";

    setDownloads((prev) => [...prev, newDownload]);
    setUrl("");

    try {
      const progressResponse = await fetchProgress(encodeURIComponent(url));
      const reader = progressResponse.body?.getReader();
      const decoder = new TextDecoder();

      if (!reader) throw new Error("Cannot read response");

      while (true) {
        const { value, done } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value);
        const lines = chunk.split(";");

        for (const line of lines) {
          if (line === "") continue;
          const dataProgress = parseProgress(line);
          if (dataProgress === null) continue;

          updateDownloadsById(downloadId, {
            progress: dataProgress.progress,
            title: dataProgress.filename.replace(".mp3", ""),
            status: "downloading",
          });

          filename = dataProgress.filename;

          if (dataProgress.completed) {
            await downloadFile(filename);
            updateDownloadsById(downloadId, { status: "completed" });

            toast({
              title: "Téléchargement terminé",
              description: `${filename} a été téléchargé avec succès.`,
            });

            setTimeout(() => removeDownload(downloadId), 1000);
            return;
          }
        }
      }
    } catch (error) {
      updateDownloadsById(downloadId, { status: "error" });
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors du téléchargement.",
        variant: "destructive",
      });
    }
  };

  const updateDownloadsById = (id: string, data: Partial<Download>) => {
    setDownloads((prev) =>
      prev.map((download) => {
        if (download.id === id) {
          return { ...download, ...data };
        }
        return download;
      })
    );
  };

  const removeDownload = (id: string) => {
    setDownloads((prev) => prev.filter((download) => download.id !== id));
  };

  return {
    url,
    setUrl,
    downloads,
    startDownload,
    removeDownload,
  };
}
