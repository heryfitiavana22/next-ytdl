import { MediaType } from "@/features/data-type";

export function withFilenameAndType<TRequest extends Request>(
  handler: Handler
) {
  return async function (request: TRequest) {
    const url = new URL(request.url);
    const filenameParams = url.searchParams.get("filename");
    const mediaTypeParams = url.searchParams.get("type");

    if (!filenameParams)
      return new Response("Missing filename parameter", { status: 400 });

    if (mediaTypeParams !== "mp4" && mediaTypeParams !== "mp3") {
      return new Response("Media type not supported", { status: 400 });
    }

    return handler({
      request,
      params: { filename: filenameParams, mediaType: mediaTypeParams },
    });
  };
}

type HandlerParams = {
  request: Request;
  params: {
    filename: string;
    mediaType: MediaType;
  };
};
type Handler = (params: HandlerParams) => Promise<Response>;
