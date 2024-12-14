"use client";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import { useDownloader } from "./use-downloader";
import { CardDownloader } from "./components/card-downloader";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { MediaType } from "../data-type";

export function Downloader() {
  const {
    url,
    setUrl,
    downloads,
    startDownload,
    mediaType,
    setMediaType,
    removeOrAbortDownload,
    onDownload,
    copyUrl,
  } = useDownloader();

  return (
    <div className="space-y-6">
      <RadioGroup
        defaultValue={mediaType}
        onValueChange={(value) => setMediaType(value as MediaType)}
        className="flex space-x-4"
      >
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="mp3" id="mp3" />
          <Label htmlFor="mp3">MP3</Label>
        </div>
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="mp4" id="mp4" />
          <Label htmlFor="mp4">MP4</Label>
        </div>
      </RadioGroup>

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
            onRemove={removeOrAbortDownload}
            onDownload={onDownload}
            onClickCard={(download) => copyUrl(download.url)}
          />
        ))}
      </div>
    </div>
  );
}
