import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Search, Cloud, Cpu, HardDrive, Activity, MoreVertical, Plus } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

const CloudManagement = () => {
  const [searchQuery, setSearchQuery] = useState("");

  const { data: cloudInstances, isLoading } = useQuery({
    queryKey: ["admin-cloud-instances"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("cloud_instances")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
  });

  const instances = cloudInstances ?? [];
  const filtered = instances.filter((i) =>
    i.name?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const totalCount = instances.length;
  const runningCount = instances.filter(i => i.status === "running").length;
  const totalVcpus = instances.reduce((sum, i) => sum + (i.vcpu || 0), 0);
  const totalDiskGB = instances.reduce((sum, i) => sum + (i.disk_gb || 0), 0);

  return (
    <div className="space-y-6 md:space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold mb-2 break-words">Cloud Management</h1>
          <p className="text-sm md:text-base text-muted-foreground break-words">Manage VMs and cloud resources</p>
        </div>
        <Button className="w-full sm:w-auto bg-accent hover:bg-accent/90 text-accent-foreground">
          <Plus className="mr-2 h-4 w-4 flex-shrink-0" />
          <span className="truncate">Create Resource</span>
        </Button>
      </div>

      {/* Cloud Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        <Card>
          <CardContent className="p-4 md:p-6">
            <p className="text-xs md:text-sm text-muted-foreground mb-1 truncate">Virtual Machines</p>
            {isLoading ? <Skeleton className="h-9 w-16" /> : <p className="text-2xl md:text-3xl font-bold truncate">{totalCount}</p>}
            <Badge variant="outline" className="mt-2 bg-green-500/10 text-green-500 border-green-500/20 text-xs whitespace-nowrap">
              {runningCount} Running
            </Badge>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 md:p-6">
            <p className="text-xs md:text-sm text-muted-foreground mb-1 truncate">Total vCPUs</p>
            {isLoading ? <Skeleton className="h-9 w-16" /> : <p className="text-2xl md:text-3xl font-bold truncate">{totalVcpus}</p>}
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 md:p-6">
            <p className="text-xs md:text-sm text-muted-foreground mb-1 truncate">Total Disk</p>
            {isLoading ? <Skeleton className="h-9 w-16" /> : <p className="text-2xl md:text-3xl font-bold truncate">{totalDiskGB} GB</p>}
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 md:p-6">
            <p className="text-xs md:text-sm text-muted-foreground mb-1 truncate">Monthly Cost</p>
            {isLoading ? <Skeleton className="h-9 w-16" /> : (
              <p className="text-2xl md:text-3xl font-bold truncate">
                ${instances.reduce((sum, i) => sum + (i.monthly_cost || 0), 0).toFixed(0)}
              </p>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Cloud Table */}
      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <CardTitle className="text-lg md:text-xl truncate">Cloud Instances</CardTitle>
            <div className="relative w-full sm:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground flex-shrink-0" />
              <Input
                placeholder="Search instances..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 w-full"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="space-y-3">
              {[1, 2, 3].map(i => <Skeleton key={i} className="h-12 w-full" />)}
            </div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-12">
              <Cloud className="h-10 w-10 mx-auto text-muted-foreground mb-3" />
              <p className="text-muted-foreground">{searchQuery ? "No instances match your search" : "No cloud instances yet"}</p>
            </div>
          ) : (
            <div className="overflow-x-auto -mx-4 sm:mx-0">
              <div className="inline-block min-w-full align-middle">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="whitespace-nowrap">Name</TableHead>
                      <TableHead className="whitespace-nowrap">CPU</TableHead>
                      <TableHead className="whitespace-nowrap">RAM</TableHead>
                      <TableHead className="whitespace-nowrap">Disk</TableHead>
                      <TableHead className="whitespace-nowrap">Region</TableHead>
                      <TableHead className="whitespace-nowrap">Status</TableHead>
                      <TableHead className="whitespace-nowrap">Cost/mo</TableHead>
                      <TableHead className="w-[50px]"></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filtered.map((vm) => (
                      <TableRow key={vm.id}>
                        <TableCell className="font-medium">
                          <div className="flex items-center gap-2">
                            <Cpu className="h-4 w-4 text-accent flex-shrink-0" />
                            <span className="truncate max-w-[120px] md:max-w-none">{vm.name}</span>
                          </div>
                        </TableCell>
                        <TableCell className="whitespace-nowrap text-sm">{vm.vcpu} vCPU</TableCell>
                        <TableCell className="whitespace-nowrap text-sm">{vm.ram_gb} GB</TableCell>
                        <TableCell className="whitespace-nowrap text-sm">{vm.disk_gb} GB</TableCell>
                        <TableCell className="whitespace-nowrap text-sm">{vm.region}</TableCell>
                        <TableCell>
                          <Badge
                            variant="outline"
                            className={`whitespace-nowrap ${
                              vm.status === "running"
                                ? "bg-green-500/10 text-green-500 border-green-500/20"
                                : "bg-muted/50 text-muted-foreground border-border"
                            }`}
                          >
                            {vm.status}
                          </Badge>
                        </TableCell>
                        <TableCell className="whitespace-nowrap font-medium">${vm.monthly_cost}</TableCell>
                        <TableCell>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon" className="h-8 w-8">
                                <MoreVertical className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="bg-popover">
                              <DropdownMenuItem><Activity className="mr-2 h-4 w-4" />View Metrics</DropdownMenuItem>
                              <DropdownMenuItem><HardDrive className="mr-2 h-4 w-4" />Manage Storage</DropdownMenuItem>
                              <DropdownMenuItem><Cloud className="mr-2 h-4 w-4" />Create Snapshot</DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default CloudManagement;
