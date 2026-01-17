import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";

import {
  BookOpen,
  Code2,
  Zap,
  ShieldCheck,
  Copy,
  CheckCircle2,
  AlertCircle
} from "lucide-react";

const Documentation = () => {
  const [copied, setCopied] = React.useState("");

  const copyCode = (code, id) => {
    navigator.clipboard.writeText(code);
    setCopied(id);
    setTimeout(() => setCopied(""), 2000);
  };

  const CodeBlock = ({ code, language = "javascript", id }) => (
    <div className="relative">
      <div className="absolute right-2 top-2">
        <Button
          size="sm"
          variant="ghost"
          onClick={() => copyCode(code, id)}
          className="h-8 w-8 p-0"
        >
          {copied === id ? (
            <CheckCircle2 className="h-4 w-4 text-green-600" />
          ) : (
            <Copy className="h-4 w-4" />
          )}
        </Button>
      </div>
      <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto">
        <code className={`language-${language} text-sm`}>{code}</code>
      </pre>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50">
      <div className="max-w-6xl mx-auto px-6 py-12 space-y-8">

        {/* HEADER */}
        <div className="text-center space-y-4">
          <Badge className="gap-2">
            <BookOpen className="h-3.5 w-3.5" />
            Documentation
          </Badge>
          <h1 className="text-5xl font-bold">
            AuthSphere SDK Guide
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Complete guide to integrate secure authentication in your application
          </p>
        </div>

        {/* QUICK START */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Zap className="h-5 w-5 text-blue-600" />
              Quick Start
            </CardTitle>
            <CardDescription>
              Get up and running in 5 minutes
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            
            <div>
              <h3 className="font-semibold mb-2">1. Install the SDK</h3>
              <CodeBlock
                id="install"
                language="bash"
                code={`npm install @authsphere/sdk
# or
yarn add @authsphere/sdk
# or
pnpm add @authsphere/sdk`}
              />
            </div>

            <div>
              <h3 className="font-semibold mb-2">2. Initialize in your app</h3>
              <CodeBlock
                id="init"
                code={`import AuthSphere from '@authsphere/sdk'

// Initialize once at app startup
AuthSphere.initAuth({
  publicKey: 'your_project_public_key',
  redirectUri: 'http://localhost:3000/callback',
  baseUrl: 'https://api.authsphere.com' // Optional, defaults to production
})`}
              />
            </div>

            <div>
              <h3 className="font-semibold mb-2">3. Add login button</h3>
              <CodeBlock
                id="login"
                code={`function LoginButton() {
  const handleLogin = () => {
    // Redirect user to OAuth provider
    AuthSphere.redirectToLogin('google') // or 'github', 'discord'
  }

  return <button onClick={handleLogin}>Login with Google</button>
}`}
              />
            </div>

            <div>
              <h3 className="font-semibold mb-2">4. Handle the callback</h3>
              <CodeBlock
                id="callback"
                code={`// In your callback route (e.g., /callback page)
import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import AuthSphere from '@authsphere/sdk'

function CallbackPage() {
  const navigate = useNavigate()

  useEffect(() => {
    async function handleCallback() {
      try {
        const auth = await AuthSphere.handleAuthCallback()
        
        if (auth) {
          console.log('Logged in:', auth.user)
          navigate('/dashboard')
        }
      } catch (error) {
        console.error('Auth failed:', error)
        navigate('/login')
      }
    }

    handleCallback()
  }, [])

  return <div>Processing login...</div>
}`}
              />
            </div>

          </CardContent>
        </Card>

        {/* DETAILED DOCS */}
        <Tabs defaultValue="auth" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="auth">Authentication</TabsTrigger>
            <TabsTrigger value="session">Session</TabsTrigger>
            <TabsTrigger value="api">API Calls</TabsTrigger>
            <TabsTrigger value="advanced">Advanced</TabsTrigger>
          </TabsList>

          {/* AUTHENTICATION */}
          <TabsContent value="auth" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Authentication Flow</CardTitle>
                <CardDescription>
                  Complete OAuth 2.0 + PKCE authentication
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                
                <div>
                  <h3 className="font-semibold mb-2 flex items-center gap-2">
                    <Code2 className="h-4 w-4" />
                    redirectToLogin(provider)
                  </h3>
                  <p className="text-sm text-muted-foreground mb-3">
                    Initiates OAuth flow by redirecting user to provider login page
                  </p>
                  <CodeBlock
                    id="redirect-to-login"
                    code={`// Basic usage
AuthSphere.redirectToLogin('google')

// Supported providers
AuthSphere.redirectToLogin('google')
AuthSphere.redirectToLogin('github')
AuthSphere.redirectToLogin('discord')

// This will:
// 1. Generate PKCE code verifier and challenge
// 2. Store verifier securely in sessionStorage
// 3. Build authorization URL with all required params
// 4. Redirect user to OAuth provider`}
                  />
                </div>

                <div>
                  <h3 className="font-semibold mb-2 flex items-center gap-2">
                    <Code2 className="h-4 w-4" />
                    handleAuthCallback()
                  </h3>
                  <p className="text-sm text-muted-foreground mb-3">
                    Processes OAuth callback and exchanges code for tokens
                  </p>
                  <CodeBlock
                    id="handle-callback"
                    code={`const auth = await AuthSphere.handleAuthCallback()

if (auth) {
  console.log('User:', auth.user)
  // {
  //   id: '123',
  //   email: 'user@example.com',
  //   username: 'johndoe',
  //   provider: 'google'
  // }

  console.log('Tokens:', auth.accessToken, auth.refreshToken)
}

// Returns null if not a callback (no 'code' in URL)
// Throws error if authentication fails`}
                  />
                </div>

              </CardContent>
            </Card>
          </TabsContent>

          {/* SESSION MANAGEMENT */}
          <TabsContent value="session" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Session Management</CardTitle>
                <CardDescription>
                  Check auth status and manage user sessions
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                
                <div>
                  <h3 className="font-semibold mb-2">getUser()</h3>
                  <p className="text-sm text-muted-foreground mb-3">
                    Get currently logged in user
                  </p>
                  <CodeBlock
                    id="get-user"
                    code={`const user = AuthSphere.getUser()

if (user) {
  console.log(user.email)    // user@example.com
  console.log(user.username) // johndoe
  console.log(user.id)       // user_123
} else {
  // User not logged in
}`}
                  />
                </div>

                <div>
                  <h3 className="font-semibold mb-2">isAuthenticated()</h3>
                  <p className="text-sm text-muted-foreground mb-3">
                    Check if user is authenticated with valid token
                  </p>
                  <CodeBlock
                    id="is-authenticated"
                    code={`if (AuthSphere.isAuthenticated()) {
  // User is logged in and token is valid
  console.log('User authenticated')
} else {
  // Redirect to login
  window.location.href = '/login'
}`}
                  />
                </div>

                <div>
                  <h3 className="font-semibold mb-2">getToken()</h3>
                  <p className="text-sm text-muted-foreground mb-3">
                    Get current access token
                  </p>
                  <CodeBlock
                    id="get-token"
                    code={`const token = AuthSphere.getToken()
console.log(token) // eyJhbGciOiJIUzI1NiIs...`}
                  />
                </div>

                <div>
                  <h3 className="font-semibold mb-2">logout()</h3>
                  <p className="text-sm text-muted-foreground mb-3">
                    Clear session and log out user
                  </p>
                  <CodeBlock
                    id="logout"
                    code={`await AuthSphere.logout()
// Clears all tokens and user data
// Redirects to login page`}
                  />
                </div>

              </CardContent>
            </Card>
          </TabsContent>

          {/* API CALLS */}
          <TabsContent value="api" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Making Authenticated API Calls</CardTitle>
                <CardDescription>
                  Use fetchWithAuth for automatic token handling
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                
                <div>
                  <h3 className="font-semibold mb-2">fetchWithAuth()</h3>
                  <p className="text-sm text-muted-foreground mb-3">
                    Wrapper around fetch that automatically adds auth headers
                  </p>
                  <CodeBlock
                    id="fetch-with-auth"
                    code={`import { fetchWithAuth } from '@authsphere/sdk'

// GET request
const response = await fetchWithAuth('https://api.yourapp.com/user/profile')
const data = await response.json()

// POST request
const response = await fetchWithAuth('https://api.yourapp.com/posts', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({ title: 'Hello World' })
})

// Automatically:
// - Adds Authorization header
// - Refreshes token if expired
// - Retries request after refresh`}
                  />
                </div>

                <div>
                  <h3 className="font-semibold mb-2">Manual Token Usage</h3>
                  <p className="text-sm text-muted-foreground mb-3">
                    If you need manual control
                  </p>
                  <CodeBlock
                    id="manual-token"
                    code={`const token = AuthSphere.getToken()

const response = await fetch('https://api.yourapp.com/data', {
  headers: {
    'Authorization': \`Bearer \${token}\`
  }
})`}
                  />
                </div>

              </CardContent>
            </Card>
          </TabsContent>

          {/* ADVANCED */}
          <TabsContent value="advanced" className="space-y-6">
            
            <Card>
              <CardHeader>
                <CardTitle>Advanced Configuration</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                
                <div>
                  <h3 className="font-semibold mb-2">Callbacks & Events</h3>
                  <CodeBlock
                    id="callbacks"
                    code={`AuthSphere.initAuth({
  publicKey: 'your_key',
  redirectUri: 'http://localhost:3000/callback',
  
  // Called when tokens are refreshed
  onTokenRefresh: (tokens) => {
    console.log('New tokens:', tokens)
  },
  
  // Called on authentication errors
  onAuthError: (error) => {
    console.error('Auth error:', error)
    // Handle error (e.g., redirect to login)
  }
})`}
                  />
                </div>

                <div>
                  <h3 className="font-semibold mb-2">Protected Routes (React)</h3>
                  <CodeBlock
                    id="protected-route"
                    code={`import { Navigate } from 'react-router-dom'
import AuthSphere from '@authsphere/sdk'

function ProtectedRoute({ children }) {
  if (!AuthSphere.isAuthenticated()) {
    return <Navigate to="/login" replace />
  }
  
  return children
}

// Usage in routes
<Route path="/dashboard" element={
  <ProtectedRoute>
    <Dashboard />
  </ProtectedRoute>
} />`}
                  />
                </div>

                <div>
                  <h3 className="font-semibold mb-2">Token Refresh</h3>
                  <p className="text-sm text-muted-foreground mb-3">
                    Tokens are automatically refreshed, but you can manually trigger it
                  </p>
                  <CodeBlock
                    id="refresh"
                    code={`import { refreshTokens } from '@authsphere/sdk'

try {
  await refreshTokens()
  console.log('Tokens refreshed')
} catch (error) {
  console.error('Refresh failed:', error)
  // Redirect to login
}`}
                  />
                </div>

              </CardContent>
            </Card>

            <Card className="border-amber-200 bg-amber-50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-amber-900">
                  <ShieldCheck className="h-5 w-5" />
                  Security Best Practices
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-amber-900">
                <div className="flex gap-2">
                  <AlertCircle className="h-5 w-5 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-medium">Never expose your private key</p>
                    <p className="text-sm text-amber-800">Only use the public key in client-side code</p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <AlertCircle className="h-5 w-5 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-medium">Register your redirect URIs</p>
                    <p className="text-sm text-amber-800">Only use exact redirect URIs configured in your project</p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <AlertCircle className="h-5 w-5 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-medium">Use HTTPS in production</p>
                    <p className="text-sm text-amber-800">Never use HTTP for OAuth in production environments</p>
                  </div>
                </div>
              </CardContent>
            </Card>

          </TabsContent>

        </Tabs>

        {/* SUPPORT */}
        <Card>
          <CardHeader>
            <CardTitle>Need Help?</CardTitle>
          </CardHeader>
          <CardContent className="flex gap-4">
            <Button variant="outline">View Examples</Button>
            <Button variant="outline">Join Discord</Button>
            <Button variant="outline">GitHub Issues</Button>
          </CardContent>
        </Card>

      </div>
    </div>
  );
};

export default Documentation;