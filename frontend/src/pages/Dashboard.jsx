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

import {
  LayoutDashboard,
  FolderKanban,
  Users,
  Activity,
  ShieldCheck,
  Code2,
  TrendingUp,
  AlertCircle,
  CheckCircle2,
  Clock,
  Zap,
  Plus
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
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-purple-50">
        <div className="text-center space-y-4">
          <div className="inline-flex h-16 w-16 animate-spin rounded-full border-4 border-solid border-blue-600 border-r-transparent"></div>
          <p className="text-lg font-medium text-gray-600">Loading your workspace...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="max-w-7xl mx-auto px-6 py-10 space-y-8">

        {/* HEADER */}
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <div className="flex items-center gap-3">
              <LayoutDashboard className="h-8 w-8 text-blue-600" />
              <h1 className="text-4xl font-bold tracking-tight">
                Dashboard
              </h1>
            </div>
            <p className="text-muted-foreground text-lg">
              Welcome back, {user.username} 👋
            </p>
          </div>

          <Badge className="gap-2 px-4 py-2">
            <ShieldCheck className="h-4 w-4" />
            Verified Account
          </Badge>
        </div>

        {/* QUICK STATS */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="bg-gradient-to-br from-blue-500 to-blue-600 text-white shadow-lg shadow-blue-200">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-blue-100 text-sm font-medium">Total Projects</p>
                  <p className="text-3xl font-bold mt-2">{statsLoading ? "..." : stats.totalProjects}</p>
                  <p className="text-blue-100 text-xs mt-2">Active workspaces</p>
                </div>
                <FolderKanban className="h-12 w-12 text-blue-200" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-green-500 to-green-600 text-white shadow-lg shadow-green-200">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-green-100 text-sm font-medium">End Users</p>
                  <p className="text-3xl font-bold mt-2">{statsLoading ? "..." : stats.totalEndUsers}</p>
                  <p className="text-green-100 text-xs mt-2">Authenticated users</p>
                </div>
                <Users className="h-12 w-12 text-green-200" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-purple-500 to-purple-600 text-white shadow-lg shadow-purple-200">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-purple-100 text-sm font-medium">Auth Events</p>
                  <p className="text-3xl font-bold mt-2">{statsLoading ? "..." : stats.totalEndUsers * 2}</p>
                  <p className="text-purple-100 text-xs mt-2">Simulated activity</p>
                </div>
                <Activity className="h-12 w-12 text-purple-200" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-orange-500 to-orange-600 text-white shadow-lg shadow-orange-200">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-orange-100 text-sm font-medium">Avg. Response</p>
                  <p className="text-3xl font-bold mt-2">124ms</p>
                  <p className="text-orange-100 text-xs mt-2">Authentication speed</p>
                </div>
                <Zap className="h-12 w-12 text-orange-200" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* MAIN CONTENT TABS */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-4 bg-white/50 backdrop-blur-sm border shadow-sm">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="projects">Projects</TabsTrigger>
            <TabsTrigger value="users">Users</TabsTrigger>
            <TabsTrigger value="activity">Activity</TabsTrigger>
          </TabsList>

          {/* OVERVIEW TAB */}
          <TabsContent value="overview" className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-300">

            {/* Quick Actions */}
            <Card className="border-none shadow-md bg-white/80 backdrop-blur-md">
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
                <CardDescription>Get started with common tasks</CardDescription>
              </CardHeader>
              <CardContent className="grid md:grid-cols-3 gap-4">
                <Button
                  className="h-auto py-6 flex-col gap-3 text-lg font-semibold hover:bg-blue-50 hover:text-blue-700 hover:border-blue-200 transition-all"
                  variant="outline"
                  onClick={() => setCreateOpen(true)}
                >
                  <div className="p-3 bg-blue-100 rounded-2xl">
                    <Plus className="h-6 w-6 text-blue-600" />
                  </div>
                  <span>Create Project</span>
                </Button>
                <Button
                  className="h-auto py-6 flex-col gap-3 text-lg font-semibold hover:bg-purple-50 hover:text-purple-700 hover:border-purple-200 transition-all"
                  variant="outline"
                  onClick={() => navigate('/docs')}
                >
                  <div className="p-3 bg-purple-100 rounded-2xl">
                    <Code2 className="h-6 w-6 text-purple-600" />
                  </div>
                  <span>View SDK Docs</span>
                </Button>
                <Button
                  className="h-auto py-6 flex-col gap-3 text-lg font-semibold hover:bg-green-50 hover:text-green-700 hover:border-green-200 transition-all"
                  variant="outline"
                  onClick={() => setActiveTab('users')}
                >
                  <div className="p-3 bg-green-100 rounded-2xl">
                    <Users className="h-6 w-6 text-green-600" />
                  </div>
                  <span>Manage Users</span>
                </Button>
              </CardContent>
            </Card>

            {/* Recent Activity */}
            <Card className="border-none shadow-md bg-white/80 backdrop-blur-md">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Activity className="h-5 w-5 text-purple-600" />
                  Recent End-User Signups
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {stats.recentUsers.length > 0 ? (
                    stats.recentUsers.map((user) => (
                      <div key={user._id} className="flex items-start gap-4 pb-4 border-b last:border-0 last:pb-0">
                        <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-bold">
                          {user.username.charAt(0).toUpperCase()}
                        </div>
                        <div className="flex-1">
                          <p className="font-semibold">{user.username}</p>
                          <p className="text-sm text-muted-foreground">Signed up via {user.projectId.name}</p>
                          <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            {formatDistanceToNow(new Date(user.createdAt), { addSuffix: true })}
                          </p>
                        </div>
                        <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-100">
                          {user.email}
                        </Badge>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-12 text-muted-foreground">
                      <Activity className="h-12 w-12 mx-auto mb-4 opacity-30" />
                      <p className="text-lg font-medium">No end-users yet</p>
                      <p>When users sign up via your SDK, they will appear here.</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Getting Started Guide */}
            <Card className="border-blue-200 bg-blue-50 shadow-inner">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-blue-900">
                  <Zap className="h-5 w-5 text-blue-600" />
                  Getting Started
                </CardTitle>
                <CardDescription className="text-blue-700">
                  Follow these steps to integrate AuthSphere into your app
                </CardDescription>
              </CardHeader>
              <CardContent className="grid md:grid-cols-2 gap-4">
                <div className="flex items-start gap-4 p-4 bg-white rounded-xl shadow-sm">
                  <div className="h-8 w-8 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold">1</div>
                  <div>
                    <p className="font-semibold">Create Project</p>
                    <p className="text-sm text-muted-foreground">Set up your app's callback URIs and providers.</p>
                  </div>
                </div>
                <div className="flex items-start gap-4 p-4 bg-white rounded-xl shadow-sm">
                  <div className="h-8 w-8 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold">2</div>
                  <div>
                    <p className="font-semibold">Get API Keys</p>
                    <p className="text-sm text-muted-foreground">Grab your Public and Private keys from project page.</p>
                  </div>
                </div>
                <div className="flex items-start gap-4 p-4 bg-white rounded-xl shadow-sm">
                  <div className="h-8 w-8 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold">3</div>
                  <div>
                    <p className="font-semibold">Install SDK</p>
                    <p className="text-sm text-muted-foreground">npm install @authsphere/sdk in your frontend.</p>
                  </div>
                </div>
                <div className="flex items-start gap-4 p-4 bg-white rounded-xl shadow-sm">
                  <div className="h-8 w-8 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold">4</div>
                  <div>
                    <p className="font-semibold">Go Live</p>
                    <p className="text-sm text-muted-foreground">Start authenticating and managing your users.</p>
                  </div>
                </div>
              </CardContent>
            </Card>

          </TabsContent>

          {/* PROJECTS TAB */}
          <TabsContent value="projects" className="animate-in fade-in slide-in-from-bottom-4 duration-300">
            <ProjectList />
          </TabsContent>

          {/* USERS TAB */}
          <TabsContent value="users" className="animate-in fade-in slide-in-from-bottom-4 duration-300">
            <Card className="border-none shadow-md bg-white/80 backdrop-blur-md">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5 text-green-600" />
                  All Project Users
                </CardTitle>
                <CardDescription>
                  A complete list of users who have signed up across all your projects
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {stats.recentUsers.length > 0 ? (
                    <div className="overflow-x-auto">
                      <table className="w-full text-left border-collapse">
                        <thead>
                          <tr className="border-b text-sm text-muted-foreground">
                            <th className="pb-3 px-2 font-medium">Username</th>
                            <th className="pb-3 px-2 font-medium">Email</th>
                            <th className="pb-3 px-2 font-medium">Project</th>
                            <th className="pb-3 px-2 font-medium text-right">Signed Up</th>
                          </tr>
                        </thead>
                        <tbody>
                          {stats.recentUsers.map((user) => (
                            <tr key={user._id} className="border-b last:border-0 hover:bg-slate-50 transition-colors">
                              <td className="py-4 px-2 font-medium">{user.username}</td>
                              <td className="py-4 px-2 text-sm text-muted-foreground">{user.email}</td>
                              <td className="py-4 px-2">
                                <Badge variant="secondary" className="font-normal">
                                  {user.projectId.name}
                                </Badge>
                              </td>
                              <td className="py-4 px-2 text-right text-sm text-muted-foreground">
                                {format(new Date(user.createdAt), "MMM d, yyyy")}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  ) : (
                    <div className="text-center py-20 text-muted-foreground border-2 border-dashed rounded-2xl border-slate-200">
                      <Users className="h-16 w-16 mx-auto mb-4 opacity-20" />
                      <h3 className="text-xl font-semibold text-slate-900">No users authenticated yet</h3>
                      <p className="mt-2 max-w-xs mx-auto">
                        Once you integrate our SDK, users who sign up will appear here with their details.
                      </p>
                      <Button className="mt-6" variant="outline" onClick={() => navigate('/docs')}>
                        Integration Guide
                      </Button>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* ACTIVITY TAB */}
          <TabsContent value="activity" className="animate-in fade-in slide-in-from-bottom-4 duration-300">
            <Card className="border-none shadow-md bg-white/80 backdrop-blur-md">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-orange-600" />
                  Analytics & Logs
                </CardTitle>
                <CardDescription>
                  Real-time authentication activity across your infrastructure
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-20 bg-slate-50 rounded-2xl border border-slate-100">
                  <Activity className="h-16 w-16 mx-auto mb-4 text-slate-300 animate-pulse" />
                  <h3 className="text-xl font-semibold mb-2">Live Logs Coming Soon</h3>
                  <p className="text-muted-foreground max-w-xs mx-auto">
                    We're building a powerful event stream to help you debug and monitor your auth in real-time.
                  </p>
                </div>
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
            fetchStats(); // Refresh stats
            setActiveTab('projects'); // Switch to projects tab
          }}
        />

      </div>
    </div>
  );
};

export default Dashboard;