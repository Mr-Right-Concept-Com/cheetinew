import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Search, Cloud, Cpu, HardDrive, Activity, MoreVertical, Plus } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const CloudManagement = () => {
  const [searchQuery, setSearchQuery] = useState("");

  const vms = [
    { id: 1, name: "web-server-01", user: "john@example.com", type: "Starlight VM", cpu: "4 vCPU", ram: "8GB", status: "running", region: "US-East" },
    { id: 2, name: "api-server-01", user: "sarah@example.com", type: "Starlight VM", cpu: "8 vCPU", ram: "16GB", status: "running", region: "EU-West" },
    { id: 3, name: "db-server-01", user: "mike@example.com", type: "Starlight VM", cpu: "16 vCPU", ram: "32GB", status: "stopped", region: "Asia-SE" },
  ];

  const volumes = [
    { id: 1, name: "storage-01", size: "500GB", type: "SSD", attached: "web-server-01", status: "attached" },
    { id: 2, name: "backup-vol-01", size: "1TB", type: "HDD", attached: "db-server-01", status: "attached" },
    { id: 3, name: "temp-storage", size: "250GB", type: "SSD", attached: "-", status: "available" },
  ];

  return (
    <div className="space-y-6 md:space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold mb-2 break-words">Cloud Management</h1>
          <p className="text-sm md:text-base text-muted-foreground break-words">
            Manage Starlight VMs and Block Storage
          </p>
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
            <p className="text-2xl md:text-3xl font-bold truncate">127</p>
            <Badge variant="outline" className="mt-2 bg-green-500/10 text-green-500 border-green-500/20 text-xs whitespace-nowrap">
              89 Running
            </Badge>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 md:p-6">
            <p className="text-xs md:text-sm text-muted-foreground mb-1 truncate">Total vCPUs</p>
            <p className="text-2xl md:text-3xl font-bold truncate">542</p>
            <Badge variant="outline" className="mt-2 bg-accent/10 text-accent border-accent/20 text-xs whitespace-nowrap">
              In Use
            </Badge>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 md:p-6">
            <p className="text-xs md:text-sm text-muted-foreground mb-1 truncate">Storage Volumes</p>
            <p className="text-2xl md:text-3xl font-bold truncate">234</p>
            <Badge variant="outline" className="mt-2 bg-primary/10 text-primary border-primary/20 text-xs whitespace-nowrap">
              45TB Total
            </Badge>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 md:p-6">
            <p className="text-xs md:text-sm text-muted-foreground mb-1 truncate">Snapshots</p>
            <p className="text-2xl md:text-3xl font-bold truncate">892</p>
            <Badge variant="outline" className="mt-2 bg-accent/10 text-accent border-accent/20 text-xs whitespace-nowrap">
              Active
            </Badge>
          </CardContent>
        </Card>
      </div>

      {/* Cloud Resources Tabs */}
      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <CardTitle className="text-lg md:text-xl truncate">Cloud Resources</CardTitle>
            <div className="relative w-full sm:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground flex-shrink-0" />
              <Input
                placeholder="Search resources..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 w-full"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="vms" className="w-full">
            <TabsList className="grid w-full grid-cols-2 h-auto gap-2">
              <TabsTrigger value="vms" className="text-xs md:text-sm whitespace-nowrap">
                <Cloud className="mr-2 h-4 w-4" />
                Virtual Machines
              </TabsTrigger>
              <TabsTrigger value="volumes" className="text-xs md:text-sm whitespace-nowrap">
                <HardDrive className="mr-2 h-4 w-4" />
                Storage Volumes
              </TabsTrigger>
            </TabsList>

            <TabsContent value="vms" className="mt-4">
              <div className="overflow-x-auto -mx-4 sm:mx-0">
                <div className="inline-block min-w-full align-middle">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="whitespace-nowrap">Name</TableHead>
                        <TableHead className="whitespace-nowrap">Owner</TableHead>
                        <TableHead className="whitespace-nowrap">CPU</TableHead>
                        <TableHead className="whitespace-nowrap">RAM</TableHead>
                        <TableHead className="whitespace-nowrap">Region</TableHead>
                        <TableHead className="whitespace-nowrap">Status</TableHead>
                        <TableHead className="w-[50px]"></TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {vms.map((vm) => (
                        <TableRow key={vm.id}>
                          <TableCell className="font-medium">
                            <div className="flex items-center gap-2">
                              <Cpu className="h-4 w-4 text-accent flex-shrink-0" />
                              <span className="truncate max-w-[120px] md:max-w-none">{vm.name}</span>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="truncate max-w-[120px] md:max-w-none">{vm.user}</div>
                          </TableCell>
                          <TableCell className="whitespace-nowrap text-sm">{vm.cpu}</TableCell>
                          <TableCell className="whitespace-nowrap text-sm">{vm.ram}</TableCell>
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
                          <TableCell>
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon" className="h-8 w-8">
                                  <MoreVertical className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end" className="bg-popover">
                                <DropdownMenuItem>
                                  <Activity className="mr-2 h-4 w-4" />
                                  View Metrics
                                </DropdownMenuItem>
                                <DropdownMenuItem>
                                  <HardDrive className="mr-2 h-4 w-4" />
                                  Attach Volume
                                </DropdownMenuItem>
                                <DropdownMenuItem>
                                  <Cloud className="mr-2 h-4 w-4" />
                                  Create Snapshot
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="volumes" className="mt-4">
              <div className="overflow-x-auto -mx-4 sm:mx-0">
                <div className="inline-block min-w-full align-middle">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="whitespace-nowrap">Name</TableHead>
                        <TableHead className="whitespace-nowrap">Size</TableHead>
                        <TableHead className="whitespace-nowrap">Type</TableHead>
                        <TableHead className="whitespace-nowrap">Attached To</TableHead>
                        <TableHead className="whitespace-nowrap">Status</TableHead>
                        <TableHead className="w-[50px]"></TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {volumes.map((volume) => (
                        <TableRow key={volume.id}>
                          <TableCell className="font-medium">
                            <div className="flex items-center gap-2">
                              <HardDrive className="h-4 w-4 text-primary flex-shrink-0" />
                              <span className="truncate max-w-[120px] md:max-w-none">{volume.name}</span>
                            </div>
                          </TableCell>
                          <TableCell className="whitespace-nowrap text-sm">{volume.size}</TableCell>
                          <TableCell className="whitespace-nowrap text-sm">{volume.type}</TableCell>
                          <TableCell>
                            <div className="truncate max-w-[120px] md:max-w-none">{volume.attached}</div>
                          </TableCell>
                          <TableCell>
                            <Badge
                              variant="outline"
                              className={`whitespace-nowrap ${
                                volume.status === "attached"
                                  ? "bg-green-500/10 text-green-500 border-green-500/20"
                                  : "bg-accent/10 text-accent border-accent/20"
                              }`}
                            >
                              {volume.status}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon" className="h-8 w-8">
                                  <MoreVertical className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end" className="bg-popover">
                                <DropdownMenuItem>
                                  <Activity className="mr-2 h-4 w-4" />
                                  View Details
                                </DropdownMenuItem>
                                <DropdownMenuItem>
                                  <Cloud className="mr-2 h-4 w-4" />
                                  Create Snapshot
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default CloudManagement;
