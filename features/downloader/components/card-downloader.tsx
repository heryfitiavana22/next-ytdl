import { Card, CardContent } from "@/components/ui/card";
import { Download as DownloadIcon, Music, Trash2, Video } from "lucide-react";
import { CircularProgress } from "./circular-progress";
import { Download } from "../downloader-type";
import { Button } from "@/components/ui/button";

export function CardDownloader({
  download,
  onRemove = () => {},
  onDownload = () => {},
  onClickCard = () => {},
}: CardDownloaderProps) {
  return (
    <Card
      className="hover:bg-muted"
      key={download.id}
      onDoubleClick={() => onClickCard(download)}
    >
      <CardContent className="">
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-2 grow">
            {download.mediaType === "mp3" ? (
              <Music className="h-4 w-4" />
            ) : (
              <Video className="h-4 w-4" />
            )}
            <span className="font-medium truncate max-w-[200px]">
              {download.title}
            </span>
          </div>
          {download.status !== "completed" && (
            <CircularProgress value={download.progress} />
          )}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onRemove(download)}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
          {download.status === "completed" && (
            <Button
              variant="outline"
              size="icon"
              onClick={() => onDownload(download)}
            >
              <DownloadIcon className="h-4 w-4" />
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

type CardDownloaderProps = {
  download: Download;
  onRemove?: (download: Download) => void;
  onDownload?: (download: Download) => void;
  onClickCard?: (download: Download) => void;
};
