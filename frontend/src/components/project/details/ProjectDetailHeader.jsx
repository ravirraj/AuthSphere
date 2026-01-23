import { useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Folder,
  Calendar,
  Hash,
  Activity,
  BarChart3,
  ArrowUpRight,
  Copy,
  CheckCircle2
} from "lucide-react";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger
} from "@/components/ui/tooltip";

const ProjectDetailHeader = ({ project }) => {
  const navigate = useNavigate();
  const [copied, setCopied] = useState(false);

  const copyId = () => {
    navigator.clipboard.writeText(project._id);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="relative pb-12 border-b border-border mb-12 animate-in fade-in slide-in-from-top-4 duration-1000">
      {/* 1. Breadcrumb / Back Navigation */}
      <nav className="flex items-center gap-3 mb-10">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => navigate("/dashboard")}
          className="h-9 rounded-xl text-muted-foreground hover:text-blue-600 hover:bg-blue-600/5 transition-all font-black text-[10px] uppercase tracking-[0.2em] px-4 border border-transparent hover:border-blue-600/20"
        >
          <ArrowLeft className="h-3.5 w-3.5 mr-2" />
          Grid Control
        </Button>
        <span className="text-border">/</span>
        <Badge variant="outline" className="text-[10px] font-black text-foreground uppercase tracking-widest bg-muted/30 border-border px-4 py-1.5 rounded-xl">
          Shard: {project.name}
        </Badge>
      </nav>

      {/* 2. Main Title Row */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-10">
        <div className="flex items-start gap-6">
          <div className="mt-1 bg-white border border-border/40 p-2.5 rounded-2xl shadow-xl shadow-blue-500/5 transition-transform hover:scale-105 active:scale-95 duration-300">
            <img
              src="/assets/logo.png"
              alt="AuthSphere Logo"
              className="h-7 w-7 object-contain mix-blend-multiply dark:invert dark:mix-blend-normal"
            />
          </div>
          <div className="space-y-4">
            <div className="flex flex-wrap items-center gap-4">
              <h1 className="text-5xl lg:text-6xl font-black tracking-tighter text-foreground italic uppercase leading-none">
                {project.name}<span className="text-blue-600">.</span>
              </h1>
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-600">
                <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-[10px] font-black uppercase tracking-widest">Shard Active</span>
              </div>
            </div>
            <p className="text-muted-foreground font-medium text-lg leading-relaxed max-w-2xl text-balance">
              Managing secure identity for <span className="text-foreground font-black italic">{project.name}</span>.
              Currently connected to the <span className="text-blue-600 font-bold">Global Shard Registry</span> with sub-50ms latency.
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-4">
          <Button
            variant="outline"
            onClick={() => navigate(`/projects/${project._id}/analytics`)}
            className="rounded-2xl h-14 font-black uppercase tracking-widest text-xs border-border bg-card/50 backdrop-blur-sm shadow-xl hover:shadow-2xl transition-all px-8 border-b-4 border-b-muted-foreground/20 active:border-b-0 active:translate-y-1"
          >
            <BarChart3 className="h-4 w-4 mr-3 text-blue-600" />
            Shard Vitals
          </Button>

          <Button
            className="bg-blue-600 hover:bg-blue-700 text-white font-black h-14 rounded-2xl shadow-xl shadow-blue-600/20 transition-all active:scale-95 px-10 uppercase tracking-widest text-xs border-b-4 border-b-blue-800 active:border-b-0 active:translate-y-1"
          >
            Deploy Shard Updates <ArrowUpRight className="h-4 w-4 ml-3 opacity-60" />
          </Button>
        </div>
      </div>

      {/* 3. Meta Data Strip */}
      <div className="flex flex-wrap items-center gap-8 mt-12 bg-muted/20 p-6 rounded-[2rem] border border-border/50">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <div
                onClick={copyId}
                className="group flex items-center gap-4 px-5 py-3 bg-background hover:bg-muted/50 rounded-2xl cursor-pointer transition-all border border-border active:scale-95 shadow-sm"
              >
                <Hash className="h-4 w-4 text-blue-600" />
                <span className="text-xs font-mono font-bold text-foreground">shard_{project._id}</span>
                {copied ? <CheckCircle2 className="h-4 w-4 text-emerald-500" /> : <Copy className="h-4 w-4 text-muted-foreground opacity-30 group-hover:opacity-100" />}
              </div>
            </TooltipTrigger>
            <TooltipContent className="bg-foreground text-background font-black text-[10px] rounded-xl px-4 py-2">CLICK TO SYNC SHARD ID</TooltipContent>
          </Tooltip>
        </TooltipProvider>

        <div className="h-10 w-[1px] bg-border/50 hidden md:block" />

        <div className="flex items-center gap-4">
          <div className="h-12 w-12 rounded-2xl bg-muted flex items-center justify-center border border-border">
            <Calendar className="h-5 w-5 text-muted-foreground" />
          </div>
          <div className="flex flex-col">
            <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/60">Sequence Provisioned</span>
            <span className="text-xs font-bold text-foreground">
              {new Date(project.createdAt).toLocaleDateString(undefined, { month: 'long', day: 'numeric', year: 'numeric' })}
            </span>
          </div>
        </div>

        <div className="h-10 w-[1px] bg-border/50 hidden md:block" />

        <div className="flex items-center gap-4">
          <div className="h-12 w-12 rounded-2xl bg-blue-600/10 flex items-center justify-center border border-blue-600/20">
            <Activity className="h-5 w-5 text-blue-600" />
          </div>
          <div className="flex flex-col">
            <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/60">Registry Version</span>
            <span className="text-xs font-bold text-foreground flex items-center gap-2">
              Grid-Core 2.1.0-stable
              <Badge className="bg-blue-600 text-white border-none py-0 px-2 h-4 text-[8px] font-black">LATEST</Badge>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectDetailHeader;