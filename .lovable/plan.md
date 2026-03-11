# CheetiHost Batch 2-5 Implementation Plan

## Audit Findings

After reviewing all pages, here are the critical gaps vs Hostinger/Spaceship/Namecheap:

**Hosting page**: No tabbed management, no one-click apps, no file manager, no SSH credentials, no PHP selector, no resource charts, no cron jobs. Buttons just show toasts.

**Domains page**: No DNS record creation dialog (Add Record button has no onClick), no bulk transfer, no nameserver config form, no WHOIS toggle that persists, domain actions are toast-only.

**Billing page**: "Add Payment Method" button has no form, "Change Plan" shows toast only, no invoice PDF, no promo codes, no transaction history filtering.

**Email page**: Inbox tab just lists mailboxes again, no compose, forwarding tab is empty placeholder, spam tab has non-functional toggle. Dropdown items (Settings, Forwarding, Spam Rules, Delete) have no onClick handlers.

**Security page**: No WAF toggle, no IP blocklist, 2FA button non-functional, no security scan, "View Report" button non-functional.

**Support page**: "Start Chat" button non-functional, ticket "View" button does nothing, knowledge base articles non-clickable, video tutorials are placeholder boxes.

**Website Builder**: Template category tabs only show "all" content (other tabs render nothing), "Preview"/"Use" buttons non-functional, "Create from Scratch" non-functional, "Try Cheeti AI" non-functional.

**Notifications**: Category tabs work but mapping may be incomplete. Clear All deletes ALL notifications (should only clear read ones with confirmation).

**Settings page**: Missing API keys section, missing connected services, missing delete account.

**Dashboard**: Missing onboarding wizard for new users with no data.

---

## Implementation Plan (Batches 2-5)

### BATCH 2: Hosting + Domains Deep Management

**Hosting.tsx (~600 lines rewrite):**

- Add tabbed interface per hosting account: Overview | Apps | Files | Databases | SSH/SFTP | PHP | Cron Jobs | Logs
- **One-Click Apps tab**: Grid of app cards (WordPress, Laravel, Node.js, Ghost, Joomla, Drupal) with "Install" buttons that call a toast + create audit log
- **File Manager tab**: Mock directory tree UI with breadcrumb, file list table (name, size, date, permissions), upload/download/delete buttons
- **SSH/SFTP tab**: Credentials display card (host, port, username) with copy-to-clipboard buttons
- **PHP Version tab**: Dropdown selector (7.4, 8.0, 8.1, 8.2, 8.3) with "Apply" button
- **Resource Charts**: CPU, RAM, Disk, Bandwidth area charts using Recharts with mock time-series data
- **Cron Jobs tab**: Table of cron jobs with schedule/command columns, add/delete functionality
- **Access Logs tab**: Scrollable log viewer with date/IP/request/status columns
- Wire dropdown buttons to real edge function calls or meaningful actions

**Domains.tsx (~650 lines rewrite):**

- **Add DNS Record dialog**: Type selector (A, AAAA, CNAME, MX, TXT, NS, SRV), Name, Value, TTL, Priority inputs with validation, calls Supabase insert on `dns_records`
- **Bulk Transfer tab**: Textarea for multiple domains with auth codes, process button
- **Nameserver config form**: Editable ns1-ns4 inputs per domain, Save button updates `domains.nameservers`
- **WHOIS privacy toggle**: Switch component that calls Supabase update on `domains.privacy_enabled`
- **Auto-renew toggle**: Same pattern for `domains.auto_renew`
- **Domain lock toggle**: Confirmation dialog, updates `domains.transfer_lock`
- **Renew button**: Dialog with renewal period selector (1/2/3/5 years)

### BATCH 3: Billing + Email + Security

**Billing.tsx enhancements:**

- **Add Payment Method dialog**: Form with card type, last four, expiry month/year, brand. Inserts into `payment_methods` table
- **Change Plan dialog**: Shows current plan vs available plans from `plans` table with feature comparison, confirm button updates subscription
- **Invoice PDF**: Generate printable invoice view (window.print() approach) or HTML-based download
- **Promo code input**: Text field with "Apply" button (validates against system_settings or a codes table)
- **Transaction history tab**: Pull from `transactions` table with date range filter and status filter

**Email.tsx enhancements:**

- **Inbox tab**: Demo inbox UI with mock messages (sender, subject, snippet, date) with info banner "Full webmail via your mail provider"
- **Compose dialog**: To, CC, Subject, Body fields with Send button
- **Forwarding tab**: Table showing forwarding rules per mailbox with add/edit/delete. Updates `email_accounts.forwarding_address` and `forwarding_enabled`
- **Autoresponder tab**: Enable toggle, subject, message, date range fields. Updates `email_accounts.autoresponder_*` fields
- **Spam filter tab**: Radio group (Low/Medium/High/Custom) per mailbox. Updates `email_accounts.spam_filter_level`
- Wire all dropdown menu items to real actions

**Security.tsx enhancements:**

- **WAF toggle**: Switch that persists to `system_settings` key "waf_enabled"
- **Security scan button**: Creates audit_log entry with action "security.scan", shows mock scan results
- **IP Blocklist tab**: Add IP input + list of blocked IPs stored in `system_settings` key "ip_blocklist"
- **2FA setup**: Multi-step dialog (show QR code placeholder, verify code input, enable)
- **Login activity tab**: Enhanced view from `audit_logs` filtered by action "auth.*"
- Wire "View Report" and "Renew" SSL buttons

### BATCH 4: Support + Notifications + Website Builder

**Support.tsx enhancements:**

- **"Start Chat" button**: Opens CheetiAI component in expanded mode (or scrolls to embedded chat)
- **Ticket "View" button**: Expands ticket into detail view showing `ticket_messages` thread with reply form
- **Knowledge base articles**: Clickable, opens detail view with article content
- **Video tutorials**: "Watch" button opens modal with embedded video placeholder and description

**Notifications.tsx fixes:**

- Fix category mapping to match actual `notifications.category` values in DB
- "Clear All" should only delete read notifications with confirmation dialog
- Add notification preferences section (email/push toggles per category stored in system_settings)

**WebsiteBuilder.tsx enhancements:**

- Wire category tab filtering (Business/Portfolio/Shop/Blog/Marketing tabs filter template list)
- "Preview" button: Opens dialog with full-size template preview
- "Use Template" button: Creates hosting account pre-configured with template name
- "Create from Scratch": Opens dialog asking for site name + domain, creates hosting account
- "Try Cheeti AI": Opens input prompt "Describe your website", generates template recommendation
- Add "My Sites" section showing user's builder sites from hosting_accounts

### BATCH 5: Onboarding + Command Palette + Global Polish

**OnboardingWizard component:**

- Shows for users with 0 hosting accounts + 0 domains + 0 cloud instances
- Step 1: "What do you want to do?" (Build website / Register domain / Set up email / Deploy from GitHub)
- Step 2: Redirects to relevant page
- "Skip" + "Don't show again" (localStorage flag)
- Render in Dashboard.tsx when conditions met

**CommandPalette.tsx enhancement:**

- Add categories: Navigation, Services, Actions
- Add recent pages section
- Add domain/hosting account search results

**Global fixes:**

- Copyright year to 2026 in footer
- Wire remaining non-functional buttons across all pages
- Add About Us, Contact, Careers, Blog, Status pages as "Coming Soon" with real routes

### File Changes Summary

**Modified files (14):**

- `src/pages/Hosting.tsx` - Full tabbed management rebuild
- `src/pages/Domains.tsx` - DNS dialog, bulk transfer, nameserver config
- `src/pages/Billing.tsx` - Payment form, plan change dialog, invoice PDF
- `src/pages/Email.tsx` - Inbox demo, compose, forwarding, autoresponder, spam
- `src/pages/Security.tsx` - WAF, IP blocklist, 2FA, scan, login activity
- `src/pages/Support.tsx` - Chat integration, ticket threading, KB articles
- `src/pages/Notifications.tsx` - Category fix, clear all fix, preferences
- `src/pages/WebsiteBuilder.tsx` - Template filtering, preview, site creation
- `src/pages/Dashboard.tsx` - Onboarding wizard integration
- `src/components/CommandPalette.tsx` - Categories, search enhancement
- `src/pages/Landing.tsx` - Footer copyright fix
- `src/App.tsx` - Add company page routes

**New files (8):**

- `src/components/OnboardingWizard.tsx`
- `src/components/hosting/OneClickApps.tsx`
- `src/components/hosting/FileManager.tsx`
- `src/components/hosting/CronManager.tsx`
- `src/components/hosting/ResourceCharts.tsx`
- `src/components/billing/AddPaymentMethodDialog.tsx`
- `src/components/billing/ChangePlanDialog.tsx`
- `src/components/email/ComposeDialog.tsx`

### Execution Order

1. **Batch 2**: Hosting tabs + Domains DNS/transfer (highest impact on competitor parity)
2. **Batch 3**: Billing forms + Email webmail + Security WAF
3. **Batch 4**: Support threading + Notifications fix + Builder
4. **Batch 5**: Onboarding + Command palette + polish
  &nbsp;
5. Also Add The spaceship  Unbox feature  ( Bring it all together
6. Unbox™ automatically activates as part of your purchase setup, swiftly getting your products ready to launch and manage.)

&nbsp;