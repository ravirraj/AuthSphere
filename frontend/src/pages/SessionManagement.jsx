import React, { useState, useEffect } from "react";
import {
    getSessions,
    revokeSession,
    revokeAllOtherSessions,
    revokeAllSessions
} from "../api/SessionAPI";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
    CardFooter
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
    Shield,
    Monitor,
    Smartphone,
    Tablet,
    Globe,
    Clock,
    MapPin,
    LogOut,
    Trash2,
    AlertTriangle,
    ChevronLeft,
    Key
} from "lucide-react";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { toast } from "sonner";
import { formatDistanceToNow } from "date-fns";
import { Link, useNavigate } from "react-router-dom";

const DeviceIcon = ({ device }) => {
    const d = device?.toLowerCase() || "";
    if (d.includes("mobile") || d.includes("phone")) return <Smartphone className="h-5 w-5" />;
    if (d.includes("tablet")) return <Tablet className="h-5 w-5" />;
    return <Monitor className="h-5 w-5" />;
};

const SessionCard = ({ session, onRevoke }) => (
    <Card className={`relative group transition-all duration-300 ${session.current ? 'border-indigo-500 shadow-md ring-1 ring-indigo-500/20' : 'hover:border-slate-300 shadow-sm'}`}>
        {session.current && (
            <Badge className="absolute top-4 right-4 bg-indigo-600 text-white font-bold text-[10px] rounded-full px-2">
                CURRENT SESSION
            </Badge>
        )}
        <CardContent className="p-6">
            <div className="flex items-start gap-4">
                <div className={`h-12 w-12 rounded-2xl flex items-center justify-center ${session.current ? 'bg-indigo-100 text-indigo-600' : 'bg-slate-100 text-slate-500'}`}>
                    <DeviceIcon device={session.deviceInfo?.device} />
                </div>
                <div className="flex-1 space-y-1">
                    <div className="flex items-center gap-2">
                        <h4 className="font-bold text-slate-900">
                            {session.deviceInfo?.os} • {session.deviceInfo?.browser}
                        </h4>
                    </div>
                    <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-muted-foreground font-medium">
                        <span className="flex items-center gap-1.5"><MapPin className="h-3 w-3" /> {session.location?.city || 'Unknown'}, {session.location?.country || 'Unknown'}</span>
                        <span className="flex items-center gap-1.5 text-slate-400"><Globe className="h-3 w-3" /> {session.ipAddress}</span>
                    </div>
                    <div className="pt-2 flex items-center gap-4 text-xs font-bold uppercase tracking-wider text-slate-400">
                        <span className="flex items-center gap-1"><Clock className="h-3 w-3" /> Started: {new Date(session.createdAt).toLocaleDateString()}</span>
                        <span className="flex items-center gap-1 text-indigo-500/70"><Activity className="h-3.5 w-3.5" /> Last active: {formatDistanceToNow(new Date(session.lastActive))} ago</span>
                    </div>
                </div>
                {!session.current && (
                    <AlertDialog>
                        <AlertDialogTrigger asChild>
                            <Button variant="ghost" size="icon" className="text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-full transition-all">
                                <Trash2 className="h-4 w-4" />
                            </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent className="rounded-2xl border-none shadow-2xl">
                            <AlertDialogHeader>
                                <AlertDialogTitle className="text-xl font-bold">Revoke Session?</AlertDialogTitle>
                                <AlertDialogDescription>
                                    This will immediately log out the developer from this device and OS.
                                </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                                <AlertDialogCancel className="rounded-xl font-bold border-slate-200">Cancel</AlertDialogCancel>
                                <AlertDialogAction
                                    onClick={() => onRevoke(session._id)}
                                    className="bg-rose-600 hover:bg-rose-700 text-white rounded-xl font-bold border-none"
                                >
                                    Revoke Now
                                </AlertDialogAction>
                            </AlertDialogFooter>
                        </AlertDialogContent>
                    </AlertDialog>
                )}
            </div>
        </CardContent>
    </Card>
);

const SessionManagement = () => {
    const [sessions, setSessions] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    const fetchSessions = async () => {
        try {
            setLoading(true);
            const res = await getSessions();
            if (res.success) setSessions(res.data);
        } catch (error) {
            toast.error("Failed to load active sessions");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchSessions();
    }, []);

    const handleRevoke = async (id) => {
        try {
            const res = await revokeSession(id);
            if (res.success) {
                toast.success("Session revoked");
                fetchSessions();
            }
        } catch (error) {
            toast.error("Failed to revoke session");
        }
    };

    const handleRevokeOthers = async () => {
        try {
            const res = await revokeAllOtherSessions();
            if (res.success) {
                toast.success("All other devices logged out");
                fetchSessions();
            }
        } catch (error) {
            toast.error("Failed to logout other devices");
        }
    };

    const handleRevokeAll = async () => {
        try {
            const res = await revokeAllSessions();
            if (res.success) {
                toast.success("All sessions logged out");
                // Redirect to login
                navigate("/login");
            }
        } catch (error) {
            toast.error("Failed to logout all devices");
        }
    };

    if (loading) {
        return (
            <div className="container mx-auto py-12 px-4 max-w-4xl text-center italic text-slate-100">
                Syncing your active sessions...
            </div>
        );
    }

    return (
        <div className="container mx-auto py-12 px-4 max-w-4xl animate-in fade-in duration-700">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
                <div>
                    <Link
                        to="/dashboard"
                        className="flex items-center text-sm text-muted-foreground hover:text-primary transition-colors mb-2 font-medium"
                    >
                        <ChevronLeft className="h-4 w-4 mr-1" /> Dashboard
                    </Link>
                    <h1 className="text-4xl font-extrabold tracking-tight text-slate-950 flex items-center gap-3">
                        <Shield className="h-8 w-8 text-indigo-600" />
                        Security & Sessions
                    </h1>
                    <p className="text-muted-foreground mt-2 font-medium">Manage and secure your active developer sessions across all devices.</p>
                </div>

                <div className="flex flex-wrap gap-3">
                    <AlertDialog>
                        <AlertDialogTrigger asChild>
                            <Button variant="outline" className="border-slate-200 hover:bg-slate-50 rounded-xl font-bold">
                                Logout Others
                            </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent className="rounded-2xl border-none shadow-2xl">
                            <AlertDialogHeader>
                                <AlertDialogTitle className="text-xl font-bold flex items-center gap-2">
                                    <AlertTriangle className="text-amber-500 h-6 w-6" />
                                    Logout other devices?
                                </AlertDialogTitle>
                                <AlertDialogDescription>
                                    This will end all sessions except for the one you are currently using. You will need to log in again on those devices.
                                </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                                <AlertDialogCancel className="rounded-xl font-bold border-slate-200">Go Back</AlertDialogCancel>
                                <AlertDialogAction onClick={handleRevokeOthers} className="bg-slate-950 hover:bg-slate-800 text-white rounded-xl font-bold border-none">
                                    Confirm Logout
                                </AlertDialogAction>
                            </AlertDialogFooter>
                        </AlertDialogContent>
                    </AlertDialog>

                    <AlertDialog>
                        <AlertDialogTrigger asChild>
                            <Button className="bg-rose-600 hover:bg-rose-700 text-white rounded-xl font-bold shadow-lg shadow-rose-100 border-none">
                                Logout All
                            </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent className="rounded-2xl border-none shadow-2xl">
                            <AlertDialogHeader>
                                <AlertDialogTitle className="text-xl font-bold flex items-center gap-2 text-rose-600">
                                    <LogOut className="h-6 w-6" />
                                    Total Logout
                                </AlertDialogTitle>
                                <AlertDialogDescription>
                                    Are you absolutely sure? This will end ALL active sessions, including the one you're currently using. You will be redirected to the login page.
                                </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                                <AlertDialogCancel className="rounded-xl font-bold border-slate-200">Cancel</AlertDialogCancel>
                                <AlertDialogAction onClick={handleRevokeAll} className="bg-rose-600 hover:bg-rose-700 text-white rounded-xl font-bold border-none">
                                    Log Out Everywhere
                                </AlertDialogAction>
                            </AlertDialogFooter>
                        </AlertDialogContent>
                    </AlertDialog>
                </div>
            </div>

            <div className="grid gap-6">
                <div className="flex items-center gap-3 px-2 mb-2">
                    <p className="text-xs font-black text-slate-400 uppercase tracking-[0.2em]">Active Sessions ({sessions.length})</p>
                    <div className="h-[1px] flex-1 bg-slate-100" />
                </div>

                {sessions.map((session) => (
                    <SessionCard
                        key={session._id}
                        session={session}
                        onRevoke={handleRevoke}
                    />
                ))}

                <Card className="bg-slate-50 border-dashed border-2 border-slate-200 shadow-none mt-10 overflow-hidden">
                    <CardHeader className="text-center pb-2">
                        <div className="h-10 w-10 rounded-full bg-slate-200 flex items-center justify-center mx-auto mb-4">
                            <Key className="h-5 w-5 text-slate-400" />
                        </div>
                        <CardTitle className="text-lg">Security Recommendations</CardTitle>
                    </CardHeader>
                    <CardContent className="text-center pb-6">
                        <p className="text-xs text-muted-foreground max-w-sm mx-auto leading-relaxed">
                            We recommend ending sessions you don't recognize. AuthSphere automatically expires sessions after 7 days of inactivity for your protection.
                        </p>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};

export default SessionManagement;
