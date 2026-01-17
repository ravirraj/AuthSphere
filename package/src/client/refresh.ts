import { getConfig } from "../config/options";
import { AuthError } from "../utils/errors";
import {
  getRefreshToken,
  setAccessToken,
  setRefreshToken,
  setExpiresAt,
  clearAll,
} from "../utils/storage";

let isRefreshing = false;
let refreshPromise: Promise<void> | null = null;

const DEFAULT_BASE_URL = "http://localhost:8000";

export async function refreshTokens(): Promise<void> {
  if (isRefreshing && refreshPromise) {
    console.log("⏳ Token refresh already in progress, waiting...");
    return refreshPromise;
  }

  isRefreshing = true;

  refreshPromise = (async () => {
    const { publicKey, baseUrl, onTokenRefresh, onAuthError } = getConfig();
    const refreshToken = getRefreshToken();

    if (!refreshToken) {
      isRefreshing = false;
      refreshPromise = null;
      throw new AuthError("No refresh token available");
    }

    try {
      if (!publicKey) throw new AuthError("AuthConfig missing publicKey");

      console.log("🔄 Refreshing tokens...");

      const res = await fetch(
        `${(baseUrl || DEFAULT_BASE_URL).replace(/\/$/, "")}/sdk/refresh`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            refreshToken, // Changed from refresh_token to refreshToken
            publicKey,    // Changed from public_key to publicKey
          }),
        }
      );

      if (!res.ok) {
        let errorData;
        try {
          errorData = await res.json();
        } catch {
          errorData = { message: `HTTP ${res.status}: Token refresh failed` };
        }
        throw new AuthError(errorData.message || errorData.error_description || "Token refresh failed");
      }

      let data;
      try {
        data = await res.json() as {
          success: boolean;
          accessToken: string;
          refreshToken: string;
          expiresAt?: number;
        };
      } catch {
        throw new AuthError("Invalid JSON response from server");
      }

      if (!data.success || !data.accessToken || !data.refreshToken) {
        console.error("Invalid token response:", data);
        throw new AuthError("Invalid token response from server");
      }

      // ✅ STORE NEW TOKENS
      setAccessToken(data.accessToken);
      setRefreshToken(data.refreshToken);

      const expiresAt = data.expiresAt || (Date.now() + 24 * 60 * 60 * 1000);
      setExpiresAt(expiresAt);

      console.log("✓ Tokens refreshed successfully");

      if (onTokenRefresh) {
        onTokenRefresh({
          accessToken: data.accessToken,
          refreshToken: data.refreshToken,
          expiresAt,
        });
      }
    } catch (err) {
      console.error("Token refresh failed:", err);
      clearAll();
      const error = err instanceof AuthError 
        ? err 
        : new AuthError("Token refresh failed: " + (err as Error).message);
      
      if (onAuthError) onAuthError(error);
      throw error;
    } finally {
      isRefreshing = false;
      refreshPromise = null;
    }
  })();

  return refreshPromise;
}