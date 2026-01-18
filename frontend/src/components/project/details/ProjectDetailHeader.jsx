import { useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Folder,
  Calendar,
  Hash,
  Activity,
  BarChart3,
  ArrowUpRight
} from "lucide-react";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const ProjectDetailHeader = ({ project }) => {
  const navigate = useNavigate();

  return (
    <Card>
      <CardHeader className="space-y-3">

        {/* Back */}
        <Button
          variant="ghost"
          size="sm"
          onClick={() => navigate("/dashboard")}
          className="w-fit px-0 text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4 mr-1" />
          Back to Dashboard
        </Button>

        {/* Title */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Folder className="h-6 w-6 text-primary" />
            <div>
              <CardTitle className="text-2xl">
                {project.name}
              </CardTitle>
              <CardDescription>
                Project overview & configuration
              </CardDescription>
            </div>
          </div>
          <Button
            onClick={() => navigate(`/projects/${project._id}/analytics`)}
            className="hidden sm:flex bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl shadow-lg shadow-indigo-100 border-none transition-all hover:scale-105"
          >
            <BarChart3 className="h-4 w-4 mr-2" />
            View Analytics
            <ArrowUpRight className="h-3 w-3 ml-1 opacity-50" />
          </Button>
        </div>

      </CardHeader>

      <CardContent className="flex flex-col sm:flex-row gap-4 text-sm">

        {/* Project ID */}
        <div className="flex items-center gap-2">
          <Hash className="h-4 w-4 text-muted-foreground" />
          <span className="text-muted-foreground">
            ID:
          </span>
          <Badge variant="secondary">
            {project._id}
          </Badge>
        </div>

        {/* Created At */}
        <div className="flex items-center gap-2">
          <Calendar className="h-4 w-4 text-muted-foreground" />
          <span className="text-muted-foreground">
            Created:
          </span>
          <span>
            {new Date(project.createdAt).toLocaleDateString()}
          </span>
        </div>

      </CardContent>
    </Card>
  );
};

export default ProjectDetailHeader;
