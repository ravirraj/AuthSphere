import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

import {
  ArrowRight,
  ShieldCheck,
  Zap,
  Code2,
  Lock,
  Users,
  Sparkles,
  CheckCircle2,
  Github,
  Chrome,
  MessageCircle
} from "lucide-react";

const features = [
  {
    icon: Zap,
    title: "Lightning Fast",
    description: "Sub-100ms authentication response times with intelligent caching"
  },
  {
    icon: ShieldCheck,
    title: "Enterprise Security",
    description: "PKCE flow, token rotation, and automatic threat detection"
  },
  {
    icon: Code2,
    title: "Developer First",
    description: "Simple SDK, comprehensive docs, and extensive code examples"
  },
  {
    icon: Users,
    title: "User Management",
    description: "Built-in user dashboard, roles, permissions, and analytics"
  },
  {
    icon: Lock,
    title: "OAuth 2.0 + PKCE",
    description: "Industry-standard security with proof key for code exchange"
  },
  {
    icon: Sparkles,
    title: "Beautiful UI",
    description: "Pre-built authentication components that match your brand"
  }
];

const providers = [
  { name: "Google", icon: Chrome, color: "text-red-500" },
  { name: "GitHub", icon: Github, color: "text-gray-800" },
  { name: "Discord", icon: MessageCircle, color: "text-indigo-500" }
];

const stats = [
  { value: "99.99%", label: "Uptime SLA" },
  { value: "<100ms", label: "Auth Speed" },
  { value: "500K+", label: "Active Users" },
  { value: "SOC 2", label: "Certified" }
];

const Home = () => {
  const { user } = useContext(AuthContext);

  return (
    <div className="flex flex-col min-h-screen">
      
      {/* HERO SECTION */}
      <section className="relative px-6 pt-20 pb-32 bg-gradient-to-br from-blue-50 via-white to-purple-50">
        <div className="absolute inset-0 bg-grid-slate-100 [mask-image:linear-gradient(0deg,white,rgba(255,255,255,0.6))] -z-10" />
        
        <div className="max-w-6xl mx-auto text-center space-y-8">
          <Badge className="mx-auto gap-2 px-4 py-2">
            <Sparkles className="h-3.5 w-3.5" />
            Now with PKCE Security & Token Rotation
          </Badge>

          <h1 className="text-6xl md:text-7xl font-bold tracking-tight leading-tight">
            Authentication that
            <br />
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              just works
            </span>
          </h1>

          <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Add secure, beautiful authentication to your app in minutes.
            Pre-built components, powerful APIs, and enterprise-grade security.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
            {user ? (
              <Button size="lg" className="text-lg px-8 h-14" asChild>
                <Link to="/dashboard">
                  Go to Dashboard
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
            ) : (
              <>
                <Button size="lg" className="text-lg px-8 h-14" asChild>
                  <Link to="/register">
                    Start Building Free
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                </Button>
                <Button size="lg" variant="outline" className="text-lg px-8 h-14" asChild>
                  <Link to="/demo">
                    View Live Demo
                  </Link>
                </Button>
              </>
            )}
          </div>

          {/* Social Proof */}
          <div className="flex items-center justify-center gap-6 pt-8 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-green-600" />
              No credit card required
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-green-600" />
              Free forever for developers
            </div>
          </div>
        </div>
      </section>

      {/* STATS SECTION */}
      <section className="py-12 bg-slate-900 text-white">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, i) => (
              <div key={i} className="text-center">
                <div className="text-3xl md:text-4xl font-bold mb-2">{stat.value}</div>
                <div className="text-sm text-slate-400">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* OAUTH PROVIDERS */}
      <section className="py-20 px-6">
        <div className="max-w-6xl mx-auto text-center space-y-12">
          <div className="space-y-4">
            <Badge variant="secondary">Supported Providers</Badge>
            <h2 className="text-4xl font-bold">
              Works with all major OAuth providers
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              One integration, multiple providers. Add Google, GitHub, Discord, and more.
            </p>
          </div>

          <div className="flex justify-center gap-8 flex-wrap">
            {providers.map((provider) => (
              <Card key={provider.name} className="w-48 hover:shadow-lg transition-shadow">
                <CardContent className="pt-8 pb-6 text-center">
                  <provider.icon className={`h-12 w-12 mx-auto mb-4 ${provider.color}`} />
                  <p className="font-semibold">{provider.name}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* FEATURES GRID */}
      <section className="py-20 px-6 bg-slate-50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center space-y-4 mb-16">
            <Badge variant="secondary">Why Choose AuthSphere</Badge>
            <h2 className="text-4xl font-bold">
              Everything you need, nothing you don't
            </h2>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, i) => (
              <Card key={i} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="h-12 w-12 rounded-lg bg-blue-100 flex items-center justify-center mb-4">
                    <feature.icon className="h-6 w-6 text-blue-600" />
                  </div>
                  <CardTitle className="text-xl">{feature.title}</CardTitle>
                  <CardDescription className="text-base">
                    {feature.description}
                  </CardDescription>
                </CardHeader>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CODE EXAMPLE */}
      <section className="py-20 px-6">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          <div className="space-y-4">
            <Badge variant="secondary">Simple Integration</Badge>
            <h2 className="text-4xl font-bold">
              Get started in 3 lines of code
            </h2>
          </div>

          <Card className="text-left">
            <CardContent className="p-6">
              <pre className="text-sm overflow-x-auto">
                <code className="language-javascript">{`import AuthSphere from '@authsphere/sdk'

// Initialize
AuthSphere.initAuth({
  publicKey: 'your_public_key',
  redirectUri: 'http://localhost:3000/callback'
})

// Redirect to login
AuthSphere.redirectToLogin('google')

// Handle callback
const auth = await AuthSphere.handleAuthCallback()
console.log('Logged in:', auth.user)`}</code>
              </pre>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* CTA SECTION */}
      <section className="py-24 px-6 bg-gradient-to-br from-blue-600 to-purple-600 text-white">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          <h2 className="text-5xl font-bold">
            Ready to build?
          </h2>
          <p className="text-xl text-blue-100">
            Join thousands of developers building secure apps with AuthSphere
          </p>

          {!user && (
            <Button size="lg" variant="secondary" className="text-lg px-8 h-14" asChild>
              <Link to="/register">
                Create Free Account
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
          )}
        </div>
      </section>

    </div>
  );
};

export default Home;