import { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { 
  Globe, 
  Server, 
  Cloud, 
  Database, 
  Shield, 
  Zap, 
  Activity,
  MapPin,
  Wifi,
  AlertTriangle,
  CheckCircle,
  Leaf,
} from "lucide-react";

// Infrastructure Map - Real-time visualization of all resources

interface Node {
  id: string;
  type: 'server' | 'edge' | 'database' | 'cdn' | 'domain';
  name: string;
  region: string;
  status: 'healthy' | 'warning' | 'error' | 'offline';
  latency?: number;
  traffic?: number;
  carbonFootprint?: number;
  coordinates: { x: number; y: number };
}

interface Connection {
  from: string;
  to: string;
  status: 'active' | 'degraded' | 'down';
  throughput?: number;
}

interface InfrastructureMapProps {
  nodes?: Node[];
  connections?: Connection[];
  showCarbonFootprint?: boolean;
  onNodeClick?: (node: Node) => void;
}

// Default demo data
const defaultNodes: Node[] = [
  { id: 'origin', type: 'server', name: 'Origin Server', region: 'US-East', status: 'healthy', latency: 12, traffic: 2400, carbonFootprint: 45, coordinates: { x: 50, y: 50 } },
  { id: 'edge-us', type: 'edge', name: 'US Edge', region: 'US-West', status: 'healthy', latency: 8, traffic: 1200, carbonFootprint: 12, coordinates: { x: 20, y: 40 } },
  { id: 'edge-eu', type: 'edge', name: 'EU Edge', region: 'EU-West', status: 'healthy', latency: 45, traffic: 890, carbonFootprint: 8, coordinates: { x: 70, y: 30 } },
  { id: 'edge-asia', type: 'edge', name: 'Asia Edge', region: 'AP-South', status: 'warning', latency: 120, traffic: 650, carbonFootprint: 15, coordinates: { x: 85, y: 45 } },
  { id: 'db-primary', type: 'database', name: 'Primary DB', region: 'US-East', status: 'healthy', latency: 2, coordinates: { x: 55, y: 65 } },
  { id: 'db-replica', type: 'database', name: 'EU Replica', region: 'EU-West', status: 'healthy', latency: 48, coordinates: { x: 75, y: 55 } },
  { id: 'cdn', type: 'cdn', name: 'Global CDN', region: 'Global', status: 'healthy', traffic: 5200, coordinates: { x: 50, y: 20 } },
];

const defaultConnections: Connection[] = [
  { from: 'origin', to: 'edge-us', status: 'active', throughput: 450 },
  { from: 'origin', to: 'edge-eu', status: 'active', throughput: 320 },
  { from: 'origin', to: 'edge-asia', status: 'degraded', throughput: 180 },
  { from: 'origin', to: 'db-primary', status: 'active', throughput: 890 },
  { from: 'db-primary', to: 'db-replica', status: 'active', throughput: 120 },
  { from: 'cdn', to: 'edge-us', status: 'active', throughput: 780 },
  { from: 'cdn', to: 'edge-eu', status: 'active', throughput: 540 },
  { from: 'cdn', to: 'edge-asia', status: 'degraded', throughput: 220 },
];

export function InfrastructureMap({
  nodes = defaultNodes,
  connections = defaultConnections,
  showCarbonFootprint = false,
  onNodeClick,
}: InfrastructureMapProps) {
  const [selectedNode, setSelectedNode] = useState<Node | null>(null);
  const [hoveredNode, setHoveredNode] = useState<string | null>(null);

  const getNodeIcon = (type: Node['type']) => {
    const icons = {
      server: Server,
      edge: Zap,
      database: Database,
      cdn: Globe,
      domain: Globe,
    };
    return icons[type] || Server;
  };

  const getStatusColor = (status: Node['status'] | Connection['status']) => {
    const colors = {
      healthy: 'text-primary bg-primary/20 border-primary/50',
      active: 'stroke-primary',
      warning: 'text-yellow-500 bg-yellow-500/20 border-yellow-500/50',
      degraded: 'stroke-yellow-500',
      error: 'text-destructive bg-destructive/20 border-destructive/50',
      down: 'stroke-destructive',
      offline: 'text-muted-foreground bg-muted border-muted-foreground/50',
    };
    return colors[status];
  };

  const totalCarbonFootprint = useMemo(() => {
    return nodes.reduce((sum, node) => sum + (node.carbonFootprint || 0), 0);
  }, [nodes]);

  const healthyNodes = nodes.filter(n => n.status === 'healthy').length;
  const warningNodes = nodes.filter(n => n.status === 'warning' || n.status === 'error').length;

  return (
    <Card className="bg-card/50 backdrop-blur border-border/50">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="flex items-center gap-2">
          <Activity className="h-5 w-5 text-primary" />
          Infrastructure Map
        </CardTitle>
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="bg-primary/10 text-primary">
            <CheckCircle className="h-3 w-3 mr-1" />
            {healthyNodes} Healthy
          </Badge>
          {warningNodes > 0 && (
            <Badge variant="outline" className="bg-yellow-500/10 text-yellow-500">
              <AlertTriangle className="h-3 w-3 mr-1" />
              {warningNodes} Issues
            </Badge>
          )}
          {showCarbonFootprint && (
            <Badge variant="outline" className="bg-green-500/10 text-green-500">
              <Leaf className="h-3 w-3 mr-1" />
              {totalCarbonFootprint}g CO₂/hr
            </Badge>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <div className="relative w-full h-[400px] bg-background/50 rounded-lg border border-border overflow-hidden">
          {/* World map background (simplified) */}
          <div className="absolute inset-0 opacity-10">
            <svg viewBox="0 0 100 100" className="w-full h-full">
              {/* Simplified continent outlines */}
              <path
                d="M15,35 Q25,30 35,35 T55,32 T75,38 L80,42 Q75,48 70,45 T55,50 T40,48 T20,45 Z"
                fill="currentColor"
                className="text-foreground"
              />
              <path
                d="M60,50 Q70,48 75,55 T78,65 L70,70 Q65,68 60,62 Z"
                fill="currentColor"
                className="text-foreground"
              />
              <path
                d="M20,55 Q25,52 30,58 T35,70 L25,75 Q20,72 18,65 Z"
                fill="currentColor"
                className="text-foreground"
              />
            </svg>
          </div>

          {/* Connections */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none">
            {connections.map((conn, idx) => {
              const fromNode = nodes.find(n => n.id === conn.from);
              const toNode = nodes.find(n => n.id === conn.to);
              if (!fromNode || !toNode) return null;

              const isHighlighted = hoveredNode === conn.from || hoveredNode === conn.to;

              return (
                <g key={idx}>
                  <line
                    x1={`${fromNode.coordinates.x}%`}
                    y1={`${fromNode.coordinates.y}%`}
                    x2={`${toNode.coordinates.x}%`}
                    y2={`${toNode.coordinates.y}%`}
                    className={`${getStatusColor(conn.status)} transition-all duration-300`}
                    strokeWidth={isHighlighted ? 3 : 1.5}
                    strokeDasharray={conn.status === 'degraded' ? '5,5' : undefined}
                    opacity={isHighlighted ? 1 : 0.6}
                  />
                  {/* Animated flow indicator */}
                  {conn.status === 'active' && (
                    <circle r="2" fill="hsl(var(--primary))" opacity={0.8}>
                      <animateMotion
                        dur="2s"
                        repeatCount="indefinite"
                        path={`M${fromNode.coordinates.x * 4},${fromNode.coordinates.y * 4} L${toNode.coordinates.x * 4},${toNode.coordinates.y * 4}`}
                      />
                    </circle>
                  )}
                </g>
              );
            })}
          </svg>

          {/* Nodes */}
          {nodes.map((node) => {
            const Icon = getNodeIcon(node.type);
            const isSelected = selectedNode?.id === node.id;
            const isHovered = hoveredNode === node.id;

            return (
              <Tooltip key={node.id}>
                <TooltipTrigger asChild>
                  <button
                    className={`absolute transform -translate-x-1/2 -translate-y-1/2 p-2 rounded-lg border-2 transition-all duration-300 ${getStatusColor(node.status)} ${
                      isSelected || isHovered ? 'scale-125 shadow-lg z-10' : 'scale-100'
                    }`}
                    style={{
                      left: `${node.coordinates.x}%`,
                      top: `${node.coordinates.y}%`,
                    }}
                    onClick={() => {
                      setSelectedNode(node);
                      onNodeClick?.(node);
                    }}
                    onMouseEnter={() => setHoveredNode(node.id)}
                    onMouseLeave={() => setHoveredNode(null)}
                  >
                    <Icon className="h-4 w-4" />
                    {node.status === 'healthy' && (
                      <span className="absolute -top-1 -right-1 w-2 h-2 bg-primary rounded-full animate-pulse" />
                    )}
                  </button>
                </TooltipTrigger>
                <TooltipContent side="top" className="bg-card border-border">
                  <div className="text-sm space-y-1">
                    <p className="font-semibold">{node.name}</p>
                    <p className="text-muted-foreground flex items-center gap-1">
                      <MapPin className="h-3 w-3" />
                      {node.region}
                    </p>
                    {node.latency !== undefined && (
                      <p className="text-muted-foreground flex items-center gap-1">
                        <Wifi className="h-3 w-3" />
                        {node.latency}ms latency
                      </p>
                    )}
                    {node.traffic !== undefined && (
                      <p className="text-muted-foreground">
                        {node.traffic.toLocaleString()} req/min
                      </p>
                    )}
                    {showCarbonFootprint && node.carbonFootprint !== undefined && (
                      <p className="text-green-500 flex items-center gap-1">
                        <Leaf className="h-3 w-3" />
                        {node.carbonFootprint}g CO₂/hr
                      </p>
                    )}
                  </div>
                </TooltipContent>
              </Tooltip>
            );
          })}

          {/* Legend */}
          <div className="absolute bottom-3 left-3 flex flex-wrap gap-3 text-xs">
            <div className="flex items-center gap-1 bg-card/80 backdrop-blur px-2 py-1 rounded">
              <Server className="h-3 w-3 text-primary" /> Origin
            </div>
            <div className="flex items-center gap-1 bg-card/80 backdrop-blur px-2 py-1 rounded">
              <Zap className="h-3 w-3 text-primary" /> Edge
            </div>
            <div className="flex items-center gap-1 bg-card/80 backdrop-blur px-2 py-1 rounded">
              <Database className="h-3 w-3 text-primary" /> Database
            </div>
            <div className="flex items-center gap-1 bg-card/80 backdrop-blur px-2 py-1 rounded">
              <Globe className="h-3 w-3 text-primary" /> CDN
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
