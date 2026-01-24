import { useState, useMemo } from "react";
import { Save, Settings, Plus, Trash2, Globe, ShieldCheck } from "lucide-react";
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

const ProjectSettings = ({ project, onUpdated }) => {
  const [name, setName] = useState(project.name);
  const [redirectUris, setRedirectUris] = useState(
    project.redirectUris?.length ? project.redirectUris : [""]
  );
  const [providers, setProviders] = useState({
    google: project.providers?.includes("google") ?? false,
    github: project.providers?.includes("github") ?? false,
    discord: project.providers?.includes("discord") ?? false,
  });

  const [saving, setSaving] = useState(false);

  const hasChanges = useMemo(() => {
    const activeProviders = Object.keys(providers).filter(p => providers[p]).sort();
    const originalProviders = [...(project.providers || [])].sort();

    return (
      name !== project.name ||
      JSON.stringify(redirectUris.filter(Boolean)) !== JSON.stringify(project.redirectUris) ||
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
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <ShieldCheck className="h-4 w-4 text-primary" />
            <h4 className="font-semibold">Authentication Providers</h4>
          </div>
          <p className="text-sm text-muted-foreground">
            Enable social login methods for this project
          </p>
          <div className="space-y-3">
            {Object.keys(providers).map((id) => (
              <div key={id} className="flex items-center space-x-3 p-3 border rounded-lg hover:bg-muted/50 transition-colors">
                <Checkbox
                  id={id}
                  checked={providers[id]}
                  onCheckedChange={() => toggleProvider(id)}
                />
                <label
                  htmlFor={id}
                  className="flex-1 text-sm font-medium capitalize cursor-pointer"
                >
                  {id}
                </label>
              </div>
            ))}
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
