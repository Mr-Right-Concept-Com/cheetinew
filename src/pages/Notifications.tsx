import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Bell, CheckCircle, AlertCircle, Info, TrendingUp, Shield,
  CreditCard, Server, Clock, Trash2,
} from "lucide-react";
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useNotifications, useMarkNotificationAsRead, useMarkAllNotificationsAsRead, useDeleteNotification } from "@/hooks/useNotifications";
import { format } from "date-fns";
import { toast } from "sonner";
import { LucideIcon } from "lucide-react";

const Notifications = () => {
  const { data: notifications, isLoading } = useNotifications();
  const markAsRead = useMarkNotificationAsRead();
  const markAllAsRead = useMarkAllNotificationsAsRead();
  const deleteNotification = useDeleteNotification();
  const [clearAllOpen, setClearAllOpen] = useState(false);

  const getIconForType = (type: string): LucideIcon => {
    const map: Record<string, LucideIcon> = {
      success: CheckCircle, warning: AlertCircle, info: Info,
      billing: CreditCard, security: Shield, performance: TrendingUp,
    };
    return map[type] || Bell;
  };

  const getIconColor = (type: string) => {
    const map: Record<string, string> = {
      success: "text-green-500", warning: "text-accent", info: "text-primary",
      billing: "text-primary", security: "text-accent", performance: "text-primary",
    };
    return map[type] || "text-muted-foreground";
  };

  const getBgColor = (type: string) => {
    const map: Record<string, string> = {
      success: "bg-green-500/10", warning: "bg-accent/10", info: "bg-primary/10",
      billing: "bg-primary/10", security: "bg-accent/10", performance: "bg-primary/10",
    };
    return map[type] || "bg-muted";
  };

  const unreadCount = notifications?.filter(n => !n.is_read).length || 0;
  const todayCount = notifications?.filter(n => {
    if (!n.created_at) return false;
    return new Date(n.created_at).toDateString() === new Date().toDateString();
  }).length || 0;

  const handleClearRead = async () => {
    const readNotifications = notifications?.filter(n => n.is_read) || [];
    if (readNotifications.length === 0) {
      toast.info("No read notifications to clear");
      setClearAllOpen(false);
      return;
    }
    for (const n of readNotifications) {
      await deleteNotification.mutateAsync(n.id);
    }
    toast.success(`Cleared ${readNotifications.length} read notifications`);
    setClearAllOpen(false);
  };

  const categoryMap: Record<string, string> = {
    services: "service",
    billing: "billing",
    security: "security",
    updates: "system",
  };

  const filterByCategory = (category: string) => {
    const dbCategory = categoryMap[category];
    return notifications?.filter(n => n.category === dbCategory || n.type === category) || [];
  };

  const renderNotificationList = (items: typeof notifications) => {
    if (!items || items.length === 0) {
      return (
        <div className="text-center py-12">
          <Bell className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
          <h3 className="text-lg font-semibold mb-2">No Notifications</h3>
          <p className="text-muted-foreground">You're all caught up!</p>
        </div>
      );
    }
    return (
      <div className="divide-y divide-border">
        {items.map(notification => {
          const Icon = getIconForType(notification.type);
          return (
            <div key={notification.id}
              className={`p-4 md:p-6 hover:bg-muted/50 transition-colors ${!notification.is_read ? "bg-muted/30" : ""}`}>
              <div className="flex items-start gap-3 md:gap-4">
                <div className={`w-10 h-10 md:w-12 md:h-12 rounded-lg ${getBgColor(notification.type)} flex items-center justify-center flex-shrink-0`}>
                  <Icon className={`h-5 w-5 md:h-6 md:w-6 ${getIconColor(notification.type)}`} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2 mb-1">
                    <div className="flex items-center gap-2">
                      <h4 className="font-semibold text-sm md:text-base">{notification.title}</h4>
                      {!notification.is_read && <div className="w-2 h-2 rounded-full bg-primary" />}
                    </div>
                    <p className="text-xs text-muted-foreground whitespace-nowrap">
                      {notification.created_at ? format(new Date(notification.created_at), "MMM d, h:mm a") : "N/A"}
                    </p>
                  </div>
                  <p className="text-sm text-muted-foreground mb-2">{notification.message}</p>
                  <div className="flex gap-2">
                    {notification.category && (
                      <Badge variant="outline" className="text-xs capitalize">{notification.category}</Badge>
                    )}
                    {!notification.is_read && (
                      <Button variant="ghost" size="sm" className="h-6 text-xs"
                        onClick={() => markAsRead.mutate(notification.id)}>Mark Read</Button>
                    )}
                    <Button variant="ghost" size="sm" className="h-6 text-xs text-destructive"
                      onClick={() => deleteNotification.mutate(notification.id)}>
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-6 md:py-8 space-y-6 md:space-y-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold mb-2">Notifications</h1>
            <p className="text-sm md:text-base text-muted-foreground">Stay updated with your services</p>
          </div>
          <div className="flex gap-2 w-full sm:w-auto">
            <Button variant="outline" size="sm" className="gap-2 flex-1 sm:flex-none"
              onClick={() => markAllAsRead.mutate()} disabled={markAllAsRead.isPending}>
              <CheckCircle className="h-4 w-4" /><span className="hidden sm:inline">Mark All Read</span><span className="sm:hidden">Read</span>
            </Button>
            <Button variant="outline" size="sm" className="gap-2 flex-1 sm:flex-none"
              onClick={() => setClearAllOpen(true)}>
              <Trash2 className="h-4 w-4" /><span className="hidden sm:inline">Clear Read</span><span className="sm:hidden">Clear</span>
            </Button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { label: "Unread", value: unreadCount, icon: Bell, bg: "bg-primary/10", color: "text-primary" },
            { label: "Today", value: todayCount, icon: Clock, bg: "bg-accent/10", color: "text-accent" },
            { label: "Total", value: notifications?.length || 0, icon: CheckCircle, bg: "bg-green-500/10", color: "text-green-500" },
            { label: "Systems", value: "OK", icon: Server, bg: "bg-primary/10", color: "text-primary" },
          ].map((stat, i) => (
            <Card key={i} className="bg-card/50 backdrop-blur">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-lg ${stat.bg}`}><stat.icon className={`h-5 w-5 ${stat.color}`} /></div>
                  <div>{isLoading ? <Skeleton className="h-8 w-12" /> : <p className="text-xl font-bold">{stat.value}</p>}<p className="text-xs text-muted-foreground">{stat.label}</p></div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <Tabs defaultValue="all" className="space-y-6">
          <TabsList className="grid grid-cols-3 sm:grid-cols-6 w-full max-w-3xl">
            <TabsTrigger value="all">All ({notifications?.length || 0})</TabsTrigger>
            <TabsTrigger value="unread">Unread ({unreadCount})</TabsTrigger>
            <TabsTrigger value="services">Services</TabsTrigger>
            <TabsTrigger value="billing" className="hidden sm:flex">Billing</TabsTrigger>
            <TabsTrigger value="security" className="hidden sm:flex">Security</TabsTrigger>
            <TabsTrigger value="updates" className="hidden sm:flex">Updates</TabsTrigger>
          </TabsList>

          <TabsContent value="all">
            <Card className="bg-card/50 backdrop-blur"><CardContent className="p-0">
              {isLoading ? <div className="p-6 space-y-4">{[1, 2, 3].map(i => <Skeleton key={i} className="h-24 w-full" />)}</div> : renderNotificationList(notifications)}
            </CardContent></Card>
          </TabsContent>

          <TabsContent value="unread">
            <Card className="bg-card/50 backdrop-blur"><CardContent className="p-0">
              {isLoading ? <div className="p-6"><Skeleton className="h-24 w-full" /></div> : renderNotificationList(notifications?.filter(n => !n.is_read))}
            </CardContent></Card>
          </TabsContent>

          {["services", "billing", "security", "updates"].map(category => (
            <TabsContent key={category} value={category}>
              <Card className="bg-card/50 backdrop-blur"><CardContent className="p-0">
                {isLoading ? <div className="p-6"><Skeleton className="h-24 w-full" /></div> : renderNotificationList(filterByCategory(category))}
              </CardContent></Card>
            </TabsContent>
          ))}
        </Tabs>
      </div>

      {/* Clear All Confirmation */}
      <AlertDialog open={clearAllOpen} onOpenChange={setClearAllOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Clear Read Notifications</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete all read notifications ({notifications?.filter(n => n.is_read).length || 0} notifications). Unread notifications will be kept.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleClearRead} className="bg-destructive text-destructive-foreground">
              Clear Read
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default Notifications;
