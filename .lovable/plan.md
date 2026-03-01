# CheetiHost -- Full Industry-Level Implementation Plan

## Modeled on Hostinger, Spaceship, Namecheap, Hosting.com, A2Hosting

This plan covers fixing the build error, implementing a real GitHub Deploy system, and bringing all platform features to parity with the 5 reference hosting platforms.

---

## Phase 0: Fix Build Error (Immediate)

**Backups.tsx** is missing imports for `useBackups`, `useCreateBackup`, `useRestoreBackup` from `@/hooks/useBackups`. Add the import line at the top of the file.

---

## Phase 1: GitHub Deploy -- Real Implementation

Replace the "Coming Soon" placeholder with a full GitHub deployment system.

**Edge Functions to create:**

- `github-oauth` -- Handles GitHub OAuth flow (redirect + callback), exchanges code for access token, stores encrypted token in `github_connections` table
- `github-repos` -- Fetches user's repositories from GitHub API using stored token
- `github-deploy` -- Triggers a deployment: clones repo, builds, and deploys to the user's hosting account

**Frontend (`src/pages/GitHubDeploy.tsx`):**

- If no GitHub connection exists: Show "Connect GitHub" button that initiates OAuth
- If connected: Show repository list (fetched via edge function), branch selector, deploy button
- Deployment history table from `deployments` table with status badges, logs viewer
- Auto-deploy toggle per repo (webhook-based)

**Required secrets:** `GITHUB_CLIENT_ID`, `GITHUB_CLIENT_SECRET` -- will prompt user to provide these but for the main time use demo id and secret  and make it easy for admin to change later to real without rebuilding 

---

## Phase 2: Domain Search and Registration Flow (Namecheap/Spaceship Style)

**New Features:**

- Domain search bar on Landing page and Domains page with TLD pricing (.com, .net, .org, .io)
- "Beast Mode" bulk domain search (search multiple names at once, like Spaceship/Namecheap)
- Domain transfer flow with auth code input and bulk transfer support
- Domain registration form with WHOIS privacy toggle, auto-renew, and nameserver configuration
- Add DNS Record dialog (A, AAAA, CNAME, MX, TXT, NS, SRV) with validation

**Files to modify:**

- `src/pages/Domains.tsx` -- Add search, bulk operations, DNS record creation dialog
- `src/pages/Landing.tsx` -- Add domain search bar in hero section (like Hostinger/Spaceship)

---

## Phase 3: Cart and Checkout System

**New Files:**

- `src/hooks/useCart.ts` -- Cart state management with localStorage persistence
- `src/components/CartDrawer.tsx` -- Slide-out cart panel showing items, quantities, totals
- `src/pages/Checkout.tsx` -- Multi-step checkout: Review > Billing Info > Payment > Confirmation
- Route: `/checkout`

**Flow:** User adds plan/domain/service to cart from Pricing, Domains, or service pages. Cart icon in header shows item count. Checkout integrates with existing payment gateway factory (Stripe/Paystack/Flutterwave). After payment, triggers provisioning edge functions.

**Database:** Create `cart_items` table for logged-in user cart persistence.

---

## Phase 4: Hosting Page -- Industry Features (Hostinger/A2Hosting Level)

**Enhancements to `src/pages/Hosting.tsx`:**

- One-click app installer (WordPress, Joomla, Laravel, Node.js) with visual cards
- File Manager tab with directory browser UI
- SSH/SFTP access credentials display with copy-to-clipboard
- PHP version selector dropdown
- Resource usage charts (CPU, RAM, Disk, Bandwidth) using Recharts
- Access logs viewer
- Cron job manager (list, create, delete)
- Wire all dropdown buttons: Restart Server calls edge function, Create Backup triggers backup creation, SSL Certificate shows certificate status dialog

---

## Phase 5: Billing Enhancements (Hostinger/Namecheap Level)

**Enhancements to `src/pages/Billing.tsx`:**

- "Download Invoice" button generates PDF (or opens invoice detail page)
- "Change Plan" button opens plan upgrade/downgrade dialog showing current vs new plan comparison
- "Switch to Annual/Monthly" billing toggle with savings calculation
- Add Payment Method form (card number, expiry, CVC) with Stripe Elements integration
- Transaction history with filtering by date range, status, and type
- Promo code / coupon input field

---

## Phase 6: Email -- Webmail Interface (Spaceship Spacemail Level)

**Enhancements to `src/pages/Email.tsx`:**

- Inbox view with message list (sender, subject, date, read/unread status)
- Compose email dialog with rich text editor
- Folder navigation (Inbox, Sent, Drafts, Spam, Trash)
- Email forwarding rules configuration
- Autoresponder setup form
- Spam filter level configuration (Low/Medium/High/Custom)
- Storage usage bar per mailbox

Note: Since we don't have a real mail server, the inbox/compose will show the management UI with a note that webmail access is via the configured mail provider. The configuration and account management will be fully functional.

---

## Phase 7: Website Builder -- Template Gallery (Hosting.com/Hostinger Level)

**Enhancements to `src/pages/WebsiteBuilder.tsx`:**

- Template gallery with category filters (Business, Portfolio, Blog, E-commerce, Landing Page)
- Template preview cards with "Use Template" and "Preview" buttons
- Site list showing user's builder sites with edit/publish/delete actions
- AI site generator prompt input ("Describe your website and we'll build it")
- Publish/unpublish toggle per site
- Custom domain assignment per builder site

---

## Phase 8: Security Center -- WAF and Scanning (Spaceship Level)

**Enhancements to `src/pages/Security.tsx`:**

- WAF toggle that persists state to `system_settings`
- Security scan button that creates an audit log entry and shows scan results
- IP blocklist manager (add/remove IPs)
- Two-factor authentication setup (enable/disable 2FA)
- Login activity log from `audit_logs`
- SSL certificate management per domain with renew/install buttons

---

## Phase 9: Support -- Live Chat and Knowledge Base (Hostinger Level)

**Enhancements to `src/pages/Support.tsx`:**

- Live chat widget integration (CheetiAI chatbot for instant answers)
- Knowledge base section with searchable articles (stored in system_settings or a new table)
- Video tutorial cards with embedded video player
- Ticket detail view with message thread (using `ticket_messages` table)
- Ticket status updates (open/in-progress/resolved)
- Real-time stats from actual ticket data

---

## Phase 10: Notifications -- Full Category Filtering

**Enhancements to `src/pages/Notifications.tsx`:**

- Category tabs (Services, Billing, Security, Updates) filter notifications by `category` field
- "Clear All" deletes all read notifications
- Mark individual notifications as read/unread
- Notification preferences page (email/push/in-app toggles per category)

---

## Phase 11: Landing Page -- Industry-Level Hero (Hostinger/Spaceship Style)

**Enhancements to `src/pages/Landing.tsx`:**

- Hero section with domain search bar (Register/Transfer tabs like Spaceship)
- Animated stats counter (sites hosted, domains managed, uptime percentage)
- Customer testimonials carousel
- Feature comparison table (CheetiHost vs competitors)
- Trust badges (Trustpilot rating, money-back guarantee, uptime SLA)
- Dynamic pricing section from `plans` table (already done in Pricing.tsx, replicate here)

---

## Phase 12: Pricing Page -- Plan Comparison (A2Hosting/Namecheap Level)

**Enhancements to `src/pages/Pricing.tsx`:**

- Billing period toggle (Monthly / Annually / Biennially) with savings badges
- Feature comparison matrix across all plans
- "Add to Cart" buttons that integrate with the cart system
- Money-back guarantee badge
- FAQ accordion section

---

## Technical Implementation Details

### New Database Tables

- `cart_items` (user_id, plan_id, item_type, quantity, price, metadata, created_at)

### New Edge Functions

- `github-oauth` -- GitHub OAuth exchange
- `github-repos` -- Fetch user repos from GitHub API
- `github-deploy` -- Trigger deployment

### New Hooks

- `src/hooks/useCart.ts` -- Cart CRUD with local + DB persistence
- `src/hooks/useGitHub.ts` -- GitHub connection, repos, deployments

### New Components

- `src/components/CartDrawer.tsx` -- Cart slide-out panel
- `src/components/DomainSearch.tsx` -- Domain search with TLD pricing
- `src/components/TemplateGallery.tsx` -- Website builder templates

### New Pages

- `src/pages/Checkout.tsx` -- Multi-step checkout flow

### Modified Files (Summary)

- `src/pages/Backups.tsx` -- Fix missing imports
- `src/pages/GitHubDeploy.tsx` -- Full rebuild with OAuth + repo list + deploy
- `src/pages/Domains.tsx` -- Add search bar, DNS dialog, bulk operations
- `src/pages/Hosting.tsx` -- Add one-click apps, file manager, resource charts
- `src/pages/Billing.tsx` -- Add payment forms, invoice download, plan change
- `src/pages/Email.tsx` -- Add inbox UI, compose, folder navigation
- `src/pages/WebsiteBuilder.tsx` -- Add template gallery, site management
- `src/pages/Security.tsx` -- WAF controls, IP blocklist, scan button
- `src/pages/Support.tsx` -- Chat widget, knowledge base, ticket threads
- `src/pages/Notifications.tsx` -- Category filtering, clear all, preferences
- `src/pages/Landing.tsx` -- Domain search hero, testimonials, trust badges
- `src/pages/Pricing.tsx` -- Billing toggle, comparison matrix, add-to-cart
- `src/components/UserHeader.tsx` -- Add cart icon with item count
- `src/App.tsx` -- Add checkout route

### Execution Order

All phases will be implemented in parallel batches:

1. **Batch 1:** Phase 0 (build fix) + Phase 1 (GitHub) + Phase 3 (Cart/Checkout)
2. **Batch 2:** Phase 2 (Domains) + Phase 4 (Hosting) + Phase 5 (Billing)
3. **Batch 3:** Phase 6 (Email) + Phase 7 (Builder) + Phase 8 (Security)
4. **Batch 4:** Phase 9 (Support) + Phase 10 (Notifications) + Phase 11 (Landing) + Phase 12 (Pricing)