import { useState, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  GripVertical,
  Plus,
  X,
  Settings,
  Server,
  Cloud,
  Globe,
  Activity,
  Database,
  Shield,
  TrendingUp,
  DollarSign,
  Users,
  Mail,
  Cpu,
  HardDrive,
  Wifi,
} from "lucide-react";

// Modular Widget System - Drag & drop dashboard customization

export type WidgetType = 
  | 'stats' 
  | 'websites' 
  | 'cloud' 
  | 'domains' 
  | 'traffic' 
  | 'storage' 
  | 'security' 
  | 'billing' 
  | 'users'
  | 'email'
  | 'performance';

export type WidgetSize = 'small' | 'medium' | 'large' | 'full';

export interface Widget {
  id: string;
  type: WidgetType;
  title: string;
  size: WidgetSize;
  position: number;
  enabled: boolean;
  config?: Record<string, unknown>;
}

interface DraggableWidgetProps {
  widget: Widget;
  onRemove: (id: string) => void;
  onResize: (id: string, size: WidgetSize) => void;
  isDragging?: boolean;
  children: React.ReactNode;
}

export function DraggableWidget({ 
  widget, 
  onRemove, 
  onResize, 
  isDragging,
  children 
}: DraggableWidgetProps) {
  const [showSettings, setShowSettings] = useState(false);

  const sizeClasses: Record<WidgetSize, string> = {
    small: 'col-span-1',
    medium: 'col-span-2',
    large: 'col-span-3',
    full: 'col-span-full',
  };

  return (
    <Card
      className={`relative group transition-all duration-300 ${sizeClasses[widget.size]} ${
        isDragging ? 'opacity-50 scale-95' : ''
      } bg-card/50 backdrop-blur hover:shadow-elegant`}
    >
      {/* Drag handle */}
      <div className="absolute top-2 left-2 opacity-0 group-hover:opacity-100 transition-opacity cursor-grab active:cursor-grabbing">
        <GripVertical className="h-4 w-4 text-muted-foreground" />
      </div>

      {/* Widget controls */}
      <div className="absolute top-2 right-2 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
        <Button
          variant="ghost"
          size="icon"
          className="h-6 w-6"
          onClick={() => setShowSettings(!showSettings)}
        >
          <Settings className="h-3 w-3" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="h-6 w-6 hover:text-destructive"
          onClick={() => onRemove(widget.id)}
        >
          <X className="h-3 w-3" />
        </Button>
      </div>

      {/* Settings dropdown */}
      {showSettings && (
        <div className="absolute top-10 right-2 z-20 bg-card border border-border rounded-lg shadow-lg p-3 min-w-[140px]">
          <p className="text-xs text-muted-foreground mb-2">Widget Size</p>
          <div className="flex flex-wrap gap-1">
            {(['small', 'medium', 'large', 'full'] as WidgetSize[]).map((size) => (
              <Button
                key={size}
                variant={widget.size === size ? 'default' : 'outline'}
                size="sm"
                className="text-xs h-7"
                onClick={() => {
                  onResize(widget.id, size);
                  setShowSettings(false);
                }}
              >
                {size.charAt(0).toUpperCase()}
              </Button>
            ))}
          </div>
        </div>
      )}

      {children}
    </Card>
  );
}

// Pre-built widget content components
export function StatsWidget() {
  const stats = [
    { label: 'Active Sites', value: '12', icon: Server, trend: '+2' },
    { label: 'Cloud Instances', value: '5', icon: Cloud, trend: '+1' },
    { label: 'Domains', value: '18', icon: Globe, trend: '0' },
    { label: 'Uptime', value: '99.99%', icon: Activity, trend: '+0.01%' },
  ];

  return (
    <CardContent className="pt-6">
      <div className="grid grid-cols-2 gap-4">
        {stats.map((stat, idx) => (
          <div key={idx} className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-primary/10">
              <stat.icon className="h-4 w-4 text-primary" />
            </div>
            <div>
              <p className="text-2xl font-bold">{stat.value}</p>
              <p className="text-xs text-muted-foreground">{stat.label}</p>
            </div>
          </div>
        ))}
      </div>
    </CardContent>
  );
}

export function TrafficWidget() {
  return (
    <>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm flex items-center gap-2">
          <TrendingUp className="h-4 w-4 text-primary" />
          Traffic Overview
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground">Today</span>
            <span className="font-semibold">24.5K</span>
          </div>
          <div className="h-2 bg-muted rounded-full overflow-hidden">
            <div className="h-full bg-primary rounded-full" style={{ width: '72%' }} />
          </div>
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>0</span>
            <span>Target: 34K</span>
          </div>
        </div>
      </CardContent>
    </>
  );
}

export function StorageWidget() {
  const storage = [
    { name: 'Files', used: 45, total: 100, color: 'bg-primary' },
    { name: 'Databases', used: 12, total: 50, color: 'bg-accent' },
    { name: 'Backups', used: 28, total: 100, color: 'bg-green-500' },
  ];

  return (
    <>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm flex items-center gap-2">
          <HardDrive className="h-4 w-4 text-primary" />
          Storage Usage
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {storage.map((item, idx) => (
            <div key={idx} className="space-y-1">
              <div className="flex justify-between text-sm">
                <span>{item.name}</span>
                <span className="text-muted-foreground">{item.used}GB / {item.total}GB</span>
              </div>
              <div className="h-2 bg-muted rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full ${item.color}`}
                  style={{ width: `${(item.used / item.total) * 100}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </>
  );
}

export function SecurityWidget() {
  return (
    <>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm flex items-center gap-2">
          <Shield className="h-4 w-4 text-primary" />
          Security Status
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm">SSL Certificates</span>
            <Badge className="bg-primary/10 text-primary">18 Active</Badge>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm">Firewall</span>
            <Badge className="bg-green-500/10 text-green-500">Enabled</Badge>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm">DDoS Protection</span>
            <Badge className="bg-green-500/10 text-green-500">Active</Badge>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm">Threats Blocked</span>
            <span className="font-semibold text-destructive">1,247</span>
          </div>
        </div>
      </CardContent>
    </>
  );
}

export function PerformanceWidget() {
  return (
    <>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm flex items-center gap-2">
          <Cpu className="h-4 w-4 text-primary" />
          Performance
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-4">
          <div className="text-center p-3 rounded-lg bg-muted/50">
            <p className="text-2xl font-bold text-primary">23ms</p>
            <p className="text-xs text-muted-foreground">Avg Response</p>
          </div>
          <div className="text-center p-3 rounded-lg bg-muted/50">
            <p className="text-2xl font-bold text-accent">99.9%</p>
            <p className="text-xs text-muted-foreground">Uptime</p>
          </div>
          <div className="text-center p-3 rounded-lg bg-muted/50">
            <p className="text-2xl font-bold">45%</p>
            <p className="text-xs text-muted-foreground">CPU Usage</p>
          </div>
          <div className="text-center p-3 rounded-lg bg-muted/50">
            <p className="text-2xl font-bold">62%</p>
            <p className="text-xs text-muted-foreground">Memory</p>
          </div>
        </div>
      </CardContent>
    </>
  );
}

// Widget configuration
export const AVAILABLE_WIDGETS: Omit<Widget, 'position' | 'enabled'>[] = [
  { id: 'stats', type: 'stats', title: 'Quick Stats', size: 'medium' },
  { id: 'traffic', type: 'traffic', title: 'Traffic', size: 'small' },
  { id: 'storage', type: 'storage', title: 'Storage', size: 'small' },
  { id: 'security', type: 'security', title: 'Security', size: 'small' },
  { id: 'performance', type: 'performance', title: 'Performance', size: 'medium' },
  { id: 'billing', type: 'billing', title: 'Billing', size: 'small' },
  { id: 'users', type: 'users', title: 'Users', size: 'small' },
];

export function getWidgetContent(type: WidgetType) {
  switch (type) {
    case 'stats':
      return <StatsWidget />;
    case 'traffic':
      return <TrafficWidget />;
    case 'storage':
      return <StorageWidget />;
    case 'security':
      return <SecurityWidget />;
    case 'performance':
      return <PerformanceWidget />;
    default:
      return (
        <CardContent className="flex items-center justify-center h-32 text-muted-foreground">
          Widget: {type}
        </CardContent>
      );
  }
}
