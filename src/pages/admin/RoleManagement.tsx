import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, Shield, UserCog, Users, Crown, Building, Loader2, Save, RefreshCw } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

type AppRole = "admin" | "moderator" | "user" | "reseller";

interface UserWithRole {
  id: string;
  user_id: string;
  email: string;
  full_name: string | null;
  role: AppRole;
  created_at: string;
}

const RoleManagement = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [pendingChanges, setPendingChanges] = useState<Record<string, AppRole>>({});
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch users with their roles
  const { data: users = [], isLoading, refetch } = useQuery({
    queryKey: ["users-with-roles"],
    queryFn: async () => {
      // First get all profiles
      const { data: profiles, error: profilesError } = await supabase
        .from("profiles")
        .select("*")
        .order("created_at", { ascending: false });

      if (profilesError) throw profilesError;

      // Then get all user roles
      const { data: roles, error: rolesError } = await supabase
        .from("user_roles")
        .select("*");

      if (rolesError) throw rolesError;

      // Create a map of user_id to role
      const roleMap = new Map(roles?.map(r => [r.user_id, r.role]) || []);

      // Combine profiles with roles
      const usersWithRoles: UserWithRole[] = (profiles || []).map(profile => ({
        id: profile.id,
        user_id: profile.user_id,
        email: profile.user_id, // We'll use user_id as placeholder since we can't access auth.users
        full_name: profile.full_name,
        role: (roleMap.get(profile.user_id) as AppRole) || "user",
        created_at: profile.created_at,
      }));

      return usersWithRoles;
    },
  });

  // Update role mutation
  const updateRoleMutation = useMutation({
    mutationFn: async ({ userId, newRole }: { userId: string; newRole: AppRole }) => {
      const { error } = await supabase
        .from("user_roles")
        .upsert({ user_id: userId, role: newRole }, { onConflict: "user_id" });

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users-with-roles"] });
      toast({
        title: "Role Updated",
        description: "User role has been updated successfully.",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const handleRoleChange = (userId: string, newRole: AppRole) => {
    setPendingChanges(prev => ({ ...prev, [userId]: newRole }));
  };

  const saveRoleChange = async (userId: string) => {
    const newRole = pendingChanges[userId];
    if (!newRole) return;

    await updateRoleMutation.mutateAsync({ userId, newRole });
    setPendingChanges(prev => {
      const updated = { ...prev };
      delete updated[userId];
      return updated;
    });
  };

  const filteredUsers = users.filter(user =>
    user.full_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.user_id.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getRoleBadgeStyle = (role: AppRole) => {
    switch (role) {
      case "admin":
        return "bg-red-500/10 text-red-500 border-red-500/20";
      case "reseller":
        return "bg-purple-500/10 text-purple-500 border-purple-500/20";
      case "moderator":
        return "bg-blue-500/10 text-blue-500 border-blue-500/20";
      default:
        return "bg-green-500/10 text-green-500 border-green-500/20";
    }
  };

  const getRoleIcon = (role: AppRole) => {
    switch (role) {
      case "admin":
        return <Crown className="h-3 w-3" />;
      case "reseller":
        return <Building className="h-3 w-3" />;
      case "moderator":
        return <Shield className="h-3 w-3" />;
      default:
        return <Users className="h-3 w-3" />;
    }
  };

  // Stats
  const stats = {
    total: users.length,
    admins: users.filter(u => u.role === "admin").length,
    resellers: users.filter(u => u.role === "reseller").length,
    users: users.filter(u => u.role === "user").length,
  };

  return (
    <div className="space-y-6 md:space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold mb-2 flex items-center gap-2">
            <UserCog className="h-8 w-8 text-primary" />
            Role Management
          </h1>
          <p className="text-sm md:text-base text-muted-foreground">
            Assign and manage user roles across the platform
          </p>
        </div>
        <Button onClick={() => refetch()} variant="outline" className="gap-2">
          <RefreshCw className="h-4 w-4" />
          Refresh
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 md:gap-6">
        <Card>
          <CardContent className="p-4 md:p-6">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-primary/10">
                <Users className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold">{stats.total}</p>
                <p className="text-xs text-muted-foreground">Total Users</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 md:p-6">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-red-500/10">
                <Crown className="h-5 w-5 text-red-500" />
              </div>
              <div>
                <p className="text-2xl font-bold">{stats.admins}</p>
                <p className="text-xs text-muted-foreground">Admins</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 md:p-6">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-purple-500/10">
                <Building className="h-5 w-5 text-purple-500" />
              </div>
              <div>
                <p className="text-2xl font-bold">{stats.resellers}</p>
                <p className="text-xs text-muted-foreground">Resellers</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 md:p-6">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-green-500/10">
                <Users className="h-5 w-5 text-green-500" />
              </div>
              <div>
                <p className="text-2xl font-bold">{stats.users}</p>
                <p className="text-xs text-muted-foreground">Regular Users</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Users Table */}
      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <CardTitle className="text-lg md:text-xl">User Roles</CardTitle>
              <CardDescription>Change user roles using the dropdown selector</CardDescription>
            </div>
            <div className="relative w-full sm:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search users..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 w-full"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : filteredUsers.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              <Users className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No users found</p>
            </div>
          ) : (
            <div className="overflow-x-auto -mx-4 sm:mx-0">
              <div className="inline-block min-w-full align-middle">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>User</TableHead>
                      <TableHead>Current Role</TableHead>
                      <TableHead>New Role</TableHead>
                      <TableHead>Joined</TableHead>
                      <TableHead className="w-[100px]">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredUsers.map((user) => {
                      const hasPendingChange = pendingChanges[user.user_id] !== undefined;
                      const displayRole = pendingChanges[user.user_id] || user.role;

                      return (
                        <TableRow key={user.id}>
                          <TableCell>
                            <div>
                              <p className="font-medium">{user.full_name || "Unnamed User"}</p>
                              <p className="text-xs text-muted-foreground truncate max-w-[200px]">
                                {user.user_id}
                              </p>
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge 
                              variant="outline" 
                              className={`${getRoleBadgeStyle(user.role)} gap-1`}
                            >
                              {getRoleIcon(user.role)}
                              {user.role}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <Select
                              value={displayRole}
                              onValueChange={(value: AppRole) => handleRoleChange(user.user_id, value)}
                            >
                              <SelectTrigger className="w-[140px]">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="user">
                                  <div className="flex items-center gap-2">
                                    <Users className="h-3 w-3" />
                                    User
                                  </div>
                                </SelectItem>
                                <SelectItem value="reseller">
                                  <div className="flex items-center gap-2">
                                    <Building className="h-3 w-3" />
                                    Reseller
                                  </div>
                                </SelectItem>
                                <SelectItem value="moderator">
                                  <div className="flex items-center gap-2">
                                    <Shield className="h-3 w-3" />
                                    Moderator
                                  </div>
                                </SelectItem>
                                <SelectItem value="admin">
                                  <div className="flex items-center gap-2">
                                    <Crown className="h-3 w-3" />
                                    Admin
                                  </div>
                                </SelectItem>
                              </SelectContent>
                            </Select>
                          </TableCell>
                          <TableCell className="text-sm text-muted-foreground">
                            {new Date(user.created_at).toLocaleDateString()}
                          </TableCell>
                          <TableCell>
                            {hasPendingChange && (
                              <Button
                                size="sm"
                                onClick={() => saveRoleChange(user.user_id)}
                                disabled={updateRoleMutation.isPending}
                                className="gap-1"
                              >
                                {updateRoleMutation.isPending ? (
                                  <Loader2 className="h-3 w-3 animate-spin" />
                                ) : (
                                  <Save className="h-3 w-3" />
                                )}
                                Save
                              </Button>
                            )}
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Role Descriptions */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="border-green-500/20">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <Users className="h-4 w-4 text-green-500" />
              <span className="font-medium">User</span>
            </div>
            <p className="text-xs text-muted-foreground">
              Standard user access. Can manage their own hosting, domains, and services.
            </p>
          </CardContent>
        </Card>

        <Card className="border-purple-500/20">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <Building className="h-4 w-4 text-purple-500" />
              <span className="font-medium">Reseller</span>
            </div>
            <p className="text-xs text-muted-foreground">
              Can white-label services and manage clients. Earns commission on sales.
            </p>
          </CardContent>
        </Card>

        <Card className="border-blue-500/20">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <Shield className="h-4 w-4 text-blue-500" />
              <span className="font-medium">Moderator</span>
            </div>
            <p className="text-xs text-muted-foreground">
              Can assist with support tickets and moderate user content.
            </p>
          </CardContent>
        </Card>

        <Card className="border-red-500/20">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <Crown className="h-4 w-4 text-red-500" />
              <span className="font-medium">Admin</span>
            </div>
            <p className="text-xs text-muted-foreground">
              Full platform access. Can manage all users, services, and settings.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default RoleManagement;