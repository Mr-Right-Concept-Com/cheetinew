import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import {
  HelpCircle,
  MessageSquare,
  Book,
  Video,
  Search,
  ExternalLink,
  Clock,
  CheckCircle,
  AlertCircle,
  Sparkles,
  Plus,
} from "lucide-react";
import { useSupportTickets, useCreateTicket } from "@/hooks/useSupport";
import { format } from "date-fns";
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";

const Support = () => {
  const { toast } = useToast();
  const { data: tickets, isLoading } = useSupportTickets();
  const createTicket = useCreateTicket();
  const [newTicket, setNewTicket] = useState({ subject: "", description: "", priority: "medium" });

  const handleCreateTicket = async () => {
    try {
      await createTicket.mutateAsync({
        subject: newTicket.subject,
        description: newTicket.description,
        priority: newTicket.priority as "low" | "medium" | "high" | "urgent",
      });
      toast({
        title: "Ticket Created",
        description: "Your support ticket has been submitted successfully.",
      });
      setNewTicket({ subject: "", description: "", priority: "medium" });
    } catch (err) {
      toast({
        title: "Error",
        description: "Failed to create ticket.",
        variant: "destructive",
      });
    }
  };

  // Calculate stats
  const openTickets = tickets?.filter(t => t.status === 'open').length || 0;
  const totalTickets = tickets?.length || 0;

  const knowledgeBase = [
    { title: "Getting Started with CheetiHost", category: "Basics", views: "2.4K", icon: "🚀" },
    { title: "Setting up Custom Domains", category: "Domains", views: "1.8K", icon: "🌐" },
    { title: "Configuring SSL Certificates", category: "Security", views: "1.5K", icon: "🔒" },
    { title: "Email Setup Guide", category: "Email", views: "1.2K", icon: "📧" },
    { title: "Optimizing Site Performance", category: "Performance", views: "980", icon: "⚡" },
    { title: "Backup & Restore Guide", category: "Data", views: "750", icon: "💾" },
  ];

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-6 md:py-8 space-y-6 md:space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-3xl md:text-4xl font-bold mb-2 truncate">Help & Support</h1>
          <p className="text-sm md:text-base text-muted-foreground">
            Get help from our knowledge base or contact our support team
          </p>
        </div>

        {/* AI Assistant Banner */}
        <Card className="bg-gradient-speed border-none shadow-glow">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <Sparkles className="h-10 w-10 text-primary-foreground" />
                <div>
                  <h3 className="text-xl font-bold text-primary-foreground">Ask Cheeti AI</h3>
                  <p className="text-primary-foreground/90">
                    Get instant answers from our AI assistant 24/7
                  </p>
                </div>
              </div>
              <Button variant="secondary" size="lg" className="gap-2">
                <MessageSquare className="h-5 w-5" />
                Start Chat
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          <Card className="bg-card/50 backdrop-blur">
            <CardContent className="p-4 md:p-6">
              <div className="flex items-center gap-3 md:gap-4">
                <div className="p-2 md:p-3 rounded-lg bg-primary/10">
                  <MessageSquare className="h-5 w-5 md:h-6 md:w-6 text-primary" />
                </div>
                <div className="min-w-0 flex-1">
                  {isLoading ? (
                    <Skeleton className="h-8 w-12" />
                  ) : (
                    <p className="text-xl md:text-2xl font-bold truncate">{openTickets}</p>
                  )}
                  <p className="text-xs md:text-sm text-muted-foreground truncate">Open Tickets</p>
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
                  <p className="text-2xl font-bold">2.5h</p>
                  <p className="text-sm text-muted-foreground">Avg Response</p>
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
                  <p className="text-2xl font-bold">98%</p>
                  <p className="text-sm text-muted-foreground">Satisfaction</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-card/50 backdrop-blur">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-lg bg-primary/10">
                  <Book className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <p className="text-2xl font-bold">450+</p>
                  <p className="text-sm text-muted-foreground">Help Articles</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Search Bar */}
        <Card className="bg-card/50 backdrop-blur">
          <CardContent className="p-6">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <Input
                placeholder="Search for help articles, guides, and FAQs..."
                className="pl-12 h-14 text-lg"
              />
            </div>
          </CardContent>
        </Card>

        {/* Main Content */}
        <Tabs defaultValue="tickets" className="space-y-6">
          <TabsList className="grid grid-cols-3 w-full max-w-md">
            <TabsTrigger value="tickets">My Tickets</TabsTrigger>
            <TabsTrigger value="knowledge">Knowledge Base</TabsTrigger>
            <TabsTrigger value="contact">Contact Us</TabsTrigger>
          </TabsList>

          {/* Tickets Tab */}
          <TabsContent value="tickets" className="space-y-6">
            <Card className="bg-card/50 backdrop-blur">
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>Support Tickets</CardTitle>
                  <CardDescription>View and manage your support requests</CardDescription>
                </div>
                <Dialog>
                  <DialogTrigger asChild>
                    <Button className="gap-2">
                      <Plus className="h-4 w-4" />
                      New Ticket
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Create Support Ticket</DialogTitle>
                      <DialogDescription>
                        Describe your issue and we'll get back to you as soon as possible.
                      </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                      <div className="space-y-2">
                        <Label>Subject</Label>
                        <Input 
                          placeholder="Brief description of your issue"
                          value={newTicket.subject}
                          onChange={(e) => setNewTicket({ ...newTicket, subject: e.target.value })}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Description</Label>
                        <Textarea 
                          placeholder="Provide details about your issue..."
                          rows={5}
                          value={newTicket.description}
                          onChange={(e) => setNewTicket({ ...newTicket, description: e.target.value })}
                        />
                      </div>
                      <Button 
                        onClick={handleCreateTicket} 
                        className="w-full"
                        disabled={createTicket.isPending}
                      >
                        {createTicket.isPending ? "Submitting..." : "Submit Ticket"}
                      </Button>
                    </div>
                  </DialogContent>
                </Dialog>
              </CardHeader>
              <CardContent className="space-y-4">
                {isLoading ? (
                  <div className="space-y-4">
                    {[1, 2, 3].map((i) => (
                      <Skeleton key={i} className="h-20 w-full" />
                    ))}
                  </div>
                ) : tickets?.length === 0 ? (
                  <div className="text-center py-12">
                    <MessageSquare className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                    <h3 className="text-lg font-semibold mb-2">No Tickets</h3>
                    <p className="text-muted-foreground">You haven't created any support tickets yet.</p>
                  </div>
                ) : (
                  tickets?.map((ticket) => (
                    <div
                      key={ticket.id}
                      className="flex items-center justify-between p-4 rounded-lg border border-border bg-background/50 hover:border-primary/50 transition-all cursor-pointer"
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                          <MessageSquare className="h-6 w-6 text-primary" />
                        </div>
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <h4 className="font-semibold">{ticket.ticket_number || ticket.id.slice(0, 8)}</h4>
                            <Badge
                              variant={ticket.priority === "high" ? "destructive" : "secondary"}
                              className={
                                ticket.priority === "medium"
                                  ? "bg-accent/10 text-accent border-none"
                                  : ticket.priority === "low"
                                  ? "bg-muted text-muted-foreground"
                                  : ""
                              }
                            >
                              {ticket.priority}
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground">{ticket.subject}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="text-right">
                          <p className="text-sm text-muted-foreground">
                            {ticket.created_at 
                              ? format(new Date(ticket.created_at), 'MMM d, yyyy')
                              : 'N/A'
                            }
                          </p>
                          <Badge
                            variant={ticket.status === "closed" ? "default" : "secondary"}
                            className={
                              ticket.status === "open"
                                ? "bg-primary/10 text-primary border-none"
                                : ticket.status === "answered"
                                ? "bg-accent/10 text-accent border-none"
                                : "bg-muted"
                            }
                          >
                            {ticket.status}
                          </Badge>
                        </div>
                        <Button variant="ghost" size="sm">
                          View
                        </Button>
                      </div>
                    </div>
                  ))
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Knowledge Base Tab */}
          <TabsContent value="knowledge" className="space-y-6">
            <Card className="bg-card/50 backdrop-blur">
              <CardHeader>
                <CardTitle>Popular Articles</CardTitle>
                <CardDescription>Browse our most helpful guides and tutorials</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-4">
                  {knowledgeBase.map((article, index) => (
                    <div
                      key={index}
                      className="p-4 rounded-lg border border-border bg-background/50 hover:border-primary/50 transition-all cursor-pointer group"
                    >
                      <div className="flex items-start gap-4">
                        <div className="text-4xl">{article.icon}</div>
                        <div className="flex-1">
                          <div className="flex items-start justify-between gap-2 mb-2">
                            <h4 className="font-semibold group-hover:text-primary transition-colors">
                              {article.title}
                            </h4>
                            <ExternalLink className="h-4 w-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                          </div>
                          <div className="flex items-center gap-3 text-sm text-muted-foreground">
                            <Badge variant="outline" className="text-xs">
                              {article.category}
                            </Badge>
                            <span>{article.views} views</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Video Tutorials */}
            <Card className="bg-card/50 backdrop-blur">
              <CardHeader>
                <CardTitle>Video Tutorials</CardTitle>
                <CardDescription>Watch step-by-step video guides</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-3 gap-4">
                  {[1, 2, 3].map((i) => (
                    <div
                      key={i}
                      className="group cursor-pointer rounded-lg border border-border bg-background/50 hover:border-primary/50 transition-all overflow-hidden"
                    >
                      <div className="aspect-video bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center relative">
                        <Video className="h-12 w-12 text-primary/50" />
                        <div className="absolute inset-0 bg-background/80 opacity-0 group-hover:opacity-100 transition-all flex items-center justify-center">
                          <Button size="sm" className="gap-2">
                            <Video className="h-4 w-4" />
                            Watch
                          </Button>
                        </div>
                      </div>
                      <div className="p-4">
                        <h4 className="font-semibold mb-1">Getting Started Tutorial</h4>
                        <p className="text-sm text-muted-foreground">5:30 • 1.2K views</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Contact Tab */}
          <TabsContent value="contact" className="space-y-6">
            <div className="grid md:grid-cols-3 gap-6">
              <Card className="bg-card/50 backdrop-blur hover:shadow-elegant transition-all">
                <CardContent className="p-6 text-center space-y-4">
                  <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mx-auto">
                    <MessageSquare className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="font-semibold text-lg">Live Chat</h3>
                  <p className="text-sm text-muted-foreground">
                    Chat with our support team in real-time
                  </p>
                  <Button className="w-full">Start Chat</Button>
                </CardContent>
              </Card>

              <Card className="bg-card/50 backdrop-blur hover:shadow-elegant transition-all">
                <CardContent className="p-6 text-center space-y-4">
                  <div className="w-12 h-12 rounded-lg bg-accent/10 flex items-center justify-center mx-auto">
                    <Book className="h-6 w-6 text-accent" />
                  </div>
                  <h3 className="font-semibold text-lg">Email Support</h3>
                  <p className="text-sm text-muted-foreground">
                    Send us an email and we'll respond within 24h
                  </p>
                  <Button variant="outline" className="w-full">Send Email</Button>
                </CardContent>
              </Card>

              <Card className="bg-card/50 backdrop-blur hover:shadow-elegant transition-all">
                <CardContent className="p-6 text-center space-y-4">
                  <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mx-auto">
                    <HelpCircle className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="font-semibold text-lg">Community Forum</h3>
                  <p className="text-sm text-muted-foreground">
                    Get help from other CheetiHost users
                  </p>
                  <Button variant="outline" className="w-full gap-2">
                    Visit Forum
                    <ExternalLink className="h-4 w-4" />
                  </Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Support;
