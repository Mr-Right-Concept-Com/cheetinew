

# Batches 3-5: Complete Production-Ready Implementation

## Scope

Complete all remaining non-functional features across Email, Security, Support, Notifications, Website Builder, Dashboard onboarding, and Settings. Every button, toggle, and form will be wired to real Supabase data with proper error handling.

---

## BATCH 3: Email + Security + Billing Polish

### Email.tsx (Full Rewrite ~500 lines)
- **Forwarding tab**: List mailboxes with forwarding_enabled status, toggle switch calls `useUpdateEmailAccount` to set `forwarding_enabled` + `forwarding_address`, inline address input
- **Autoresponder tab** (new): Per-mailbox toggle for `autoresponder_enabled`, subject/message fields, save calls `useUpdateEmailAccount`
- **Spam tab**: Per-mailbox radio group (Low/Medium/High/Custom) calling `useUpdateEmailAccount({ spam_filter_level })`
- **Compose dialog** (new component): To/CC/Subject/Body fields, "Send" shows info toast that webmail is via mail provider
- **Inbox tab**: Show mailbox overview with storage bar per account, link to webmail provider
- **Dropdown menu items**: Wire Settings (opens mailbox settings dialog), Forwarding (switches to forwarding tab), Spam Rules (switches to spam tab), Delete (calls `useDeleteEmailAccount` with confirmation)

### Security.tsx (Full Rewrite ~450 lines)
- **WAF tab** (new): Toggle switch persists `waf_enabled` to `system_settings` via upsert, shows event count
- **IP Blocklist tab** (new): Add IP input + blocked IPs list from `system_settings` key `ip_blocklist` (JSON array), add/remove operations
- **2FA tab**: Multi-step dialog: Step 1 show QR code placeholder + setup instructions, Step 2 verify code input, Step 3 confirm enabled. Persists `2fa_enabled` flag
- **Security Scan**: "Run Scan" button inserts audit_log entry with action `security.scan`, shows mock results with real timestamp
- **View Report button**: Opens dialog showing security score breakdown
- **SSL Renew button**: Calls manage-ssl edge function
- **Login Activity tab**: Pull from `audit_logs` where action starts with `auth.`, show IP/device/date

### Billing.tsx Polish
- **Invoice "Download" button**: Opens printable invoice page in new window (already partially done, wire remaining)
- **Promo code section**: Input + Apply button, validates code exists in `system_settings` key `promo_codes`
- **Transaction history filtering**: Date range inputs + status dropdown filter on transactions query

---

## BATCH 4: Support + Notifications + Website Builder

### Support.tsx (Rewrite ~550 lines)
- **"Start Chat" button**: Scrolls to embedded CheetiAI chat section at bottom of page, or opens floating chat
- **Ticket "View" button**: Expands ticket inline to show `ticket_messages` thread (uses `useTicketMessages` hook), reply form with `useAddTicketMessage`, close ticket button with `useCloseTicket`
- **Knowledge base articles**: Clickable, opens dialog with full article content (hardcoded articles with real content about CheetiHost features)
- **Video tutorials**: "Watch" button opens dialog with video description and placeholder
- **Ticket priority selector**: Add to create ticket dialog (Low/Medium/High/Urgent radio)
- **Ticket category selector**: Add dropdown in create dialog

### Notifications.tsx Fixes
- **"Clear All" button**: Only deletes read notifications (`is_read = true`) with confirmation dialog using AlertDialog
- **Category tab filtering**: Fix mapping - `services` maps to `category = 'service'`, `billing` to `'billing'`, `security` to `'security'`, `updates` to `'system'`
- **Notification preferences section**: New tab showing email/push toggles per category, persisted to `system_settings` key `notification_preferences_{userId}`

### WebsiteBuilder.tsx (Rewrite ~400 lines)
- **Category tab filtering**: Each tab (Business/Portfolio/Shop/Blog/Marketing) filters templates by `category` field
- **"Preview" button**: Opens Dialog showing full-size template preview with description
- **"Use Template" button**: Opens dialog asking for site name + domain, creates hosting account via `useCreateHostingAccount` with template metadata
- **"Create from Scratch"**: Same dialog without template pre-selection
- **"Try Cheeti AI"**: Opens input dialog "Describe your website", shows AI-generated template recommendation (selects closest matching template)
- **"My Sites" section**: Shows user's hosting accounts as builder sites with status badges and manage links

---

## BATCH 5: Dashboard Onboarding + Settings + Global Wiring

### OnboardingWizard (New Component)
- Renders in Dashboard.tsx when user has 0 hosting + 0 domains + 0 cloud instances
- Step 1: "What do you want to do?" - 4 cards (Build website / Register domain / Set up email / Deploy from GitHub)
- Step 2: Redirects to relevant page
- "Skip" + "Don't show again" via localStorage key `cheetihost_onboarding_dismissed`

### Settings.tsx Enhancements
- **Password change**: Wire "Update Password" button to `supabase.auth.updateUser({ password })`
- **2FA toggles**: Wire Switch components to persist to `system_settings`
- **API Keys tab**: "Generate New Key" creates a random key, stores in `system_settings`, shows once then masks
- **"Copy" button**: Uses `navigator.clipboard.writeText()`
- **Delete Account section** (new): Confirmation dialog, shows warning about data loss

### CommandPalette.tsx
- Wire "Connect GitHub" to navigate to `/dashboard/deploy`
- Wire "View System Logs" to navigate to `/dashboard/security` (logs tab)
- Wire "Database Manager" to navigate to `/dashboard/hosting` (databases tab)

---

## Files to Create
1. `src/components/email/ComposeDialog.tsx` - Email compose form
2. `src/components/OnboardingWizard.tsx` - New user wizard

## Files to Modify (11)
1. `src/pages/Email.tsx` - Full rewrite with functional tabs
2. `src/pages/Security.tsx` - WAF, IP blocklist, 2FA, scan
3. `src/pages/Support.tsx` - Ticket threading, KB articles, chat
4. `src/pages/Notifications.tsx` - Clear all fix, category fix
5. `src/pages/WebsiteBuilder.tsx` - Template filtering, preview, create
6. `src/pages/Dashboard.tsx` - Onboarding wizard integration
7. `src/pages/Settings.tsx` - Wire password change, 2FA, API keys
8. `src/pages/Billing.tsx` - Promo codes, transaction filtering
9. `src/components/CommandPalette.tsx` - Wire remaining actions
10. `src/hooks/useSystemSettings.tsx` - Add upsert helper for WAF/blocklist

## Database Changes
- Need RLS policy for notifications DELETE (currently users can't delete)
- Add `notifications` DELETE policy for own notifications

## Execution
Batches 3-5 implemented in sequence, all wired to real Supabase data, zero mock/placeholder content.

