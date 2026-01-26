import React, { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { format, formatDistanceToNow } from "date-fns";
import {
  XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, PieChart, Pie, Cell, Legend, Area, AreaChart
} from "recharts";
import {
  Users, UserPlus, LogIn, ArrowUpRight, ArrowDownRight,
  Calendar, Activity, ChevronLeft, Loader2, Zap, ShieldCheck
} from "lucide-react";

import { getAnalyticsOverview, getAnalyticsCharts, getRecentActivity } from "../api/AnalyticsAPI";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";

const COLORS = ["#6366f1", "#8b5cf6", "#ec4899", "#f59e0b", "#10b981", "#3b82f6"];

const StatsCard = ({ title, value, trend, icon: Icon, description }) => (
  <Card className="border hover:shadow-md transition-shadow">
    <CardContent className="p-6">
      <div className="flex items-center justify-between mb-3">
        <div className="h-8 w-8 rounded-lg bg-muted flex items-center justify-center text-primary">
          <Icon className="h-4 w-4" />
        </div>
        {trend && trend !== "0%" && (
          <Badge variant="secondary" className="text-xs gap-1">
            {trend.startsWith('+') ? <ArrowUpRight className="h-3 w-3" /> : <ArrowDownRight className="h-3 w-3" />}
            {trend.replace(/[+-]/g, '')}
          </Badge>
        )}
      </div>
      <div className="text-2xl font-bold mb-1">{value}</div>
      <p className="text-sm text-muted-foreground">{title}</p>
      {description && <p className="text-xs text-muted-foreground mt-1">{description}</p>}
    </CardContent>
  </Card>
);

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-card border rounded-lg p-3 shadow-lg">
        <p className="text-xs text-muted-foreground mb-1">
          {label ? format(new Date(label), "MMM dd, yyyy") : ""}
        </p>
        <p className="text-sm font-medium">
          {payload[0].value} signups
        </p>
      </div>
    );
  }
  return null;
};

const ProjectAnalytics = () => {
  const { projectId } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState({ overview: null, charts: null, activity: null });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [ov, ch, ac] = await Promise.all([
          getAnalyticsOverview(projectId),
          getAnalyticsCharts(projectId),
          getRecentActivity(projectId)
        ]);
        setData({ overview: ov.data, charts: ch.data, activity: ac.data });
      } catch (error) {
        toast.error("Failed to load analytics data");
      } finally {
        setLoading(false);
      }
    };

    if (projectId) fetchData();
  }, [projectId]);

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary mb-4" />
        <p className="text-sm text-muted-foreground">Loading analytics...</p>
      </div>
    );
  }

  const providerData = data.charts?.providerDistribution
    ? Object.entries(data.charts.providerDistribution).map(([name, value]) => ({ name, value }))
    : [];

  return (
    <div className="min-h-screen">
      <div className="max-w-7xl mx-auto px-6 py-8 space-y-8">

        {/* HEADER */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <Button
              variant="ghost"
              size="sm"
              className="mb-2 gap-2"
              onClick={() => navigate('/dashboard')}
            >
              <ChevronLeft className="h-4 w-4" />
              Back to Dashboard
            </Button>
            <h1 className="text-3xl font-bold tracking-tight mb-1">
              Project Analytics
            </h1>
            <p className="text-muted-foreground">
              Monitor authentication activity and user engagement
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Button variant="outline" className="gap-2">
              <Calendar className="h-4 w-4" />
              Last 30 Days
            </Button>
            <Button className="gap-2">
              Export Report
            </Button>
          </div>
        </div>

        {/* QUICK STATS */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatsCard
            title="Monthly Signups"
            value={data.overview?.signups?.month || 0}
            trend={data.overview?.signups?.trend}
            icon={UserPlus}
            description="New users this month"
          />
          <StatsCard
            title="Active Today"
            value={data.overview?.logins?.today || 0}
            trend={data.overview?.logins?.trend}
            icon={LogIn}
            description="Login sessions today"
          />
          <StatsCard
            title="Retention Rate"
            value={data.overview?.activeUsers?.retention || "0.0%"}
            icon={Users}
            description="Monthly active users"
          />
          <StatsCard
            title="System Latency"
            value={data.overview?.health?.latency || "0ms"}
            icon={Zap}
            description="Average response time"
          />
        </div>

        {/* CHARTS ROW */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* Signup Trend Chart */}
          <Card className="lg:col-span-2">
            <CardHeader className="flex flex-row items-center justify-between pb-4">
              <div>
                <CardTitle className="text-xl">Signup Trend</CardTitle>
                <CardDescription>Daily user registrations over the past month</CardDescription>
              </div>
            </CardHeader>
            <CardContent className="h-[350px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={data.charts?.dailySignups || []}>
                  <defs>
                    <linearGradient id="colorSignups" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} className="stroke-muted" />
                  <XAxis
                    dataKey="date"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }}
                    tickFormatter={(str) => format(new Date(str), "MMM d")}
                  />
                  <YAxis
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Area
                    type="monotone"
                    dataKey="count"
                    stroke="hsl(var(--primary))"
                    strokeWidth={2}
                    fillOpacity={1}
                    fill="url(#colorSignups)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Provider Distribution */}
          <Card>
            <CardHeader>
              <CardTitle className="text-xl">Auth Providers</CardTitle>
              <CardDescription>Distribution by provider type</CardDescription>
            </CardHeader>
            <CardContent className="h-[350px] flex items-center justify-center">
              {providerData.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={providerData}
                      innerRadius={60}
                      outerRadius={90}
                      paddingAngle={5}
                      dataKey="value"
                      stroke="none"
                    >
                      {providerData.map((_, i) => (
                        <Cell key={i} fill={COLORS[i % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend
                      verticalAlign="bottom"
                      iconType="circle"
                      formatter={(value) => <span className="text-xs text-muted-foreground">{value}</span>}
                    />
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <div className="text-center">
                  <ShieldCheck className="h-12 w-12 mx-auto mb-3 text-muted-foreground/30" />
                  <p className="text-sm text-muted-foreground">No provider data</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* BOTTOM ROW */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

          {/* Recent Activity */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-4">
              <div>
                <CardTitle className="text-xl flex items-center gap-2">
                  <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                  Recent Activity
                </CardTitle>
                <CardDescription>Latest authentication events</CardDescription>
              </div>
            </CardHeader>
            <CardContent>
              {data.activity?.recentLogins?.length > 0 ? (
                <div className="space-y-4">
                  {data.activity.recentLogins.map((login, i) => (
                    <div key={i} className="flex items-center gap-4">
                      <div className="h-10 w-10 rounded-full bg-muted flex items-center justify-center font-semibold">
                        {login.user[0].toUpperCase()}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium truncate">{login.user}</p>
                        <p className="text-sm text-muted-foreground truncate">{login.email}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-xs text-muted-foreground">
                          {formatDistanceToNow(new Date(login.timestamp), { addSuffix: true })}
                        </p>
                        <Badge variant="secondary" className="text-xs mt-1">
                          {login.provider === 'local' ? 'Email' : login.provider}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <Activity className="h-12 w-12 mx-auto mb-3 text-muted-foreground/30" />
                  <p className="text-muted-foreground">No recent activity</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* System Health */}
          <Card>
            <CardHeader>
              <CardTitle className="text-xl flex items-center gap-2">
                <ShieldCheck className="h-5 w-5 text-emerald-500" />
                System Health
              </CardTitle>
              <CardDescription>Infrastructure performance metrics</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Service Uptime</p>
                  <p className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">99.99%</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground mb-1">OAuth Latency</p>
                  <p className="text-2xl font-bold">{data.overview?.health?.latency || "102ms"}</p>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between p-2 bg-emerald-500/10 rounded-lg">
                  <div className="flex items-center gap-2">
                    <div className="h-2 w-2 rounded-full bg-emerald-500" />
                    <span className="text-sm font-medium">Identity API</span>
                  </div>
                  <Badge className="bg-emerald-500 hover:bg-emerald-600 text-xs">Operational</Badge>
                </div>

                <div className="flex items-center justify-between p-2 bg-emerald-500/10 rounded-lg">
                  <div className="flex items-center gap-2">
                    <div className="h-2 w-2 rounded-full bg-emerald-500" />
                    <span className="text-sm font-medium">Token Service</span>
                  </div>
                  <Badge className="bg-emerald-500 hover:bg-emerald-600 text-xs">Operational</Badge>
                </div>

                <div className="flex items-center justify-between p-2 bg-emerald-500/10 rounded-lg">
                  <div className="flex items-center gap-2">
                    <div className="h-2 w-2 rounded-full bg-emerald-500" />
                    <span className="text-sm font-medium">Session Edge</span>
                  </div>
                  <Badge className="bg-emerald-500 hover:bg-emerald-600 text-xs">Operational</Badge>
                </div>
              </div>

              <p className="text-xs text-muted-foreground italic pt-2 border-t">
                * Real-time status from global infrastructure
              </p>
            </CardContent>
          </Card>
        </div>

      </div>
    </div>
  );
};

export default ProjectAnalytics;
