
# CheetiHost -- Complete Competitor Feature Parity Implementation

## Analysis Summary: What Competitors Have That CheetiHost Lacks

After browsing all 5 platforms (Hostinger, Spaceship, Namecheap, Hosting.com, A2Hosting), here are the standout patterns and missing features mapped to implementation tasks.

---

## BATCH 1: Landing Page + Domain Search + Pricing Overhaul

### 1A. Hero Domain Search Bar (Spaceship + Namecheap + Hosting.com pattern)
All 5 competitors have a domain search bar as the primary hero element. Spaceship and Namecheap both have Register/Transfer tabs with a "Beast Mode" toggle for bulk search.

**Changes to `src/pages/Landing.tsx`:**
- Replace current mascot hero with a domain search bar hero section
- Add Register/Transfer tab toggle (like Spaceship and Namecheap)
- Add "Beast Mode" button for bulk domain search
- Show TLD pricing chips below search (.com $8.88, .net $11.20, etc.)
- Add animated stats counter section: "4M+ Clients", "150+ Countries", "99.9% Uptime", "10M+ Sites"
- Add trust badges row: Trustpilot 4.7 rating widget, money-back guarantee badge, review count
- Add "Made with CheetiHost" inspiration gallery section
- Add product category cards below hero (like Hosting.com): Shared Hosting, AI Sitebuilder, VPS, WordPress Hosting
- Add Kodee/Cheeti AI assistant floating button (like Hostinger's "Ask Kodee")
- Add newsletter subscribe form in footer (like Spaceship)
- Keep existing testimonials but enhance with real review card format

### 1B. Pricing Page Overhaul (Hostinger + Spaceship pattern)
Hostinger has: hosting type tabs (Web/VPS/WordPress/Cloud/Agency), billing period selector (1/12/24/48 months), strikethrough original prices, "MOST POPULAR" badges, "+3 months free" badges.

**Changes to `src/pages/Pricing.tsx`:**
- Add hosting type tabs at top: Web Hosting | VPS | Website Builder | Cloud | Domains | Email
- Add billing period toggle: Monthly | Yearly | Biyearly (with "BEST VALUE" badge)
- Show strikethrough original price with discount percentage badge (e.g., "85% OFF")
- Show "Renews at $X.XX/mo" below discounted price
- Add "+3 months free" or similar promotional badge
- Add "30-day money-back guarantee" + "24/7 support" + "Cancel anytime" trust strip
- Add feature comparison matrix table below plan cards (expandable "View all features")
- Add FAQ accordion section at bottom
- Add "Not sure which plan?" CTA with Cheeti AI recommendation
- Wire "Add to Cart" buttons to the cart system

### 1C. Domain Search Component (New: `src/components/DomainSearch.tsx`)
Reusable domain search component used on both Landing and Domains pages.
- Single domain search with TLD suggestions
- Beast Mode: textarea for bulk domain input (multiple domains, one per line)
- Transfer mode: domain + auth code input
- Results show availability, price per TLD, "Add to Cart" button
- Domain name generator/suggestions powered by Cheeti AI

---

## BATCH 2: Hosting Dashboard + Domains Management

### 2A. Hosting Page Enhancement (Hostinger + A2Hosting level)
Competitors have tabbed management interfaces per hosting account with deep controls.

**Changes to `src/pages/Hosting.tsx`:**
- Add tabbed interface per site: Overview | File Manager | Databases | Email | Domains | SSL | Backups | Logs | Cron Jobs
- **One-Click App Installer**: Visual cards for WordPress, Joomla, Laravel, Node.js, Ghost, Drupal with "Install" buttons
- **File Manager Tab**: Directory tree browser UI with breadcrumb path, file list with name/size/date/permissions, upload/download/delete/rename actions
- **SSH/SFTP Access**: Credentials display card with copy-to-clipboard for host, port, username, password
- **PHP Version Selector**: Dropdown to switch PHP versions (7.4, 8.0, 8.1, 8.2, 8.3)
- **Resource Usage Charts**: CPU, RAM, Disk, Bandwidth over time using Recharts (line/area charts)
- **Access Logs Viewer**: Scrollable log viewer with date/IP/request/status columns
- **Cron Job Manager**: List existing cron jobs, create new (schedule + command), delete
- **Site Migration**: "Migrate from another host" wizard with step-by-step flow
- Wire all dropdown buttons to real actions: Restart Server calls edge function, Create Backup triggers backup creation, SSL Certificate shows status dialog

### 2B. Domains Page Enhancement (Namecheap + Spaceship level)
Namecheap has: domain search in header, bulk transfer with auth codes, WHOIS privacy toggle, auto-renew toggle, nameserver presets. Spaceship has: Connection Manager, Transfer Manager, DNS management.

**Changes to `src/pages/Domains.tsx`:**
- Add domain search/register section at top of page (reuse DomainSearch component)
- Add "Bulk Transfer" tab: textarea for multiple domains with auth codes (domain, authcode per line)
- Add DNS Record creation dialog: Type selector (A, AAAA, CNAME, MX, TXT, NS, SRV), Name, Value, TTL, Priority fields with validation
- Add DNS record inline editing (click to edit, save/cancel)
- Add WHOIS privacy toggle per domain (on/off switch, persists to DB)
- Add auto-renew toggle per domain
- Add nameserver configuration form: custom nameserver inputs (ns1, ns2, ns3, ns4)
- Add domain lock/unlock toggle with confirmation dialog
- Add "Renew Domain" button with renewal period selector

---

## BATCH 3: Billing + Email + Security

### 3A. Billing Enhancements (Hostinger + Namecheap level)

**Changes to `src/pages/Billing.tsx`:**
- **Invoice PDF Download**: Generate PDF from invoice data (client-side using a simple HTML-to-print approach) or link to invoice detail page
- **Change Plan Dialog**: Shows current plan vs available plans with feature comparison, upgrade/downgrade confirmation
- **Billing Period Toggle**: Switch between Monthly/Annual with savings calculation display
- **Add Payment Method**: Form with card number, expiry, CVC inputs (Stripe Elements style UI)
- **Promo Code Input**: Coupon/promo code field with "Apply" button
- **Transaction History**: Filterable table by date range, status (completed/pending/failed), and type (payment/refund)
- **Usage-Based Billing Summary**: Show current period charges breakdown by service

### 3B. Email Page Enhancement (Spaceship Spacemail level)
Spaceship has: inbox view, compose, folders, forwarding rules, autoresponder, spam filter levels.

**Changes to `src/pages/Email.tsx`:**
- Add tabbed interface: Mailboxes | Inbox (demo) | Compose | Settings | Forwarding | Autoresponder
- **Inbox Demo View**: Message list with sender, subject, date, read/unread toggle, starring. Note banner: "Full webmail access via your configured mail provider"
- **Compose Dialog**: To/CC/BCC fields, subject, rich text body, send button
- **Folder Navigation**: Sidebar with Inbox, Sent, Drafts, Spam, Trash folders with unread counts
- **Forwarding Rules**: Table of rules with condition/action, add/edit/delete
- **Autoresponder Setup**: Enable/disable toggle, subject, message body, date range
- **Spam Filter Level**: Radio group (Low/Medium/High/Custom) with description per level
- **Storage Usage Bar**: Per-mailbox storage used vs quota with percentage

### 3C. Security Center Enhancement (Spaceship level)
Spaceship has: DNSSEC, DDoS prevention, free domain privacy, SSL redirects, suspicious login monitoring, 2FA, passkeys, Imunify360 protection.

**Changes to `src/pages/Security.tsx`:**
- **WAF Toggle**: On/off switch that persists to `system_settings` table, shows WAF event count
- **Security Scan**: Button that creates an audit log entry, shows scan results (mock scan with real log creation)
- **IP Blocklist Manager**: Add IP address input, list of blocked IPs with remove button
- **Two-Factor Authentication**: Enable/disable 2FA with QR code setup flow
- **Login Activity Log**: Table showing recent logins with date, IP, device, location, status from `audit_logs`
- **SSL Certificate Manager**: Per-domain SSL status cards with renew/install buttons
- **DNSSEC Status**: Per-domain DNSSEC enable/disable toggle
- **Suspicious Login Alerts**: Toggle email notifications for new device logins

---

## BATCH 4: Support + Notifications + Website Builder

### 4A. Support Enhancement (Hostinger level)
Hostinger has: Kodee AI assistant, knowledge base with search, video tutorials, live chat, ticket threading.

**Changes to `src/pages/Support.tsx`:**
- **CheetiAI Chat Widget**: Embedded chat interface that uses the existing CheetiAI component for instant answers
- **Knowledge Base Section**: Searchable article cards organized by category (Getting Started, Hosting, Domains, Email, Billing, Security)
- **Video Tutorials**: Cards with embedded placeholder thumbnails, "Watch" button opens modal video player
- **Ticket Detail View**: Click a ticket to expand into threaded message view using `ticket_messages` table
- **Ticket Status Updates**: Staff can update status (open/in-progress/resolved) inline
- **Live Chat Button**: Opens CheetiAI in a full-screen chat mode
- Real stats from `support_tickets` data (already partially done)

### 4B. Notifications Enhancement

**Changes to `src/pages/Notifications.tsx`:**
- Category tab filters actually filter by `category` field: Services, Billing, Security, Updates
- "Clear All" button deletes all read notifications (with confirmation)
- Individual notification mark as read/unread toggle
- **Notification Preferences Page**: Email/push/in-app toggles per category (persisted to `system_settings`)

### 4C. Website Builder Enhancement (Hosting.com + Hostinger level)
Hosting.com has: AI Sitebuilder ($4.99/mo). Hostinger has: AI Website Builder, drag-and-drop editor, template gallery.

**Changes to `src/pages/WebsiteBuilder.tsx`:**
- **Template Gallery**: Category filter tabs (Business, Portfolio, Blog, E-commerce, Landing Page) that actually filter the template list
- **Template Preview Modal**: Click "Preview" opens full-screen preview of template
- **Site List**: Show user's builder sites with status (draft/published), edit/publish/delete actions, last modified date
- **AI Site Generator**: Text input prompt "Describe your website and we'll build it" with generate button
- **Publish/Unpublish Toggle**: Per site with deploy URL display
- **Custom Domain Assignment**: Dropdown to assign a user's domain to a builder site

---

## BATCH 5: Onboarding + Command Palette + Global Polish

### 5A. Onboarding Wizard (Hostinger + Spaceship pattern)
Both competitors guide new users through: Choose product -> Configure -> Launch.

**New Component: `src/components/OnboardingWizard.tsx`**
- Step 1: "What do you want to do?" (Build a website / Register a domain / Set up email / Deploy from GitHub)
- Step 2: Based on choice, guide to relevant page with pre-filled data
- Step 3: Success confirmation with next steps
- Shows only for users with no hosting accounts, domains, or cloud instances
- "Skip" and "Don't show again" options (persisted to profile or localStorage)

### 5B. Command Palette / Launchpad Enhancement (Spaceship pattern)
Spaceship has a "Launchpad" (Ctrl+K) for instant navigation and search.

**Changes to `src/components/CommandPalette.tsx`:**
- Ensure Ctrl+K / Cmd+K opens the palette
- Add categories: Navigation, Services, Support, Admin
- Add recent items section
- Add fuzzy search across all pages, domains, hosting accounts

### 5C. Footer + Global Polish
- Update copyright to 2026 (already done in some places)
- Add Company pages: About Us, Contact, Careers, Blog, Status with real content or "Coming Soon" notices
- Add newsletter subscribe form in footer
- Add social media links in footer
- Add "Made with CheetiHost" showcase section

---

## Technical Implementation Details

### New Components
- `src/components/DomainSearch.tsx` -- Reusable domain search with Register/Transfer/Beast Mode
- `src/components/OnboardingWizard.tsx` -- Step-by-step new user guide
- `src/components/hosting/FileManager.tsx` -- File browser UI
- `src/components/hosting/OneClickApps.tsx` -- App installer cards
- `src/components/hosting/CronManager.tsx` -- Cron job CRUD
- `src/components/hosting/ResourceCharts.tsx` -- CPU/RAM/Disk/Bandwidth charts
- `src/components/billing/ChangePlanDialog.tsx` -- Plan upgrade/downgrade
- `src/components/billing/AddPaymentMethod.tsx` -- Card entry form
- `src/components/email/InboxView.tsx` -- Demo inbox UI
- `src/components/email/ComposeDialog.tsx` -- Email compose form
- `src/components/security/IPBlocklist.tsx` -- IP block/unblock manager
- `src/components/security/TwoFactorSetup.tsx` -- 2FA configuration

### Modified Pages (all existing)
- `src/pages/Landing.tsx` -- Domain search hero, stats, trust badges, product cards
- `src/pages/Pricing.tsx` -- Billing toggle, comparison matrix, FAQ, hosting type tabs
- `src/pages/Hosting.tsx` -- Tabbed management, one-click apps, file manager, resource charts
- `src/pages/Domains.tsx` -- Domain search, bulk transfer, DNS record dialog, WHOIS/nameserver config
- `src/pages/Billing.tsx` -- Invoice download, plan change, payment method form, promo codes
- `src/pages/Email.tsx` -- Inbox demo, compose, forwarding rules, autoresponder, spam filter
- `src/pages/Security.tsx` -- WAF toggle, IP blocklist, 2FA setup, login activity, DNSSEC
- `src/pages/Support.tsx` -- Chat widget, knowledge base, video tutorials, ticket threading
- `src/pages/Notifications.tsx` -- Category filtering, clear all, preferences
- `src/pages/WebsiteBuilder.tsx` -- Template filtering, site management, AI generator

### Execution Order
1. **Batch 1**: Landing hero + Domain Search component + Pricing overhaul
2. **Batch 2**: Hosting tabbed management + Domains DNS/transfer
3. **Batch 3**: Billing forms + Email webmail UI + Security WAF/2FA
4. **Batch 4**: Support chat/KB + Notifications filters + Website Builder
5. **Batch 5**: Onboarding wizard + Command palette + Footer polish
