import { useState, useMemo } from "react";
import { Save, Settings, Plus, Trash2, Globe, ShieldCheck, Search } from "lucide-react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { updateProject } from "@/api/ProjectAPI";
import { toast } from "sonner";
import { Checkbox } from "@/components/ui/checkbox";
import { ProviderLogos } from "./assets";

const ProjectSettings = ({ project, onUpdated }) => {
  const [name, setName] = useState(project.name);
  const [redirectUris, setRedirectUris] = useState(
    project.redirectUris?.length ? project.redirectUris : [""]
  );
  const [providers, setProviders] = useState({
    google: project.providers?.includes("google") ?? false,
    github: project.providers?.includes("github") ?? false,
    discord: project.providers?.includes("discord") ?? false,
    linkedin: project.providers?.includes("linkedin") ?? false,
    gitlab: project.providers?.includes("gitlab") ?? false,
    twitch: project.providers?.includes("twitch") ?? false,
    bitbucket: project.providers?.includes("bitbucket") ?? false,
    microsoft: project.providers?.includes("microsoft") ?? false,
    // Future providers
    facebook: project.providers?.includes("facebook") ?? false,
    twitter: project.providers?.includes("twitter") ?? false,
    slack: project.providers?.includes("slack") ?? false,
    apple: project.providers?.includes("apple") ?? false,
    spotify: project.providers?.includes("spotify") ?? false,
    reddit: project.providers?.includes("reddit") ?? false,
    zoom: project.providers?.includes("zoom") ?? false,
    dropbox: project.providers?.includes("dropbox") ?? false,
    salesforce: project.providers?.includes("salesforce") ?? false,
    hubspot: project.providers?.includes("hubspot") ?? false,
    instagram: project.providers?.includes("instagram") ?? false,
    pinterest: project.providers?.includes("pinterest") ?? false,
    yahoo: project.providers?.includes("yahoo") ?? false,
  });

  const [saving, setSaving] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const allProvidersList = [
    { id: "google", name: "Google", logo: ProviderLogos.google, color: "hover:border-blue-500/50", status: "ready" },
    { id: "github", name: "GitHub", logo: ProviderLogos.github, color: "hover:border-slate-500/50", status: "ready" },
    { id: "discord", name: "Discord", logo: ProviderLogos.discord, color: "hover:border-indigo-500/50", status: "ready" },
    { id: "linkedin", name: "LinkedIn", logo: ProviderLogos.linkedin, color: "hover:border-blue-600/50", status: "ready" },
    { id: "gitlab", name: "GitLab", logo: ProviderLogos.gitlab, color: "hover:border-orange-500/50", status: "ready" },
    { id: "twitch", name: "Twitch", logo: ProviderLogos.twitch, color: "hover:border-purple-500/50", status: "ready" },
    { id: "bitbucket", name: "Bitbucket", logo: ProviderLogos.bitbucket, color: "hover:border-blue-400/50", status: "ready" },
    { id: "microsoft", name: "Microsoft", logo: ProviderLogos.microsoft, color: "hover:border-teal-500/50", status: "ready" },
    { id: "facebook", name: "Facebook", logo: ProviderLogos.facebook, color: "hover:border-blue-700/50", status: "planned" },
    { id: "twitter", name: "Twitter (X)", logo: ProviderLogos.twitter, color: "hover:border-black/50", status: "planned" },
    { id: "slack", name: "Slack", logo: ProviderLogos.slack, color: "hover:border-purple-600/50", status: "planned" },
    { id: "apple", name: "Apple", logo: ProviderLogos.apple, color: "hover:border-black/50", status: "planned" },
    { id: "spotify", name: "Spotify", logo: ProviderLogos.spotify, color: "hover:border-green-500/50", status: "planned" },
    { id: "reddit", name: "Reddit", logo: ProviderLogos.reddit, color: "hover:border-orange-600/50", status: "planned" },
    { id: "zoom", name: "Zoom", logo: ProviderLogos.zoom, color: "hover:border-blue-400/50", status: "planned" },
    { id: "dropbox", name: "Dropbox", logo: ProviderLogos.dropbox, color: "hover:border-blue-600/50", status: "planned" },
    { id: "salesforce", name: "Salesforce", logo: ProviderLogos.salesforce, color: "hover:border-blue-500/50", status: "planned" },
    { id: "hubspot", name: "HubSpot", logo: ProviderLogos.hubspot, color: "hover:border-orange-500/50", status: "planned" },
    { id: "instagram", name: "Instagram", logo: ProviderLogos.instagram, color: "hover:border-pink-500/50", status: "planned" },
    { id: "pinterest", name: "Pinterest", logo: ProviderLogos.pinterest, color: "hover:border-red-600/50", status: "planned" },
    { id: "yahoo", name: "Yahoo", logo: ProviderLogos.yahoo, color: "hover:border-purple-700/50", status: "planned" },
  ];

  const filteredProviders = allProvidersList.filter(p =>
    p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.id.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const hasChanges = useMemo(() => {
    const activeProviders = Object.keys(providers).filter(p => providers[p]).sort();
    const originalProviders = [...(project.providers || [])].sort();

    return (
      name !== project.name ||
      JSON.stringify(redirectUris.filter(Boolean)) !== JSON.stringify(project.redirectUris || []) ||
      JSON.stringify(activeProviders) !== JSON.stringify(originalProviders)
    );
  }, [name, redirectUris, providers, project]);

  const updateUri = (index, value) => {
    const updated = [...redirectUris];
    updated[index] = value;
    setRedirectUris(updated);
  };

  const addUri = () => setRedirectUris([...redirectUris, ""]);
  const removeUri = (index) => setRedirectUris(redirectUris.filter((_, i) => i !== index));

  const toggleProvider = (id) => {
    setProviders(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      const activeProviders = Object.keys(providers).filter(p => providers[p]);

      if (activeProviders.length === 0) {
        toast.error("At least one provider must be enabled");
        return;
      }

      const res = await updateProject(project._id, {
        name,
        redirectUris: redirectUris.filter(Boolean),
        providers: activeProviders,
      });

      if (res?.success) {
        toast.success("Settings saved successfully");
        onUpdated();
      }
    } catch (err) {
      toast.error("Failed to update settings");
    } finally {
      setSaving(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-xl">
          <Settings className="h-5 w-5 text-primary" />
          Project Settings
        </CardTitle>
        <CardDescription>
          Configure your project settings and authentication providers
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-8">
        {/* Project Name */}
        <div className="space-y-3">
          <div>
            <h4 className="font-semibold mb-1">Project Name</h4>
            <p className="text-sm text-muted-foreground">
              This name will be visible during the OAuth consent flow
            </p>
          </div>
          <div className="space-y-2">
            <Label htmlFor="name">Display Name</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="My Production App"
            />
          </div>
        </div>

        <Separator />

        {/* Redirect URIs */}
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <Globe className="h-4 w-4 text-primary" />
            <h4 className="font-semibold">Redirect URIs</h4>
          </div>
          <p className="text-sm text-muted-foreground">
            Only these URIs will be allowed for authentication callbacks
          </p>
          <div className="space-y-2">
            {redirectUris.map((uri, index) => (
              <div key={index} className="flex gap-2">
                <Input
                  placeholder="https://app.com/callback"
                  value={uri}
                  onChange={(e) => updateUri(index, e.target.value)}
                  className="font-mono text-sm"
                />
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => removeUri(index)}
                  disabled={redirectUris.length === 1}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={addUri}
            className="gap-2"
          >
            <Plus className="h-4 w-4" />
            Add URI
          </Button>
        </div>

        <Separator />

        {/* Providers */}
        <div className="space-y-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <ShieldCheck className="h-4 w-4 text-primary" />
                <h4 className="font-semibold">Authentication Providers</h4>
              </div>
              <p className="text-sm text-muted-foreground mt-1">
                Enable social login methods for this project.
              </p>
            </div>
            <div className="relative max-w-sm w-full">
              <Input
                placeholder="Search 20+ providers..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 bg-muted/30 border-none focus-visible:ring-1"
              />
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 pt-4">
            {filteredProviders.length > 0 ? (
              filteredProviders.map((p) => (
                <div
                  key={p.id}
                  onClick={() => toggleProvider(p.id)}
                  className={`
                    flex items-center gap-4 p-4 border rounded-xl cursor-pointer transition-all duration-200
                    ${providers[p.id] ? 'bg-primary/5 border-primary shadow-sm' : 'bg-card hover:bg-muted/50'} 
                    ${p.color}
                    ${p.status === 'planned' ? 'opacity-70 grayscale-[0.5]' : ''}
                  `}
                >
                  <div className={`h-10 w-10 flex-shrink-0 bg-white rounded-lg border p-2 flex items-center justify-center ${providers[p.id] ? 'ring-2 ring-primary/20' : ''}`}>
                    <img
                      src={p.logo}
                      alt={p.name}
                      className="h-full w-full object-contain"
                      onError={(e) => { e.target.src = "https://www.svgrepo.com/show/506680/app-development.svg" }}
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold truncate">{p.name}</p>
                    <p className="text-[10px] text-muted-foreground uppercase tracking-wider font-bold">
                      {providers[p.id] ? 'Enabled' : (p.status === 'ready' ? 'Ready' : 'Coming Soon')}
                    </p>
                  </div>
                  <Checkbox
                    id={p.id}
                    checked={providers[p.id] || false}
                    onCheckedChange={() => toggleProvider(p.id)}
                    onClick={(e) => e.stopPropagation()}
                    className="rounded-full h-5 w-5"
                  />
                </div>
              ))
            ) : (
              <div className="col-span-full py-12 text-center border-2 border-dashed rounded-xl">
                <Search className="h-8 w-8 mx-auto mb-2 text-muted-foreground/30" />
                <p className="text-muted-foreground">No providers found matching "{searchQuery}"</p>
              </div>
            )}
          </div>
        </div>
      </CardContent>

      <CardFooter className="bg-muted/30 border-t flex justify-between items-center">
        <div className="text-sm text-muted-foreground flex items-center gap-2">
          {hasChanges && (
            <>
              <div className="h-2 w-2 rounded-full bg-primary animate-pulse" />
              Unsaved changes
            </>
          )}
        </div>
        <Button
          onClick={handleSave}
          disabled={saving || !hasChanges || !name.trim()}
          className="gap-2"
        >
          {saving ? (
            <>
              <div className="h-4 w-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
              Saving...
            </>
          ) : (
            <>
              <Save className="h-4 w-4" />
              Save Changes
            </>
          )}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default ProjectSettings;
