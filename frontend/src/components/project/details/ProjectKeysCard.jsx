import { useState } from "react";
import { KeyRound, Copy, Check, RefreshCcw } from "lucide-react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { rotateProjectKeys } from "@/api/ProjectAPI"; // Your API call

const ProjectKeysCard = ({ project, onKeysRotated }) => {
  const [copied, setCopied] = useState(false);
  const [rotating, setRotating] = useState(false);

  /* -------------------- COPY PUBLIC KEY -------------------- */
  const handleCopy = async () => {
    await navigator.clipboard.writeText(project.publicKey);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  /* -------------------- ROTATE KEYS -------------------- */
  const handleRotateKeys = async () => {
    const confirm = window.confirm(
      "Are you sure you want to rotate keys? This will invalidate existing sessions."
    );
    if (!confirm) return;

    try {
      setRotating(true);
      const res = await rotateProjectKeys(project._id);
      if (res.success) {
        toast.success("Keys rotated successfully");
        onKeysRotated?.(); // Refresh project data
      } else {
        toast.error(res.message || "Failed to rotate keys");
      }
    } catch (err) {
      toast.error(err.message || "Server error");
    } finally {
      setRotating(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <KeyRound className="h-5 w-5 text-primary" />
          API Keys
        </CardTitle>
        <CardDescription>
          Use these keys to integrate AuthSphere into your application.
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-4">

        {/* Public Key */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border rounded-lg p-4">
          <div className="space-y-1">
            <p className="text-sm font-medium">Public Key</p>
            <Badge variant="secondary" className="font-mono text-xs break-all">
              {project.publicKey}
            </Badge>
          </div>

          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleCopy}
              className="w-fit"
            >
              {copied ? (
                <>
                  <Check className="h-4 w-4 mr-1 text-green-600" />
                  Copied
                </>
              ) : (
                <>
                  <Copy className="h-4 w-4 mr-1" />
                  Copy
                </>
              )}
            </Button>

            <Button
              variant="destructive"
              size="sm"
              onClick={handleRotateKeys}
              disabled={rotating}
            >
              {rotating ? (
                <>
                  <RefreshCcw className="h-4 w-4 mr-1 animate-spin" />
                  Rotating...
                </>
              ) : (
                <>
                  <RefreshCcw className="h-4 w-4 mr-1" />
                  Rotate Keys
                </>
              )}
            </Button>
          </div>
        </div>

        {/* Redirect URIs */}
        {project.redirectUris?.length > 0 && (
          <div className="space-y-1">
            <p className="text-sm font-medium">Redirect URIs</p>
            <ul className="text-xs font-mono space-y-1 list-disc list-inside">
              {project.redirectUris.map((uri) => (
                <li key={uri}>{uri}</li>
              ))}
            </ul>
          </div>
        )}

        {/* Enabled Providers */}
        {project.providers?.length > 0 && (
          <div className="space-y-1">
            <p className="text-sm font-medium">Enabled Providers</p>
            <div className="flex flex-wrap gap-2">
              {project.providers.map((p) => (
                <Badge key={p}>{p.charAt(0).toUpperCase() + p.slice(1)}</Badge>
              ))}
            </div>
          </div>
        )}

        {/* SDK Snippet */}
        <div>
          <p className="text-sm font-medium">SDK Integration Snippet</p>
          <pre className="bg-gray-100 dark:bg-gray-800 p-2 rounded text-xs overflow-x-auto">
            {`import { initAuth } from "authsphere";

const auth = initAuth({
  clientId: "${project.publicKey}",
  redirectUri: "YOUR_REDIRECT_URI",
  authBaseUrl: "https://auth.yourplatform.com"
});

auth.redirectToLogin();`}
          </pre>
        </div>

        {/* Security Notice */}
        <p className="text-xs text-muted-foreground leading-relaxed">
          Keep your API keys secure. Do not expose your private keys in client-side code. Rotating keys will invalidate existing sessions.
        </p>

      </CardContent>
    </Card>
  );
};

export default ProjectKeysCard;
