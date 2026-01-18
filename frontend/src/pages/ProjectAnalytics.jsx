import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import {
    getAnalyticsOverview,
    getAnalyticsCharts,
    getRecentActivity
} from "../api/AnalyticsAPI";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle
} from "@/components/ui/card";
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    PieChart,
    Pie,
    Cell,
    BarChart,
    Bar,
    Legend
} from "recharts";
import {
    Users,
    UserPlus,
    LogIn,
    ArrowUpRight,
    ArrowDownRight,
    Calendar,
    Clock,
    ExternalLink,
    ChevronLeft,
    Activity,
    Globe,
    Smartphone
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { formatDistanceToNow } from "date-fns";

const COLORS = ["#6366f1", "#8b5cf6", "#ec4899", "#f59e0b", "#10b981", "#3b82f6"];

const StatsCard = ({ title, value, trend, icon: Icon, description }) => (
    <Card className="overflow-hidden">
        <CardContent className="p-6">
            <div className="flex items-center justify-between">
                <div>
                    <p className="text-sm font-medium text-muted-foreground mb-1">{title}</p>
                    <div className="flex items-baseline gap-2">
                        <h3 className="text-2xl font-bold tracking-tight">{value}</h3>
                        {trend && (
                            <span className={`text-xs font-medium flex items-center ${trend.startsWith('+') ? 'text-emerald-600' : 'text-rose-600'}`}>
                                {trend.startsWith('+') ? <ArrowUpRight className="h-3 w-3 mr-0.5" /> : <ArrowDownRight className="h-3 w-3 mr-0.5" />}
                                {trend.replace('+', '').replace('-', '')}
                            </span>
                        )}
                    </div>
                    {description && <p className="text-xs text-muted-foreground mt-1">{description}</p>}
                </div>
                <div className="h-12 w-12 rounded-2xl bg-primary/5 flex items-center justify-center text-primary">
                    <Icon className="h-6 w-6" />
                </div>
            </div>
        </CardContent>
    </Card>
);

const ProjectAnalytics = () => {
    const { projectId } = useParams();
    const [loading, setLoading] = useState(true);
    const [overview, setOverview] = useState(null);
    const [charts, setCharts] = useState(null);
    const [activity, setActivity] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                const [overviewRes, chartsRes, activityRes] = await Promise.all([
                    getAnalyticsOverview(projectId),
                    getAnalyticsCharts(projectId),
                    getRecentActivity(projectId)
                ]);

                if (overviewRes.success) setOverview(overviewRes.data);
                if (chartsRes.success) setCharts(chartsRes.data);
                if (activityRes.success) setActivity(activityRes.data);
            } catch (error) {
                console.error("Error fetching analytics:", error);
                toast.error("Failed to load analytics data");
            } finally {
                setLoading(false);
            }
        };

        if (projectId) fetchData();
    }, [projectId]);

    if (loading) {
        return (
            <div className="container mx-auto py-8 px-4 space-y-8 animate-pulse text-slate-100 italic">
                Loading analytics...
            </div>
        );
    }

    const providerData = charts?.providerDistribution
        ? Object.entries(charts.providerDistribution).map(([name, value]) => ({ name, value }))
        : [];

    return (
        <div className="container mx-auto py-8 px-4 max-w-7xl animate-in fade-in duration-500">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                <div>
                    <Link
                        to={`/dashboard`}
                        className="flex items-center text-sm text-muted-foreground hover:text-primary transition-colors mb-2"
                    >
                        <ChevronLeft className="h-4 w-4 mr-1" /> Back to Dashboard
                    </Link>
                    <h1 className="text-3xl font-extrabold tracking-tight text-slate-950 flex items-center gap-2">
                        <Activity className="h-8 w-8 text-indigo-600" />
                        Project Analytics
                    </h1>
                    <p className="text-muted-foreground mt-1">Real-time insights and usage metrics for your project.</p>
                </div>

                <div className="flex gap-2">
                    <Button variant="outline" size="sm" className="hidden sm:flex">
                        <Calendar className="h-4 w-4 mr-2" />
                        Last 30 Days
                    </Button>
                    <Button size="sm" className="bg-slate-950 hover:bg-indigo-600 shadow-lg shadow-indigo-100">
                        Export Report
                    </Button>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                <StatsCard
                    title="Total Signups"
                    value={overview?.signups?.month || 0}
                    trend={overview?.signups?.trend}
                    icon={UserPlus}
                    description="New users this month"
                />
                <StatsCard
                    title="Daily Logins"
                    value={overview?.logins?.today || 0}
                    trend={overview?.logins?.trend}
                    icon={LogIn}
                    description="Logins in the last 24h"
                />
                <StatsCard
                    title="Monthly Active"
                    value={overview?.activeUsers?.mau || 0}
                    icon={Users}
                    description="Unique users active this month"
                />
                <StatsCard
                    title="Growth Rate"
                    value="+14.2%"
                    trend="+2.1%"
                    icon={Activity}
                    description="Signup growth vs last period"
                />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
                {/* Main Chart */}
                <Card className="lg:col-span-2">
                    <CardHeader>
                        <CardTitle>Signup Trends</CardTitle>
                        <CardDescription>Daily signup volume across the last 30 days</CardDescription>
                    </CardHeader>
                    <CardContent className="h-[350px] pt-4">
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={charts?.dailySignups || []}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                <XAxis
                                    dataKey="date"
                                    axisLine={false}
                                    tickLine={false}
                                    tick={{ fontSize: 12, fill: '#94a3b8' }}
                                    tickFormatter={(val) => val.split('-').slice(1).join('/')}
                                />
                                <YAxis
                                    axisLine={false}
                                    tickLine={false}
                                    tick={{ fontSize: 12, fill: '#94a3b8' }}
                                />
                                <Tooltip
                                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                                />
                                <Line
                                    type="monotone"
                                    dataKey="count"
                                    stroke="#6366f1"
                                    strokeWidth={3}
                                    dot={{ r: 4, fill: '#6366f1', strokeWidth: 2, stroke: '#fff' }}
                                    activeDot={{ r: 6, strokeWidth: 0 }}
                                />
                            </LineChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>

                {/* Provider Breakdown */}
                <Card>
                    <CardHeader>
                        <CardTitle>Auth Providers</CardTitle>
                        <CardDescription>Distribution of login methods</CardDescription>
                    </CardHeader>
                    <CardContent className="h-[350px] flex flex-col items-center justify-center">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={providerData}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={60}
                                    outerRadius={100}
                                    paddingAngle={5}
                                    dataKey="value"
                                >
                                    {providerData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip />
                                <Legend layout="horizontal" verticalAlign="bottom" align="center" />
                            </PieChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Recent Activity Feed */}
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between">
                        <div>
                            <CardTitle>Recent Logins</CardTitle>
                            <CardDescription>Latest authentication events</CardDescription>
                        </div>
                        <Button variant="ghost" size="sm" className="text-indigo-600 font-bold hover:bg-indigo-50">View All</Button>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {activity?.recentLogins?.length > 0 ? (
                                activity.recentLogins.map((login, i) => (
                                    <div key={i} className="flex items-center justify-between group">
                                        <div className="flex items-center gap-3">
                                            {login.picture ? (
                                                <img src={login.picture} alt="" className="h-10 w-10 rounded-full object-cover" />
                                            ) : (
                                                <div className="h-10 w-10 rounded-full bg-slate-100 flex items-center justify-center font-bold text-slate-600">
                                                    {login.user[0].toUpperCase()}
                                                </div>
                                            )}
                                            <div>
                                                <p className="text-sm font-bold text-slate-900 group-hover:text-indigo-600 transition-colors uppercase">{login.user}</p>
                                                <p className="text-xs text-muted-foreground lowercase">{login.email}</p>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-xs font-medium text-slate-900">{formatDistanceToNow(new Date(login.timestamp))} ago</p>
                                            <Badge variant="secondary" className="text-[10px] bg-slate-50 text-slate-400 font-mono py-0">{login.device?.split(' ')[0] || 'Desktop'}</Badge>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="py-8 text-center text-muted-foreground">No recent login activity found.</div>
                            )}
                        </div>
                    </CardContent>
                </Card>

                {/* Breakdown Card */}
                <Card>
                    <CardHeader>
                        <CardTitle>Metric Breakdown</CardTitle>
                        <CardDescription>Secondary insights for your project</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-6">
                            <div className="flex items-center justify-between border-b pb-4">
                                <div className="flex items-center gap-3 font-semibold">
                                    <Globe className="h-5 w-5 text-blue-500" />
                                    Top Region
                                </div>
                                <div className="text-right">
                                    <p className="font-bold">United States</p>
                                    <p className="text-xs text-muted-foreground">34% of traffic</p>
                                </div>
                            </div>
                            <div className="flex items-center justify-between border-b pb-4">
                                <div className="flex items-center gap-3 font-semibold">
                                    <Smartphone className="h-5 w-5 text-emerald-500" />
                                    Device Mix
                                </div>
                                <div className="text-right">
                                    <p className="font-bold">72% Mobile</p>
                                    <p className="text-xs text-muted-foreground">Mainly iOS/Safari</p>
                                </div>
                            </div>
                            <div className="flex items-center justify-between border-b pb-4">
                                <div className="flex items-center gap-3 font-semibold">
                                    <Clock className="h-5 w-5 text-amber-500" />
                                    Peak Usage
                                </div>
                                <div className="text-right">
                                    <p className="font-bold">18:00 - 22:00</p>
                                    <p className="text-xs text-muted-foreground">UTC-time</p>
                                </div>
                            </div>
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3 font-semibold">
                                    <ExternalLink className="h-5 w-5 text-indigo-500" />
                                    API Health
                                </div>
                                <div className="text-right">
                                    <p className="font-bold text-emerald-600">99.98%</p>
                                    <p className="text-xs text-muted-foreground">Everything active</p>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};

export default ProjectAnalytics;
