import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

const generateData = (baseValue: number, variance: number) => {
  const hours = ["00:00", "02:00", "04:00", "06:00", "08:00", "10:00", "12:00", "14:00", "16:00", "18:00", "20:00", "22:00"];
  return hours.map(time => ({
    time,
    value: Math.max(0, Math.min(100, baseValue + (Math.random() - 0.5) * variance)),
  }));
};

const cpuData = generateData(35, 40);
const ramData = generateData(55, 25);
const diskData = generateData(42, 10);
const bandwidthData = generateData(25, 30);

const charts = [
  { title: "CPU Usage", data: cpuData, color: "hsl(var(--primary))", unit: "%" },
  { title: "RAM Usage", data: ramData, color: "hsl(var(--accent))", unit: "%" },
  { title: "Disk I/O", data: diskData, color: "hsl(142, 76%, 36%)", unit: "%" },
  { title: "Bandwidth", data: bandwidthData, color: "hsl(var(--primary))", unit: "Mbps" },
];

export const ResourceCharts = () => (
  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
    {charts.map((chart) => (
      <Card key={chart.title}>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium">{chart.title}</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={180}>
            <AreaChart data={chart.data}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
              <XAxis dataKey="time" tick={{ fontSize: 10 }} className="text-muted-foreground" />
              <YAxis tick={{ fontSize: 10 }} domain={[0, 100]} className="text-muted-foreground" />
              <Tooltip
                contentStyle={{ background: "hsl(var(--popover))", border: "1px solid hsl(var(--border))", borderRadius: "8px", fontSize: "12px" }}
                formatter={(value: number) => [`${value.toFixed(1)}${chart.unit}`, chart.title]}
              />
              <Area type="monotone" dataKey="value" stroke={chart.color} fill={chart.color} fillOpacity={0.15} strokeWidth={2} />
            </AreaChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    ))}
  </div>
);
