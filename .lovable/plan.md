# CheetiHost — Competitor Parity + Monzo-Style Redesign

Goal: Match/exceed Spaceship, Hostinger, and Hosting.com on features and flows, while giving every surface a Monzo-grade UX (bold color, oversized numbers, calm hierarchy, playful micro-interactions, card-first mobile-native layouts).

This is a large multi-phase build. I'll ship it in ordered phases so you get value each cycle instead of one giant unreviewable drop.

---

## Phase 0 — Research capture (I do this before any code)

Deep-crawl each competitor with Firecrawl and archive structured notes:

- **Spaceship.com** — domains, Unbox, email, hosting, DNS, transfers, pricing UI
- **Hostinger.com** — hPanel dashboard, AI website builder, hosting plans, VPS, email, onboarding
- **Hosting.com** — cPanel wrapper, managed WP, cloud, migrations, support flows

Deliverable: `/docs/competitor-audit.md` — feature matrix (Have / Partial / Missing) mapped to CheetiHost pages + screenshots of each competitor's key screens.

---

## Phase 1 — Monzo-style design system refresh

Rebuild the visual layer only (no logic changes):

- **Tokens (`index.css`)** — keep Cheeti Gold + Digital Blue, but add Monzo-style semantic surfaces: `--surface-hot` (coral/red for alerts), `--surface-cool` (mint for success), `--surface-cash` (soft neutral cards), heavier radii (1rem–1.5rem), softer shadows, generous 24–32px spacing scale.
- **Typography** — display font for oversized balances/metrics (numbers dominate cards, Monzo signature), Inter for body. Tabular numerals on all monetary/stat values.
- **New primitives** (`src/components/ui/monzo/`):
  - `BalanceCard` — huge number, tiny label, colored pill trend
  - `PotCard` — rounded service tile (Hosting / Domains / Email / Cloud) with progress ring
  - `ActivityRow` — feed-style transaction/event row with avatar circle
  - `ActionSheet` — bottom-sheet on mobile, side-panel on desktop (replaces most modals)
  - `SegmentedTabs`, `SwipeableCarousel`, `PullRefresh`
- **Motion** — spring-based entrance on cards, number count-up on load, haptic-like tap feedback (scale 0.97).
- **Mobile-first** — every dashboard reflows to a single-column feed under 768px (current preview is 360×584).

Deliverable: refreshed tokens + primitive library + one converted page (Dashboard) as the reference implementation.

---

## Phase 2 — User dashboard (feature parity + redesign)

Redesign + fill gaps on every user-facing page:


| Page                | Competitor features to add                                                                                                                                  |
| ------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Dashboard**       | Hostinger-style "next best action" cards, uptime feed, quick-actions grid                                                                                   |
| **Hosting**         | One-click apps expansion (WordPress, Woo, Joomla, Ghost, Laravel), staging environments, Git deploy, LiteSpeed cache toggle, PHP version switcher, SSH keys |
| **Domains**         | Spaceship Unbox-style bundle view, bulk DNS editor, domain forwarding, WHOIS privacy toggle, transfer-in wizard, auction/aftermarket search                 |
| **Email**           | Titan/Hostinger-style webmail preview, aliases, forwarders, autoresponders, catch-all, spam controls, DKIM/SPF/DMARC one-click                              |
| **Cloud/VPS**       | Hostinger KVM plans, OS templates, snapshots, firewall rules, monitoring graphs, console access, backups schedule                                           |
| **Website Builder** | Hostinger Horizons–style AI prompt → site, template gallery, section editor                                                                                 |
| **Backups**         | Daily/weekly/monthly retention, restore points timeline, download .tar.gz                                                                                   |
| **Security**        | 2FA, login history, active sessions, IP allowlist, Malware/Monarx-style scan results                                                                        |
| **Billing**         | Monzo-style transaction feed, upcoming charges timeline, invoice PDFs, credit balance, referral credit                                                      |
| **Support**         | AI first-response (Kodee-style), ticket threads, live chat widget, knowledge-base search                                                                    |
| **Onboarding**      | Hostinger 5-step wizard: goal → plan → domain → template/app → deploy                                                                                       |


---

## Phase 3 — Admin dashboard

- Investor metrics hero (ARR, MRR, churn, LTV/CAC) as oversized Monzo balance cards
- User growth feed (activity stream)
- Hosting/Domain/Email/Cloud management: bulk actions, filters, saved views
- Panel connections manager (cPanel/Plesk/Hostinger/Spaceship) with health pings
- Payment gateway toggles with live status
- Role management + audit log timeline
- System settings, SMTP tester, feature flags

---

## Phase 4 — Reseller dashboard

- White-label config with live preview (Hostinger Reseller Cloud parity)
- Client management: create/suspend/upgrade, impersonate
- Products & pricing markup editor
- Commissions feed + payout requests ($100 threshold already exists)
- Custom domain + email templates (welcome / invoice / reset / alert — already wired)

---

## Phase 5 — Cross-cutting

- **PWA polish** — installable, offline shell, push notifications
- **Command palette** (⌘K) — already exists; expand actions to cover every new feature
- **Cheeti AI** — context-aware suggestions per page (already wired; extend prompts)
- **i18n scaffold** — English default, structure ready for more locales
- **SEO/meta** — real titles + descriptions per public page

---

## Technical notes

- All new UI uses semantic tokens; no hardcoded colors.
- New primitives live under `src/components/ui/monzo/` and are additive — existing shadcn components stay.
- Data comes from existing Supabase tables + edge functions; no schema changes required for Phase 1–2. Phases 3–5 may add: `staging_environments`, `ssh_keys`, `firewall_rules`, `snapshots`, `activity_feed` (I'll flag before adding).
- Panel adapters (cPanel/Plesk/Hostinger/Spaceship) already exist — new features route through them in `mode: 'test'` until real credentials are set.
- Feature flags gate anything not fully wired so nothing ships as a dead button.

---

## Scope decision I need from you

This is roughly a 5-phase build. Two questions before I start:

1. **Order** — start with Phase 1 (design system + one reference page) so you can approve the look before I roll it across every page? Or do you want me to redesign + refactor all user pages in one sweep? Yes into one sweep 
2. **Competitor emphasis** — equal weight across all three, or lean hardest on one (Spaceship's Unbox/domain UX is the most differentiated; Hostinger has the deepest feature surface; Hosting.com is the most cPanel-traditional)? All three in parallel 

Once you answer, I'll approve-and-build Phase 1,2,3 immediately in parallel delegate task to sub agents 