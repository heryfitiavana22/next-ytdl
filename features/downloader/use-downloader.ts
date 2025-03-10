import { useState } from "react";
import { Download } from "./downloader-type";
import { fetchProgress, parseProgress } from "../progress/progress-helper";
import { downloadFile, removeFile } from "./downloader-helper";
import { getInfo } from "../info/info-helper";
import { MediaType } from "../data-type";
import { toast } from "sonner";

export function useDownloader() {
  const [url, setUrl] = useState("");
  const [mediaType, setMediaType] = useState<MediaType>("mp3");
  const [downloads, setDownloads] = useState<Download[]>([]);

  const startDownload = async () => {
    if (!url.trim()) return;

    const downloadId = Date.now().toString();

    const abortController = new AbortController();
    const { signal } = abortController;
    const newDownload: Download = {
      id: downloadId,
      url,
      progress: 0,
      title: "Chargement...",
      outputFilename: "",
      status: "downloading",
      abortController,
      mediaType,
    };

    setDownloads((prev) => [newDownload, ...prev]);
    setUrl("");

    try {
      const info = await getInfo(url, {
        action: "deleteIfExist",
        signal,
        type: newDownload.mediaType,
      });
      updateDownloadsById(downloadId, {
        title: info.title,
        outputFilename: info.outputFilename,
      });

      const progressResponse = await fetchProgress(url, {
        signal,
        type: newDownload.mediaType,
      });
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
            status: "downloading",
          });

          if (dataProgress.completed) {
            await onDownload({
              ...newDownload,
              outputFilename: info.outputFilename,
            });
            updateDownloadsById(downloadId, { status: "completed" });

            toast(`Téléchargement de ${info.title} terminé`);

            return;
          }
        }
      }
    } catch (error: any) {
      if (error.name === "AbortError") return;
      updateDownloadsById(downloadId, { status: "error" });
      toast("Erreur", {
        description: "Une erreur est survenue lors du téléchargement.",
      });
    }
  };

  const onDownload = async (download: Download) => {
    await downloadFile(download.outputFilename, {
      signal: download.abortController.signal,
      type: download.mediaType,
    });
    toast(`${download.title} a été téléchargé avec succès.`);
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

  const abortDownload = (id: string) => {
    let newData: Download[] = [];
    for (const download of downloads) {
      if (download.id === id) {
        download.abortController.abort();
      } else {
        newData.push(download);
      }
    }
    setDownloads(newData);
  };

  const removeOrAbortDownload = async (download: Download) => {
    if (download.status === "downloading") {
      abortDownload(download.id);
    } else {
      removeDownload(download.id);
    }
    if (download.status == "completed") {
      await removeFile(download.outputFilename);
    }
  };

  const copyUrl = (url: string) => {
    navigator.clipboard.writeText(url);
    toast("URL copiée");
  };

  return {
    url,
    setUrl,
    downloads,
    startDownload,
    abortDownload,
    mediaType,
    setMediaType,
    removeOrAbortDownload,
    onDownload,
    copyUrl,
  };
}
