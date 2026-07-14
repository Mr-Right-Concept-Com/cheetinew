import { useState, useEffect } from "react";
import { usePageMeta } from "@/hooks/usePageMeta";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Server, Cloud, Globe, TrendingUp, Database, Zap,
  Plus, Mail, Shield, Sparkles, ArrowRight, Rocket, HardDrive, Bell,
} from "lucide-react";
import { Link } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { useHostingAccounts, useHostingStats } from "@/hooks/useHosting";
import { useCloudInstances } from "@/hooks/useCloudInstances";
import { useDomainStats } from "@/hooks/useDomains";
import { useUnreadNotificationCount } from "@/hooks/useNotifications";
import { OnboardingWizard } from "@/components/OnboardingWizard";
import { BalanceCard, PotCard, ActivityRow } from "@/components/ui/monzo";

const Dashboard = () => {
  usePageMeta("Dashboard", "Manage your hosting, cloud, domains, and more from your CheetiHost dashboard");
  const { profile } = useAuth();
  const { data: hostingAccounts, isLoading: hostingLoading } = useHostingAccounts();
  const { data: hostingStats } = useHostingStats();
  const { data: cloudInstances, isLoading: cloudLoading } = useCloudInstances();
  const { data: domainStats } = useDomainStats();
  const { data: unreadCount } = useUnreadNotificationCount();
  const [showOnboarding, setShowOnboarding] = useState(false);

  useEffect(() => {
    const dismissed = localStorage.getItem("cheetihost_onboarding_dismissed");
    if (dismissed) return;
    if (
      hostingAccounts !== undefined &&
      cloudInstances !== undefined &&
      (hostingAccounts?.length || 0) === 0 &&
      (cloudInstances?.length || 0) === 0 &&
      (domainStats?.total || 0) === 0
    ) {
      setShowOnboarding(true);
    }
  }, [hostingAccounts, cloudInstances, domainStats]);

  const activeHosting = hostingStats?.active ?? 0;
  const totalHosting = hostingStats?.total ?? 0;
  const runningCloud = cloudInstances?.filter(i => i.status === "running").length ?? 0;
  const totalCloud = cloudInstances?.length ?? 0;
  const totalBandwidth = hostingStats?.usedBandwidthGB ?? 0;
  const bandwidthLimit = hostingStats?.totalBandwidthGB ?? 0;
  const bandwidthPercent = bandwidthLimit > 0 ? Math.min(100, Math.round((totalBandwidth / bandwidthLimit) * 100)) : 0;

  const displayName = (profile?.full_name || "there").split(" ")[0];
  const greetingHour = new Date().getHours();
  const greeting = greetingHour < 12 ? "Good morning" : greetingHour < 18 ? "Good afternoon" : "Good evening";

  return (
    <div className="min-h-screen bg-background">
      <div className="px-4 md:px-6 py-6 md:py-10 max-w-7xl mx-auto space-y-8 md:space-y-10">
        {showOnboarding && <OnboardingWizard onDismiss={() => setShowOnboarding(false)} />}

        {/* Header — Monzo-style oversized greeting */}
        <header className="flex items-start justify-between gap-4 animate-fade-in-up">
          <div className="min-w-0">
            <p className="text-sm text-muted-foreground font-medium">{greeting},</p>
            <h1 className="text-3xl md:text-5xl font-black tracking-tight leading-tight truncate">
              {displayName} <span className="inline-block animate-bounce-subtle">👋</span>
            </h1>
            <p className="text-sm md:text-base text-muted-foreground mt-2">
              Here&apos;s what&apos;s happening across your infrastructure today.
            </p>
          </div>
          <Link to="/dashboard/notifications" className="flex-shrink-0 relative inline-flex items-center justify-center w-11 h-11 rounded-full bg-card border border-border shadow-float hover:shadow-pot transition-all monzo-tap">
            <Bell className="h-5 w-5" />
            {(unreadCount ?? 0) > 0 && (
              <span className="absolute -top-0.5 -right-0.5 w-5 h-5 rounded-full bg-destructive text-destructive-foreground text-[10px] font-bold flex items-center justify-center">
                {(unreadCount ?? 0) > 9 ? "9+" : unreadCount}
              </span>
            )}
          </Link>
        </header>

        {/* Hero balance — total infrastructure */}
        <section className="animate-spring-in">
          <div className="rounded-[2rem] bg-gradient-warmth p-6 md:p-10 shadow-pot text-primary-foreground relative overflow-hidden">
            <div className="absolute -right-16 -top-16 w-64 h-64 rounded-full bg-primary-foreground/10 blur-2xl" />
            <div className="absolute -right-8 -bottom-20 w-52 h-52 rounded-full bg-primary-foreground/10 blur-2xl" />
            <div className="relative flex flex-col md:flex-row md:items-end justify-between gap-6">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider opacity-80">Total active services</p>
                <p className="balance text-6xl md:text-8xl font-black leading-none mt-2">
                  {hostingLoading ? <Skeleton className="h-20 w-32 bg-primary-foreground/20" /> : activeHosting + runningCloud + (domainStats?.active ?? 0)}
                </p>
                <p className="text-sm md:text-base opacity-90 mt-3 max-w-md">
                  {activeHosting} website{activeHosting !== 1 && "s"}, {runningCloud} cloud instance{runningCloud !== 1 && "s"}, {domainStats?.active ?? 0} domain{(domainStats?.active ?? 0) !== 1 && "s"} — all healthy.
                </p>
              </div>
              <div className="flex flex-col sm:flex-row gap-2 flex-shrink-0">
                <Link to="/dashboard/hosting"><Button size="lg" variant="secondary" className="gap-2 rounded-full font-semibold w-full sm:w-auto"><Plus className="h-4 w-4" />New website</Button></Link>
                <Link to="/pricing"><Button size="lg" variant="outline" className="gap-2 rounded-full font-semibold bg-primary-foreground/10 border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/20 w-full sm:w-auto"><Rocket className="h-4 w-4" />Upgrade</Button></Link>
              </div>
            </div>
          </div>
        </section>

        {/* Balance cards row */}
        <section className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
          <BalanceCard
            label="Websites"
            value={hostingLoading ? "—" : activeHosting}
            hint={`${totalHosting} total`}
            tone="gold"
            icon={<Server className="h-5 w-5" />}
            trend={{ direction: activeHosting > 0 ? "up" : "flat", label: activeHosting > 0 ? "Live" : "None yet" }}
          />
          <BalanceCard
            label="Cloud"
            value={cloudLoading ? "—" : runningCloud}
            hint={`${totalCloud} total`}
            tone="blue"
            icon={<Cloud className="h-5 w-5" />}
            trend={{ direction: runningCloud > 0 ? "up" : "flat", label: runningCloud > 0 ? "Running" : "Idle" }}
          />
          <BalanceCard
            label="Domains"
            value={domainStats?.total ?? 0}
            hint={`${domainStats?.active ?? 0} active`}
            tone="cool"
            icon={<Globe className="h-5 w-5" />}
          />
          <BalanceCard
            label="Bandwidth"
            value={`${totalBandwidth}`}
            hint={bandwidthLimit > 0 ? `${bandwidthPercent}% of ${bandwidthLimit} GB` : "No usage yet"}
            tone="lilac"
            icon={<TrendingUp className="h-5 w-5" />}
          />
        </section>

        {/* Pots — service tiles Monzo-style */}
        <section>
          <div className="flex items-baseline justify-between mb-4 px-1">
            <h2 className="text-xl md:text-2xl font-bold">Your services</h2>
            <Link to="/dashboard/hosting" className="text-sm font-semibold text-primary hover:underline">See all</Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
            <Link to="/dashboard/hosting" className="block">
              <PotCard
                title="Hosting"
                subtitle={`${activeHosting} of ${totalHosting || 0} active`}
                icon={<Server className="h-6 w-6" />}
                tone="gold"
                progress={totalHosting > 0 ? (activeHosting / totalHosting) * 100 : 0}
                progressLabel={bandwidthLimit > 0 ? `${bandwidthPercent}% bandwidth used` : "Ready to launch"}
              />
            </Link>
            <Link to="/dashboard/cloud" className="block">
              <PotCard
                title="Cloud instances"
                subtitle={`${runningCloud} of ${totalCloud || 0} running`}
                icon={<Cloud className="h-6 w-6" />}
                tone="blue"
                progress={totalCloud > 0 ? (runningCloud / totalCloud) * 100 : 0}
                progressLabel={totalCloud > 0 ? "Deploy more anytime" : "Deploy your first VPS"}
              />
            </Link>
            <Link to="/dashboard/domains" className="block">
              <PotCard
                title="Domains"
                subtitle={`${domainStats?.total ?? 0} in your portfolio`}
                icon={<Globe className="h-6 w-6" />}
                tone="cool"
              />
            </Link>
            <Link to="/dashboard/email" className="block">
              <PotCard
                title="Email"
                subtitle="Mailboxes & aliases"
                icon={<Mail className="h-6 w-6" />}
                tone="lilac"
              />
            </Link>
            <Link to="/dashboard/backups" className="block">
              <PotCard
                title="Backups"
                subtitle="Snapshots & restore"
                icon={<Database className="h-6 w-6" />}
                tone="coral"
              />
            </Link>
            <Link to="/dashboard/security" className="block">
              <PotCard
                title="Security"
                subtitle="SSL, 2FA & scans"
                icon={<Shield className="h-6 w-6" />}
                tone="hot"
              />
            </Link>
          </div>
        </section>

        {/* Recent websites feed */}
        <section>
          <div className="flex items-baseline justify-between mb-3 px-1">
            <h2 className="text-xl md:text-2xl font-bold">Recent websites</h2>
            <Link to="/dashboard/hosting" className="text-sm font-semibold text-primary hover:underline">Manage all</Link>
          </div>
          <div className="monzo-card p-2 md:p-3">
            {hostingLoading ? (
              <div className="space-y-2 p-3">
                {[1, 2, 3].map(i => <Skeleton key={i} className="h-14 w-full rounded-2xl" />)}
              </div>
            ) : hostingAccounts && hostingAccounts.length > 0 ? (
              <div className="divide-y divide-border/60">
                {hostingAccounts.slice(0, 4).map(site => (
                  <ActivityRow
                    key={site.id}
                    tone="gold"
                    icon={<Server className="h-5 w-5" />}
                    title={site.name}
                    subtitle={`${site.plan} • ${site.region}`}
                    amount={`${site.storage_used_gb ?? 0} GB`}
                    meta={site.status === "active" ? "Healthy" : site.status}
                    onClick={() => (window.location.href = "/dashboard/hosting")}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-10 px-4">
                <div className="w-14 h-14 mx-auto rounded-2xl bg-surface-gold text-surface-gold-foreground flex items-center justify-center">
                  <Server className="h-6 w-6" />
                </div>
                <p className="mt-4 font-semibold">No websites yet</p>
                <p className="text-sm text-muted-foreground mt-1">Launch your first site in under a minute.</p>
                <Link to="/dashboard/hosting"><Button size="sm" className="mt-4 gap-2 rounded-full"><Plus className="h-4 w-4" />Add website</Button></Link>
              </div>
            )}
          </div>
        </section>

        {/* Cloud instances feed */}
        {(cloudInstances?.length ?? 0) > 0 && (
          <section>
            <div className="flex items-baseline justify-between mb-3 px-1">
              <h2 className="text-xl md:text-2xl font-bold">Cloud instances</h2>
              <Link to="/dashboard/cloud" className="text-sm font-semibold text-primary hover:underline">Manage all</Link>
            </div>
            <div className="monzo-card p-2 md:p-3">
              <div className="divide-y divide-border/60">
                {cloudInstances!.slice(0, 4).map(instance => (
                  <ActivityRow
                    key={instance.id}
                    tone="blue"
                    icon={<Cloud className="h-5 w-5" />}
                    title={instance.name}
                    subtitle={`${instance.type} • ${instance.region}`}
                    amount={`${instance.vcpu} vCPU`}
                    meta={`${instance.ram_gb} GB RAM`}
                    onClick={() => (window.location.href = "/dashboard/cloud")}
                  />
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Next best action — Hostinger/Monzo style suggestion */}
        <section>
          <div className="rounded-3xl bg-gradient-cool p-6 md:p-8 text-primary-foreground shadow-pot relative overflow-hidden">
            <div className="absolute -right-10 -bottom-10 w-48 h-48 rounded-full bg-primary-foreground/10 blur-2xl" />
            <div className="relative flex flex-col md:flex-row md:items-center justify-between gap-5">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-2xl bg-primary-foreground/20 flex items-center justify-center flex-shrink-0">
                  <Sparkles className="h-6 w-6" />
                </div>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider opacity-80">Suggested for you</p>
                  <h3 className="text-xl md:text-2xl font-bold mt-1">
                    {activeHosting === 0 ? "Launch your first website" : "Bundle a domain with your hosting"}
                  </h3>
                  <p className="text-sm opacity-90 mt-1 max-w-md">
                    {activeHosting === 0
                      ? "Choose a template or connect a repo. We&apos;ll provision SSL and DNS automatically."
                      : "Save 20% when you add a matching domain to any active site."}
                  </p>
                </div>
              </div>
              <Link to={activeHosting === 0 ? "/dashboard/hosting" : "/dashboard/domains"} className="flex-shrink-0">
                <Button size="lg" variant="secondary" className="gap-2 rounded-full font-semibold">
                  Get started <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
            </div>
          </div>
        </section>

        {/* Quick actions strip */}
        <section className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
          <Link to="/dashboard/website-builder" className="monzo-card p-4 md:p-5 flex flex-col items-start gap-2 monzo-tap hover:-translate-y-0.5">
            <div className="w-10 h-10 rounded-xl bg-surface-lilac text-surface-lilac-foreground flex items-center justify-center"><Zap className="h-5 w-5" /></div>
            <p className="font-semibold text-sm md:text-base leading-tight">AI Website Builder</p>
            <p className="text-xs text-muted-foreground">Describe it. We build it.</p>
          </Link>
          <Link to="/dashboard/github-deploy" className="monzo-card p-4 md:p-5 flex flex-col items-start gap-2 monzo-tap hover:-translate-y-0.5">
            <div className="w-10 h-10 rounded-xl bg-surface-cash text-surface-cash-foreground flex items-center justify-center"><HardDrive className="h-5 w-5" /></div>
            <p className="font-semibold text-sm md:text-base leading-tight">Deploy from GitHub</p>
            <p className="text-xs text-muted-foreground">Push to deploy.</p>
          </Link>
          <Link to="/dashboard/backups" className="monzo-card p-4 md:p-5 flex flex-col items-start gap-2 monzo-tap hover:-translate-y-0.5">
            <div className="w-10 h-10 rounded-xl bg-surface-coral text-surface-coral-foreground flex items-center justify-center"><Database className="h-5 w-5" /></div>
            <p className="font-semibold text-sm md:text-base leading-tight">Backups</p>
            <p className="text-xs text-muted-foreground">Daily snapshots.</p>
          </Link>
          <Link to="/dashboard/support" className="monzo-card p-4 md:p-5 flex flex-col items-start gap-2 monzo-tap hover:-translate-y-0.5">
            <div className="w-10 h-10 rounded-xl bg-surface-cool text-surface-cool-foreground flex items-center justify-center"><Sparkles className="h-5 w-5" /></div>
            <p className="font-semibold text-sm md:text-base leading-tight">Ask Cheeti AI</p>
            <p className="text-xs text-muted-foreground">Instant support.</p>
          </Link>
        </section>
      </div>
    </div>
  );
};

export default Dashboard;
