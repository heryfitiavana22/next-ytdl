import { Card, CardContent } from "@/components/ui/card";
import { Music, Trash2 } from "lucide-react";
import { CircularProgress } from "./circular-progress";
import { Download } from "../downloader-type";
import { Button } from "@/components/ui/button";

export function CardDownloader({
  download,
  onRemove = () => {},
}: CardDownloaderProps) {
  return (
    <Card key={download.id}>
      <CardContent className="pt-6">
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-2 flex-grow">
            <Music className="h-4 w-4" />
            <span className="font-medium truncate max-w-[200px]">
              {download.title}
            </span>
          </div>
          <CircularProgress value={download.progress} />
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onRemove(download.id)}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

type CardDownloaderProps = {
  download: Download;
  onRemove?: (id: string) => void;
};
