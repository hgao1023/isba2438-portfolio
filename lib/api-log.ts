export function logApiResponse(request: Request, response: Response): Response {
  const pathname = new URL(request.url).pathname;
  console.log(`[api] ${request.method} ${pathname} -> ${response.status}`);
  return response;
}
