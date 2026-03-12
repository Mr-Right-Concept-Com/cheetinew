import { Link } from "react-router-dom";
import { Navigation } from "@/components/Navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

const posts = [
  { title: "Introducing CheetiHost AI-Powered Hosting", category: "Product", date: "Mar 10, 2026", excerpt: "We're excited to announce our new AI-powered hosting infrastructure that automatically optimizes your websites for peak performance.", slug: "#" },
  { title: "How to Choose the Right Hosting Plan", category: "Guide", date: "Mar 5, 2026", excerpt: "A comprehensive guide to selecting the perfect hosting plan for your website, from shared hosting to dedicated cloud servers.", slug: "#" },
  { title: "Website Security Best Practices for 2026", category: "Security", date: "Feb 28, 2026", excerpt: "Protect your website with these essential security practices including SSL, WAF configuration, and regular backups.", slug: "#" },
  { title: "Speed Optimization: Getting 100 on PageSpeed", category: "Performance", date: "Feb 20, 2026", excerpt: "Learn how to achieve perfect PageSpeed scores with our CDN, caching, and image optimization features.", slug: "#" },
  { title: "Scaling Your Business with Cloud VPS", category: "Cloud", date: "Feb 15, 2026", excerpt: "When shared hosting isn't enough, cloud VPS gives you the power and flexibility to grow without limits.", slug: "#" },
  { title: "Domain Name Strategy for Startups", category: "Domains", date: "Feb 10, 2026", excerpt: "How to choose, register, and protect the perfect domain name for your startup or business.", slug: "#" },
];

const Blog = () => (
  <div className="min-h-screen bg-background">
    <Navigation />
    <div className="container mx-auto px-4 pt-24 pb-16 max-w-5xl space-y-12">
      <div className="text-center space-y-4">
        <h1 className="text-4xl md:text-5xl font-bold">CheetiHost <span className="text-primary">Blog</span></h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Tips, tutorials, and news about hosting, domains, and building on the web.
        </p>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {posts.map((post, i) => (
          <Card key={i} className="hover:shadow-glow hover:border-primary/50 transition-all group cursor-pointer">
            <CardContent className="p-5 space-y-3">
              <div className="flex items-center justify-between">
                <Badge variant="outline" className="text-xs">{post.category}</Badge>
                <span className="text-xs text-muted-foreground">{post.date}</span>
              </div>
              <h3 className="font-semibold group-hover:text-primary transition-colors">{post.title}</h3>
              <p className="text-sm text-muted-foreground line-clamp-3">{post.excerpt}</p>
              <Button variant="ghost" size="sm" className="gap-1 p-0 h-auto text-primary">
                Read more <ArrowRight className="h-3 w-3" />
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  </div>
);

export default Blog;
