# AuthSphere SDK Test Application

This is a demonstration project showing how to integrate the `@authsphere/sdk` into a modern React application.

## Key Features Demonstrated
- **SDK Initialization**: How to set up the SDK using your Public Key.
- **Provider Login**: Implementing social login redirects (Google, GitHub, Discord).
- **Callback Handling**: Processing the OAuth2 response and securing the session.
- **Protected Routes**: Checking user authentication status.
- **Session Management**: Accessing user profile data and logging out.

## Getting Started

1. **Install Dependencies**:
   ```bash
   npm install
   ```

2. **Run the Backend**:
   Ensure your AuthSphere backend is running at `http://localhost:8000`.

3. **Run the Test App**:
   ```bash
   npm run dev
   ```

4. **Experience the Flow**:
   - Open your browser to the local dev server.
   - Click a login provider.
   - You will be redirected to the AuthSphere Auth Hub.
   - After authenticating, you'll be returned to the `/callback` route.
   - The SDK will handle the rest and redirect you to your secure `/dashboard`.

## Basic Usage Snippet

```javascript
import AuthSphere from '@authsphere/sdk';

// 1. Initialize
AuthSphere.initAuth({
  publicKey: 'your_public_key',
  redirectUri: 'http://localhost:3000/callback'
});

// 2. Login
AuthSphere.redirectToLogin('google');

// 3. Callback (in your /callback route)
await AuthSphere.handleAuthCallback();

// 4. Get User
const user = AuthSphere.getUser();
```
