-- =====================================================
-- CHEETIHOST DATABASE FOUNDATION - COMPLETE MIGRATION
-- 19+ tables for production-ready hosting platform
-- =====================================================

-- =====================================================
-- PART 1: CORE BUSINESS TABLES
-- =====================================================

-- Domains table
CREATE TABLE public.domains (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  name text NOT NULL,
  tld text,
  status text DEFAULT 'active' CHECK (status IN ('active', 'pending', 'expired', 'transferred', 'suspended')),
  registrar text,
  registration_date timestamptz DEFAULT now(),
  expiry_date timestamptz,
  auto_renew boolean DEFAULT true,
  privacy_enabled boolean DEFAULT false,
  nameservers text[],
  transfer_lock boolean DEFAULT true,
  auth_code text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(name)
);

-- Hosting accounts table
CREATE TABLE public.hosting_accounts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  domain_id uuid REFERENCES public.domains(id) ON DELETE SET NULL,
  name text NOT NULL,
  plan text NOT NULL,
  plan_type text DEFAULT 'shared' CHECK (plan_type IN ('shared', 'vps', 'dedicated', 'wordpress', 'reseller')),
  status text DEFAULT 'active' CHECK (status IN ('active', 'pending', 'suspended', 'terminated')),
  storage_limit_gb integer DEFAULT 10,
  storage_used_gb numeric DEFAULT 0,
  bandwidth_limit_gb integer DEFAULT 100,
  bandwidth_used_gb numeric DEFAULT 0,
  databases_limit integer DEFAULT 5,
  databases_used integer DEFAULT 0,
  email_accounts_limit integer DEFAULT 10,
  email_accounts_used integer DEFAULT 0,
  region text DEFAULT 'us-east-1',
  ip_address inet,
  panel_type text,
  panel_account_id text,
  ssl_enabled boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Cloud instances (VPS) table
CREATE TABLE public.cloud_instances (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  name text NOT NULL,
  hostname text,
  type text NOT NULL,
  status text DEFAULT 'stopped' CHECK (status IN ('running', 'stopped', 'pending', 'terminated', 'error')),
  vcpu integer NOT NULL,
  ram_gb integer NOT NULL,
  disk_gb integer NOT NULL,
  disk_type text DEFAULT 'ssd',
  region text NOT NULL,
  datacenter text,
  ip_address inet,
  ipv6_address inet,
  private_ip inet,
  os text NOT NULL,
  os_version text,
  root_password_encrypted text,
  ssh_keys text[],
  monthly_cost numeric NOT NULL,
  hourly_cost numeric,
  cpu_usage numeric DEFAULT 0,
  ram_usage numeric DEFAULT 0,
  disk_usage numeric DEFAULT 0,
  network_in_gb numeric DEFAULT 0,
  network_out_gb numeric DEFAULT 0,
  backups_enabled boolean DEFAULT false,
  monitoring_enabled boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Email accounts table
CREATE TABLE public.email_accounts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  domain_id uuid REFERENCES public.domains(id) ON DELETE CASCADE,
  hosting_account_id uuid REFERENCES public.hosting_accounts(id) ON DELETE CASCADE,
  email_address text NOT NULL UNIQUE,
  display_name text,
  quota_mb integer DEFAULT 1000,
  used_mb numeric DEFAULT 0,
  status text DEFAULT 'active' CHECK (status IN ('active', 'suspended', 'disabled')),
  forwarding_enabled boolean DEFAULT false,
  forwarding_address text,
  autoresponder_enabled boolean DEFAULT false,
  autoresponder_subject text,
  autoresponder_message text,
  spam_filter_level text DEFAULT 'medium',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- =====================================================
-- PART 2: BILLING & SUBSCRIPTION TABLES
-- =====================================================

-- Plans/Products catalog
CREATE TABLE public.plans (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  slug text NOT NULL UNIQUE,
  type text NOT NULL CHECK (type IN ('hosting', 'cloud', 'domain', 'email', 'ssl', 'addon')),
  description text,
  features jsonb,
  price_monthly numeric NOT NULL,
  price_yearly numeric,
  price_biennial numeric,
  currency text DEFAULT 'USD',
  storage_gb integer,
  bandwidth_gb integer,
  is_active boolean DEFAULT true,
  is_featured boolean DEFAULT false,
  sort_order integer DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Subscriptions table
CREATE TABLE public.subscriptions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  plan_id uuid REFERENCES public.plans(id),
  plan_name text NOT NULL,
  plan_type text NOT NULL,
  resource_id uuid,
  resource_type text,
  status text DEFAULT 'active' CHECK (status IN ('active', 'cancelled', 'past_due', 'paused', 'trialing', 'incomplete')),
  amount numeric NOT NULL,
  currency text DEFAULT 'USD',
  interval text DEFAULT 'monthly' CHECK (interval IN ('monthly', 'yearly', 'biennial', 'one_time')),
  provider text,
  provider_subscription_id text,
  current_period_start timestamptz DEFAULT now(),
  current_period_end timestamptz,
  cancel_at_period_end boolean DEFAULT false,
  cancelled_at timestamptz,
  trial_start timestamptz,
  trial_end timestamptz,
  metadata jsonb,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Invoices table
CREATE TABLE public.invoices (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  invoice_number text UNIQUE,
  subscription_id uuid REFERENCES public.subscriptions(id) ON DELETE SET NULL,
  status text DEFAULT 'draft' CHECK (status IN ('draft', 'pending', 'paid', 'overdue', 'cancelled', 'refunded')),
  subtotal numeric NOT NULL DEFAULT 0,
  tax_amount numeric DEFAULT 0,
  tax_rate numeric DEFAULT 0,
  discount_amount numeric DEFAULT 0,
  total numeric NOT NULL DEFAULT 0,
  currency text DEFAULT 'USD',
  due_date timestamptz,
  paid_at timestamptz,
  payment_method text,
  notes text,
  line_items jsonb,
  billing_address jsonb,
  pdf_url text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Transactions table
CREATE TABLE public.transactions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  invoice_id uuid REFERENCES public.invoices(id) ON DELETE SET NULL,
  subscription_id uuid REFERENCES public.subscriptions(id) ON DELETE SET NULL,
  type text DEFAULT 'payment' CHECK (type IN ('payment', 'refund', 'credit', 'debit', 'payout')),
  amount numeric NOT NULL,
  currency text DEFAULT 'USD',
  status text DEFAULT 'pending' CHECK (status IN ('pending', 'completed', 'failed', 'cancelled', 'refunded')),
  provider text,
  provider_transaction_id text,
  payment_method text,
  payment_method_details jsonb,
  description text,
  metadata jsonb,
  created_at timestamptz DEFAULT now()
);

-- Payment methods table
CREATE TABLE public.payment_methods (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  type text NOT NULL CHECK (type IN ('card', 'bank', 'paypal', 'mobile_money', 'crypto')),
  provider text,
  provider_payment_method_id text,
  is_default boolean DEFAULT false,
  last_four text,
  brand text,
  exp_month integer,
  exp_year integer,
  billing_address jsonb,
  metadata jsonb,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- =====================================================
-- PART 3: RESELLER & CLIENT TABLES
-- =====================================================

-- Reseller clients table
CREATE TABLE public.reseller_clients (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  reseller_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  client_user_id uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  name text NOT NULL,
  email text NOT NULL,
  company text,
  phone text,
  status text DEFAULT 'active' CHECK (status IN ('active', 'pending', 'suspended', 'terminated')),
  total_revenue numeric DEFAULT 0,
  total_paid numeric DEFAULT 0,
  services_count integer DEFAULT 0,
  notes text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Reseller products/pricing table
CREATE TABLE public.reseller_products (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  reseller_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  base_plan_id uuid REFERENCES public.plans(id),
  name text NOT NULL,
  type text NOT NULL,
  base_price numeric NOT NULL,
  reseller_price numeric NOT NULL,
  markup_percentage numeric DEFAULT 0,
  description text,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Reseller payouts table
CREATE TABLE public.reseller_payouts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  reseller_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  amount numeric NOT NULL,
  currency text DEFAULT 'USD',
  status text DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'completed', 'failed', 'cancelled')),
  payout_method text,
  payout_details jsonb,
  period_start timestamptz,
  period_end timestamptz,
  processed_at timestamptz,
  transaction_id text,
  notes text,
  created_at timestamptz DEFAULT now()
);

-- Reseller commissions table
CREATE TABLE public.reseller_commissions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  reseller_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  client_id uuid REFERENCES public.reseller_clients(id) ON DELETE SET NULL,
  transaction_id uuid REFERENCES public.transactions(id) ON DELETE SET NULL,
  amount numeric NOT NULL,
  percentage numeric NOT NULL,
  status text DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'paid', 'cancelled')),
  payout_id uuid REFERENCES public.reseller_payouts(id) ON DELETE SET NULL,
  created_at timestamptz DEFAULT now()
);

-- =====================================================
-- PART 4: SUPPORT & COMMUNICATION TABLES
-- =====================================================

-- Support tickets table
CREATE TABLE public.support_tickets (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  ticket_number text UNIQUE,
  subject text NOT NULL,
  description text,
  category text DEFAULT 'general' CHECK (category IN ('general', 'billing', 'technical', 'sales', 'abuse')),
  priority text DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high', 'urgent')),
  status text DEFAULT 'open' CHECK (status IN ('open', 'pending', 'in_progress', 'resolved', 'closed')),
  assigned_to uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  related_service_type text,
  related_service_id uuid,
  first_response_at timestamptz,
  resolved_at timestamptz,
  satisfaction_rating integer,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Ticket messages table
CREATE TABLE public.ticket_messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  ticket_id uuid REFERENCES public.support_tickets(id) ON DELETE CASCADE NOT NULL,
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  message text NOT NULL,
  is_staff boolean DEFAULT false,
  is_internal boolean DEFAULT false,
  attachments jsonb,
  created_at timestamptz DEFAULT now()
);

-- Notifications table
CREATE TABLE public.notifications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  type text NOT NULL,
  category text DEFAULT 'system' CHECK (category IN ('system', 'billing', 'security', 'service', 'marketing')),
  title text NOT NULL,
  message text,
  is_read boolean DEFAULT false,
  action_url text,
  metadata jsonb,
  created_at timestamptz DEFAULT now()
);

-- =====================================================
-- PART 5: INFRASTRUCTURE & SECURITY TABLES
-- =====================================================

-- Backups table
CREATE TABLE public.backups (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  hosting_account_id uuid REFERENCES public.hosting_accounts(id) ON DELETE CASCADE,
  cloud_instance_id uuid REFERENCES public.cloud_instances(id) ON DELETE CASCADE,
  name text,
  type text NOT NULL CHECK (type IN ('full', 'incremental', 'database', 'files', 'snapshot')),
  size_mb numeric,
  status text DEFAULT 'pending' CHECK (status IN ('pending', 'in_progress', 'completed', 'failed', 'expired')),
  storage_path text,
  storage_provider text DEFAULT 'local',
  retention_days integer DEFAULT 30,
  is_automatic boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  expires_at timestamptz,
  completed_at timestamptz
);

-- SSL certificates table
CREATE TABLE public.ssl_certificates (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  domain_id uuid REFERENCES public.domains(id) ON DELETE CASCADE NOT NULL,
  hosting_account_id uuid REFERENCES public.hosting_accounts(id) ON DELETE SET NULL,
  type text DEFAULT 'free' CHECK (type IN ('free', 'dv', 'ov', 'ev', 'wildcard')),
  issuer text,
  status text DEFAULT 'pending' CHECK (status IN ('pending', 'active', 'expired', 'revoked', 'failed')),
  issued_at timestamptz,
  expires_at timestamptz,
  auto_renew boolean DEFAULT true,
  certificate_data text,
  private_key_encrypted text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- DNS records table
CREATE TABLE public.dns_records (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  domain_id uuid REFERENCES public.domains(id) ON DELETE CASCADE NOT NULL,
  type text NOT NULL CHECK (type IN ('A', 'AAAA', 'CNAME', 'MX', 'TXT', 'NS', 'SRV', 'CAA', 'PTR')),
  name text NOT NULL,
  value text NOT NULL,
  ttl integer DEFAULT 3600,
  priority integer,
  is_system boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- =====================================================
-- PART 6: ADMIN & SYSTEM TABLES
-- =====================================================

-- Audit logs table
CREATE TABLE public.audit_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  action text NOT NULL,
  resource_type text,
  resource_id text,
  details jsonb,
  ip_address inet,
  user_agent text,
  created_at timestamptz DEFAULT now()
);

-- Panel connections table (encrypted credentials)
CREATE TABLE public.panel_connections (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  panel_type text NOT NULL CHECK (panel_type IN ('cpanel', 'plesk', 'directadmin', 'hostinger', 'spaceship', 'custom')),
  name text NOT NULL,
  api_url text NOT NULL,
  api_token_encrypted text,
  username_encrypted text,
  password_encrypted text,
  is_active boolean DEFAULT true,
  is_default boolean DEFAULT false,
  mode text DEFAULT 'production' CHECK (mode IN ('test', 'production')),
  last_sync_at timestamptz,
  sync_status text DEFAULT 'pending',
  metadata jsonb,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Payment gateway settings table
CREATE TABLE public.payment_gateway_settings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  provider text NOT NULL UNIQUE CHECK (provider IN ('stripe', 'paystack', 'flutterwave', 'mobile_money', 'paypal', 'crypto')),
  display_name text NOT NULL,
  public_key_encrypted text,
  secret_key_encrypted text,
  webhook_secret_encrypted text,
  is_active boolean DEFAULT false,
  is_default boolean DEFAULT false,
  mode text DEFAULT 'test' CHECK (mode IN ('test', 'live')),
  supported_currencies text[],
  supported_countries text[],
  min_amount numeric,
  max_amount numeric,
  transaction_fee_percentage numeric DEFAULT 0,
  transaction_fee_fixed numeric DEFAULT 0,
  metadata jsonb,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- System settings table
CREATE TABLE public.system_settings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  key text NOT NULL UNIQUE,
  value jsonb,
  description text,
  category text DEFAULT 'general',
  is_public boolean DEFAULT false,
  updated_by uuid REFERENCES auth.users(id),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- =====================================================
-- PART 7: ENABLE ROW LEVEL SECURITY
-- =====================================================

ALTER TABLE public.domains ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.hosting_accounts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cloud_instances ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.email_accounts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.invoices ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payment_methods ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reseller_clients ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reseller_products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reseller_payouts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reseller_commissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.support_tickets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ticket_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.backups ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ssl_certificates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.dns_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.panel_connections ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payment_gateway_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.system_settings ENABLE ROW LEVEL SECURITY;

-- =====================================================
-- PART 8: RLS POLICIES - USER ACCESS
-- =====================================================

-- Domains policies
CREATE POLICY "Users can view their own domains" ON public.domains FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create their own domains" ON public.domains FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own domains" ON public.domains FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own domains" ON public.domains FOR DELETE USING (auth.uid() = user_id);

-- Hosting accounts policies
CREATE POLICY "Users can view their own hosting" ON public.hosting_accounts FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create their own hosting" ON public.hosting_accounts FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own hosting" ON public.hosting_accounts FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own hosting" ON public.hosting_accounts FOR DELETE USING (auth.uid() = user_id);

-- Cloud instances policies
CREATE POLICY "Users can view their own instances" ON public.cloud_instances FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create their own instances" ON public.cloud_instances FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own instances" ON public.cloud_instances FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own instances" ON public.cloud_instances FOR DELETE USING (auth.uid() = user_id);

-- Email accounts policies
CREATE POLICY "Users can view their own email accounts" ON public.email_accounts FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create their own email accounts" ON public.email_accounts FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own email accounts" ON public.email_accounts FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own email accounts" ON public.email_accounts FOR DELETE USING (auth.uid() = user_id);

-- Plans policies (public read for pricing pages)
CREATE POLICY "Anyone can view active plans" ON public.plans FOR SELECT USING (is_active = true);
CREATE POLICY "Admins can manage plans" ON public.plans FOR ALL USING (public.has_role(auth.uid(), 'admin'));

-- Subscriptions policies
CREATE POLICY "Users can view their own subscriptions" ON public.subscriptions FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create their own subscriptions" ON public.subscriptions FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own subscriptions" ON public.subscriptions FOR UPDATE USING (auth.uid() = user_id);

-- Invoices policies
CREATE POLICY "Users can view their own invoices" ON public.invoices FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create their own invoices" ON public.invoices FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Transactions policies
CREATE POLICY "Users can view their own transactions" ON public.transactions FOR SELECT USING (auth.uid() = user_id);

-- Payment methods policies
CREATE POLICY "Users can view their own payment methods" ON public.payment_methods FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can manage their own payment methods" ON public.payment_methods FOR ALL USING (auth.uid() = user_id);

-- Reseller clients policies
CREATE POLICY "Resellers can view their clients" ON public.reseller_clients FOR SELECT USING (auth.uid() = reseller_id);
CREATE POLICY "Resellers can manage their clients" ON public.reseller_clients FOR ALL USING (auth.uid() = reseller_id);

-- Reseller products policies
CREATE POLICY "Resellers can view their products" ON public.reseller_products FOR SELECT USING (auth.uid() = reseller_id);
CREATE POLICY "Resellers can manage their products" ON public.reseller_products FOR ALL USING (auth.uid() = reseller_id);

-- Reseller payouts policies
CREATE POLICY "Resellers can view their payouts" ON public.reseller_payouts FOR SELECT USING (auth.uid() = reseller_id);
CREATE POLICY "Resellers can request payouts" ON public.reseller_payouts FOR INSERT WITH CHECK (auth.uid() = reseller_id);

-- Reseller commissions policies
CREATE POLICY "Resellers can view their commissions" ON public.reseller_commissions FOR SELECT USING (auth.uid() = reseller_id);

-- Support tickets policies
CREATE POLICY "Users can view their own tickets" ON public.support_tickets FOR SELECT USING (auth.uid() = user_id OR auth.uid() = assigned_to);
CREATE POLICY "Users can create their own tickets" ON public.support_tickets FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own tickets" ON public.support_tickets FOR UPDATE USING (auth.uid() = user_id OR auth.uid() = assigned_to);

-- Ticket messages policies
CREATE POLICY "Users can view messages on their tickets" ON public.ticket_messages FOR SELECT USING (
  EXISTS (SELECT 1 FROM public.support_tickets WHERE id = ticket_id AND (user_id = auth.uid() OR assigned_to = auth.uid()))
);
CREATE POLICY "Users can add messages to their tickets" ON public.ticket_messages FOR INSERT WITH CHECK (
  EXISTS (SELECT 1 FROM public.support_tickets WHERE id = ticket_id AND user_id = auth.uid())
);

-- Notifications policies
CREATE POLICY "Users can view their own notifications" ON public.notifications FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can update their own notifications" ON public.notifications FOR UPDATE USING (auth.uid() = user_id);

-- Backups policies
CREATE POLICY "Users can view their own backups" ON public.backups FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create their own backups" ON public.backups FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can delete their own backups" ON public.backups FOR DELETE USING (auth.uid() = user_id);

-- SSL certificates policies
CREATE POLICY "Users can view their own SSL certs" ON public.ssl_certificates FOR SELECT USING (
  EXISTS (SELECT 1 FROM public.domains WHERE id = domain_id AND user_id = auth.uid())
);

-- DNS records policies
CREATE POLICY "Users can view their own DNS records" ON public.dns_records FOR SELECT USING (
  EXISTS (SELECT 1 FROM public.domains WHERE id = domain_id AND user_id = auth.uid())
);
CREATE POLICY "Users can manage their own DNS records" ON public.dns_records FOR ALL USING (
  EXISTS (SELECT 1 FROM public.domains WHERE id = domain_id AND user_id = auth.uid())
);

-- =====================================================
-- PART 9: RLS POLICIES - ADMIN ACCESS
-- =====================================================

CREATE POLICY "Admins can view all domains" ON public.domains FOR SELECT USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can manage all domains" ON public.domains FOR ALL USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can view all hosting" ON public.hosting_accounts FOR SELECT USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can manage all hosting" ON public.hosting_accounts FOR ALL USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can view all instances" ON public.cloud_instances FOR SELECT USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can manage all instances" ON public.cloud_instances FOR ALL USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can view all subscriptions" ON public.subscriptions FOR SELECT USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can manage all subscriptions" ON public.subscriptions FOR ALL USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can view all invoices" ON public.invoices FOR SELECT USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can manage all invoices" ON public.invoices FOR ALL USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can view all transactions" ON public.transactions FOR SELECT USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can view all tickets" ON public.support_tickets FOR SELECT USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can manage all tickets" ON public.support_tickets FOR ALL USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can view all ticket messages" ON public.ticket_messages FOR SELECT USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can manage all ticket messages" ON public.ticket_messages FOR ALL USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can view audit logs" ON public.audit_logs FOR SELECT USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can create audit logs" ON public.audit_logs FOR INSERT WITH CHECK (true);

CREATE POLICY "Admins can view panel connections" ON public.panel_connections FOR SELECT USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can manage panel connections" ON public.panel_connections FOR ALL USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can view payment settings" ON public.payment_gateway_settings FOR SELECT USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can manage payment settings" ON public.payment_gateway_settings FOR ALL USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Anyone can view public system settings" ON public.system_settings FOR SELECT USING (is_public = true);
CREATE POLICY "Admins can view all system settings" ON public.system_settings FOR SELECT USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can manage system settings" ON public.system_settings FOR ALL USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can view all reseller clients" ON public.reseller_clients FOR SELECT USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can view all reseller payouts" ON public.reseller_payouts FOR SELECT USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can manage all reseller payouts" ON public.reseller_payouts FOR ALL USING (public.has_role(auth.uid(), 'admin'));

-- =====================================================
-- PART 10: HELPER FUNCTIONS & TRIGGERS
-- =====================================================

-- Function to generate invoice numbers
CREATE OR REPLACE FUNCTION public.generate_invoice_number()
RETURNS TRIGGER AS $$
BEGIN
  NEW.invoice_number := 'INV-' || TO_CHAR(NOW(), 'YYYYMM') || '-' || LPAD(NEXTVAL('public.invoice_number_seq')::text, 6, '0');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Create sequence for invoice numbers
CREATE SEQUENCE IF NOT EXISTS public.invoice_number_seq START 1;

-- Trigger for invoice number generation
CREATE TRIGGER generate_invoice_number_trigger
  BEFORE INSERT ON public.invoices
  FOR EACH ROW
  WHEN (NEW.invoice_number IS NULL)
  EXECUTE FUNCTION public.generate_invoice_number();

-- Function to generate ticket numbers
CREATE OR REPLACE FUNCTION public.generate_ticket_number()
RETURNS TRIGGER AS $$
BEGIN
  NEW.ticket_number := 'TKT-' || LPAD(NEXTVAL('public.ticket_number_seq')::text, 8, '0');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Create sequence for ticket numbers
CREATE SEQUENCE IF NOT EXISTS public.ticket_number_seq START 1;

-- Trigger for ticket number generation
CREATE TRIGGER generate_ticket_number_trigger
  BEFORE INSERT ON public.support_tickets
  FOR EACH ROW
  WHEN (NEW.ticket_number IS NULL)
  EXECUTE FUNCTION public.generate_ticket_number();

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Add updated_at triggers to all relevant tables
CREATE TRIGGER update_domains_updated_at BEFORE UPDATE ON public.domains FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_hosting_accounts_updated_at BEFORE UPDATE ON public.hosting_accounts FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_cloud_instances_updated_at BEFORE UPDATE ON public.cloud_instances FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_email_accounts_updated_at BEFORE UPDATE ON public.email_accounts FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_plans_updated_at BEFORE UPDATE ON public.plans FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_subscriptions_updated_at BEFORE UPDATE ON public.subscriptions FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_invoices_updated_at BEFORE UPDATE ON public.invoices FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_payment_methods_updated_at BEFORE UPDATE ON public.payment_methods FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_reseller_clients_updated_at BEFORE UPDATE ON public.reseller_clients FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_reseller_products_updated_at BEFORE UPDATE ON public.reseller_products FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_support_tickets_updated_at BEFORE UPDATE ON public.support_tickets FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_ssl_certificates_updated_at BEFORE UPDATE ON public.ssl_certificates FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_dns_records_updated_at BEFORE UPDATE ON public.dns_records FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_panel_connections_updated_at BEFORE UPDATE ON public.panel_connections FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_payment_gateway_settings_updated_at BEFORE UPDATE ON public.payment_gateway_settings FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_system_settings_updated_at BEFORE UPDATE ON public.system_settings FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- =====================================================
-- PART 11: INDEXES FOR PERFORMANCE
-- =====================================================

CREATE INDEX idx_domains_user_id ON public.domains(user_id);
CREATE INDEX idx_domains_status ON public.domains(status);
CREATE INDEX idx_domains_expiry ON public.domains(expiry_date);

CREATE INDEX idx_hosting_user_id ON public.hosting_accounts(user_id);
CREATE INDEX idx_hosting_status ON public.hosting_accounts(status);

CREATE INDEX idx_cloud_user_id ON public.cloud_instances(user_id);
CREATE INDEX idx_cloud_status ON public.cloud_instances(status);

CREATE INDEX idx_email_user_id ON public.email_accounts(user_id);
CREATE INDEX idx_email_domain_id ON public.email_accounts(domain_id);

CREATE INDEX idx_subscriptions_user_id ON public.subscriptions(user_id);
CREATE INDEX idx_subscriptions_status ON public.subscriptions(status);
CREATE INDEX idx_subscriptions_plan_id ON public.subscriptions(plan_id);

CREATE INDEX idx_invoices_user_id ON public.invoices(user_id);
CREATE INDEX idx_invoices_status ON public.invoices(status);
CREATE INDEX idx_invoices_created_at ON public.invoices(created_at);

CREATE INDEX idx_transactions_user_id ON public.transactions(user_id);
CREATE INDEX idx_transactions_status ON public.transactions(status);
CREATE INDEX idx_transactions_created_at ON public.transactions(created_at);

CREATE INDEX idx_reseller_clients_reseller_id ON public.reseller_clients(reseller_id);
CREATE INDEX idx_reseller_products_reseller_id ON public.reseller_products(reseller_id);
CREATE INDEX idx_reseller_payouts_reseller_id ON public.reseller_payouts(reseller_id);
CREATE INDEX idx_reseller_commissions_reseller_id ON public.reseller_commissions(reseller_id);

CREATE INDEX idx_support_tickets_user_id ON public.support_tickets(user_id);
CREATE INDEX idx_support_tickets_status ON public.support_tickets(status);
CREATE INDEX idx_support_tickets_assigned_to ON public.support_tickets(assigned_to);

CREATE INDEX idx_ticket_messages_ticket_id ON public.ticket_messages(ticket_id);

CREATE INDEX idx_notifications_user_id ON public.notifications(user_id);
CREATE INDEX idx_notifications_is_read ON public.notifications(is_read);
CREATE INDEX idx_notifications_created_at ON public.notifications(created_at);

CREATE INDEX idx_backups_user_id ON public.backups(user_id);
CREATE INDEX idx_backups_status ON public.backups(status);

CREATE INDEX idx_ssl_domain_id ON public.ssl_certificates(domain_id);
CREATE INDEX idx_dns_domain_id ON public.dns_records(domain_id);

CREATE INDEX idx_audit_logs_user_id ON public.audit_logs(user_id);
CREATE INDEX idx_audit_logs_action ON public.audit_logs(action);
CREATE INDEX idx_audit_logs_created_at ON public.audit_logs(created_at);

-- =====================================================
-- PART 12: ENABLE REALTIME FOR KEY TABLES
-- =====================================================

ALTER PUBLICATION supabase_realtime ADD TABLE public.notifications;
ALTER PUBLICATION supabase_realtime ADD TABLE public.support_tickets;
ALTER PUBLICATION supabase_realtime ADD TABLE public.ticket_messages;
ALTER PUBLICATION supabase_realtime ADD TABLE public.cloud_instances;