import React from "react";
import { BookOpen, ShieldCheck, Mail, Lock, BarChart3, Settings2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

const Introduction = () => {
    return (
        <article className="space-y-10 animate-in fade-in duration-500">
            <div className="flex flex-col lg:flex-row gap-8 items-start">
                <div className="flex-1 space-y-4">
                    <Badge variant="outline" className="w-fit border-primary/20 bg-primary/5 text-primary">docs / specification</Badge>
                    <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight">Identity Infrastructure for Modern Apps</h1>
                    <p className="text-lg text-muted-foreground leading-relaxed max-w-2xl">
                        AuthSphere is a high-performance identity engine designed to handle the complexity of modern authentication flows, from stateless sessions to robust social integrations.
                    </p>
                </div>
                <div className="w-full lg:w-72 shrink-0 p-4 rounded-xl border bg-muted/30 space-y-3">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Protocol Specs</h4>
                    <div className="space-y-2">
                        {[
                            { label: "Auth", value: "OAuth 2.0 / OIDC" },
                            { label: "Token", value: "JWT (RS256)" },
                            { label: "Hashing", value: "Argon2id" },
                            { label: "Storage", value: "AES-256-GCM" }
                        ].map((spec, i) => (
                            <div key={i} className="flex items-center justify-between text-xs">
                                <span className="text-muted-foreground">{spec.label}</span>
                                <span className="font-mono font-bold">{spec.value}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                {[
                    { icon: ShieldCheck, title: "Protocol Standards", desc: "Built on top of OAuth 2.0 and OIDC. Standardized identity objects across all providers." },
                    { icon: Mail, title: "Managed Verification", desc: "Automatic 6-digit OTP delivery. Configurable rules for mandatory verification." },
                    { icon: Lock, title: "Hardened Security", desc: "PKCE for browser flows, RS256 token signing, and AES-256-GCM data encryption." },
                    { icon: BarChart3, title: "Observability", desc: "Real-time tracking of login patterns and provider performance in your dashboard." },
                    { icon: Settings2, title: "Granular Control", desc: "Manage sessions, toggle verification overrides, and monitor audit logs." },
                    { icon: BookOpen, title: "Developer First", desc: "Language-agnostic API endpoints and lightweight SDKs for modular deployments." }
                ].map((item, i) => (
                    <Card key={i} className="bg-card hover:bg-muted/30 transition-colors border-muted shadow-none">
                        <CardHeader className="p-5">
                            <div className="h-9 w-9 rounded-lg bg-primary/10 flex items-center justify-center mb-3 text-primary">
                                <item.icon className="h-4 w-4" />
                            </div>
                            <CardTitle className="text-base">{item.title}</CardTitle>
                            <CardDescription className="text-xs leading-relaxed mt-1.5 text-muted-foreground">{item.desc}</CardDescription>
                        </CardHeader>
                    </Card>
                ))}
            </div>
        </article>
    );
};

export default Introduction;
