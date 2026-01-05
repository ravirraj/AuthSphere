import { getConfig } from "../config/options";

export function redirectToLogin(provider) {
  const { clientId, redirectUri, baseUrl } = getConfig();

  const url = new URL(`${baseUrl}/authorize`);

  url.searchParams.set("client_id", clientId);
  url.searchParams.set("redirect_uri", redirectUri);
  url.searchParams.set("provider", provider);
  url.searchParams.set("response_type", "code");

  window.location.href = url.toString();
}
