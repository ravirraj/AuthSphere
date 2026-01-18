import React, { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

// Shadcn UI Components
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card";
import {
  CommandDialog, CommandEmpty, CommandGroup,
  CommandInput, CommandItem, CommandList
} from "@/components/ui/command";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";

// Icons
import {
  ArrowRight, ShieldCheck, Zap, Code2, Lock, Users, Sparkles, CheckCircle2,
  Github, Chrome, MessageCircle, Terminal, Globe, Fingerprint, ChevronRight,
  Monitor, Search, Command, Book, Activity, LifeBuoy
} from "lucide-react";

const Home = () => {
  const { user } = useContext(AuthContext);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const down = (e) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((open) => !open);
      }
    };
    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  return (
    <div className="flex flex-col min-h-screen bg-slate-50/50 selection:bg-blue-100 selection:text-blue-900">

      {/* 1. NAVIGATION & COMMAND SEARCH */}
      <header className="fixed top-0 w-full z-50 border-b border-slate-200/60 bg-white/80 backdrop-blur-md">
        <div className="container mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-8">
            <Link to="/" className="flex items-center gap-2 group">
              <div className="bg-blue-600 p-1.5 rounded-lg group-hover:rotate-6 transition-transform">
                <div className="w-5 h-5 border-2 border-white rounded-sm" />
              </div>
              <span className="font-bold text-xl tracking-tight">AuthSphere</span>
            </Link>

            <NavigationMenu className="hidden lg:flex">
              <NavigationMenuList>
                <NavigationMenuItem>
                  <NavigationMenuTrigger>Features</NavigationMenuTrigger>
                  <NavigationMenuContent>
                    <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px]">
                      <ListItem title="Passwordless" href="/#">Biometric and magic link auth.</ListItem>
                      <ListItem title="RBAC" href="/#">Fine-grained role-based access control.</ListItem>
                      <ListItem title="MFA" href="/#">SMS, TOTP, and WebAuthn support.</ListItem>
                      <ListItem title="Organizations" href="/#">Multi-tenant architecture support.</ListItem>
                    </ul>
                  </NavigationMenuContent>
                </NavigationMenuItem>
                <NavigationMenuItem>
                  <Link to="/docs"><NavigationMenuLink className={navigationMenuTriggerStyle()}>Documentation</NavigationMenuLink></Link>
                </NavigationMenuItem>
              </NavigationMenuList>
            </NavigationMenu>
          </div>

          <div className="flex items-center gap-4">
            <Button variant="outline" size="sm" className="hidden md:flex text-slate-500" onClick={() => setOpen(true)}>
              <Search className="mr-2 h-4 w-4" />
              <span>Search...</span>
              <kbd className="ml-4 pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium">
                ⌘K
              </kbd>
            </Button>
            {user ? (
              <Button size="sm" asChild><Link to="/dashboard">Dashboard</Link></Button>
            ) : (
              <Button size="sm" asChild><Link to="/login">Login</Link></Button>
            )}
          </div>
        </div>
      </header>

      {/* 2. HERO SECTION */}
      <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 brightness-100 contrast-150 pointer-events-none"></div>
        <div className="container mx-auto px-6 relative z-10 text-center">
          <Badge variant="outline" className="mb-6 animate-fade-in bg-white/50 backdrop-blur">
            <Sparkles className="h-3 w-3 mr-2 text-blue-500" />
            V2.0 is now live: Deploy globally in seconds
          </Badge>
          <h1 className="text-6xl lg:text-[100px] font-black tracking-tighter mb-8 leading-[0.9]">
            Identity for <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600">
              Modern Developers
            </span>
          </h1>
          <p className="max-w-2xl mx-auto text-lg lg:text-xl text-slate-600 mb-10 leading-relaxed">
            The complete authentication toolkit. From first sign-in to enterprise SSO,
            AuthSphere handles the complexity so you can build your product.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Button size="lg" className="h-14 px-8 rounded-full text-lg shadow-lg shadow-blue-500/25" asChild>
              <Link to="/register">Get Started Free <ArrowRight className="ml-2 h-5 w-5" /></Link>
            </Button>
            <Button size="lg" variant="outline" className="h-14 px-8 rounded-full text-lg bg-white/50" asChild>
              <Link to="/docs">View SDKs</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* 3. PROOF SECTION (Compliance & Hover Cards) */}
      <div className="container mx-auto px-6 py-12">
        <div className="flex flex-wrap justify-center gap-8 md:gap-16">
          <ComplianceBadge label="SOC 2 Type II" description="Independently audited for security, availability, and confidentiality." />
          <ComplianceBadge label="GDPR Compliant" description="Data processing agreements that meet European privacy standards." />
          <ComplianceBadge label="HIPAA Ready" description="Built-in controls for handling protected health information." />
        </div>
      </div>

      {/* 4. FEATURES GRID */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-6">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((f, i) => (
              <Card key={i} className="group border-none shadow-none hover:bg-slate-50 transition-colors duration-300">
                <CardHeader>
                  <div className="h-12 w-12 rounded-lg bg-blue-50 flex items-center justify-center text-blue-600 mb-4 group-hover:scale-110 transition-transform">
                    <f.icon size={24} />
                  </div>
                  <CardTitle className="text-xl">{f.title}</CardTitle>
                  <CardDescription className="text-base leading-relaxed">{f.description}</CardDescription>
                </CardHeader>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* 5. CODE SHOWCASE */}
      <section className="py-24 lg:py-32 bg-slate-900 text-white overflow-hidden relative">
        <div className="container mx-auto px-6 grid lg:grid-cols-2 gap-16 items-center">
          <div>
            <h2 className="text-4xl lg:text-5xl font-bold tracking-tight mb-6">Built for the <br /><span className="text-blue-400">TypeScript Era</span></h2>
            <p className="text-slate-400 text-lg mb-8 leading-relaxed">
              Native support for React, Next.js, Vue, and Svelte.
              Our SDKs are fully typed and designed for maximum DX.
            </p>
            <div className="grid grid-cols-2 gap-4">
              <CodeFeature icon={Terminal} text="CLI Migration Tools" />
              <CodeFeature icon={ShieldCheck} text="JWT Verification" />
              <CodeFeature icon={Activity} text="Real-time Logs" />
              <CodeFeature icon={Lock} text="Secrets Manager" />
            </div>
          </div>
          <div className="bg-slate-800/50 rounded-2xl border border-slate-700 p-2 shadow-2xl">
            <div className="bg-slate-900 rounded-xl overflow-hidden">
              <div className="flex items-center justify-between px-4 py-3 bg-slate-800/50">
                <div className="flex gap-1.5"><div className="w-3 h-3 rounded-full bg-red-500" /><div className="w-3 h-3 rounded-full bg-yellow-500" /><div className="w-3 h-3 rounded-full bg-green-500" /></div>
                <span className="text-xs font-mono text-slate-500">auth-config.ts</span>
              </div>
              <pre className="p-6 text-sm font-mono leading-relaxed text-blue-300 overflow-x-auto">
                <code>{`import { AuthSphere } from "@authsphere/react";

export const config = {
  domain: "auth.your-app.com",
  clientId: "client_92jaks82",
  redirectUri: window.location.origin,
  cacheLocation: 'localstorage'
};

// Start protecting routes in < 10 lines`}</code>
              </pre>
            </div>
          </div>
        </div>
      </section>

      {/* 6. FAQ (ACCORDION) */}
      <section className="py-24 container mx-auto px-6 max-w-4xl">
        <h2 className="text-3xl font-bold text-center mb-12">Frequently Asked Questions</h2>
        <Accordion type="single" collapsible className="w-full">
          <AccordionItem value="item-1">
            <AccordionTrigger>How is this different from Auth0 or Clerk?</AccordionTrigger>
            <AccordionContent>
              AuthSphere focuses on a "Headless First" approach. We provide the robust security infrastructure and APIs, but give you total control over the UI components, resulting in zero brand-clash.
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="item-2">
            <AccordionTrigger>Can I host the data in my own region?</AccordionTrigger>
            <AccordionContent>
              Yes. During project setup, you can select from our global regions including US-East, EU-Central, and Asia-Pacific to ensure data residency compliance.
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </section>

      {/* 7. FOOTER */}
      <footer className="bg-white border-t border-slate-200 py-12">
        <div className="container mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-2">
            <div className="bg-slate-900 p-1 rounded-md text-white"><Command size={18} /></div>
            <span className="font-bold uppercase tracking-widest text-sm">AuthSphere</span>
          </div>
          <div className="flex gap-8 text-sm text-slate-500">
            <Link to="#" className="hover:text-blue-600 transition-colors">Twitter</Link>
            <Link to="#" className="hover:text-blue-600 transition-colors">GitHub</Link>
            <Link to="#" className="hover:text-blue-600 transition-colors">Status</Link>
          </div>
          <p className="text-xs text-slate-400 font-mono">© 2026 AUTH-SPHERE_GLOBAL.SYS</p>
        </div>
      </footer>

      {/* COMMAND PALETTE DIALOG */}
      <CommandDialog open={open} onOpenChange={setOpen}>
        <CommandInput placeholder="Type a command or search documentation..." />
        <CommandList className="max-h-[300px] overflow-y-auto">
          <CommandEmpty>No results found.</CommandEmpty>
          <CommandGroup heading="Suggestions">
            <CommandItem className="cursor-pointer">
              <Book className="mr-2 h-4 w-4" /> Quickstart Guide
            </CommandItem>
            <CommandItem className="cursor-pointer">
              <Code2 className="mr-2 h-4 w-4" /> React SDK Reference
            </CommandItem>
            <CommandItem className="cursor-pointer">
              <LifeBuoy className="mr-2 h-4 w-4" /> Contact Support
            </CommandItem>
          </CommandGroup>
        </CommandList>
      </CommandDialog>
    </div>
  );
};

// --- HELPER COMPONENTS ---

const ListItem = ({ title, children, href }) => (
  <li>
    <NavigationMenuLink asChild>
      <a href={href} className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-slate-100 focus:bg-slate-100">
        <div className="text-sm font-medium leading-none">{title}</div>
        <p className="line-clamp-2 text-sm leading-snug text-slate-500">{children}</p>
      </a>
    </NavigationMenuLink>
  </li>
);

const ComplianceBadge = ({ label, description }) => (
  <HoverCard>
    <HoverCardTrigger asChild>
      <div className="flex items-center gap-2 cursor-help text-slate-400 hover:text-slate-600 transition-colors">
        <CheckCircle2 className="h-4 w-4 text-emerald-500" />
        <span className="text-sm font-semibold tracking-wider uppercase">{label}</span>
      </div>
    </HoverCardTrigger>
    <HoverCardContent className="w-64">
      <p className="text-sm text-slate-600 leading-relaxed">{description}</p>
    </HoverCardContent>
  </HoverCard>
);

const CodeFeature = ({ icon: Icon, text }) => (
  <div className="flex items-center gap-3 text-slate-300">
    <div className="h-8 w-8 rounded-full bg-slate-800 flex items-center justify-center"><Icon size={16} /></div>
    <span className="font-medium">{text}</span>
  </div>
);

const features = [
  { icon: Zap, title: "Edge Auth", description: "Globally distributed auth nodes ensure <50ms latency regardless of where your users are." },
  { icon: ShieldCheck, title: "Fraud Protection", description: "Automated bot detection and brute-force protection built into every login flow." },
  { icon: Fingerprint, title: "Passkeys Ready", description: "Enable biometric login with a single line of code. No more passwords to reset." },
  { icon: Monitor, title: "Dashboard", description: "Manage users, monitor login trends, and configure webhooks from a beautiful interface." },
  { icon: Globe, title: "Global SSO", description: "Connect to Enterprise providers like Okta, Azure AD, and Google Workspace instantly." },
  { icon: Code2, title: "API First", description: "Everything you can do in our dashboard, you can do via our robust REST API." }
];

export default Home;