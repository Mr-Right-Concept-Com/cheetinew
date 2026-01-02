import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  Brain,
  Zap,
  Shield,
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  Loader2,
  Server,
  Database,
  Cpu,
  Activity,
  ChevronRight,
} from "lucide-react";

// AI DevOps Agent - Predictive scaling, security monitoring, optimization

interface AIInsight {
  id: string;
  type: 'optimization' | 'security' | 'scaling' | 'cost' | 'performance';
  severity: 'info' | 'warning' | 'critical';
  title: string;
  description: string;
  action: string;
  automated?: boolean;
  potentialSavings?: string;
}

interface AIDevOpsAgentProps {
  insights?: AIInsight[];
  onApplyAction?: (insightId: string) => void;
}

const defaultInsights: AIInsight[] = [
  {
    id: '1',
    type: 'scaling',
    severity: 'warning',
    title: 'Traffic spike predicted',
    description: 'Based on historical patterns, we predict a 300% traffic increase in 2 hours. Auto-scaling recommended.',
    action: 'Enable Auto-Scaling',
    automated: true,
    potentialSavings: 'Avoid downtime',
  },
  {
    id: '2',
    type: 'optimization',
    severity: 'info',
    title: 'Database query optimization',
    description: '3 slow queries detected. AI-generated indexes can improve performance by 45%.',
    action: 'Apply Optimizations',
    potentialSavings: '45% faster queries',
  },
  {
    id: '3',
    type: 'security',
    severity: 'critical',
    title: 'Unusual login patterns',
    description: 'Detected 127 failed login attempts from 5 IPs. Recommend enabling rate limiting.',
    action: 'Block IPs',
    automated: true,
  },
  {
    id: '4',
    type: 'cost',
    severity: 'info',
    title: 'Idle resources detected',
    description: '2 cloud instances have <5% utilization. Consider downsizing or terminating.',
    action: 'Review Resources',
    potentialSavings: '$45/month',
  },
  {
    id: '5',
    type: 'performance',
    severity: 'warning',
    title: 'Cache hit ratio low',
    description: 'Only 34% of requests are served from cache. Recommend adjusting cache rules.',
    action: 'Optimize Cache',
    potentialSavings: '60% faster loads',
  },
];

export function AIDevOpsAgent({ 
  insights = defaultInsights,
  onApplyAction 
}: AIDevOpsAgentProps) {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [appliedActions, setAppliedActions] = useState<string[]>([]);
  const [healthScore, setHealthScore] = useState(87);

  const handleApplyAction = (insightId: string) => {
    setAppliedActions(prev => [...prev, insightId]);
    onApplyAction?.(insightId);
    
    // Simulate health improvement
    setHealthScore(prev => Math.min(100, prev + 3));
  };

  const getTypeIcon = (type: AIInsight['type']) => {
    const icons = {
      optimization: TrendingUp,
      security: Shield,
      scaling: Zap,
      cost: Activity,
      performance: Cpu,
    };
    return icons[type];
  };

  const getSeverityColor = (severity: AIInsight['severity']) => {
    const colors = {
      info: 'bg-accent/10 text-accent border-accent/30',
      warning: 'bg-yellow-500/10 text-yellow-500 border-yellow-500/30',
      critical: 'bg-destructive/10 text-destructive border-destructive/30',
    };
    return colors[severity];
  };

  const criticalCount = insights.filter(i => i.severity === 'critical' && !appliedActions.includes(i.id)).length;
  const warningCount = insights.filter(i => i.severity === 'warning' && !appliedActions.includes(i.id)).length;

  return (
    <Card className="bg-card/50 backdrop-blur">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Brain className="h-5 w-5 text-primary" />
            AI DevOps Agent
          </CardTitle>
          <div className="flex items-center gap-2">
            {criticalCount > 0 && (
              <Badge variant="destructive" className="animate-pulse">
                {criticalCount} Critical
              </Badge>
            )}
            {warningCount > 0 && (
              <Badge className="bg-yellow-500/10 text-yellow-500 border-yellow-500/30">
                {warningCount} Warnings
              </Badge>
            )}
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setIsAnalyzing(true);
                setTimeout(() => setIsAnalyzing(false), 2000);
              }}
              disabled={isAnalyzing}
            >
              {isAnalyzing ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Analyzing...
                </>
              ) : (
                <>
                  <Brain className="h-4 w-4 mr-2" />
                  Run Analysis
                </>
              )}
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Health Score */}
        <div className="flex items-center gap-6 p-4 rounded-lg bg-muted/50">
          <div className="relative">
            <svg className="w-24 h-24 transform -rotate-90">
              <circle
                cx="48"
                cy="48"
                r="40"
                stroke="currentColor"
                strokeWidth="8"
                fill="none"
                className="text-muted"
              />
              <circle
                cx="48"
                cy="48"
                r="40"
                stroke="currentColor"
                strokeWidth="8"
                fill="none"
                strokeDasharray={`${healthScore * 2.51} 251`}
                className={healthScore > 80 ? 'text-primary' : healthScore > 60 ? 'text-yellow-500' : 'text-destructive'}
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-2xl font-bold">{healthScore}</span>
            </div>
          </div>
          <div className="flex-1">
            <h4 className="text-lg font-semibold">System Health Score</h4>
            <p className="text-sm text-muted-foreground mb-2">
              Based on performance, security, and cost optimization
            </p>
            <div className="grid grid-cols-3 gap-2 text-sm">
              <div className="flex items-center gap-1">
                <Server className="h-3 w-3 text-primary" />
                <span>Uptime: 99.99%</span>
              </div>
              <div className="flex items-center gap-1">
                <Shield className="h-3 w-3 text-primary" />
                <span>Security: Strong</span>
              </div>
              <div className="flex items-center gap-1">
                <TrendingUp className="h-3 w-3 text-primary" />
                <span>Performance: Good</span>
              </div>
            </div>
          </div>
        </div>

        {/* AI Insights */}
        <div className="space-y-3">
          <h4 className="font-semibold flex items-center gap-2">
            <Activity className="h-4 w-4 text-primary" />
            AI Insights & Recommendations
          </h4>

          {insights.map((insight) => {
            const Icon = getTypeIcon(insight.type);
            const isApplied = appliedActions.includes(insight.id);

            return (
              <Card
                key={insight.id}
                className={`transition-all ${
                  isApplied ? 'opacity-50' : getSeverityColor(insight.severity)
                }`}
              >
                <CardContent className="p-4">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-start gap-3">
                      <div className={`p-2 rounded-lg ${
                        insight.severity === 'critical' 
                          ? 'bg-destructive/10' 
                          : insight.severity === 'warning'
                          ? 'bg-yellow-500/10'
                          : 'bg-primary/10'
                      }`}>
                        <Icon className={`h-4 w-4 ${
                          insight.severity === 'critical'
                            ? 'text-destructive'
                            : insight.severity === 'warning'
                            ? 'text-yellow-500'
                            : 'text-primary'
                        }`} />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h5 className="font-semibold">{insight.title}</h5>
                          {insight.automated && (
                            <Badge variant="outline" className="text-xs">
                              <Zap className="h-3 w-3 mr-1" />
                              Auto
                            </Badge>
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground mb-2">
                          {insight.description}
                        </p>
                        {insight.potentialSavings && (
                          <Badge variant="secondary" className="text-xs">
                            <TrendingUp className="h-3 w-3 mr-1" />
                            {insight.potentialSavings}
                          </Badge>
                        )}
                      </div>
                    </div>
                    <Button
                      size="sm"
                      variant={isApplied ? 'outline' : 'default'}
                      onClick={() => handleApplyAction(insight.id)}
                      disabled={isApplied}
                      className="flex-shrink-0"
                    >
                      {isApplied ? (
                        <>
                          <CheckCircle className="h-4 w-4 mr-1" />
                          Applied
                        </>
                      ) : (
                        <>
                          {insight.action}
                          <ChevronRight className="h-4 w-4 ml-1" />
                        </>
                      )}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Quick Actions */}
        <div className="flex flex-wrap gap-2">
          <Button variant="outline" size="sm" className="gap-1">
            <Shield className="h-4 w-4" />
            Security Scan
          </Button>
          <Button variant="outline" size="sm" className="gap-1">
            <Database className="h-4 w-4" />
            DB Optimization
          </Button>
          <Button variant="outline" size="sm" className="gap-1">
            <Zap className="h-4 w-4" />
            Performance Audit
          </Button>
          <Button variant="outline" size="sm" className="gap-1">
            <TrendingUp className="h-4 w-4" />
            Cost Analysis
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
