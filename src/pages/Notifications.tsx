import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Bell,
  CheckCircle,
  AlertCircle,
  Info,
  TrendingUp,
  Shield,
  CreditCard,
  Server,
  Clock,
  Trash2,
} from "lucide-react";
import { useNotifications, useMarkNotificationAsRead, useDeleteNotification } from "@/hooks/useNotifications";
import { format } from "date-fns";
import { LucideIcon } from "lucide-react";

const Notifications = () => {
  const { data: notifications, isLoading } = useNotifications();
  const markAsRead = useMarkNotificationAsRead();
  const deleteNotification = useDeleteNotification();

  const getIconForType = (type: string): LucideIcon => {
    switch (type) {
      case "success":
        return CheckCircle;
      case "warning":
        return AlertCircle;
      case "info":
        return Info;
      case "billing":
        return CreditCard;
      case "security":
        return Shield;
      case "performance":
        return TrendingUp;
      default:
        return Bell;
    }
  };

  const getIconColor = (type: string) => {
    switch (type) {
      case "success":
        return "text-green-500";
      case "warning":
        return "text-accent";
      case "info":
        return "text-primary";
      case "billing":
        return "text-primary";
      case "security":
        return "text-accent";
      case "performance":
        return "text-primary";
      default:
        return "text-muted-foreground";
    }
  };

  const getBgColor = (type: string) => {
    switch (type) {
      case "success":
        return "bg-green-500/10";
      case "warning":
        return "bg-accent/10";
      case "info":
        return "bg-primary/10";
      case "billing":
        return "bg-primary/10";
      case "security":
        return "bg-accent/10";
      case "performance":
        return "bg-primary/10";
      default:
        return "bg-muted";
    }
  };

  const unreadCount = notifications?.filter((n) => !n.is_read).length || 0;
  const todayCount = notifications?.filter(n => {
    if (!n.created_at) return false;
    const today = new Date();
    const notifDate = new Date(n.created_at);
    return notifDate.toDateString() === today.toDateString();
  }).length || 0;

  const handleMarkAsRead = async (id: string) => {
    await markAsRead.mutateAsync(id);
  };

  const handleMarkAllAsRead = async () => {
    // Mark all unread notifications as read
    const unreadIds = notifications?.filter(n => !n.is_read).map(n => n.id) || [];
    for (const id of unreadIds) {
      await markAsRead.mutateAsync(id);
    }
  };

  const handleDelete = async (id: string) => {
    await deleteNotification.mutateAsync(id);
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-6 md:py-8 space-y-6 md:space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold mb-2 truncate">Notifications</h1>
            <p className="text-sm md:text-base text-muted-foreground">
              Stay updated with your services and activities
            </p>
          </div>
          <div className="flex gap-2 md:gap-3 w-full sm:w-auto">
            <Button 
              variant="outline" 
              className="gap-2 flex-1 sm:flex-none" 
              size="sm"
              onClick={handleMarkAllAsRead}
              disabled={markAllAsRead.isPending}
            >
              <CheckCircle className="h-4 w-4" />
              <span className="hidden sm:inline">Mark All Read</span>
              <span className="sm:hidden">Read</span>
            </Button>
            <Button variant="outline" className="gap-2 flex-1 sm:flex-none" size="sm">
              <Trash2 className="h-4 w-4" />
              <span className="hidden sm:inline">Clear All</span>
              <span className="sm:hidden">Clear</span>
            </Button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          <Card className="bg-card/50 backdrop-blur">
            <CardContent className="p-4 md:p-6">
              <div className="flex items-center gap-3 md:gap-4">
                <div className="p-2 md:p-3 rounded-lg bg-primary/10">
                  <Bell className="h-5 w-5 md:h-6 md:w-6 text-primary" />
                </div>
                <div className="min-w-0 flex-1">
                  {isLoading ? (
                    <Skeleton className="h-8 w-12" />
                  ) : (
                    <p className="text-xl md:text-2xl font-bold truncate">{unreadCount}</p>
                  )}
                  <p className="text-xs md:text-sm text-muted-foreground truncate">Unread</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-card/50 backdrop-blur">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-lg bg-accent/10">
                  <Clock className="h-6 w-6 text-accent" />
                </div>
                <div>
                  <p className="text-2xl font-bold">Today</p>
                  <p className="text-sm text-muted-foreground">{todayCount} new updates</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-card/50 backdrop-blur">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-lg bg-green-500/10">
                  <CheckCircle className="h-6 w-6 text-green-500" />
                </div>
                <div>
                  {isLoading ? (
                    <Skeleton className="h-8 w-12" />
                  ) : (
                    <p className="text-2xl font-bold">{notifications?.length || 0}</p>
                  )}
                  <p className="text-sm text-muted-foreground">Total</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-card/50 backdrop-blur">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-lg bg-primary/10">
                  <Server className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <p className="text-2xl font-bold">All</p>
                  <p className="text-sm text-muted-foreground">Systems OK</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Notifications List */}
        <Tabs defaultValue="all" className="space-y-6">
          <TabsList className="grid grid-cols-3 sm:grid-cols-6 w-full max-w-3xl">
            <TabsTrigger value="all">
              All ({notifications?.length || 0})
            </TabsTrigger>
            <TabsTrigger value="unread">
              Unread ({unreadCount})
            </TabsTrigger>
            <TabsTrigger value="services">Services</TabsTrigger>
            <TabsTrigger value="billing" className="hidden sm:flex">Billing</TabsTrigger>
            <TabsTrigger value="security" className="hidden sm:flex">Security</TabsTrigger>
            <TabsTrigger value="updates" className="hidden sm:flex">Updates</TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="space-y-4">
            <Card className="bg-card/50 backdrop-blur">
              <CardContent className="p-0">
                {isLoading ? (
                  <div className="space-y-4 p-6">
                    {[1, 2, 3].map((i) => (
                      <Skeleton key={i} className="h-24 w-full" />
                    ))}
                  </div>
                ) : notifications?.length === 0 ? (
                  <div className="text-center py-12">
                    <Bell className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                    <h3 className="text-lg font-semibold mb-2">No Notifications</h3>
                    <p className="text-muted-foreground">You're all caught up!</p>
                  </div>
                ) : (
                  <div className="divide-y divide-border">
                    {notifications?.map((notification) => {
                      const Icon = getIconForType(notification.type);
                      return (
                        <div
                          key={notification.id}
                          className={`p-6 hover:bg-muted/50 transition-colors cursor-pointer ${
                            !notification.is_read ? "bg-muted/30" : ""
                          }`}
                        >
                          <div className="flex items-start gap-4">
                            <div
                              className={`w-12 h-12 rounded-lg ${getBgColor(
                                notification.type
                              )} flex items-center justify-center flex-shrink-0`}
                            >
                              <Icon className={`h-6 w-6 ${getIconColor(notification.type)}`} />
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-start justify-between gap-4 mb-2">
                                <div className="flex items-center gap-2">
                                  <h4 className="font-semibold">{notification.title}</h4>
                                  {!notification.is_read && (
                                    <div className="w-2 h-2 rounded-full bg-primary" />
                                  )}
                                </div>
                                <p className="text-sm text-muted-foreground whitespace-nowrap">
                                  {notification.created_at 
                                    ? format(new Date(notification.created_at), 'MMM d, h:mm a')
                                    : 'N/A'
                                  }
                                </p>
                              </div>
                              <p className="text-sm text-muted-foreground mb-3">
                                {notification.message}
                              </p>
                              <div className="flex gap-2">
                                {!notification.is_read && (
                                  <Button 
                                    variant="ghost" 
                                    size="sm"
                                    onClick={() => handleMarkAsRead(notification.id)}
                                  >
                                    Mark as Read
                                  </Button>
                                )}
                                <Button 
                                  variant="ghost" 
                                  size="sm" 
                                  className="text-destructive"
                                  onClick={() => handleDelete(notification.id)}
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="unread" className="space-y-4">
            <Card className="bg-card/50 backdrop-blur">
              <CardContent className="p-0">
                {isLoading ? (
                  <div className="space-y-4 p-6">
                    <Skeleton className="h-24 w-full" />
                  </div>
                ) : (
                  <div className="divide-y divide-border">
                    {notifications
                      ?.filter((n) => !n.is_read)
                      .map((notification) => {
                        const Icon = getIconForType(notification.type);
                        return (
                          <div
                            key={notification.id}
                            className="p-6 bg-muted/30 hover:bg-muted/50 transition-colors cursor-pointer"
                          >
                            <div className="flex items-start gap-4">
                              <div
                                className={`w-12 h-12 rounded-lg ${getBgColor(
                                  notification.type
                                )} flex items-center justify-center flex-shrink-0`}
                              >
                                <Icon className={`h-6 w-6 ${getIconColor(notification.type)}`} />
                              </div>
                              <div className="flex-1 min-w-0">
                                <div className="flex items-start justify-between gap-4 mb-2">
                                  <div className="flex items-center gap-2">
                                    <h4 className="font-semibold">{notification.title}</h4>
                                    <div className="w-2 h-2 rounded-full bg-primary" />
                                  </div>
                                  <p className="text-sm text-muted-foreground whitespace-nowrap">
                                    {notification.created_at 
                                      ? format(new Date(notification.created_at), 'MMM d, h:mm a')
                                      : 'N/A'
                                    }
                                  </p>
                                </div>
                                <p className="text-sm text-muted-foreground mb-3">
                                  {notification.message}
                                </p>
                                <div className="flex gap-2">
                                  <Button 
                                    variant="ghost" 
                                    size="sm"
                                    onClick={() => handleMarkAsRead(notification.id)}
                                  >
                                    Mark as Read
                                  </Button>
                                  <Button 
                                    variant="ghost" 
                                    size="sm" 
                                    className="text-destructive"
                                    onClick={() => handleDelete(notification.id)}
                                  >
                                    <Trash2 className="h-4 w-4" />
                                  </Button>
                                </div>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    {notifications?.filter(n => !n.is_read).length === 0 && (
                      <div className="text-center py-12">
                        <CheckCircle className="h-12 w-12 mx-auto text-green-500 mb-4" />
                        <h3 className="text-lg font-semibold mb-2">All Caught Up!</h3>
                        <p className="text-muted-foreground">No unread notifications.</p>
                      </div>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Notifications;
