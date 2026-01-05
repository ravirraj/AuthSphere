let config = null;

export function initAuth(options) {
  if (!options?.clientId) {
    throw new Error("clientId is required");
  }

  if (!options?.redirectUri) {
    throw new Error("redirectUri is required");
  }

  config = {
    clientId: options.clientId,
    redirectUri: options.redirectUri,
    baseUrl: options.baseUrl || "https://authsphere.dev",
  };
}

export function getConfig() {
  if (!config) {
    throw new Error("AuthSphere not initialized. Call initAuth()");
  }
  return config;
}
