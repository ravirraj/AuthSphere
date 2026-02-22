<div align="center">
  <img src="assets/Gemini_Generated_Image_swlzriswlzriswlz.png" alt="AuthSphere Logo" width="200" style="border-radius: 20px; box-shadow: 0 10px 30px rgba(0,0,0,0.5);" />
  
  # 🌐 AuthSphere Universal SDK
  
  **The high-performance, zero-trust TypeScript engine for secure identity orchestration.**
  
  [![npm version](https://img.shields.io/npm/v/@authspherejs/sdk.svg?style=for-the-badge&color=007cf0)](https://www.npmjs.com/package/@authspherejs/sdk)
  [![license](https://img.shields.io/npm/l/@authspherejs/sdk.svg?style=for-the-badge&color=7928ca)](https://github.com/madhav9757/AuthSphere/blob/main/LICENSE)
  [![bundle size](https://img.shields.io/bundlephobia/minzip/@authspherejs/sdk?style=for-the-badge&color=ff0080)](https://bundlephobia.com/package/@authspherejs/sdk)

  <p align="center">
    <a href="#-core-capabilities">Capabilities</a> •
    <a href="#-automated-pkce-handshake">The Handshake</a> •
    <a href="#-api-reference">API Surface</a> •
    <a href="#-security-architecture">Security</a> •
    <a href="https://auth-sphere-gilt.vercel.app">Command Center</a>
  </p>
</div>

---

## 📖 Overview

The **AuthSphere Universal SDK** is a lightweight, zero-dependency TypeScript library designed to eliminate the complexity of implementing secure authentication. Written from the ground up for the modern web, it abstracts the intricacies of **OpenID Connect (OIDC)** and **PKCE (Proof Key for Code Exchange) flows** into a unified, high-level API.

Whether you are building a React SPA, a Next.js application, or a mobile-first web app, the AuthSphere SDK provides the cryptographic primitives and session management logic needed to establish verified user identity in milliseconds.

---

## ✨ Core Capabilities

### **🛡️ Automated OIDC + PKCE S256**

The SDK is natively compliant with **RFC 7636**. It automatically handles the generation of high-entropy `code_verifier` strings and cryptographically secure `code_challenge` hashes (SHA-256), protecting your application against authorization code injection and Man-in-the-Middle (MITM) attacks.

### **🔌 Universal Provider Handshaking**

A single, unified interface for initiating social identity redirects. One function call handles the state preservation and protocol negotiation for **Google, GitHub, and Discord**.

### **🔄 Stateless Session Management**

The SDK manages the entire lifecycle of Access and Refresh tokens. It includes a built-in renewal engine that handles token rotation automatically before they expire, ensuring your users never face unexpected logout events.

### **🔐 Identity Challenge Engines**

Complete support for local auth flows including **Email/Password** registration and **OTP (One-Time Password)** verification. The SDK preserves the original authentication context (`sdk_request`) across redirects, ensuring a seamless user experience.

---

## 🚀 Installation

Deploy the engine to your project via your preferred package manager:

```bash
# Using npm
npm install @authspherejs/sdk

# Using pnpm
pnpm add @authspherejs/sdk

# Using yarn
yarn add @authspherejs/sdk
```

---

## 🛠️ The 4-Step Handshake Lifecycle

### **1️⃣ Initialize the Global Handshake**

Configure the AuthSphere singleton at the very root of your application (e.g., `main.ts` or `App.jsx`).

```typescript
import AuthSphere from "@authspherejs/sdk";

AuthSphere.initAuth({
  publicKey: "YOUR_PROJECT_PUB_KEY", // Available in your Dashboard
  projectId: "YOUR_PROJECT_ID", // Available in your Dashboard
  redirectUri: window.location.origin + "/callback",
  baseUrl: "https://auth-sphere-6s2v.vercel.app",
});
```

### **2️⃣ Initiate Identity Handshake**

Trigger a social login or local credentials flow.

```typescript
// Social Login (Google, GitHub, Discord)
AuthSphere.redirectToLogin("google");

// Local Login with error handling for unverified users
const onLogin = async (credentials) => {
  try {
    const res = await AuthSphere.loginLocal(credentials);
    if (res?.redirect) window.location.href = res.redirect;
  } catch (err) {
    if (err instanceof AuthError && err.message.includes("not verified")) {
      // Redirect to OTP verification if email isn't verified yet
      navigate(
        `/verify-otp?email=${credentials.email}&sdk_request=${err.sdk_request}`,
      );
    }
  }
};
```

### **3️⃣ Resolve the Handshake**

Inside your callback route (e.g., `/callback`), exchange the transient authorization code for a high-entropy session.

```tsx
import { useEffect, useRef } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import AuthSphere from "@authspherejs/sdk";

const Callback = () => {
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const processed = useRef(false);

  useEffect(() => {
    if (processed.current) return;
    processed.current = true;

    // Handle verification requirement from social providers
    if (params.get("error") === "email_not_verified") {
      const email = params.get("email");
      const sdkReq = params.get("sdk_request");
      navigate(
        `/verify-otp?email=${email}${sdkReq ? `&sdk_request=${sdkReq}` : ""}`,
      );
      return;
    }

    AuthSphere.handleAuthCallback()
      .then(() => navigate("/dashboard"))
      .catch((err) => console.error("Handshake Failed:", err));
  }, [navigate, params]);

  return <div>Authenticating...</div>;
};
```

### **4️⃣ Identity Challenges (OTP & Registration)**

For flows requiring Email/Password verification cycles.

```tsx
// Registration
const onSignUp = async (data) => {
  await AuthSphere.register(data);
  navigate(`/verify-otp?email=${data.email}`);
};

// OTP Verification
const onVerify = async (otpValue) => {
  const res = await AuthSphere.verifyOTP({
    email,
    otp: otpValue,
    sdk_request: sdkReq,
  });

  if (res?.redirect) {
    window.location.href = res.redirect;
  } else {
    navigate(sdkReq ? "/dashboard" : "/login");
  }
};
```

---

## 📖 Comprehensive API Reference

### `initAuth(config: Config)`

Configures the global identity client. Required once at app startup.

### `redirectToLogin(provider: Provider)`

Performs a cryptographically protected redirect to the chosen provider.

### `handleAuthCallback()`

The authoritative resolution function. Exchanges the OIDC code for a `Session`.

### `loginLocal(data: LoginData)`

Authenticates using local credentials. Throws specific error codes for "Unverified" or "Suspended" users.

### `verifyOTP(data: OTPData)`

Resolves a pending identity challenge using a 6-digit cryptographic code.

### `getUser()`

Retrieves the active user profile (if any) from the secure persistence layer.

### `isAuthenticated()`

A synchronous check of the current session state.

---

## 🛡️ Security Architecture & Compliance

The AuthSphere SDK is built to strictly adhere to the **IETF Best Current Practices (BCP)** for securing browser-resident applications.

- **PKCE Mandatory**: Every redirect cycle generates a unique, high-entropy `code_verifier`.
- **State Integrity**: Protects against Cross-Site Request Forgery (CSRF) via atomic state validation.
- **XSS Mitigation**: Designed to minimize exposure of sensitive tokens and work seamlessly alongside strict Content Security Policies (CSP).

---

## 🔧 Technical Specifications

| Parameter     | Type      | Required | Description                                              |
| :------------ | :-------- | :------: | :------------------------------------------------------- |
| `publicKey`   | `string`  | **Yes**  | Your project's public key from the Command Center.       |
| `projectId`   | `string`  | **Yes**  | Your project's unique ID from the Command Center.        |
| `redirectUri` | `string`  | **Yes**  | The URI your app redirects back to after authentication. |
| `baseUrl`     | `string`  |    No    | Your API server URL (Default: Production).               |
| `storage`     | `Storage` |    No    | Persistence layer (Default: `localStorage`).             |

---

## 📄 License

Distributed under the **MIT License**. See `LICENSE` for more information.

<hr />

<div align="center">
  <p>Engineered with ❤️ by the <b>AuthSphere Team</b></p>
  <a href="https://github.com/madhav9757/AuthSphere">Source Code</a> •
  <a href="https://auth-sphere-gilt.vercel.app">Command Center</a> •
  <a href="https://www.npmjs.com/package/@authspherejs/sdk">NPM Registry</a>
</div>
