

# CheetiHost Launch Readiness Audit

## Current State Summary
The platform has a solid foundation with 19+ database tables, 12 edge functions, real-time data binding across most pages, and role-based access control. However, several critical gaps remain before launch readiness.

---

## CRITICAL GAPS (Must Fix Before Launch)

### 1. Cart and Checkout System -- MISSING ENTIRELY
There is no cart, checkout, or payment processing flow for users. Plans on the Pricing and Landing pages link directly to `/dashboard` or `/auth/signup` with no purchase flow. Users cannot actually buy hosting, domains, cloud instances, or any service.

**What needs to be built:**
- Cart component with add/remove items, quantity, plan configuration
- Checkout page with payment gateway integration (Stripe/Paystack/Flutterwave)
- Order confirmation and auto-provisioning after payment
- Cart persistence (localStorage + database for logged-in users)

### 2. GitHub Deploy Page -- 100% Mock Data
`src/pages/GitHubDeploy.tsx` uses hardcoded mock repos and fake deployment simulations (setTimeout-based). No real GitHub OAuth, no real build pipeline, no database persistence. This entire page is a non-functional demo.

**What needs to be fixed:**
- Either remove the page or clearly mark it as "Coming Soon"
- Or implement real GitHub OAuth + webhook-based deployment tracking

### 3. Non-Functional Action Buttons Across Pages
Many buttons throughout the app are decorative with no `onClick` handlers or real functionality:

- **Hosting page**: "Restart Server", "Create Backup", "Database Access", "SSL Certificate", "View Logs" dropdown items -- all non-functional
- **Billing page**: "Download All Invoices", "Change Plan", "Cancel" subscription, "Set Default", "Edit", "Remove" payment method, "Switch to Annual" -- all non-functional
- **Domains page**: "Add Record" (DNS), "Privacy Settings", "Renew Domain", "Lock/Unlock" -- non-functional
- **Support page**: "Start Chat" (AI and Live Chat buttons), "Watch" video tutorials -- non-functional
- **Notifications page**: "Clear All" button, tab filters (Services, Billing, Security, Updates) -- non-functional
- **Backups page**: "Save Settings" for backup frequency/retention -- not persisted
- **Security page**: WAF toggle, security scan buttons -- non-functional
- **Website Builder page**: The entire builder is a static UI with no drag-and-drop functionality

### 4. Landing Page Footer Links -- All Dead
Footer links for "About Us", "Contact", "Careers", "Blog", "Status", "Community", "Privacy Policy", "Terms of Service", "Cookie Policy" all link to `/` (the landing page itself). These need real pages or external links.

### 5. Plans Table Not Used in Pricing
The `plans` table exists in the database but the Pricing page (`src/pages/Pricing.tsx`) uses hardcoded plan data. Plans should be fetched from the database so admins can manage pricing through the admin panel.

### 6. Notification Tab Filters Incomplete
The Notifications page has tabs for "Services", "Billing", "Security", "Updates" but only "All" and "Unread" tabs have content. The other four tabs render empty.

### 7. Support Stats Hardcoded
On the Support page, "Avg Response: 2.5h", "Satisfaction: 98%", and "Help Articles: 450+" are all hardcoded values, not derived from real data.

---

## MODERATE GAPS (Should Fix Before Launch)

### 8. No Onboarding Wizard
New users land on a dashboard with zero data and no guidance. Industry competitors (Hostinger, Spaceship) have step-by-step onboarding: "Create your first site -> Register a domain -> Set up email."

### 9. Email Page Has No Send/Receive Functionality
The Email page shows mailbox management but lacks any actual webmail interface (inbox, compose, read). It only manages account settings.

### 10. Website Builder is a Placeholder
The Website Builder page shows stats and template cards but has no actual drag-and-drop builder, template selection, or site editor functionality.

### 11. Missing Error Boundaries
No error boundary components wrap page sections. A single component crash can take down the entire app.

### 12. No i18n / Localization
No internationalization framework is set up despite being a deliverable requirement.

### 13. No PWA Offline Support
`service-worker.js` and `manifest.json` exist but there's no offline detection banner, action queuing, or offline-capable views.

### 14. Copyright Year Outdated
Footer says "(c) 2025 CheetiHost" but current date is 2026.

### 15. Admin Layout Missing UserHeader
The Admin and Reseller layouts don't include the `UserHeader` component, so there's no user profile, notifications bell, or logout button visible in those layouts.

---

## LOWER PRIORITY (Post-Launch Polish)

### 16. Reseller Pages Data Coverage
Reseller dashboard pages exist but would benefit from deeper data integration testing.

### 17. Analytics Tracking (GA4)
No Google Analytics, conversion tracking, or marketing pixels are implemented.

### 18. SEO Metadata
No dynamic meta tags, structured data (schema.org), or sitemap generation.

### 19. Rate Limiting / Abuse Prevention
No client-side rate limiting on form submissions or API calls.

### 20. Accessibility Audit
No skip links, insufficient aria-labels, keyboard navigation not fully tested.

---

## Recommended Priority Order

```text
Phase 1 (Launch Blockers):
  [1] Cart + Checkout + Payment Flow
  [3] Wire all non-functional buttons
  [4] Fix dead footer links (add legal pages)
  [5] Fetch plans from database

Phase 2 (Critical Polish):
  [6] Complete notification tab filters
  [7] Replace hardcoded support stats
  [8] Add onboarding wizard
  [11] Add error boundaries
  [14] Fix copyright year
  [15] Add UserHeader to Admin/Reseller layouts

Phase 3 (Feature Completion):
  [2] GitHub Deploy -- mark "Coming Soon" or implement
  [9] Email webmail interface
  [10] Website Builder functionality
  [12] i18n framework
  [13] PWA offline support

Phase 4 (Scale & Growth):
  [16-20] Analytics, SEO, rate limiting, accessibility, reseller polish
```

---

## Technical Implementation Details

**Cart/Checkout (highest priority):** Create a `cart` table in Supabase, a `useCart` hook, CartDrawer component, and a `/checkout` page that integrates with the existing payment gateway factory. After payment confirmation via webhook, trigger the provisioning edge functions.

**Button Wiring:** Each non-functional button needs either a real API call (e.g., restart server via edge function), a dialog/form (e.g., cancel subscription confirmation), or a toast indicating the feature is being processed.

**Plans from DB:** Replace hardcoded plan arrays in Pricing.tsx and Landing.tsx with a `usePlans` hook that queries the `plans` table, allowing admins to control pricing without code changes.

**Error Boundaries:** Create a reusable `ErrorBoundary` component and wrap each major page section, providing a "Something went wrong" fallback with a retry button.


Please everything must be fix systematically in parallel no skip production-ready 
