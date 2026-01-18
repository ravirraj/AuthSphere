import { getConfig } from "../config/options";
import { AuthError } from "../utils/errors";
import {
  getCodeVerifier,
  clearCodeVerifier,
  getState,
  clearState,
  setAccessToken,
  setRefreshToken,
  setUser,
  setExpiresAt,
} from "../utils/storage";
import type { AuthResponse } from "../types";

const DEFAULT_BASE_URL = "http://localhost:8000";

export async function handleAuthCallback(): Promise<AuthResponse | null> {
  const params = new URLSearchParams(window.location.search);
  const code = params.get("code");
  const state = params.get("state");
  const error = params.get("error");

  // ✅ CHECK FOR ERROR RESPONSE
  if (error) {
    const errorDescription = params.get("error_description") || "Authentication failed";
    throw new AuthError(`${error}: ${errorDescription}`);
  }

  // ✅ NO CODE = NOT A CALLBACK
  if (!code) return null;

  // ✅ CSRF PROTECTION - VERIFY STATE
  const storedState = getState();
  if (!storedState || state !== storedState) {
    clearState();
    throw new AuthError("Invalid state parameter - possible CSRF attack");
  }
  clearState();

  // ✅ PKCE CODE VERIFIER
  const codeVerifier = getCodeVerifier();
  if (!codeVerifier) {
    throw new AuthError("Missing code verifier - invalid flow");
  }
  clearCodeVerifier();

  // ✅ GET CONFIG
  const { publicKey, redirectUri, baseUrl } = getConfig();

  if (!publicKey || !redirectUri) {
    throw new AuthError("AuthConfig missing publicKey or redirectUri");
  }

  const tokenUrl = `${(baseUrl || DEFAULT_BASE_URL).replace(/\/$/, "")}/sdk/token`;

  try {
    console.log("🔄 Exchanging authorization code for tokens...");

    const res = await fetch(tokenUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        code,
        public_key: publicKey,
        redirect_uri: redirectUri,
        code_verifier: codeVerifier,
      }),
    });

    if (!res.ok) {
      let errorData;
      try {
        errorData = await res.json();
      } catch {
        errorData = { message: `HTTP ${res.status}: Token exchange failed` };
      }
      throw new AuthError(errorData.message || errorData.error_description || "Token exchange failed");
    }

    let data: AuthResponse;
    try {
      data = await res.json();
    } catch {
      throw new AuthError("Invalid JSON response from server");
    }

    // ✅ VALIDATE RESPONSE STRUCTURE
    if (!data || !data.accessToken || !data.user) {
      console.error("Invalid token response:", data);
      throw new AuthError("Invalid token response from server");
    }

    // ✅ STORE TOKENS AND USER
    setAccessToken(data.accessToken);
    setRefreshToken(data.refreshToken);
    setUser(data.user);

    // Use expiresAt from server or calculate default
    const expiresAt = data.expiresAt || (Date.now() + 24 * 60 * 60 * 1000);
    setExpiresAt(expiresAt);

    console.log("✓ Authentication successful:", data.user.email);

    // ✅ CLEAN URL (REMOVE QUERY PARAMS)
    window.history.replaceState({}, document.title, window.location.pathname);

    return data;
  } catch (err) {
    console.error("Token exchange error:", err);
    if (err instanceof AuthError) throw err;
    throw new AuthError(`Authentication failed: ${(err as Error).message}`);
  }
}