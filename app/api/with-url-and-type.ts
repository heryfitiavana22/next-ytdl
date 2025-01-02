import { MediaType } from "@/features/data-type";

export function withUrlAndType<TRequest extends Request>(handler: Handler) {
  return async function (request: TRequest) {
    const url = new URL(request.url);
    const urlParams = url.searchParams.get("url");
    const mediaTypeParams = url.searchParams.get("type");
    const actionParams = url.searchParams.get("action");

    if (!urlParams || !mediaTypeParams) {
      return new Response("Missing URL parameter", { status: 400 });
    }

    if (mediaTypeParams !== "mp4" && mediaTypeParams !== "mp3") {
      return new Response("Media type not supported", { status: 400 });
    }

    return handler({
      request,
      params: {
        url: urlParams,
        mediaType: mediaTypeParams,
        action: actionParams,
      },
    });
  };
}

type HandlerParams = {
  request: Request;
  params: {
    url: string;
    mediaType: MediaType;
    action: string | null;
  };
};
type Handler = (params: HandlerParams) => Promise<Response>;
