export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "13.0.5"
  }
  public: {
    Tables: {
      audit_logs: {
        Row: {
          action: string
          created_at: string | null
          details: Json | null
          id: string
          ip_address: unknown
          resource_id: string | null
          resource_type: string | null
          user_agent: string | null
          user_id: string | null
        }
        Insert: {
          action: string
          created_at?: string | null
          details?: Json | null
          id?: string
          ip_address?: unknown
          resource_id?: string | null
          resource_type?: string | null
          user_agent?: string | null
          user_id?: string | null
        }
        Update: {
          action?: string
          created_at?: string | null
          details?: Json | null
          id?: string
          ip_address?: unknown
          resource_id?: string | null
          resource_type?: string | null
          user_agent?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      backups: {
        Row: {
          cloud_instance_id: string | null
          completed_at: string | null
          created_at: string | null
          expires_at: string | null
          hosting_account_id: string | null
          id: string
          is_automatic: boolean | null
          name: string | null
          retention_days: number | null
          size_mb: number | null
          status: string | null
          storage_path: string | null
          storage_provider: string | null
          type: string
          user_id: string
        }
        Insert: {
          cloud_instance_id?: string | null
          completed_at?: string | null
          created_at?: string | null
          expires_at?: string | null
          hosting_account_id?: string | null
          id?: string
          is_automatic?: boolean | null
          name?: string | null
          retention_days?: number | null
          size_mb?: number | null
          status?: string | null
          storage_path?: string | null
          storage_provider?: string | null
          type: string
          user_id: string
        }
        Update: {
          cloud_instance_id?: string | null
          completed_at?: string | null
          created_at?: string | null
          expires_at?: string | null
          hosting_account_id?: string | null
          id?: string
          is_automatic?: boolean | null
          name?: string | null
          retention_days?: number | null
          size_mb?: number | null
          status?: string | null
          storage_path?: string | null
          storage_provider?: string | null
          type?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "backups_cloud_instance_id_fkey"
            columns: ["cloud_instance_id"]
            isOneToOne: false
            referencedRelation: "cloud_instances"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "backups_hosting_account_id_fkey"
            columns: ["hosting_account_id"]
            isOneToOne: false
            referencedRelation: "hosting_accounts"
            referencedColumns: ["id"]
          },
        ]
      }
      cloud_instances: {
        Row: {
          backups_enabled: boolean | null
          cpu_usage: number | null
          created_at: string | null
          datacenter: string | null
          disk_gb: number
          disk_type: string | null
          disk_usage: number | null
          hostname: string | null
          hourly_cost: number | null
          id: string
          ip_address: unknown
          ipv6_address: unknown
          monitoring_enabled: boolean | null
          monthly_cost: number
          name: string
          network_in_gb: number | null
          network_out_gb: number | null
          os: string
          os_version: string | null
          private_ip: unknown
          ram_gb: number
          ram_usage: number | null
          region: string
          root_password_encrypted: string | null
          ssh_keys: string[] | null
          status: string | null
          type: string
          updated_at: string | null
          user_id: string
          vcpu: number
        }
        Insert: {
          backups_enabled?: boolean | null
          cpu_usage?: number | null
          created_at?: string | null
          datacenter?: string | null
          disk_gb: number
          disk_type?: string | null
          disk_usage?: number | null
          hostname?: string | null
          hourly_cost?: number | null
          id?: string
          ip_address?: unknown
          ipv6_address?: unknown
          monitoring_enabled?: boolean | null
          monthly_cost: number
          name: string
          network_in_gb?: number | null
          network_out_gb?: number | null
          os: string
          os_version?: string | null
          private_ip?: unknown
          ram_gb: number
          ram_usage?: number | null
          region: string
          root_password_encrypted?: string | null
          ssh_keys?: string[] | null
          status?: string | null
          type: string
          updated_at?: string | null
          user_id: string
          vcpu: number
        }
        Update: {
          backups_enabled?: boolean | null
          cpu_usage?: number | null
          created_at?: string | null
          datacenter?: string | null
          disk_gb?: number
          disk_type?: string | null
          disk_usage?: number | null
          hostname?: string | null
          hourly_cost?: number | null
          id?: string
          ip_address?: unknown
          ipv6_address?: unknown
          monitoring_enabled?: boolean | null
          monthly_cost?: number
          name?: string
          network_in_gb?: number | null
          network_out_gb?: number | null
          os?: string
          os_version?: string | null
          private_ip?: unknown
          ram_gb?: number
          ram_usage?: number | null
          region?: string
          root_password_encrypted?: string | null
          ssh_keys?: string[] | null
          status?: string | null
          type?: string
          updated_at?: string | null
          user_id?: string
          vcpu?: number
        }
        Relationships: []
      }
      dns_records: {
        Row: {
          created_at: string | null
          domain_id: string
          id: string
          is_system: boolean | null
          name: string
          priority: number | null
          ttl: number | null
          type: string
          updated_at: string | null
          value: string
        }
        Insert: {
          created_at?: string | null
          domain_id: string
          id?: string
          is_system?: boolean | null
          name: string
          priority?: number | null
          ttl?: number | null
          type: string
          updated_at?: string | null
          value: string
        }
        Update: {
          created_at?: string | null
          domain_id?: string
          id?: string
          is_system?: boolean | null
          name?: string
          priority?: number | null
          ttl?: number | null
          type?: string
          updated_at?: string | null
          value?: string
        }
        Relationships: [
          {
            foreignKeyName: "dns_records_domain_id_fkey"
            columns: ["domain_id"]
            isOneToOne: false
            referencedRelation: "domains"
            referencedColumns: ["id"]
          },
        ]
      }
      domains: {
        Row: {
          auth_code: string | null
          auto_renew: boolean | null
          created_at: string | null
          expiry_date: string | null
          id: string
          name: string
          nameservers: string[] | null
          privacy_enabled: boolean | null
          registrar: string | null
          registration_date: string | null
          status: string | null
          tld: string | null
          transfer_lock: boolean | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          auth_code?: string | null
          auto_renew?: boolean | null
          created_at?: string | null
          expiry_date?: string | null
          id?: string
          name: string
          nameservers?: string[] | null
          privacy_enabled?: boolean | null
          registrar?: string | null
          registration_date?: string | null
          status?: string | null
          tld?: string | null
          transfer_lock?: boolean | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          auth_code?: string | null
          auto_renew?: boolean | null
          created_at?: string | null
          expiry_date?: string | null
          id?: string
          name?: string
          nameservers?: string[] | null
          privacy_enabled?: boolean | null
          registrar?: string | null
          registration_date?: string | null
          status?: string | null
          tld?: string | null
          transfer_lock?: boolean | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      email_accounts: {
        Row: {
          autoresponder_enabled: boolean | null
          autoresponder_message: string | null
          autoresponder_subject: string | null
          created_at: string | null
          display_name: string | null
          domain_id: string | null
          email_address: string
          forwarding_address: string | null
          forwarding_enabled: boolean | null
          hosting_account_id: string | null
          id: string
          quota_mb: number | null
          spam_filter_level: string | null
          status: string | null
          updated_at: string | null
          used_mb: number | null
          user_id: string
        }
        Insert: {
          autoresponder_enabled?: boolean | null
          autoresponder_message?: string | null
          autoresponder_subject?: string | null
          created_at?: string | null
          display_name?: string | null
          domain_id?: string | null
          email_address: string
          forwarding_address?: string | null
          forwarding_enabled?: boolean | null
          hosting_account_id?: string | null
          id?: string
          quota_mb?: number | null
          spam_filter_level?: string | null
          status?: string | null
          updated_at?: string | null
          used_mb?: number | null
          user_id: string
        }
        Update: {
          autoresponder_enabled?: boolean | null
          autoresponder_message?: string | null
          autoresponder_subject?: string | null
          created_at?: string | null
          display_name?: string | null
          domain_id?: string | null
          email_address?: string
          forwarding_address?: string | null
          forwarding_enabled?: boolean | null
          hosting_account_id?: string | null
          id?: string
          quota_mb?: number | null
          spam_filter_level?: string | null
          status?: string | null
          updated_at?: string | null
          used_mb?: number | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "email_accounts_domain_id_fkey"
            columns: ["domain_id"]
            isOneToOne: false
            referencedRelation: "domains"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "email_accounts_hosting_account_id_fkey"
            columns: ["hosting_account_id"]
            isOneToOne: false
            referencedRelation: "hosting_accounts"
            referencedColumns: ["id"]
          },
        ]
      }
      hosting_accounts: {
        Row: {
          bandwidth_limit_gb: number | null
          bandwidth_used_gb: number | null
          created_at: string | null
          databases_limit: number | null
          databases_used: number | null
          domain_id: string | null
          email_accounts_limit: number | null
          email_accounts_used: number | null
          id: string
          ip_address: unknown
          name: string
          panel_account_id: string | null
          panel_type: string | null
          plan: string
          plan_type: string | null
          region: string | null
          ssl_enabled: boolean | null
          status: string | null
          storage_limit_gb: number | null
          storage_used_gb: number | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          bandwidth_limit_gb?: number | null
          bandwidth_used_gb?: number | null
          created_at?: string | null
          databases_limit?: number | null
          databases_used?: number | null
          domain_id?: string | null
          email_accounts_limit?: number | null
          email_accounts_used?: number | null
          id?: string
          ip_address?: unknown
          name: string
          panel_account_id?: string | null
          panel_type?: string | null
          plan: string
          plan_type?: string | null
          region?: string | null
          ssl_enabled?: boolean | null
          status?: string | null
          storage_limit_gb?: number | null
          storage_used_gb?: number | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          bandwidth_limit_gb?: number | null
          bandwidth_used_gb?: number | null
          created_at?: string | null
          databases_limit?: number | null
          databases_used?: number | null
          domain_id?: string | null
          email_accounts_limit?: number | null
          email_accounts_used?: number | null
          id?: string
          ip_address?: unknown
          name?: string
          panel_account_id?: string | null
          panel_type?: string | null
          plan?: string
          plan_type?: string | null
          region?: string | null
          ssl_enabled?: boolean | null
          status?: string | null
          storage_limit_gb?: number | null
          storage_used_gb?: number | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "hosting_accounts_domain_id_fkey"
            columns: ["domain_id"]
            isOneToOne: false
            referencedRelation: "domains"
            referencedColumns: ["id"]
          },
        ]
      }
      invoices: {
        Row: {
          billing_address: Json | null
          created_at: string | null
          currency: string | null
          discount_amount: number | null
          due_date: string | null
          id: string
          invoice_number: string | null
          line_items: Json | null
          notes: string | null
          paid_at: string | null
          payment_method: string | null
          pdf_url: string | null
          status: string | null
          subscription_id: string | null
          subtotal: number
          tax_amount: number | null
          tax_rate: number | null
          total: number
          updated_at: string | null
          user_id: string
        }
        Insert: {
          billing_address?: Json | null
          created_at?: string | null
          currency?: string | null
          discount_amount?: number | null
          due_date?: string | null
          id?: string
          invoice_number?: string | null
          line_items?: Json | null
          notes?: string | null
          paid_at?: string | null
          payment_method?: string | null
          pdf_url?: string | null
          status?: string | null
          subscription_id?: string | null
          subtotal?: number
          tax_amount?: number | null
          tax_rate?: number | null
          total?: number
          updated_at?: string | null
          user_id: string
        }
        Update: {
          billing_address?: Json | null
          created_at?: string | null
          currency?: string | null
          discount_amount?: number | null
          due_date?: string | null
          id?: string
          invoice_number?: string | null
          line_items?: Json | null
          notes?: string | null
          paid_at?: string | null
          payment_method?: string | null
          pdf_url?: string | null
          status?: string | null
          subscription_id?: string | null
          subtotal?: number
          tax_amount?: number | null
          tax_rate?: number | null
          total?: number
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "invoices_subscription_id_fkey"
            columns: ["subscription_id"]
            isOneToOne: false
            referencedRelation: "subscriptions"
            referencedColumns: ["id"]
          },
        ]
      }
      notifications: {
        Row: {
          action_url: string | null
          category: string | null
          created_at: string | null
          id: string
          is_read: boolean | null
          message: string | null
          metadata: Json | null
          title: string
          type: string
          user_id: string
        }
        Insert: {
          action_url?: string | null
          category?: string | null
          created_at?: string | null
          id?: string
          is_read?: boolean | null
          message?: string | null
          metadata?: Json | null
          title: string
          type: string
          user_id: string
        }
        Update: {
          action_url?: string | null
          category?: string | null
          created_at?: string | null
          id?: string
          is_read?: boolean | null
          message?: string | null
          metadata?: Json | null
          title?: string
          type?: string
          user_id?: string
        }
        Relationships: []
      }
      panel_connections: {
        Row: {
          api_token_encrypted: string | null
          api_url: string
          created_at: string | null
          id: string
          is_active: boolean | null
          is_default: boolean | null
          last_sync_at: string | null
          metadata: Json | null
          mode: string | null
          name: string
          panel_type: string
          password_encrypted: string | null
          sync_status: string | null
          updated_at: string | null
          username_encrypted: string | null
        }
        Insert: {
          api_token_encrypted?: string | null
          api_url: string
          created_at?: string | null
          id?: string
          is_active?: boolean | null
          is_default?: boolean | null
          last_sync_at?: string | null
          metadata?: Json | null
          mode?: string | null
          name: string
          panel_type: string
          password_encrypted?: string | null
          sync_status?: string | null
          updated_at?: string | null
          username_encrypted?: string | null
        }
        Update: {
          api_token_encrypted?: string | null
          api_url?: string
          created_at?: string | null
          id?: string
          is_active?: boolean | null
          is_default?: boolean | null
          last_sync_at?: string | null
          metadata?: Json | null
          mode?: string | null
          name?: string
          panel_type?: string
          password_encrypted?: string | null
          sync_status?: string | null
          updated_at?: string | null
          username_encrypted?: string | null
        }
        Relationships: []
      }
      payment_gateway_settings: {
        Row: {
          created_at: string | null
          display_name: string
          id: string
          is_active: boolean | null
          is_default: boolean | null
          max_amount: number | null
          metadata: Json | null
          min_amount: number | null
          mode: string | null
          provider: string
          public_key_encrypted: string | null
          secret_key_encrypted: string | null
          supported_countries: string[] | null
          supported_currencies: string[] | null
          transaction_fee_fixed: number | null
          transaction_fee_percentage: number | null
          updated_at: string | null
          webhook_secret_encrypted: string | null
        }
        Insert: {
          created_at?: string | null
          display_name: string
          id?: string
          is_active?: boolean | null
          is_default?: boolean | null
          max_amount?: number | null
          metadata?: Json | null
          min_amount?: number | null
          mode?: string | null
          provider: string
          public_key_encrypted?: string | null
          secret_key_encrypted?: string | null
          supported_countries?: string[] | null
          supported_currencies?: string[] | null
          transaction_fee_fixed?: number | null
          transaction_fee_percentage?: number | null
          updated_at?: string | null
          webhook_secret_encrypted?: string | null
        }
        Update: {
          created_at?: string | null
          display_name?: string
          id?: string
          is_active?: boolean | null
          is_default?: boolean | null
          max_amount?: number | null
          metadata?: Json | null
          min_amount?: number | null
          mode?: string | null
          provider?: string
          public_key_encrypted?: string | null
          secret_key_encrypted?: string | null
          supported_countries?: string[] | null
          supported_currencies?: string[] | null
          transaction_fee_fixed?: number | null
          transaction_fee_percentage?: number | null
          updated_at?: string | null
          webhook_secret_encrypted?: string | null
        }
        Relationships: []
      }
      payment_methods: {
        Row: {
          billing_address: Json | null
          brand: string | null
          created_at: string | null
          exp_month: number | null
          exp_year: number | null
          id: string
          is_default: boolean | null
          last_four: string | null
          metadata: Json | null
          provider: string | null
          provider_payment_method_id: string | null
          type: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          billing_address?: Json | null
          brand?: string | null
          created_at?: string | null
          exp_month?: number | null
          exp_year?: number | null
          id?: string
          is_default?: boolean | null
          last_four?: string | null
          metadata?: Json | null
          provider?: string | null
          provider_payment_method_id?: string | null
          type: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          billing_address?: Json | null
          brand?: string | null
          created_at?: string | null
          exp_month?: number | null
          exp_year?: number | null
          id?: string
          is_default?: boolean | null
          last_four?: string | null
          metadata?: Json | null
          provider?: string | null
          provider_payment_method_id?: string | null
          type?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      plans: {
        Row: {
          bandwidth_gb: number | null
          created_at: string | null
          currency: string | null
          description: string | null
          features: Json | null
          id: string
          is_active: boolean | null
          is_featured: boolean | null
          name: string
          price_biennial: number | null
          price_monthly: number
          price_yearly: number | null
          slug: string
          sort_order: number | null
          storage_gb: number | null
          type: string
          updated_at: string | null
        }
        Insert: {
          bandwidth_gb?: number | null
          created_at?: string | null
          currency?: string | null
          description?: string | null
          features?: Json | null
          id?: string
          is_active?: boolean | null
          is_featured?: boolean | null
          name: string
          price_biennial?: number | null
          price_monthly: number
          price_yearly?: number | null
          slug: string
          sort_order?: number | null
          storage_gb?: number | null
          type: string
          updated_at?: string | null
        }
        Update: {
          bandwidth_gb?: number | null
          created_at?: string | null
          currency?: string | null
          description?: string | null
          features?: Json | null
          id?: string
          is_active?: boolean | null
          is_featured?: boolean | null
          name?: string
          price_biennial?: number | null
          price_monthly?: number
          price_yearly?: number | null
          slug?: string
          sort_order?: number | null
          storage_gb?: number | null
          type?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          company_name: string | null
          created_at: string
          full_name: string | null
          id: string
          phone: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          avatar_url?: string | null
          company_name?: string | null
          created_at?: string
          full_name?: string | null
          id?: string
          phone?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          avatar_url?: string | null
          company_name?: string | null
          created_at?: string
          full_name?: string | null
          id?: string
          phone?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      reseller_clients: {
        Row: {
          client_user_id: string | null
          company: string | null
          created_at: string | null
          email: string
          id: string
          name: string
          notes: string | null
          phone: string | null
          reseller_id: string
          services_count: number | null
          status: string | null
          total_paid: number | null
          total_revenue: number | null
          updated_at: string | null
        }
        Insert: {
          client_user_id?: string | null
          company?: string | null
          created_at?: string | null
          email: string
          id?: string
          name: string
          notes?: string | null
          phone?: string | null
          reseller_id: string
          services_count?: number | null
          status?: string | null
          total_paid?: number | null
          total_revenue?: number | null
          updated_at?: string | null
        }
        Update: {
          client_user_id?: string | null
          company?: string | null
          created_at?: string | null
          email?: string
          id?: string
          name?: string
          notes?: string | null
          phone?: string | null
          reseller_id?: string
          services_count?: number | null
          status?: string | null
          total_paid?: number | null
          total_revenue?: number | null
          updated_at?: string | null
        }
        Relationships: []
      }
      reseller_commissions: {
        Row: {
          amount: number
          client_id: string | null
          created_at: string | null
          id: string
          payout_id: string | null
          percentage: number
          reseller_id: string
          status: string | null
          transaction_id: string | null
        }
        Insert: {
          amount: number
          client_id?: string | null
          created_at?: string | null
          id?: string
          payout_id?: string | null
          percentage: number
          reseller_id: string
          status?: string | null
          transaction_id?: string | null
        }
        Update: {
          amount?: number
          client_id?: string | null
          created_at?: string | null
          id?: string
          payout_id?: string | null
          percentage?: number
          reseller_id?: string
          status?: string | null
          transaction_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "reseller_commissions_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "reseller_clients"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "reseller_commissions_payout_id_fkey"
            columns: ["payout_id"]
            isOneToOne: false
            referencedRelation: "reseller_payouts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "reseller_commissions_transaction_id_fkey"
            columns: ["transaction_id"]
            isOneToOne: false
            referencedRelation: "transactions"
            referencedColumns: ["id"]
          },
        ]
      }
      reseller_payouts: {
        Row: {
          amount: number
          created_at: string | null
          currency: string | null
          id: string
          notes: string | null
          payout_details: Json | null
          payout_method: string | null
          period_end: string | null
          period_start: string | null
          processed_at: string | null
          reseller_id: string
          status: string | null
          transaction_id: string | null
        }
        Insert: {
          amount: number
          created_at?: string | null
          currency?: string | null
          id?: string
          notes?: string | null
          payout_details?: Json | null
          payout_method?: string | null
          period_end?: string | null
          period_start?: string | null
          processed_at?: string | null
          reseller_id: string
          status?: string | null
          transaction_id?: string | null
        }
        Update: {
          amount?: number
          created_at?: string | null
          currency?: string | null
          id?: string
          notes?: string | null
          payout_details?: Json | null
          payout_method?: string | null
          period_end?: string | null
          period_start?: string | null
          processed_at?: string | null
          reseller_id?: string
          status?: string | null
          transaction_id?: string | null
        }
        Relationships: []
      }
      reseller_products: {
        Row: {
          base_plan_id: string | null
          base_price: number
          created_at: string | null
          description: string | null
          id: string
          is_active: boolean | null
          markup_percentage: number | null
          name: string
          reseller_id: string
          reseller_price: number
          type: string
          updated_at: string | null
        }
        Insert: {
          base_plan_id?: string | null
          base_price: number
          created_at?: string | null
          description?: string | null
          id?: string
          is_active?: boolean | null
          markup_percentage?: number | null
          name: string
          reseller_id: string
          reseller_price: number
          type: string
          updated_at?: string | null
        }
        Update: {
          base_plan_id?: string | null
          base_price?: number
          created_at?: string | null
          description?: string | null
          id?: string
          is_active?: boolean | null
          markup_percentage?: number | null
          name?: string
          reseller_id?: string
          reseller_price?: number
          type?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "reseller_products_base_plan_id_fkey"
            columns: ["base_plan_id"]
            isOneToOne: false
            referencedRelation: "plans"
            referencedColumns: ["id"]
          },
        ]
      }
      ssl_certificates: {
        Row: {
          auto_renew: boolean | null
          certificate_data: string | null
          created_at: string | null
          domain_id: string
          expires_at: string | null
          hosting_account_id: string | null
          id: string
          issued_at: string | null
          issuer: string | null
          private_key_encrypted: string | null
          status: string | null
          type: string | null
          updated_at: string | null
        }
        Insert: {
          auto_renew?: boolean | null
          certificate_data?: string | null
          created_at?: string | null
          domain_id: string
          expires_at?: string | null
          hosting_account_id?: string | null
          id?: string
          issued_at?: string | null
          issuer?: string | null
          private_key_encrypted?: string | null
          status?: string | null
          type?: string | null
          updated_at?: string | null
        }
        Update: {
          auto_renew?: boolean | null
          certificate_data?: string | null
          created_at?: string | null
          domain_id?: string
          expires_at?: string | null
          hosting_account_id?: string | null
          id?: string
          issued_at?: string | null
          issuer?: string | null
          private_key_encrypted?: string | null
          status?: string | null
          type?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "ssl_certificates_domain_id_fkey"
            columns: ["domain_id"]
            isOneToOne: false
            referencedRelation: "domains"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "ssl_certificates_hosting_account_id_fkey"
            columns: ["hosting_account_id"]
            isOneToOne: false
            referencedRelation: "hosting_accounts"
            referencedColumns: ["id"]
          },
        ]
      }
      subscriptions: {
        Row: {
          amount: number
          cancel_at_period_end: boolean | null
          cancelled_at: string | null
          created_at: string | null
          currency: string | null
          current_period_end: string | null
          current_period_start: string | null
          id: string
          interval: string | null
          metadata: Json | null
          plan_id: string | null
          plan_name: string
          plan_type: string
          provider: string | null
          provider_subscription_id: string | null
          resource_id: string | null
          resource_type: string | null
          status: string | null
          trial_end: string | null
          trial_start: string | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          amount: number
          cancel_at_period_end?: boolean | null
          cancelled_at?: string | null
          created_at?: string | null
          currency?: string | null
          current_period_end?: string | null
          current_period_start?: string | null
          id?: string
          interval?: string | null
          metadata?: Json | null
          plan_id?: string | null
          plan_name: string
          plan_type: string
          provider?: string | null
          provider_subscription_id?: string | null
          resource_id?: string | null
          resource_type?: string | null
          status?: string | null
          trial_end?: string | null
          trial_start?: string | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          amount?: number
          cancel_at_period_end?: boolean | null
          cancelled_at?: string | null
          created_at?: string | null
          currency?: string | null
          current_period_end?: string | null
          current_period_start?: string | null
          id?: string
          interval?: string | null
          metadata?: Json | null
          plan_id?: string | null
          plan_name?: string
          plan_type?: string
          provider?: string | null
          provider_subscription_id?: string | null
          resource_id?: string | null
          resource_type?: string | null
          status?: string | null
          trial_end?: string | null
          trial_start?: string | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "subscriptions_plan_id_fkey"
            columns: ["plan_id"]
            isOneToOne: false
            referencedRelation: "plans"
            referencedColumns: ["id"]
          },
        ]
      }
      support_tickets: {
        Row: {
          assigned_to: string | null
          category: string | null
          created_at: string | null
          description: string | null
          first_response_at: string | null
          id: string
          priority: string | null
          related_service_id: string | null
          related_service_type: string | null
          resolved_at: string | null
          satisfaction_rating: number | null
          status: string | null
          subject: string
          ticket_number: string | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          assigned_to?: string | null
          category?: string | null
          created_at?: string | null
          description?: string | null
          first_response_at?: string | null
          id?: string
          priority?: string | null
          related_service_id?: string | null
          related_service_type?: string | null
          resolved_at?: string | null
          satisfaction_rating?: number | null
          status?: string | null
          subject: string
          ticket_number?: string | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          assigned_to?: string | null
          category?: string | null
          created_at?: string | null
          description?: string | null
          first_response_at?: string | null
          id?: string
          priority?: string | null
          related_service_id?: string | null
          related_service_type?: string | null
          resolved_at?: string | null
          satisfaction_rating?: number | null
          status?: string | null
          subject?: string
          ticket_number?: string | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      system_settings: {
        Row: {
          category: string | null
          created_at: string | null
          description: string | null
          id: string
          is_public: boolean | null
          key: string
          updated_at: string | null
          updated_by: string | null
          value: Json | null
        }
        Insert: {
          category?: string | null
          created_at?: string | null
          description?: string | null
          id?: string
          is_public?: boolean | null
          key: string
          updated_at?: string | null
          updated_by?: string | null
          value?: Json | null
        }
        Update: {
          category?: string | null
          created_at?: string | null
          description?: string | null
          id?: string
          is_public?: boolean | null
          key?: string
          updated_at?: string | null
          updated_by?: string | null
          value?: Json | null
        }
        Relationships: []
      }
      ticket_messages: {
        Row: {
          attachments: Json | null
          created_at: string | null
          id: string
          is_internal: boolean | null
          is_staff: boolean | null
          message: string
          ticket_id: string
          user_id: string
        }
        Insert: {
          attachments?: Json | null
          created_at?: string | null
          id?: string
          is_internal?: boolean | null
          is_staff?: boolean | null
          message: string
          ticket_id: string
          user_id: string
        }
        Update: {
          attachments?: Json | null
          created_at?: string | null
          id?: string
          is_internal?: boolean | null
          is_staff?: boolean | null
          message?: string
          ticket_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "ticket_messages_ticket_id_fkey"
            columns: ["ticket_id"]
            isOneToOne: false
            referencedRelation: "support_tickets"
            referencedColumns: ["id"]
          },
        ]
      }
      transactions: {
        Row: {
          amount: number
          created_at: string | null
          currency: string | null
          description: string | null
          id: string
          invoice_id: string | null
          metadata: Json | null
          payment_method: string | null
          payment_method_details: Json | null
          provider: string | null
          provider_transaction_id: string | null
          status: string | null
          subscription_id: string | null
          type: string | null
          user_id: string
        }
        Insert: {
          amount: number
          created_at?: string | null
          currency?: string | null
          description?: string | null
          id?: string
          invoice_id?: string | null
          metadata?: Json | null
          payment_method?: string | null
          payment_method_details?: Json | null
          provider?: string | null
          provider_transaction_id?: string | null
          status?: string | null
          subscription_id?: string | null
          type?: string | null
          user_id: string
        }
        Update: {
          amount?: number
          created_at?: string | null
          currency?: string | null
          description?: string | null
          id?: string
          invoice_id?: string | null
          metadata?: Json | null
          payment_method?: string | null
          payment_method_details?: Json | null
          provider?: string | null
          provider_transaction_id?: string | null
          status?: string | null
          subscription_id?: string | null
          type?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "transactions_invoice_id_fkey"
            columns: ["invoice_id"]
            isOneToOne: false
            referencedRelation: "invoices"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "transactions_subscription_id_fkey"
            columns: ["subscription_id"]
            isOneToOne: false
            referencedRelation: "subscriptions"
            referencedColumns: ["id"]
          },
        ]
      }
      user_roles: {
        Row: {
          created_at: string
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      assign_reseller_role: { Args: { _user_id: string }; Returns: undefined }
      get_user_role: {
        Args: { _user_id: string }
        Returns: Database["public"]["Enums"]["app_role"]
      }
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "admin" | "moderator" | "user" | "reseller"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      app_role: ["admin", "moderator", "user", "reseller"],
    },
  },
} as const
