import { Card, CardContent } from "@/components/ui/card";
import { Music } from "lucide-react";
import { CircularProgress } from "./circular-progress";
import { Download } from "../downloader-type";

export function CardDownloader({ download }: CardDownloaderProps) {
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
        </div>
      </CardContent>
    </Card>
  );
}

type CardDownloaderProps = {
  download: Download;
};
