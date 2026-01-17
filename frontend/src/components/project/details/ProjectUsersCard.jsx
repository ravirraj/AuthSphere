
import { useEffect, useState } from "react";
import { getProjectUsers } from "@/api/ProjectAPI";
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
    CardDescription
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Users, Loader2 } from "lucide-react";
import { format } from "date-fns";

const ProjectUsersCard = ({ projectId }) => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const res = await getProjectUsers(projectId);
                if (res.success) {
                    setUsers(res.data);
                }
            } catch (error) {
                console.error("Failed to fetch users", error);
            } finally {
                setLoading(false);
            }
        };

        if (projectId) {
            fetchUsers();
        }
    }, [projectId]);

    if (loading) {
        return (
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Users className="h-5 w-5" />
                        End Users
                    </CardTitle>
                    <CardDescription>Accounts created for this project</CardDescription>
                </CardHeader>
                <CardContent className="flex justify-center py-6">
                    <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                </CardContent>
            </Card>
        );
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2 text-xl">
                    <Users className="h-5 w-5" />
                    End Users
                    <Badge variant="secondary" className="ml-auto">
                        {users.length} Total
                    </Badge>
                </CardTitle>
                <CardDescription>
                    Users who have authenticated with your app
                </CardDescription>
            </CardHeader>
            <CardContent>
                {users.length === 0 ? (
                    <div className="text-center py-8 text-muted-foreground bg-slate-50 rounded-lg border border-dashed">
                        <p>No users found for this project yet.</p>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {users.map((user) => (
                            <div
                                key={user._id}
                                className="flex items-center justify-between p-3 border rounded-lg bg-card hover:bg-slate-50 transition-colors"
                            >
                                <div className="flex items-center gap-3">
                                    <Avatar>
                                        <AvatarImage src={`https://api.dicebear.com/7.x/initials/svg?seed=${user.username}`} />
                                        <AvatarFallback>{user.username.substring(0, 2).toUpperCase()}</AvatarFallback>
                                    </Avatar>
                                    <div>
                                        <p className="font-medium leading-none">{user.username}</p>
                                        <p className="text-sm text-muted-foreground">{user.email}</p>
                                    </div>
                                </div>
                                <div className="text-right text-xs text-muted-foreground">
                                    <p>Joined</p>
                                    <p>{format(new Date(user.createdAt), "MMM d, yyyy")}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </CardContent>
        </Card>
    );
};

export default ProjectUsersCard;
