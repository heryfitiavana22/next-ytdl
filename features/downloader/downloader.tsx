"use client";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import { Toaster } from "@/components/ui/toaster";
import { useDownloader } from "./use-downloader";
import { CardDownloader } from "./components/card-downloader";

export function Downloader() {
  const { url, setUrl, downloads, startDownload, abortDownload } =
    useDownloader();

  return (
    <div className="space-y-6">
      <div className="flex space-x-2">
        <Input
          type="url"
          placeholder="Collez l'URL YouTube ici"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          className="flex-grow"
        />
        <Button onClick={startDownload}>
          <Download className="mr-2 h-4 w-4" /> Télécharger
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {downloads.map((download) => (
          <CardDownloader
            download={download}
            key={download.id}
            onRemove={(id) => abortDownload(id)}
          />
        ))}
      </div>

      <Toaster />
    </div>
  );
}
