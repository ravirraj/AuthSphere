import { useState, useEffect } from "react";
import { FolderPlus } from "lucide-react";
import { toast } from "sonner";

import { createProject } from "@/api/ProjectAPI";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const CreateProjectModal = ({ open, onClose, onCreated }) => {
  const [name, setName] = useState("");
  const [redirectUri, setRedirectUri] = useState("");
  const [loading, setLoading] = useState(false);

  /* Reset when modal closes */
  useEffect(() => {
    if (!open) {
      setName("");
      setRedirectUri("");
      setLoading(false);
    }
  }, [open]);

  const handleCreate = async () => {
    if (!name.trim() || !redirectUri.trim()) return;

    try {
      setLoading(true);

      const res = await createProject({
        name: name.trim(),
        redirectUris: [redirectUri.trim()],
        providers: ["google"], // 👈 REQUIRED
      });

      if (res?.success) {
        setName("");
        setRedirectUri("");
        onCreated();
        onClose();
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FolderPlus className="h-5 w-5 text-primary" />
            Create Project
          </DialogTitle>
          <DialogDescription>
            Projects represent applications that will use AuthSphere authentication.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <Input
            autoFocus
            placeholder="Project name (e.g. My SaaS App)"
            value={name}
            onChange={(e) => setName(e.target.value)}
            disabled={loading}
          />

          <Input
            placeholder="Redirect URI (e.g. http://localhost:3000/callback)"
            value={redirectUri}
            onChange={(e) => setRedirectUri(e.target.value)}
            disabled={loading}
          />

          <p className="text-xs text-muted-foreground">
            OAuth redirects will only be allowed to this URI.
          </p>
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={onClose}
            disabled={loading}
          >
            Cancel
          </Button>

          <Button
            onClick={handleCreate}
            disabled={loading || !name.trim() || !redirectUri.trim()}
          >
            <FolderPlus className="h-4 w-4 mr-2" />
            {loading ? "Creating..." : "Create Project"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default CreateProjectModal;
