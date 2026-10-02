export function GET(request: Request) {
  return Response.redirect(new URL("/tm-forum/field-guide", request.url), 308);
}
