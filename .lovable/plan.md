

# Remaining Gaps & Final Production Wiring Plan

After deep exploration of the entire codebase, here is what remains vs Hostinger/Spaceship/Namecheap:

---

## Key Findings

The application is substantially built out (Hosting tabs, DNS management, Billing dialogs, Email forwarding/spam, Security WAF/2FA, Support threading, Notifications clear-read, WebsiteBuilder filtering). However, these specific items are still broken or missing:

### 1. Unbox Page -- Non-functional (Critical)
Spaceship's Unbox auto-activates purchased products. Current CheetiHost Unbox page has:
- "Configure" and "Open" buttons with **no onClick handlers**
- "Connect New Tool" button with **no onClick**
- "Connect" buttons on integrations with **no onClick**
- Search input not filtering integrations
- No post-purchase auto-provisioning flow

**Fix**: Wire Configure/Open buttons to navigate to respective dashboard pages. Wire Connect buttons to show toast + track integration. Add auto-provision logic that links from Checkout completion to Unbox activation. Add search filtering.

### 2. Hosting Page -- Mock Access Logs
Line 26-35: `mockLogs` array is hardcoded. Should pull from real data or at minimum show the hosting account's recent requests. Since access logs aren't stored in Supabase, keep mock but label it as "Sample logs -- connect cPanel for real data."

### 3. Landing Page -- Dead Footer Links
- "About Us", "Contact", "Careers", "Blog" all link to `/dashboard/support` -- should link to proper static pages or show "Coming Soon"
- Newsletter "Subscribe" button has no onClick handler

### 4. Navigation -- Missing links
- Top nav links Hosting/Cloud/Domains/Email go to dashboard routes (require auth) -- unauthenticated users should be redirected to pricing or login

### 5. Checkout -- No Post-Purchase Provisioning  
After payment confirmation, no edge function is called to actually provision services. The Unbox flow should trigger here.

### 6. Admin Panel -- Missing functionality
- UsersManagement: dropdown actions (Email User, Make Admin, Suspend) have no onClick handlers
- Missing bulk operations across admin pages

### 7. Settings Page -- Missing API key persistence
- API keys are stored in component state only, not persisted to `system_settings`

---

## Implementation Plan

### A. Wire Unbox Page (Complete Spaceship Unbox Feature)
Rewrite `src/pages/Unbox.tsx`:
- "Configure" navigates to `/dashboard/hosting`, `/dashboard/domains`, `/dashboard/email`, `/dashboard/cloud` respectively
- "Open" same navigation pattern
- "Connect New Tool" opens a dialog showing available integrations with connect actions
- Search input filters `availableTools` list
- Add "Recent Purchases" section pulling from `transactions` table to show what was recently bought and its activation status
- Add auto-provision status cards showing setup progress per purchased service

### B. Wire Dead Buttons & Links Across All Pages
- **Landing footer**: About/Contact/Careers/Blog -> create minimal static pages or toast "Coming Soon"
- **Landing newsletter**: Wire Subscribe button to insert email into `system_settings` key `newsletter_subscribers` or show toast
- **Navigation**: Unauthenticated Hosting/Cloud/Domains/Email links -> redirect to `/pricing`
- **Checkout confirmation**: After payment, call provisioning edge functions and redirect to `/dashboard/unbox`
- **Admin UsersManagement**: Wire "Email User", "Make Admin", "Suspend" dropdown items to real mutations

### C. Settings API Key Persistence
- Wire "Generate New Key" to insert into `system_settings` with key `api_key_{timestamp}`
- Wire "Revoke" to delete from `system_settings`
- Load existing keys from `system_settings` on mount

### D. Post-Purchase Unbox Auto-Provisioning
- In Checkout.tsx, after successful payment:
  1. Create subscription record
  2. Call appropriate provisioning edge function (provision-hosting, provision-domain, provision-vps)
  3. Navigate to `/dashboard/unbox` with success state
- In Unbox, show provisioning progress with real-time status updates via Supabase subscriptions

### E. Company Pages (About, Contact, Blog, Status)
- Create 4 minimal static pages under `src/pages/company/`
- Add routes in App.tsx
- Update footer links

---

## Files to Create (4)
- `src/pages/company/About.tsx`
- `src/pages/company/Contact.tsx`  
- `src/pages/company/Blog.tsx`
- `src/pages/company/Status.tsx`

## Files to Modify (7)
- `src/pages/Unbox.tsx` -- Full rewrite with navigation, search, purchase tracking, auto-provisioning
- `src/pages/Landing.tsx` -- Fix footer links, wire newsletter
- `src/pages/Checkout.tsx` -- Add post-purchase provisioning + Unbox redirect
- `src/pages/Settings.tsx` -- Persist API keys to system_settings
- `src/pages/admin/UsersManagement.tsx` -- Wire dropdown action handlers
- `src/components/Navigation.tsx` -- Fix unauthenticated nav link behavior
- `src/App.tsx` -- Add company page routes

## No Database Changes Required
All tables and RLS policies are already in place.

