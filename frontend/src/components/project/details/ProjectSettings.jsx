import { useState } from "react";
import { Save, Settings, Plus, Trash2 } from "lucide-react";

import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";

import { updateProject } from "@/api/ProjectAPI";
import { toast } from "sonner";

const ProjectSettings = ({ project, onUpdated }) => {
  const [name, setName] = useState(project.name);
  const [redirectUris, setRedirectUris] = useState(
    project.redirectUris?.length
      ? project.redirectUris
      : [""]
  );

  const [providers, setProviders] = useState({
    google: project.providers?.google ?? true,
    github: project.providers?.github ?? true,
    discord: project.providers?.discord ?? true,
  });

  const [saving, setSaving] = useState(false);

  /* -------------------- REDIRECT URI HANDLERS -------------------- */
  const updateUri = (index, value) => {
    const updated = [...redirectUris];
    updated[index] = value;
    setRedirectUris(updated);
  };

  const addUri = () => setRedirectUris([...redirectUris, ""]);

  const removeUri = (index) => {
    setRedirectUris(redirectUris.filter((_, i) => i !== index));
  };

  /* -------------------- SAVE SETTINGS -------------------- */
  const handleSave = async () => {
    try {
      setSaving(true);

      const payload = {
        name,
        settings: {
          redirectUris: redirectUris.filter(Boolean),
          providers,
        },
      };

      const res = await updateProject(project._id, payload);

      if (res?.success) {
        toast.success("Project settings updated");
        onUpdated();
      } else {
        toast.error(res?.message || "Failed to update project");
      }
    } catch (err) {
      toast.error("Server error");
    } finally {
      setSaving(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Settings className="h-5 w-5 text-primary" />
          Project Settings
        </CardTitle>
        <CardDescription>
          Configure OAuth behavior and security rules
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-6">

        {/* Project Name */}
        <div className="space-y-2">
          <Label>Project Name</Label>
          <Input
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>

        {/* Redirect URIs */}
        <div className="space-y-3">
          <Label>Allowed Redirect URIs</Label>

          {redirectUris.map((uri, index) => (
            <div key={index} className="flex gap-2">
              <Input
                placeholder="https://yourapp.com/callback"
                value={uri}
                onChange={(e) => updateUri(index, e.target.value)}
              />
              {redirectUris.length > 1 && (
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => removeUri(index)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              )}
            </div>
          ))}

          <Button
            variant="outline"
            size="sm"
            onClick={addUri}
            className="w-fit"
          >
            <Plus className="h-4 w-4 mr-1" />
            Add URI
          </Button>

          <p className="text-xs text-muted-foreground">
            OAuth redirects will be blocked if the URI is not listed here.
          </p>
        </div>

        {/* Providers */}
        <div className="space-y-3">
          <Label>Enabled Login Providers</Label>

          {Object.keys(providers).map((provider) => (
            <div key={provider} className="flex items-center gap-2">
              <Checkbox
                checked={providers[provider]}
                onCheckedChange={(checked) =>
                  setProviders({
                    ...providers,
                    [provider]: checked,
                  })
                }
              />
              <span className="capitalize">{provider}</span>
            </div>
          ))}
        </div>

        {/* Save */}
        <Button
          onClick={handleSave}
          disabled={saving || !name.trim()}
          className="w-fit"
        >
          <Save className="h-4 w-4 mr-2" />
          {saving ? "Saving..." : "Save Changes"}
        </Button>

      </CardContent>
    </Card>
  );
};

export default ProjectSettings;
