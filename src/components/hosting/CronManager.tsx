import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Plus, Trash2, Clock } from "lucide-react";
import { toast } from "sonner";

interface CronJob {
  id: string;
  schedule: string;
  command: string;
  description: string;
  status: "active" | "paused";
}

const presets = [
  { label: "Every minute", value: "* * * * *" },
  { label: "Every 5 minutes", value: "*/5 * * * *" },
  { label: "Every hour", value: "0 * * * *" },
  { label: "Every day at midnight", value: "0 0 * * *" },
  { label: "Every week (Sunday)", value: "0 0 * * 0" },
  { label: "Every month (1st)", value: "0 0 1 * *" },
];

export const CronManager = () => {
  const [jobs, setJobs] = useState<CronJob[]>([
    { id: "1", schedule: "0 0 * * *", command: "/usr/bin/php /home/user/public_html/wp-cron.php", description: "WordPress Cron", status: "active" },
    { id: "2", schedule: "0 2 * * *", command: "/usr/local/bin/backup.sh", description: "Daily Backup", status: "active" },
    { id: "3", schedule: "*/30 * * * *", command: "/usr/bin/php /home/user/scripts/queue.php", description: "Queue Worker", status: "paused" },
  ]);
  const [newSchedule, setNewSchedule] = useState("");
  const [newCommand, setNewCommand] = useState("");

  const addJob = () => {
    if (!newSchedule || !newCommand) {
      toast.error("Please fill in schedule and command");
      return;
    }
    setJobs([...jobs, {
      id: Date.now().toString(),
      schedule: newSchedule,
      command: newCommand,
      description: "Custom Job",
      status: "active",
    }]);
    setNewSchedule("");
    setNewCommand("");
    toast.success("Cron job created successfully");
  };

  const removeJob = (id: string) => {
    setJobs(jobs.filter(j => j.id !== id));
    toast.success("Cron job removed");
  };

  return (
    <div className="space-y-6">
      {/* Add New */}
      <div className="p-4 border rounded-lg space-y-4">
        <h4 className="font-semibold flex items-center gap-2"><Plus className="h-4 w-4" /> Add Cron Job</h4>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <div className="space-y-1">
            <Label className="text-xs">Schedule Preset</Label>
            <Select onValueChange={setNewSchedule}>
              <SelectTrigger><SelectValue placeholder="Select schedule" /></SelectTrigger>
              <SelectContent>
                {presets.map(p => <SelectItem key={p.value} value={p.value}>{p.label}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1">
            <Label className="text-xs">Or Custom (cron syntax)</Label>
            <Input placeholder="* * * * *" value={newSchedule} onChange={e => setNewSchedule(e.target.value)} className="font-mono text-sm" />
          </div>
          <div className="space-y-1">
            <Label className="text-xs">Command</Label>
            <Input placeholder="/usr/bin/php /path/to/script.php" value={newCommand} onChange={e => setNewCommand(e.target.value)} className="font-mono text-sm" />
          </div>
        </div>
        <Button size="sm" onClick={addJob} className="gap-1"><Plus className="h-3 w-3" /> Add Job</Button>
      </div>

      {/* Jobs Table */}
      <div className="border rounded-lg overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Description</TableHead>
              <TableHead>Schedule</TableHead>
              <TableHead className="hidden md:table-cell">Command</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="w-[60px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {jobs.map(job => (
              <TableRow key={job.id}>
                <TableCell className="font-medium">
                  <div className="flex items-center gap-2">
                    <Clock className="h-3 w-3 text-muted-foreground" />
                    {job.description}
                  </div>
                </TableCell>
                <TableCell><Badge variant="outline" className="font-mono text-[10px]">{job.schedule}</Badge></TableCell>
                <TableCell className="hidden md:table-cell font-mono text-xs text-muted-foreground truncate max-w-[200px]">{job.command}</TableCell>
                <TableCell>
                  <Badge variant={job.status === "active" ? "default" : "secondary"} className={job.status === "active" ? "bg-green-500/10 text-green-500 border-none" : ""}>
                    {job.status}
                  </Badge>
                </TableCell>
                <TableCell>
                  <Button variant="ghost" size="sm" onClick={() => removeJob(job.id)} className="text-destructive h-8 w-8 p-0">
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};
