import React from "react";
import { Link } from "react-router-dom";
import { Info } from "lucide-react";
import DocsCodeBlock from "../DocsCodeBlock";

const QuickStart = ({ publicKey, projectId }) => {
    return (
        <article className="space-y-8 animate-in fade-in duration-500">
            <div className="space-y-2">
                <h1 className="text-4xl font-bold tracking-tight">Quick Start Guide</h1>
                <p className="text-lg text-muted-foreground">
                    Integrate AuthSphere into your application in three simple steps.
                </p>
            </div>

            <div className="space-y-8">
                <div className="grid md:grid-cols-2 gap-6">
                    {/* Step 1 */}
                    <div className="relative pl-6 border-l-2 border-primary/20">
                        <span className="absolute -left-[9px] top-0 h-4 w-4 rounded-full bg-primary border-4 border-background" />
                        <h3 className="text-lg font-bold mb-2">1. Install Host SDK</h3>
                        <p className="text-sm text-muted-foreground mb-4">
                            AuthSphere provides a lightweight NPM package to handle protocol negotiation and session storage.
                        </p>
                        <DocsCodeBlock id="install" code="npm install @authsphere/sdk" language="terminal" />
                    </div>

                    {/* Step 2 */}
                    <div className="relative pl-6 border-l-2 border-primary/20">
                        <span className="absolute -left-[9px] top-0 h-4 w-4 rounded-full bg-primary border-4 border-background" />
                        <h3 className="text-lg font-bold mb-2">2. Security Config</h3>
                        <p className="text-sm text-muted-foreground mb-4">
                            Add your application's base URL (e.g., <code>localhost:3000</code>) to the <b>Allowed Origins</b> in settings.
                        </p>
                        <div className="p-3 rounded-lg bg-blue-500/5 border border-blue-500/10 text-[11px] flex gap-2 items-start">
                            <Info className="h-4 w-4 text-blue-500 shrink-0 mt-0.5" />
                            <p className="text-muted-foreground">
                                Requests without a matching <code>Origin</code> header will return a <code>403 Forbidden</code> status.
                            </p>
                        </div>
                    </div>
                </div>

                {/* Step 3 */}
                <div className="relative pl-6 border-l-2 border-muted text-foreground">
                    <span className="absolute -left-[9px] top-0 h-4 w-4 rounded-full bg-muted border-4 border-background" />
                    <h3 className="text-xl font-bold mb-2">3. Client Initialization</h3>
                    <p className="text-sm text-muted-foreground mb-4">
                        Initialize the client with your Public Key. This key is safe to expose in your frontend code.
                    </p>
                    <DocsCodeBlock
                        id="init"
                        code={`import { AuthSphere } from '@authsphere/sdk'\n\nAuthSphere.init({\n  publicKey: '${publicKey}',\n  baseUrl: 'http://localhost:8000/api/v1'\n});`}
                        language="javascript"
                    />
                </div>
            </div>
        </article>
    );
};

export default QuickStart;
