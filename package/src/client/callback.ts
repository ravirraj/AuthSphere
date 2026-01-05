import { getConfig } from "../config/options";

export async function handleAuthCallback() {
  const { clientId, redirectUri, baseUrl } = getConfig();

  const params = new URLSearchParams(window.location.search);
  const code = params.get("code");

  if (!code) return null;

  const res = await fetch(`${baseUrl}/token`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      code,
      clientId,
      redirectUri,
    }),
  });

  if (!res.ok) {
    throw new Error("Authentication failed");
  }

  const data = await res.json();

  localStorage.setItem("authsphere_token", data.accessToken);
  localStorage.setItem("authsphere_user", JSON.stringify(data.user));

  // clean URL
  window.history.replaceState({}, document.title, window.location.pathname);

  return data;
}
