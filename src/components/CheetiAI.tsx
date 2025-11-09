import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Sparkles, X, Send, Loader2 } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";

type Message = {
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
};

export const CheetiAI = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content: "Hey there! 🐆 I'm Cheeti, your AI hosting assistant. I can help you with deployments, optimizations, troubleshooting, and more. What can I help you with today?",
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const suggestedQuestions = [
    "How can I improve my site's performance?",
    "Show me my resource usage",
    "Help me deploy a new site",
    "Check my SSL certificates",
  ];

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: Message = {
      role: "user",
      content: input,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    // Simulate AI response
    setTimeout(() => {
      const aiResponse: Message = {
        role: "assistant",
        content: getAIResponse(input),
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, aiResponse]);
      setIsLoading(false);
    }, 1000);
  };

  const getAIResponse = (query: string): string => {
    const lowerQuery = query.toLowerCase();
    
    if (lowerQuery.includes("performance") || lowerQuery.includes("speed")) {
      return "I've analyzed your site's performance! 📊 Here are my recommendations:\n\n1. Enable CDN caching (could improve load time by 40%)\n2. Optimize your images (detected 15 uncompressed images)\n3. Enable HTTP/2 on your server\n\nWould you like me to apply these optimizations automatically?";
    }
    
    if (lowerQuery.includes("resource") || lowerQuery.includes("usage")) {
      return "Here's your current resource usage:\n\n💾 Storage: 45GB / 100GB (45%)\n🔄 Bandwidth: 2.1TB / Unlimited\n⚡ CPU: Average 32% this week\n🧠 RAM: 4.2GB / 8GB (52%)\n\nEverything looks healthy! Your resources are well-balanced.";
    }
    
    if (lowerQuery.includes("deploy") || lowerQuery.includes("site")) {
      return "I can help you deploy a new site! 🚀\n\nI'll guide you through:\n1. Choosing a template or uploading your code\n2. Selecting the best server region\n3. Configuring your domain\n4. Setting up SSL\n\nShall we get started?";
    }
    
    if (lowerQuery.includes("ssl") || lowerQuery.includes("certificate")) {
      return "Your SSL certificates status:\n\n✅ cheetihost.com - Active (expires Dec 15, 2025)\n✅ api.cheetihost.com - Active (expires Nov 20, 2025)\n⚠️ blog.cheetihost.com - Expiring soon (Jan 10, 2025)\n\nWould you like me to auto-renew the expiring certificate?";
    }
    
    return "That's a great question! I'm constantly learning to help you better. Here's what I can assist with:\n\n• Performance optimization\n• Resource monitoring\n• Deployment guidance\n• Security recommendations\n• Troubleshooting issues\n\nTry asking me about any of these topics!";
  };

  const handleSuggestionClick = (question: string) => {
    setInput(question);
  };

  return (
    <>
      {/* Floating Button */}
      {!isOpen && (
        <Button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 h-14 w-14 rounded-full bg-gradient-speed shadow-glow hover:scale-110 transition-transform z-50"
          size="icon"
        >
          <Sparkles className="h-6 w-6 text-primary-foreground" />
        </Button>
      )}

      {/* Chat Window */}
      {isOpen && (
        <Card className="fixed bottom-6 right-6 w-[380px] h-[600px] shadow-2xl z-50 flex flex-col bg-card/95 backdrop-blur">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4 border-b">
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="w-10 h-10 rounded-full bg-gradient-speed flex items-center justify-center">
                  <Sparkles className="h-5 w-5 text-primary-foreground" />
                </div>
                <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 rounded-full border-2 border-card" />
              </div>
              <div>
                <CardTitle className="text-lg">Cheeti AI</CardTitle>
                <Badge variant="outline" className="bg-green-500/10 text-green-500 border-green-500/20 text-xs">
                  Online
                </Badge>
              </div>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsOpen(false)}
              className="h-8 w-8"
            >
              <X className="h-4 w-4" />
            </Button>
          </CardHeader>

          <ScrollArea className="flex-1 p-4">
            <div className="space-y-4">
              {messages.map((message, index) => (
                <div
                  key={index}
                  className={`flex ${
                    message.role === "user" ? "justify-end" : "justify-start"
                  }`}
                >
                  <div
                    className={`max-w-[85%] rounded-lg p-3 ${
                      message.role === "user"
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted"
                    }`}
                  >
                    <p className="text-sm whitespace-pre-line">{message.content}</p>
                    <p className="text-xs opacity-70 mt-1">
                      {message.timestamp.toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </p>
                  </div>
                </div>
              ))}

              {isLoading && (
                <div className="flex justify-start">
                  <div className="bg-muted rounded-lg p-3">
                    <Loader2 className="h-4 w-4 animate-spin" />
                  </div>
                </div>
              )}

              {messages.length === 1 && (
                <div className="space-y-2 pt-2">
                  <p className="text-xs text-muted-foreground font-semibold">
                    Suggested questions:
                  </p>
                  {suggestedQuestions.map((question, index) => (
                    <Button
                      key={index}
                      variant="outline"
                      size="sm"
                      className="w-full justify-start text-left h-auto py-2 px-3 whitespace-normal"
                      onClick={() => handleSuggestionClick(question)}
                    >
                      <span className="text-xs">{question}</span>
                    </Button>
                  ))}
                </div>
              )}
            </div>
          </ScrollArea>

          <CardContent className="p-4 border-t">
            <div className="flex gap-2">
              <Input
                placeholder="Ask Cheeti anything..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && handleSend()}
                disabled={isLoading}
                className="flex-1"
              />
              <Button
                onClick={handleSend}
                disabled={!input.trim() || isLoading}
                size="icon"
                className="bg-primary hover:bg-primary/90"
              >
                {isLoading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Send className="h-4 w-4" />
                )}
              </Button>
            </div>
            <p className="text-xs text-muted-foreground text-center mt-2">
              Powered by Cheeti AI • Always learning 🐆
            </p>
          </CardContent>
        </Card>
      )}
    </>
  );
};
