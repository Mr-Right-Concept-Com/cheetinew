import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  HelpCircle, MessageSquare, Book, Video, Search, ExternalLink, Clock,
  CheckCircle, AlertCircle, Sparkles, Plus, Send, X,
} from "lucide-react";
import { useSupportTickets, useCreateTicket, useTicketMessages, useAddTicketMessage, useCloseTicket } from "@/hooks/useSupport";
import { format } from "date-fns";
import { useState, useRef, useEffect } from "react";
import {
  Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger,
} from "@/components/ui/dialog";
import { toast } from "sonner";

const knowledgeBase = [
  {
    title: "Getting Started with CheetiHost", category: "Basics", icon: "🚀", views: "2.4K",
    content: "Welcome to CheetiHost! Start by registering a domain, setting up hosting, and deploying your first website. Navigate to the Dashboard to see all your services at a glance. Use the sidebar to manage Hosting, Domains, Email, Cloud, and more. Need help? Our AI assistant Cheeti is available 24/7 via the chat button or Ctrl+K command palette."
  },
  {
    title: "Setting up Custom Domains", category: "Domains", icon: "🌐", views: "1.8K",
    content: "To set up a custom domain: 1) Go to Domains page and register or transfer your domain. 2) Configure DNS records (A, CNAME, MX) to point to your hosting server. 3) Enable WHOIS privacy for protection. 4) Set up SSL certificates for HTTPS. 5) Configure nameservers if using external DNS. Auto-renew is enabled by default to prevent expiration."
  },
  {
    title: "Configuring SSL Certificates", category: "Security", icon: "🔒", views: "1.5K",
    content: "SSL certificates encrypt data between your visitors and your server. CheetiHost provides free Let's Encrypt SSL for all domains. Go to Security Center > SSL tab to view certificates. Certificates auto-renew 30 days before expiration. For EV/OV certificates, contact support. Ensure your domain's DNS is properly configured before SSL provisioning."
  },
  {
    title: "Email Setup Guide", category: "Email", icon: "📧", views: "1.2K",
    content: "Create professional email accounts from the Email Management page. Each mailbox supports forwarding, auto-responders, and spam filtering. Configure your mail client with IMAP (port 993) or POP3 (port 995) for incoming mail, and SMTP (port 587) for outgoing. Set spam filter levels per mailbox. Enable forwarding to route emails to external addresses."
  },
  {
    title: "Optimizing Site Performance", category: "Performance", icon: "⚡", views: "980",
    content: "Boost your website speed: 1) Enable CDN from your hosting dashboard. 2) Use caching — configure browser and server-side caching in Hosting > Cron Jobs tab. 3) Optimize images — compress before uploading. 4) Minimize CSS/JS files. 5) Monitor resources in Hosting > Resources tab. 6) Upgrade your plan if you're hitting resource limits."
  },
  {
    title: "Backup & Restore Guide", category: "Data", icon: "💾", views: "750",
    content: "CheetiHost provides automated and manual backups. Go to Backups page to create snapshots, schedule automated backups, and restore previous versions. Backups include files, databases, and email data. Retention is 30 days by default. Cloud instances support separate snapshot functionality. Always create a backup before major changes."
  },
];

const videoTutorials = [
  { title: "Deploy Your First Website", duration: "5:30", description: "Step-by-step guide to deploying your first website on CheetiHost, from domain registration to going live." },
  { title: "Configure DNS Records", duration: "4:15", description: "Learn how to set up A records, CNAME, MX records, and more for your domains." },
  { title: "Set Up Professional Email", duration: "6:00", description: "Create and configure professional email accounts with forwarding, autoresponder, and spam filtering." },
];

const Support = () => {
  const { data: tickets, isLoading } = useSupportTickets();
  const createTicket = useCreateTicket();
  const closeTicket = useCloseTicket();
  const [newTicket, setNewTicket] = useState({ subject: "", description: "", priority: "medium", category: "general" });
  const [expandedTicket, setExpandedTicket] = useState<string | null>(null);
  const [articleOpen, setArticleOpen] = useState<number | null>(null);
  const [videoOpen, setVideoOpen] = useState<number | null>(null);
  const chatRef = useRef<HTMLDivElement>(null);

  const handleCreateTicket = async () => {
    if (!newTicket.subject.trim()) { toast.error("Subject is required"); return; }
    try {
      await createTicket.mutateAsync({
        subject: newTicket.subject,
        description: newTicket.description,
        priority: newTicket.priority as any,
        category: newTicket.category as any,
      });
      toast.success("Ticket created successfully!");
      setNewTicket({ subject: "", description: "", priority: "medium", category: "general" });
    } catch { toast.error("Failed to create ticket"); }
  };

  const handleStartChat = () => {
    chatRef.current?.scrollIntoView({ behavior: "smooth" });
    toast.info("Use the Cheeti AI chat assistant at the bottom-right of your screen, or press Ctrl+K");
  };

  const openTickets = tickets?.filter(t => t.status === "open").length || 0;
  const totalTickets = tickets?.length || 0;

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-6 md:py-8 space-y-6 md:space-y-8">
        <div>
          <h1 className="text-3xl md:text-4xl font-bold mb-2">Help & Support</h1>
          <p className="text-sm md:text-base text-muted-foreground">Get help from our knowledge base or contact support</p>
        </div>

        {/* AI Banner */}
        <Card className="bg-gradient-speed border-none shadow-glow">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <Sparkles className="h-10 w-10 text-primary-foreground" />
                <div>
                  <h3 className="text-xl font-bold text-primary-foreground">Ask Cheeti AI</h3>
                  <p className="text-primary-foreground/90">Get instant answers from our AI assistant 24/7</p>
                </div>
              </div>
              <Button variant="secondary" size="lg" className="gap-2" onClick={handleStartChat}>
                <MessageSquare className="h-5 w-5" />Start Chat
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="bg-card/50 backdrop-blur"><CardContent className="p-4"><div className="flex items-center gap-3"><div className="p-2 rounded-lg bg-primary/10"><MessageSquare className="h-5 w-5 text-primary" /></div><div>{isLoading ? <Skeleton className="h-8 w-12" /> : <p className="text-xl font-bold">{openTickets}</p>}<p className="text-xs text-muted-foreground">Open Tickets</p></div></div></CardContent></Card>
          <Card className="bg-card/50 backdrop-blur"><CardContent className="p-4"><div className="flex items-center gap-3"><div className="p-2 rounded-lg bg-accent/10"><Clock className="h-5 w-5 text-accent" /></div><div>{isLoading ? <Skeleton className="h-8 w-12" /> : <p className="text-xl font-bold">{tickets?.filter(t => t.first_response_at).length ? `${(tickets.filter(t => t.first_response_at).reduce((s, t) => s + (new Date(t.first_response_at!).getTime() - new Date(t.created_at).getTime()), 0) / tickets.filter(t => t.first_response_at).length / 3600000).toFixed(1)}h` : "N/A"}</p>}<p className="text-xs text-muted-foreground">Avg Response</p></div></div></CardContent></Card>
          <Card className="bg-card/50 backdrop-blur"><CardContent className="p-4"><div className="flex items-center gap-3"><div className="p-2 rounded-lg bg-green-500/10"><CheckCircle className="h-5 w-5 text-green-500" /></div><div><p className="text-xl font-bold">{tickets?.filter(t => t.status === "closed" || t.status === "resolved").length || 0}</p><p className="text-xs text-muted-foreground">Resolved</p></div></div></CardContent></Card>
          <Card className="bg-card/50 backdrop-blur"><CardContent className="p-4"><div className="flex items-center gap-3"><div className="p-2 rounded-lg bg-primary/10"><Book className="h-5 w-5 text-primary" /></div><div><p className="text-xl font-bold">{totalTickets}</p><p className="text-xs text-muted-foreground">Total Tickets</p></div></div></CardContent></Card>
        </div>

        <Tabs defaultValue="tickets" className="space-y-6">
          <TabsList className="grid grid-cols-3 w-full max-w-md">
            <TabsTrigger value="tickets">My Tickets</TabsTrigger>
            <TabsTrigger value="knowledge">Knowledge Base</TabsTrigger>
            <TabsTrigger value="contact">Tutorials</TabsTrigger>
          </TabsList>

          {/* Tickets Tab */}
          <TabsContent value="tickets" className="space-y-6">
            <Card className="bg-card/50 backdrop-blur">
              <CardHeader className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div><CardTitle>Support Tickets</CardTitle><CardDescription>View and manage your support requests</CardDescription></div>
                <Dialog>
                  <DialogTrigger asChild>
                    <Button className="gap-2"><Plus className="h-4 w-4" />New Ticket</Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Create Support Ticket</DialogTitle>
                      <DialogDescription>Describe your issue and we'll get back to you ASAP.</DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                      <div className="space-y-2">
                        <Label>Subject</Label>
                        <Input placeholder="Brief description" value={newTicket.subject}
                          onChange={(e) => setNewTicket({ ...newTicket, subject: e.target.value })} />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label>Category</Label>
                          <Select value={newTicket.category} onValueChange={(v) => setNewTicket({ ...newTicket, category: v })}>
                            <SelectTrigger><SelectValue /></SelectTrigger>
                            <SelectContent>
                              {["general", "billing", "technical", "sales", "abuse"].map(c => (
                                <SelectItem key={c} value={c} className="capitalize">{c}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-2">
                          <Label>Priority</Label>
                          <RadioGroup value={newTicket.priority} onValueChange={(v) => setNewTicket({ ...newTicket, priority: v })} className="flex gap-3 pt-2">
                            {["low", "medium", "high", "urgent"].map(p => (
                              <div key={p} className="flex items-center space-x-1">
                                <RadioGroupItem value={p} id={`p-${p}`} />
                                <Label htmlFor={`p-${p}`} className="capitalize text-xs cursor-pointer">{p}</Label>
                              </div>
                            ))}
                          </RadioGroup>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label>Description</Label>
                        <Textarea placeholder="Provide details..." rows={5} value={newTicket.description}
                          onChange={(e) => setNewTicket({ ...newTicket, description: e.target.value })} />
                      </div>
                      <Button onClick={handleCreateTicket} className="w-full" disabled={createTicket.isPending}>
                        {createTicket.isPending ? "Submitting..." : "Submit Ticket"}
                      </Button>
                    </div>
                  </DialogContent>
                </Dialog>
              </CardHeader>
              <CardContent className="space-y-4">
                {isLoading ? (
                  <div className="space-y-4">{[1, 2, 3].map(i => <Skeleton key={i} className="h-20 w-full" />)}</div>
                ) : tickets?.length === 0 ? (
                  <div className="text-center py-12">
                    <MessageSquare className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                    <h3 className="text-lg font-semibold mb-2">No Tickets</h3>
                    <p className="text-muted-foreground">You haven't created any support tickets yet.</p>
                  </div>
                ) : (
                  tickets?.map(ticket => (
                    <div key={ticket.id} className="border rounded-lg overflow-hidden">
                      <div
                        className="flex flex-col sm:flex-row sm:items-center justify-between p-4 bg-background/50 hover:bg-muted/30 transition-colors cursor-pointer gap-3"
                        onClick={() => setExpandedTicket(expandedTicket === ticket.id ? null : ticket.id)}
                      >
                        <div className="flex items-center gap-3">
                          <MessageSquare className="h-5 w-5 text-primary flex-shrink-0" />
                          <div className="min-w-0">
                            <div className="flex items-center gap-2 flex-wrap">
                              <span className="font-semibold text-sm">{ticket.ticket_number || ticket.id.slice(0, 8)}</span>
                              <Badge variant={ticket.priority === "high" || ticket.priority === "urgent" ? "destructive" : "secondary"} className="text-xs">{ticket.priority}</Badge>
                              <Badge variant="outline" className={ticket.status === "open" ? "bg-primary/10 text-primary border-primary/20" : ticket.status === "closed" ? "bg-muted" : "bg-accent/10 text-accent border-accent/20"} >{ticket.status}</Badge>
                            </div>
                            <p className="text-sm text-muted-foreground truncate">{ticket.subject}</p>
                          </div>
                        </div>
                        <span className="text-xs text-muted-foreground flex-shrink-0">
                          {ticket.created_at ? format(new Date(ticket.created_at), "MMM d, yyyy") : "N/A"}
                        </span>
                      </div>
                      {expandedTicket === ticket.id && (
                        <TicketThread ticketId={ticket.id} ticketStatus={ticket.status} onClose={() => {
                          closeTicket.mutate(ticket.id);
                          setExpandedTicket(null);
                        }} />
                      )}
                    </div>
                  ))
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Knowledge Base */}
          <TabsContent value="knowledge" className="space-y-6">
            <Card className="bg-card/50 backdrop-blur">
              <CardHeader><CardTitle>Popular Articles</CardTitle></CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-4">
                  {knowledgeBase.map((article, i) => (
                    <div key={i} className="p-4 rounded-lg border border-border bg-background/50 hover:border-primary/50 transition-all cursor-pointer group"
                      onClick={() => setArticleOpen(i)}>
                      <div className="flex items-start gap-4">
                        <div className="text-4xl">{article.icon}</div>
                        <div className="flex-1">
                          <h4 className="font-semibold group-hover:text-primary transition-colors">{article.title}</h4>
                          <div className="flex items-center gap-3 text-sm text-muted-foreground mt-1">
                            <Badge variant="outline" className="text-xs">{article.category}</Badge>
                            <span>{article.views} views</span>
                          </div>
                        </div>
                        <ExternalLink className="h-4 w-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Tutorials */}
          <TabsContent value="contact" className="space-y-6">
            <Card className="bg-card/50 backdrop-blur">
              <CardHeader><CardTitle>Video Tutorials</CardTitle><CardDescription>Watch step-by-step video guides</CardDescription></CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-3 gap-4">
                  {videoTutorials.map((vid, i) => (
                    <div key={i} className="group cursor-pointer rounded-lg border border-border bg-background/50 hover:border-primary/50 transition-all overflow-hidden"
                      onClick={() => setVideoOpen(i)}>
                      <div className="aspect-video bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center relative">
                        <Video className="h-12 w-12 text-primary/50" />
                        <div className="absolute inset-0 bg-background/80 opacity-0 group-hover:opacity-100 transition-all flex items-center justify-center">
                          <Button size="sm" className="gap-2"><Video className="h-4 w-4" />Watch</Button>
                        </div>
                      </div>
                      <div className="p-4">
                        <h4 className="font-semibold text-sm mb-1">{vid.title}</h4>
                        <p className="text-xs text-muted-foreground">{vid.duration}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <div ref={chatRef} />
      </div>

      {/* Article Dialog */}
      {articleOpen !== null && (
        <Dialog open onOpenChange={() => setArticleOpen(null)}>
          <DialogContent className="sm:max-w-lg">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <span className="text-2xl">{knowledgeBase[articleOpen].icon}</span>
                {knowledgeBase[articleOpen].title}
              </DialogTitle>
              <DialogDescription>{knowledgeBase[articleOpen].category} • {knowledgeBase[articleOpen].views} views</DialogDescription>
            </DialogHeader>
            <div className="py-4">
              <p className="text-sm text-muted-foreground leading-relaxed whitespace-pre-line">{knowledgeBase[articleOpen].content}</p>
            </div>
          </DialogContent>
        </Dialog>
      )}

      {/* Video Dialog */}
      {videoOpen !== null && (
        <Dialog open onOpenChange={() => setVideoOpen(null)}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{videoTutorials[videoOpen].title}</DialogTitle>
              <DialogDescription>Duration: {videoTutorials[videoOpen].duration}</DialogDescription>
            </DialogHeader>
            <div className="aspect-video bg-gradient-to-br from-primary/10 to-accent/10 rounded-lg flex items-center justify-center">
              <div className="text-center">
                <Video className="h-16 w-16 mx-auto text-primary/30 mb-3" />
                <p className="text-sm text-muted-foreground">Video tutorials coming soon</p>
              </div>
            </div>
            <p className="text-sm text-muted-foreground">{videoTutorials[videoOpen].description}</p>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};

// Ticket thread sub-component
function TicketThread({ ticketId, ticketStatus, onClose }: { ticketId: string; ticketStatus: string; onClose: () => void }) {
  const { data: messages, isLoading } = useTicketMessages(ticketId);
  const addMessage = useAddTicketMessage();
  const [reply, setReply] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [messages]);

  const handleSend = async () => {
    if (!reply.trim()) return;
    try {
      await addMessage.mutateAsync({ ticket_id: ticketId, message: reply });
      setReply("");
    } catch { toast.error("Failed to send message"); }
  };

  return (
    <div className="border-t border-border bg-muted/20">
      <ScrollArea className="h-64 p-4" ref={scrollRef}>
        {isLoading ? (
          <div className="space-y-3">{[1, 2].map(i => <Skeleton key={i} className="h-12 w-full" />)}</div>
        ) : messages && messages.length > 0 ? (
          <div className="space-y-3">
            {messages.map(msg => (
              <div key={msg.id} className={`p-3 rounded-lg text-sm ${msg.is_staff ? "bg-primary/10 ml-4" : "bg-muted mr-4"}`}>
                <div className="flex items-center justify-between mb-1">
                  <span className="font-medium text-xs">{msg.is_staff ? "Support Agent" : "You"}</span>
                  <span className="text-xs text-muted-foreground">{msg.created_at ? format(new Date(msg.created_at), "MMM d, h:mm a") : ""}</span>
                </div>
                <p className="whitespace-pre-wrap">{msg.message}</p>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-center text-sm text-muted-foreground py-4">No messages yet. Send a reply to start the conversation.</p>
        )}
      </ScrollArea>
      {ticketStatus !== "closed" && (
        <div className="flex gap-2 p-4 border-t border-border">
          <Input placeholder="Type your reply..." value={reply} onChange={(e) => setReply(e.target.value)}
            onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); handleSend(); } }} className="flex-1" />
          <Button size="sm" onClick={handleSend} disabled={addMessage.isPending} className="gap-1">
            <Send className="h-4 w-4" />{addMessage.isPending ? "..." : "Send"}
          </Button>
          <Button size="sm" variant="outline" onClick={onClose} className="gap-1">
            <X className="h-4 w-4" />Close
          </Button>
        </div>
      )}
    </div>
  );
}

export default Support;
