import React, { useState } from 'react';
import { CheckCircle2, Mail, Rocket, Shield, Zap, BarChart3, Globe, Lock, Info } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion";
import { toast } from 'sonner';

const Pricing = () => {
    const [email, setEmail] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleNotifyMe = (e) => {
        e.preventDefault();
        if (!email) return;

        setIsSubmitting(true);
        // Simulate API call
        setTimeout(() => {
            toast.success("You're on the list! We'll notify you when pricing is announced.");
            setEmail('');
            setIsSubmitting(false);
        }, 1500);
    };

    const features = [
        {
            title: "Secure Authentication",
            description: "Enterprise-grade auth with MFA, social logins, and passwordless options.",
            icon: Shield
        },
        {
            title: "Real-time Analytics",
            description: "Track user growth, session trends, and authentication success rates.",
            icon: BarChart3
        },
        {
            title: "Global Infrastructure",
            description: "Low-latency edge deployment for lightning-fast auth worldwide.",
            icon: Globe
        },
        {
            title: "Advanced Security",
            description: "Anomaly detection, rate limiting, and brute-force protection built-in.",
            icon: Lock
        },
        {
            title: "Developer First",
            description: "Powerful SDKs, clear documentation, and a first-class CLI experience.",
            icon: Zap
        },
        {
            title: "Seamless Integrations",
            description: "Connect with your favorite tools and platforms in minutes.",
            icon: Rocket
        }
    ];

    const faqs = [
        {
            question: "When will pricing be available?",
            answer: "We are currently in the final stages of defining our pricing model. We expect to announce official plans within the next few weeks. Subscribe to our newsletter to be the first to know!"
        },
        {
            question: "Will there be a free tier?",
            answer: "Yes! We are committed to supporting the developer community. AuthSphere will always have a robust free tier for hobby projects and early-stage startups."
        },
        {
            question: "Will early users get benefits?",
            answer: "Absolutely. Users who join our early access list or use the platform during our beta phase will be eligible for special 'early bird' pricing and exclusive founder-tier benefits."
        }
    ];

    return (
        <div className="min-h-screen bg-background flex flex-col items-center">
            {/* Background Decorative Elements */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10 pointer-events-none">
                <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/5 rounded-full blur-[120px]" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-primary/10 rounded-full blur-[120px]" />
            </div>

            <div className="w-full max-w-7xl px-6 lg:px-8 py-24 sm:py-32 flex flex-col items-center">
                {/* Hero Section */}
                <div className="text-center space-y-6 max-w-3xl animate-in fade-in slide-in-from-bottom-4 duration-700">
                    <Badge variant="secondary" className="px-4 py-1.5 text-sm font-medium border-primary/20 bg-primary/5 text-primary rounded-full">
                        <Info className="w-4 h-4 mr-2 inline" />
                        Pricing Coming Soon
                    </Badge>

                    <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-foreground text-balance">
                        Simple pricing, <span className="text-primary italic">launching soon</span>
                    </h1>

                    <p className="text-lg sm:text-xl text-muted-foreground text-balance leading-relaxed">
                        We're currently perfecting our pricing model based on feedback from our early beta users.
                        Our goal is to provide a transparent, scale-with-you structure that fits teams of all sizes.
                    </p>

                    <form onSubmit={handleNotifyMe} className="flex flex-col sm:flex-row items-center justify-center gap-3 mt-8 max-w-md mx-auto">
                        <div className="relative w-full">
                            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                            <Input
                                type="email"
                                placeholder="Enter your email"
                                className="pl-10 h-12 bg-background border-border focus-visible:ring-primary"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </div>
                        <Button type="submit" size="lg" className="h-12 px-8 w-full sm:w-auto font-semibold shadow-lg shadow-primary/20 transition-all hover:scale-[1.02] active:scale-[0.98]" disabled={isSubmitting}>
                            {isSubmitting ? "Wait-listing..." : "Notify Me"}
                        </Button>
                    </form>

                    <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground pt-4">
                        <CheckCircle2 className="w-4 h-4 text-primary" />
                        <span>Join 2,000+ developers on the waitlist</span>
                    </div>
                </div>

                {/* Feature Highlights */}
                <div className="mt-32 w-full">
                    <div className="text-center mb-16 space-y-4">
                        <h2 className="text-3xl font-bold tracking-tight">Everything you need to build secure apps</h2>
                        <p className="text-muted-foreground max-w-2xl mx-auto">
                            Regardless of the pricing model, AuthSphere is built to deliver a premium experience with these core features at its heart.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {features.map((feature, index) => (
                            <Card key={index} className="border-border/50 bg-card/50 backdrop-blur-sm hover:border-primary/50 transition-all duration-300 group overflow-hidden relative">
                                <div className="absolute top-0 left-0 w-1 h-full bg-primary opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                                <CardHeader>
                                    <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                                        <feature.icon className="w-6 h-6 text-primary" />
                                    </div>
                                    <CardTitle className="text-xl">{feature.title}</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <CardDescription className="text-base leading-relaxed">
                                        {feature.description}
                                    </CardDescription>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </div>

                {/* FAQ Section */}
                <div className="mt-32 w-full max-w-3xl">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl font-bold tracking-tight">Frequently Asked Questions</h2>
                    </div>

                    <Accordion type="single" collapsible className="w-full">
                        {faqs.map((faq, index) => (
                            <AccordionItem key={index} value={`item-${index}`} className="border-border/50">
                                <AccordionTrigger className="text-left font-medium hover:text-primary transition-colors text-lg py-6">
                                    {faq.question}
                                </AccordionTrigger>
                                <AccordionContent className="text-muted-foreground text-base pb-6 leading-relaxed">
                                    {faq.answer}
                                </AccordionContent>
                            </AccordionItem>
                        ))}
                    </Accordion>
                </div>

                {/* Contact/Support Footer CTA */}
                <div className="mt-32 w-full bg-primary/5 rounded-3xl p-8 sm:p-12 border border-primary/10 flex flex-col items-center text-center space-y-6">
                    <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
                        <Rocket className="w-8 h-8 text-primary" />
                    </div>
                    <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">Need a custom plan early?</h2>
                    <p className="text-muted-foreground max-w-xl">
                        If you're an enterprise or a high-growth startup needing specific requirements before our public launch, we'd love to chat.
                    </p>
                    <Button variant="outline" size="lg" className="border-primary/20 hover:bg-primary/5 font-semibold">
                        Contact Sales
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default Pricing;
