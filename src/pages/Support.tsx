import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
} from "lucide-react";

const Support = () => {
  const tickets = [
    { id: "TKT-1234", subject: "SSL Certificate Issue", status: "open", priority: "high", date: "2024-03-10" },
    { id: "TKT-1235", subject: "Billing Question", status: "answered", priority: "medium", date: "2024-03-08" },
    { id: "TKT-1236", subject: "Domain Transfer", status: "closed", priority: "low", date: "2024-03-05" },
  ];

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
      <div className="container mx-auto px-4 py-8 space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-4xl font-bold mb-2">Help & Support</h1>
          <p className="text-muted-foreground">
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
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card className="bg-card/50 backdrop-blur">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-lg bg-primary/10">
                  <MessageSquare className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <p className="text-2xl font-bold">3</p>
                  <p className="text-sm text-muted-foreground">Open Tickets</p>
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
                <Button className="gap-2">
                  <MessageSquare className="h-4 w-4" />
                  New Ticket
                </Button>
              </CardHeader>
              <CardContent className="space-y-4">
                {tickets.map((ticket) => (
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
                          <h4 className="font-semibold">{ticket.id}</h4>
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
                        <p className="text-sm text-muted-foreground">{ticket.date}</p>
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
                ))}
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
