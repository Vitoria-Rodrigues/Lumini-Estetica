const DEFAULT_ALLOWED_ORIGINS = [
  "http://localhost:5173",
  "http://127.0.0.1:5173",
  "http://localhost:3000",
  "http://127.0.0.1:3000",
];

export function getCorsHeaders(req: Request) {
  const origin = req.headers.get("origin") ?? req.headers.get("Origin") ?? "";

  const envOrigins = Deno.env.get("ALLOWED_ORIGINS")
    ? Deno.env.get("ALLOWED_ORIGINS")!.split(",").map((o) => o.trim())
    : [];

  const allowedOrigins = [...DEFAULT_ALLOWED_ORIGINS, ...envOrigins];
  const isAllowed = Boolean(origin && allowedOrigins.includes(origin));

  return {
    "Access-Control-Allow-Origin": isAllowed ? origin : (envOrigins[0] || DEFAULT_ALLOWED_ORIGINS[0]),
    "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
  };
}
