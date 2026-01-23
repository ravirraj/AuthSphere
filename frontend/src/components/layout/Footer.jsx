import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
    return (
        <footer className="bg-background border-t border-border py-20 px-6">
            <div className="container mx-auto grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
                <div className="md:col-span-2 space-y-6">
                    <div className="flex items-center">
                        <img
                            src="/assets/logo-full.png"
                            alt="AuthSphere Logo"
                            className="h-16 w-auto object-contain 
                 mix-blend-multiply 
                 dark:mix-blend-normal dark:invert dark:brightness-150
                 transition-all duration-300"
                        />
                    </div>
                    <p className="text-muted-foreground font-medium max-w-sm leading-relaxed">
                        The identity infrastructure for the modern web. Built by developers, for developers.
                        Zero friction, infinite scale.
                    </p>
                </div>
                <div className="space-y-4">
                    <h4 className="text-xs font-black uppercase tracking-[0.3em] text-foreground">Resources</h4>
                    <div className="flex flex-col gap-3 text-sm text-muted-foreground">
                        <Link to="/pricing" className="hover:text-blue-600 transition-colors cursor-pointer">Pricing</Link>
                        <Link to="/docs" className="hover:text-blue-600 transition-colors cursor-pointer">Documentation</Link>
                        <Link to="#" className="hover:text-blue-600 transition-colors cursor-pointer">SDK Reference</Link>
                        <Link to="#" className="hover:text-blue-600 transition-colors cursor-pointer">System Status</Link>
                    </div>
                </div>
                <div className="space-y-4">
                    <h4 className="text-xs font-black uppercase tracking-[0.3em] text-foreground">Company</h4>
                    <div className="flex flex-col gap-3 text-sm text-muted-foreground">
                        <Link to="#" className="hover:text-blue-600 transition-colors cursor-pointer">Twitter</Link>
                        <Link to="#" className="hover:text-blue-600 transition-colors cursor-pointer">GitHub</Link>
                        <Link to="#" className="hover:text-blue-600 transition-colors cursor-pointer">Discord</Link>
                    </div>
                </div>
            </div>
            <div className="container mx-auto flex flex-col md:flex-row justify-between items-center gap-6 pt-12 border-t border-border/50">
                <p className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.4em]">© 2026 AUTH-SPHERE GRID INC.</p>
                <div className="flex items-center gap-6">
                    <div className="h-2 w-2 rounded-full bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)]" />
                    <span className="text-[10px] font-black text-emerald-600 uppercase tracking-widest">Global Clusters Operational</span>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
