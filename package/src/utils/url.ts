export function buildUrl(base: string, params: Record<string, string>) {
  const url = new URL(base);
  for (const key in params) {
    url.searchParams.set(key, params[key]);
  }
  return url.toString();
}
