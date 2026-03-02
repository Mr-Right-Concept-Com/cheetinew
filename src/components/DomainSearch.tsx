import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Search, Globe, ArrowRightLeft, Zap, ShoppingCart, Loader2, Sparkles } from "lucide-react";
import { useCart } from "@/hooks/useCart";

interface TLDResult {
  tld: string;
  domain: string;
  available: boolean;
  price: number;
  renewPrice: number;
}

const TLD_PRICES: Record<string, { register: number; renew: number }> = {
  ".com": { register: 8.88, renew: 13.98 },
  ".net": { register: 11.2, renew: 15.98 },
  ".org": { register: 9.98, renew: 14.18 },
  ".io": { register: 32.88, renew: 44.98 },
  ".dev": { register: 12.98, renew: 18.98 },
  ".co": { register: 7.88, renew: 29.98 },
  ".xyz": { register: 1.98, renew: 12.98 },
  ".online": { register: 2.98, renew: 34.98 },
  ".tech": { register: 4.98, renew: 44.98 },
  ".site": { register: 1.88, renew: 34.98 },
};

const generateResults = (query: string): TLDResult[] => {
  const name = query.replace(/\.[a-z]+$/i, "").trim().toLowerCase().replace(/[^a-z0-9-]/g, "");
  if (!name) return [];
  return Object.entries(TLD_PRICES).map(([tld, prices]) => ({
    tld,
    domain: `${name}${tld}`,
    available: Math.random() > 0.3,
    price: prices.register,
    renewPrice: prices.renew,
  }));
};

interface DomainSearchProps {
  compact?: boolean;
  onNavigate?: (path: string) => void;
}

export function DomainSearch({ compact = false, onNavigate }: DomainSearchProps) {
  const [mode, setMode] = useState<string>("register");
  const [query, setQuery] = useState("");
  const [bulkQuery, setBulkQuery] = useState("");
  const [transferDomain, setTransferDomain] = useState("");
  const [transferAuth, setTransferAuth] = useState("");
  const [results, setResults] = useState<TLDResult[]>([]);
  const [searching, setSearching] = useState(false);
  const { addItem } = useCart();

  const handleSearch = async (searchQuery: string) => {
    if (!searchQuery.trim()) return;
    setSearching(true);
    // Simulate API delay
    await new Promise((r) => setTimeout(r, 800));
    setResults(generateResults(searchQuery));
    setSearching(false);
  };

  const handleBulkSearch = async () => {
    const domains = bulkQuery.split("\n").filter((d) => d.trim());
    if (!domains.length) return;
    setSearching(true);
    await new Promise((r) => setTimeout(r, 1200));
    const allResults: TLDResult[] = [];
    domains.forEach((d) => {
      const name = d.trim().replace(/\.[a-z]+$/i, "");
      const tld = d.includes(".") ? `.${d.split(".").pop()}` : ".com";
      const prices = TLD_PRICES[tld] || TLD_PRICES[".com"];
      allResults.push({
        tld,
        domain: `${name}${tld}`,
        available: Math.random() > 0.35,
        price: prices.register,
        renewPrice: prices.renew,
      });
    });
    setResults(allResults);
    setSearching(false);
  };

  const handleAddToCart = (result: TLDResult) => {
    addItem({
      type: "domain",
      name: result.domain,
      description: `Domain registration for ${result.domain}`,
      price: result.price,
      period: "yearly",
      quantity: 1,
      metadata: { tld: result.tld, renewPrice: result.renewPrice },
    });
  };

  return (
    <div className="w-full space-y-4">
      <Tabs value={mode} onValueChange={setMode} className="w-full">
        <TabsList className={`grid w-full ${compact ? "grid-cols-2" : "grid-cols-3"} max-w-md mx-auto`}>
          <TabsTrigger value="register" className="gap-2">
            <Search className="h-4 w-4" /> Register
          </TabsTrigger>
          <TabsTrigger value="transfer" className="gap-2">
            <ArrowRightLeft className="h-4 w-4" /> Transfer
          </TabsTrigger>
          {!compact && (
            <TabsTrigger value="beast" className="gap-2">
              <Zap className="h-4 w-4" /> Beast Mode
            </TabsTrigger>
          )}
        </TabsList>

        <TabsContent value="register" className="mt-4">
          <div className="flex gap-2 max-w-2xl mx-auto">
            <div className="relative flex-1">
              <Globe className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <Input
                placeholder="Find your perfect domain name..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSearch(query)}
                className="pl-10 h-12 text-base"
              />
            </div>
            <Button
              size="lg"
              onClick={() => handleSearch(query)}
              disabled={searching || !query.trim()}
              className="h-12 px-6 bg-primary hover:bg-primary/90 text-primary-foreground shadow-glow"
            >
              {searching ? <Loader2 className="h-5 w-5 animate-spin" /> : "Search"}
            </Button>
          </div>
          {/* TLD Price Chips */}
          <div className="flex flex-wrap gap-2 justify-center mt-3">
            {Object.entries(TLD_PRICES).slice(0, 6).map(([tld, p]) => (
              <Badge key={tld} variant="secondary" className="text-xs cursor-pointer hover:bg-primary/10"
                onClick={() => { setQuery((q) => q.replace(/\.[a-z]+$/i, "") + tld); }}>
                {tld} <span className="ml-1 text-primary font-bold">${p.register}</span>
              </Badge>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="transfer" className="mt-4">
          <div className="max-w-2xl mx-auto space-y-3">
            <Input
              placeholder="Domain to transfer (e.g. example.com)"
              value={transferDomain}
              onChange={(e) => setTransferDomain(e.target.value)}
              className="h-12"
            />
            <div className="flex gap-2">
              <Input
                placeholder="Authorization/EPP code"
                value={transferAuth}
                onChange={(e) => setTransferAuth(e.target.value)}
                className="h-12 flex-1"
              />
              <Button
                size="lg"
                onClick={() => {
                  if (transferDomain.trim()) {
                    addItem({
                      type: "domain",
                      name: transferDomain.trim(),
                      description: `Domain transfer for ${transferDomain.trim()}`,
                      price: 8.88,
                      period: "yearly",
                      quantity: 1,
                      metadata: { transfer: true, authCode: transferAuth },
                    });
                  }
                }}
                className="h-12 px-6"
              >
                Transfer
              </Button>
            </div>
          </div>
        </TabsContent>

        {!compact && (
          <TabsContent value="beast" className="mt-4">
            <div className="max-w-2xl mx-auto space-y-3">
              <div className="flex items-center gap-2 mb-2">
                <Sparkles className="h-5 w-5 text-primary" />
                <span className="text-sm text-muted-foreground">Enter one domain per line for bulk search</span>
              </div>
              <Textarea
                placeholder={"mybrand.com\nmycompany.net\nmyproject.io"}
                value={bulkQuery}
                onChange={(e) => setBulkQuery(e.target.value)}
                rows={5}
                className="font-mono text-sm"
              />
              <Button onClick={handleBulkSearch} disabled={searching || !bulkQuery.trim()} className="w-full h-12">
                {searching ? <Loader2 className="h-5 w-5 animate-spin mr-2" /> : <Zap className="h-5 w-5 mr-2" />}
                Search All Domains
              </Button>
            </div>
          </TabsContent>
        )}
      </Tabs>

      {/* Results */}
      {results.length > 0 && (
        <div className="max-w-2xl mx-auto space-y-2 mt-6">
          <h3 className="text-lg font-semibold mb-3">
            {results.filter((r) => r.available).length} of {results.length} domains available
          </h3>
          {results.map((r) => (
            <Card key={r.domain} className={`transition-all ${r.available ? "border-primary/30 hover:border-primary/60" : "opacity-60"}`}>
              <CardContent className="flex items-center justify-between p-4">
                <div className="flex items-center gap-3">
                  <Globe className={`h-5 w-5 ${r.available ? "text-primary" : "text-muted-foreground"}`} />
                  <div>
                    <span className="font-semibold">{r.domain}</span>
                    {r.available && (
                      <p className="text-xs text-muted-foreground">Renews at ${r.renewPrice}/yr</p>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  {r.available ? (
                    <>
                      <span className="text-lg font-bold text-primary">${r.price}<span className="text-xs text-muted-foreground">/yr</span></span>
                      <Button size="sm" onClick={() => handleAddToCart(r)} className="gap-1">
                        <ShoppingCart className="h-4 w-4" /> Add
                      </Button>
                    </>
                  ) : (
                    <Badge variant="secondary">Taken</Badge>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
