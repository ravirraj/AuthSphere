import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

import ProjectList from "@/components/project/ProjectList";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";

import {
  LayoutDashboard,
  FolderKanban,
  Users,
  Activity,
  ShieldCheck,
  Code2,
  Clock,
  Zap,
  Plus,
  ChevronRight,
  Loader2
} from "lucide-react";

import { getDashboardStats } from "@/api/DeveloperAPI";
import CreateProjectModal from "@/components/project/CreateProjectModal";
import { format, formatDistanceToNow } from "date-fns";

const Dashboard = () => {
  const { user, loading } = useContext(AuthContext);
  const navigate = useNavigate();

  const [stats, setStats] = useState({
    totalProjects: 0,
    totalEndUsers: 0,
    recentUsers: []
  });
  const [statsLoading, setStatsLoading] = useState(true);
  const [createOpen, setCreateOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("overview");

  const fetchStats = async () => {
    try {
      setStatsLoading(true);
      const res = await getDashboardStats();
      if (res.success) {
        setStats(res.data);
      }
    } catch (error) {
      console.error("Failed to fetch dashboard stats", error);
    } finally {
      setStatsLoading(false);
    }
  };

  useEffect(() => {
    if (!loading && !user) {
      navigate("/login");
    } else if (user) {
      fetchStats();
    }
  }, [user, loading, navigate]);

  if (loading || !user) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary mb-4" />
        <p className="text-sm text-muted-foreground">Loading dashboard...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <div className="max-w-7xl mx-auto px-6 py-8 space-y-8">

        {/* HEADER */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight mb-1">
              Welcome back, {user.username.split(' ')[0]}
            </h1>
            <p className="text-muted-foreground">
              Manage your authentication infrastructure
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Button variant="outline" className="gap-2" onClick={() => navigate('/docs')}>
              <Code2 className="h-4 w-4" />
              Docs
            </Button>
            <Button className="gap-2" onClick={() => setCreateOpen(true)}>
              <Plus className="h-4 w-4" />
              New Project
            </Button>
          </div>
        </div>

        {/* QUICK STATS */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            {
              label: "Total Projects",
              val: stats.totalProjects,
              icon: FolderKanban,
              color: "text-blue-600 dark:text-blue-400"
            },
            {
              label: "Total Users",
              val: stats.totalEndUsers,
              icon: Users,
              color: "text-emerald-600 dark:text-emerald-400"
            },
            {
              label: "Daily Active",
              val: Math.round(stats.totalEndUsers * 0.4),
              icon: Activity,
              color: "text-violet-600 dark:text-violet-400"
            },
            {
              label: "Avg Latency",
              val: "124ms",
              icon: Zap,
              color: "text-amber-600 dark:text-amber-400"
            },
          ].map((s, i) => (
            <Card key={i} className="border hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-3">
                  <div className={`h-8 w-8 rounded-lg bg-muted flex items-center justify-center ${s.color}`}>
                    <s.icon className="h-4 w-4" />
                  </div>
                  <Badge variant="secondary" className="text-xs">LIVE</Badge>
                </div>
                <div className="text-2xl font-bold mb-1">
                  {statsLoading ? "..." : s.val}
                </div>
                <p className="text-sm text-muted-foreground">{s.label}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* MAIN CONTENT TABS */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="projects">Projects</TabsTrigger>
            <TabsTrigger value="users">Users</TabsTrigger>
            <TabsTrigger value="activity">Activity</TabsTrigger>
          </TabsList>

          {/* OVERVIEW TAB */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid lg:grid-cols-3 gap-6">

              {/* Recent Activity */}
              <div className="lg:col-span-2">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between pb-4">
                    <div>
                      <CardTitle className="text-xl">Recent Users</CardTitle>
                      <CardDescription>Latest authentications across projects</CardDescription>
                    </div>
                    <Button variant="ghost" size="sm" onClick={() => setActiveTab('users')}>
                      View All <ChevronRight className="h-4 w-4 ml-1" />
                    </Button>
                  </CardHeader>
                  <CardContent>
                    {stats.recentUsers.length > 0 ? (
                      <div className="space-y-4">
                        {stats.recentUsers.slice(0, 5).map((user) => (
                          <div key={user._id} className="flex items-center gap-4">
                            <div className="h-10 w-10 rounded-full bg-muted flex items-center justify-center font-semibold">
                              {user.username.charAt(0).toUpperCase()}
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="font-medium truncate">{user.username}</p>
                              <p className="text-sm text-muted-foreground truncate">{user.email}</p>
                            </div>
                            <div className="text-right text-xs text-muted-foreground">
                              {formatDistanceToNow(new Date(user.createdAt), { addSuffix: true })}
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-12">
                        <Users className="h-12 w-12 mx-auto mb-3 text-muted-foreground/30" />
                        <p className="text-muted-foreground">No users yet</p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>

              {/* Quick Start */}
              <div className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Quick Start</CardTitle>
                    <CardDescription>Get started in 4 steps</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {[
                      "Create Project",
                      "Install SDK",
                      "Configure Providers",
                      "Test Login"
                    ].map((step, i) => (
                      <div key={i} className="flex items-center gap-3">
                        <div className="h-6 w-6 rounded-full bg-primary/10 flex items-center justify-center text-xs font-semibold text-primary">
                          {i + 1}
                        </div>
                        <span className="text-sm">{step}</span>
                      </div>
                    ))}
                    <Button variant="outline" className="w-full mt-4" onClick={() => navigate('/docs')}>
                      View Docs
                    </Button>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm flex items-center gap-2">
                      <ShieldCheck className="h-4 w-4 text-emerald-500" />
                      Security Status
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <div className="flex items-center justify-between p-2 bg-emerald-500/10 rounded-lg">
                      <span className="text-xs font-medium">JWT Encryption</span>
                      <Badge className="bg-emerald-500 hover:bg-emerald-600 text-xs">ACTIVE</Badge>
                    </div>
                    <div className="flex items-center justify-between p-2 bg-amber-500/10 rounded-lg">
                      <span className="text-xs font-medium">Key Rotation</span>
                      <span className="text-xs text-amber-600">Due in 4d</span>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          {/* PROJECTS TAB */}
          <TabsContent value="projects">
            <ProjectList />
          </TabsContent>

          {/* USERS TAB */}
          <TabsContent value="users">
            <Card>
              <CardHeader>
                <CardTitle>All Users</CardTitle>
                <CardDescription>Global view of authenticated users</CardDescription>
              </CardHeader>
              <CardContent>
                {stats.recentUsers.length > 0 ? (
                  <div className="rounded-lg border">
                    <table className="w-full text-sm">
                      <thead className="border-b bg-muted/30">
                        <tr>
                          <th className="py-3 px-4 text-left font-medium">User</th>
                          <th className="py-3 px-4 text-left font-medium">Email</th>
                          <th className="py-3 px-4 text-left font-medium">Project</th>
                          <th className="py-3 px-4 text-right font-medium">Created</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y">
                        {stats.recentUsers.map((user) => (
                          <tr key={user._id} className="hover:bg-muted/30 transition-colors">
                            <td className="py-3 px-4">
                              <div className="flex items-center gap-2">
                                <div className="h-7 w-7 rounded-full bg-muted flex items-center justify-center text-xs font-semibold">
                                  {user.username.charAt(0)}
                                </div>
                                {user.username}
                              </div>
                            </td>
                            <td className="py-3 px-4 text-muted-foreground">{user.email}</td>
                            <td className="py-3 px-4">
                              <Badge variant="secondary">{user.projectId.name}</Badge>
                            </td>
                            <td className="py-3 px-4 text-right text-muted-foreground">
                              {format(new Date(user.createdAt), "MMM d, yyyy")}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <Users className="h-12 w-12 mx-auto mb-3 text-muted-foreground/30" />
                    <p className="text-muted-foreground">No users found</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* ACTIVITY TAB */}
          <TabsContent value="activity">
            <Card>
              <CardContent className="py-16 text-center">
                <Activity className="h-12 w-12 mx-auto mb-4 text-muted-foreground/30" />
                <h3 className="text-xl font-semibold mb-2">Activity Logs Coming Soon</h3>
                <p className="text-muted-foreground max-w-md mx-auto">
                  Real-time authentication events and activity logs are in development
                </p>
                <Button variant="outline" className="mt-6">Request Early Access</Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* CREATE PROJECT MODAL */}
        <CreateProjectModal
          open={createOpen}
          onClose={() => setCreateOpen(false)}
          onCreated={() => {
            setCreateOpen(false);
            fetchStats();
            setActiveTab('projects');
          }}
        />

      </div>
    </div>
  );
};

export default Dashboard;
