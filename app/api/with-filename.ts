export function withFilename<TRequest extends Request>(handler: Handler) {
  return async function (request: TRequest) {
    const url = new URL(request.url);
    const filenameParams = url.searchParams.get("filename");

    if (!filenameParams)
      return new Response("Missing filename parameter", { status: 400 });

    return handler({
      request,
      params: { filename: filenameParams },
    });
  };
}

type HandlerParams = {
  request: Request;
  params: {
    filename: string;
  };
};
type Handler = (params: HandlerParams) => Promise<Response>;
