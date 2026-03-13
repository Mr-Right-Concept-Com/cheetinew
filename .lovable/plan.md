

# Comprehensive QA Audit & Fix Plan

## Audit Findings Summary

After reviewing every page, component, sidebar, tab, button, and dropdown across all three dashboards, here are the remaining issues categorized by severity:

---

## CRITICAL: Dead Buttons / No onClick Handlers

### Admin Dashboard (8 dead actions)
1. **HostingManagement.tsx** (lines 179-181): "View Details", "Restart Server", "Suspend" dropdown items have no `onClick` handlers
2. **HostingManagement.tsx** (line 57-59): "Add Hosting" top button has no `onClick`
3. **DomainsManagement.tsx** (lines 185-188): "Manage DNS", "Renew SSL", "Renew Domain" dropdown items have no `onClick`
4. **DomainsManagement.tsx** (line 231): "Renew" button on expiring domains alert has no `onClick`
5. **EmailManagement.tsx** (lines 169-171): "Security Settings", "Manage Storage", "View Activity" dropdown items have no `onClick`
6. **EmailManagement.tsx** (line 50-53): "Create Email" top button has no `onClick`
7. **CloudManagement.tsx** (lines 167-169): "View Metrics", "Manage Storage", "Create Snapshot" dropdown items have no `onClick`
8. **CloudManagement.tsx** (line 50-53): "Create Resource" top button has no `onClick`
9. **BillingManagement.tsx** (lines 222-223): "Download Invoice", "Process Refund" dropdown items have no `onClick`
10. **BillingManagement.tsx** (line 84-87): "Export Report" button has no `onClick`
11. **AdminDashboard.tsx** (line 78-80): "Refresh" button has no `onClick`

### Reseller Dashboard (Mock Data Issues)
12. **ResellerClients.tsx**: Uses `demoClients` hardcoded array (line 17-23) instead of real `reseller_clients` Supabase table
13. **ResellerProducts.tsx**: Uses `defaultProducts` hardcoded array (line 15-24) instead of real `reseller_products` Supabase table — state operations are local only
14. **ResellerBilling.tsx**: Entire page uses hardcoded mock data (lines 11-41: `revenueData`, `invoices`, `transactions`, `revenueBreakdown`) — not wired to Supabase at all
15. **ResellerPayouts.tsx**: Uses hardcoded `payoutHistory` and `paymentMethods` (lines 14-26) — not wired to `reseller_payouts` table
16. **ResellerDashboard.tsx** (line 51): `topProducts` uses `Math.random()` for sold count — mock data

### User Dashboard
17. **Hosting.tsx**: "Add Hosting" button on hosting list lacks validation (empty name/plan submits)
18. **Checkout.tsx**: Billing form fields lack Zod validation
19. **Login.tsx / Signup.tsx**: Basic string checks only, no Zod schema validation, no email format check

---

## MEDIUM: Missing Form Validation (No Zod)

All forms currently use basic `if (!field) return` checks. Industry standard requires Zod schema validation with inline error messages:

1. **Login form** — needs email format validation, password min length
2. **Signup form** — needs email format, password strength indicator, name length limits
3. **Checkout billing form** — needs address, zip, country validation
4. **Create Hosting dialog** — needs name/plan/region validation
5. **Create Domain dialog** — needs domain format validation
6. **Create Email dialog** — needs email format validation
7. **Support ticket form** — needs subject/description length validation
8. **Settings profile form** — needs phone format, name length validation
9. **Settings password form** — needs strength validation
10. **Admin > Add Hosting / Create Email / Create Resource** top buttons — need dialogs with validation

---

## LOW: Missing Meta / SEO

- No `<title>` or `<meta description>` per page — only global title in `index.html`
- Company pages (About, Contact, Blog, Status) lack proper meta tags

---

## Implementation Plan

### Step 1: Wire All Admin Dashboard Dead Buttons (6 files)

**HostingManagement.tsx**: Add `onClick` handlers with `toast.info()` for View Details, mutation for Suspend (update `status` to `suspended`), and Restart (update `status` to `active`). Wire "Add Hosting" to open create dialog.

**DomainsManagement.tsx**: Wire "Manage DNS" to `toast.info` with domain details, "Renew SSL" to invoke `manage-ssl` edge function, "Renew Domain" to extend expiry. Wire renewal alert button.

**EmailManagement.tsx**: Wire dropdown items to `toast.info` detail views. Wire "Create Email" button.

**CloudManagement.tsx**: Wire dropdown items. Wire "Create Resource" button.

**BillingManagement.tsx**: Wire "Download Invoice" to generate printable view, "Process Refund" to update transaction status. Wire "Export Report" to CSV download.

**AdminDashboard.tsx**: Wire "Refresh" button to `queryClient.invalidateQueries()`.

### Step 2: Wire Reseller Dashboard to Real Supabase Data (4 files)

**ResellerClients.tsx**: Replace `demoClients` with `useQuery` fetching from `reseller_clients` table. Wire add/delete/toggle to real mutations.

**ResellerProducts.tsx**: Replace `defaultProducts` with `useResellerProducts()` hook. Wire add/edit/toggle to real mutations via `reseller_products` table.

**ResellerBilling.tsx**: Replace all hardcoded data with queries to `reseller_commissions`, `transactions`, and `invoices` tables filtered by reseller user.

**ResellerPayouts.tsx**: Replace `payoutHistory` with `useQuery` from `reseller_payouts`. Wire payout request to real `INSERT` mutation.

### Step 3: Add Zod Validation to All Forms (8 files)

Create shared validation schemas in `src/lib/validations.ts`:
```typescript
// loginSchema, signupSchema, billingSchema, hostingSchema, 
// domainSchema, emailSchema, ticketSchema, profileSchema
```

Update these files to use Zod + react-hook-form:
- `Login.tsx` — email format, password min 8 chars
- `Signup.tsx` — email, password strength, name 2-50 chars, terms required
- `Checkout.tsx` — billing address fields required, zip format
- `Hosting.tsx` — create dialog: name required 3-50 chars, plan required
- `Domains.tsx` — domain name format validation
- `Email.tsx` — email address format, quota range
- `Support.tsx` — subject 5-100 chars, description 10-2000 chars
- `Settings.tsx` — profile name 2-50 chars, phone format, password min 8

### Step 4: Add Page-Level Meta Tags (1 new hook + all pages)

Create `src/hooks/usePageMeta.ts` — sets `document.title` and meta description per page.

Apply to all pages: Dashboard ("Dashboard | CheetiHost"), Hosting ("Hosting Management | CheetiHost"), etc.

---

## Files to Create (1)
- `src/lib/validations.ts` — Zod schemas for all forms

## Files to Modify (18)
**Admin (6):** HostingManagement, DomainsManagement, EmailManagement, CloudManagement, BillingManagement, AdminDashboard
**Reseller (4):** ResellerClients, ResellerProducts, ResellerBilling, ResellerPayouts
**User (6):** Login, Signup, Checkout, Hosting (create dialog), Settings, Support
**Global (2):** index.html (base meta), all pages (document.title)

## No Database Changes Required
All tables and RLS policies already exist for the reseller data.

