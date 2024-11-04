"use client";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { X, Music2, CheckCircle2, XCircle } from "lucide-react";
import { Toaster } from "@/components/ui/toaster";
import { useDownloader } from "./use-downloader";

export function Downloader() {
  const { url, setUrl, downloads, startDownload, removeDownload } =
    useDownloader();

  return (
    <div className="max-w-2xl mx-auto p-4 space-y-6">
      <Card className="p-4">
        <div className="flex gap-2">
          <Input
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="Collez l'URL YouTube ici"
            className="flex-1"
          />
          <Button onClick={startDownload} disabled={!url.trim()}>
            Télécharger
          </Button>
        </div>
      </Card>

      {downloads.length > 0 && (
        <Card>
          <CardContent className="pt-6">
            <div className="space-y-4">
              {downloads.map((download) => (
                <div key={download.id} className="relative">
                  <div className="flex items-start gap-4 mb-2">
                    <div className="mt-1">
                      <Music2 className="h-5 w-5 text-muted-foreground" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">
                        {download.title}
                      </p>
                      <div className="flex items-center gap-2 mt-2">
                        <div className="relative w-8 h-8">
                          <svg className="w-8 h-8 -rotate-90">
                            <circle
                              cx="16"
                              cy="16"
                              r="14"
                              strokeWidth="4"
                              fill="none"
                              className="stroke-muted"
                            />
                            <circle
                              cx="16"
                              cy="16"
                              r="14"
                              strokeWidth="4"
                              fill="none"
                              strokeDasharray={88}
                              strokeDashoffset={
                                88 - (88 * download.progress) / 100
                              }
                              className="stroke-primary transition-all duration-300"
                            />
                          </svg>
                          {download.status === "completed" ? (
                            <CheckCircle2 className="w-4 h-4 text-green-500 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
                          ) : download.status === "error" ? (
                            <XCircle className="w-4 h-4 text-red-500 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
                          ) : (
                            <span className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-xs font-medium">
                              {Math.round(download.progress)}%
                            </span>
                          )}
                        </div>
                        <Progress
                          value={download.progress}
                          className="flex-1"
                        />
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => removeDownload(download.id)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
      <Toaster />
    </div>
  );
}
