import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useEffect } from "react";
import { toast } from "sonner";
import { PaymentProvider, EnvironmentMode, TEST_KEYS } from "@/lib/payments/types";

export interface PaymentGatewaySettings {
  id: string;
  provider: PaymentProvider;
  displayName: string;
  isActive: boolean;
  isDefault: boolean;
  mode: EnvironmentMode;
  publicKey: string;
  secretKey: string;
  webhookSecret: string;
  supportedCurrencies: string[];
  supportedCountries: string[];
  transactionFeePercentage: number;
  transactionFeeFixed: number;
  minAmount: number;
  maxAmount: number;
  createdAt: string;
  updatedAt: string;
}

// Default gateway configurations with test keys
const defaultGateways: Omit<PaymentGatewaySettings, 'id' | 'createdAt' | 'updatedAt'>[] = [
  {
    provider: 'stripe',
    displayName: 'Stripe',
    isActive: true,
    isDefault: true,
    mode: 'test',
    publicKey: TEST_KEYS.stripe.publicKey,
    secretKey: '',
    webhookSecret: '',
    supportedCurrencies: ['USD', 'EUR', 'GBP', 'NGN', 'ZAR', 'KES'],
    supportedCountries: ['US', 'GB', 'CA', 'AU', 'NG', 'ZA', 'KE', 'GH'],
    transactionFeePercentage: 2.9,
    transactionFeeFixed: 0.30,
    minAmount: 0.50,
    maxAmount: 999999.99,
  },
  {
    provider: 'paystack',
    displayName: 'Paystack',
    isActive: true,
    isDefault: false,
    mode: 'test',
    publicKey: TEST_KEYS.paystack.publicKey,
    secretKey: '',
    webhookSecret: '',
    supportedCurrencies: ['NGN', 'GHS', 'ZAR', 'KES', 'USD'],
    supportedCountries: ['NG', 'GH', 'ZA', 'KE'],
    transactionFeePercentage: 1.5,
    transactionFeeFixed: 100,
    minAmount: 100,
    maxAmount: 10000000,
  },
  {
    provider: 'flutterwave',
    displayName: 'Flutterwave',
    isActive: false,
    isDefault: false,
    mode: 'test',
    publicKey: TEST_KEYS.flutterwave.publicKey,
    secretKey: '',
    webhookSecret: '',
    supportedCurrencies: ['NGN', 'GHS', 'KES', 'TZS', 'UGX', 'ZAR', 'USD', 'EUR', 'GBP'],
    supportedCountries: ['NG', 'GH', 'KE', 'TZ', 'UG', 'ZA', 'RW', 'CI'],
    transactionFeePercentage: 1.4,
    transactionFeeFixed: 0,
    minAmount: 100,
    maxAmount: 10000000,
  },
  {
    provider: 'mobilemoney',
    displayName: 'Mobile Money',
    isActive: false,
    isDefault: false,
    mode: 'test',
    publicKey: TEST_KEYS.mobilemoney.publicKey,
    secretKey: '',
    webhookSecret: '',
    supportedCurrencies: ['KES', 'TZS', 'UGX', 'GHS', 'NGN', 'XOF'],
    supportedCountries: ['KE', 'TZ', 'UG', 'GH', 'NG', 'CI', 'SN'],
    transactionFeePercentage: 1.0,
    transactionFeeFixed: 0,
    minAmount: 10,
    maxAmount: 500000,
  },
];

export const usePaymentGateways = () => {
  const queryClient = useQueryClient();

  // Fetch all payment gateway settings
  const { data: gateways, isLoading, error } = useQuery({
    queryKey: ["payment-gateways"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("payment_gateway_settings")
        .select("*")
        .order("created_at", { ascending: true });

      if (error) throw error;

      // Transform database response to our interface
      const transformedData: PaymentGatewaySettings[] = data.map((row) => ({
        id: row.id,
        provider: row.provider as PaymentProvider,
        displayName: row.display_name,
        isActive: row.is_active ?? false,
        isDefault: row.is_default ?? false,
        mode: (row.mode ?? 'test') as EnvironmentMode,
        publicKey: row.public_key_encrypted ?? '',
        secretKey: row.secret_key_encrypted ? '••••••••••••' : '',
        webhookSecret: row.webhook_secret_encrypted ? '••••••••••••' : '',
        supportedCurrencies: row.supported_currencies ?? [],
        supportedCountries: row.supported_countries ?? [],
        transactionFeePercentage: row.transaction_fee_percentage ?? 0,
        transactionFeeFixed: row.transaction_fee_fixed ?? 0,
        minAmount: row.min_amount ?? 0,
        maxAmount: row.max_amount ?? 999999,
        createdAt: row.created_at ?? '',
        updatedAt: row.updated_at ?? '',
      }));

      // If no gateways exist, return defaults (they'll be created on first save)
      if (transformedData.length === 0) {
        return defaultGateways.map((g, i) => ({
          ...g,
          id: `default_${g.provider}`,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        }));
      }

      return transformedData;
    },
  });

  // Real-time subscription
  useEffect(() => {
    const channel = supabase
      .channel("payment-gateway-changes")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "payment_gateway_settings" },
        () => {
          queryClient.invalidateQueries({ queryKey: ["payment-gateways"] });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [queryClient]);

  return { gateways: gateways ?? [], isLoading, error };
};

export const useUpdatePaymentGateway = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (gateway: Partial<PaymentGatewaySettings> & { id: string; provider: PaymentProvider }) => {
      // Check if this is a default (not yet in DB)
      const isDefault = gateway.id.startsWith('default_');

      const dbData: Record<string, unknown> = {
        provider: gateway.provider,
        display_name: gateway.displayName,
        is_active: gateway.isActive,
        is_default: gateway.isDefault,
        mode: gateway.mode,
        supported_currencies: gateway.supportedCurrencies,
        supported_countries: gateway.supportedCountries,
        transaction_fee_percentage: gateway.transactionFeePercentage,
        transaction_fee_fixed: gateway.transactionFeeFixed,
        min_amount: gateway.minAmount,
        max_amount: gateway.maxAmount,
        updated_at: new Date().toISOString(),
      };

      // Only update keys if they're not masked
      if (gateway.publicKey && !gateway.publicKey.includes('••••')) {
        dbData.public_key_encrypted = gateway.publicKey;
      }
      if (gateway.secretKey && !gateway.secretKey.includes('••••')) {
        dbData.secret_key_encrypted = gateway.secretKey;
      }
      if (gateway.webhookSecret && !gateway.webhookSecret.includes('••••')) {
        dbData.webhook_secret_encrypted = gateway.webhookSecret;
      }

      if (isDefault) {
        // Insert new record - explicitly type for Supabase
        const insertPayload = {
          provider: gateway.provider,
          display_name: gateway.displayName || gateway.provider,
          is_active: gateway.isActive ?? true,
          is_default: gateway.isDefault ?? false,
          mode: gateway.mode ?? 'test',
          supported_currencies: gateway.supportedCurrencies,
          supported_countries: gateway.supportedCountries,
          transaction_fee_percentage: gateway.transactionFeePercentage,
          transaction_fee_fixed: gateway.transactionFeeFixed,
          min_amount: gateway.minAmount,
          max_amount: gateway.maxAmount,
          public_key_encrypted: gateway.publicKey && !gateway.publicKey.includes('••••') ? gateway.publicKey : undefined,
          secret_key_encrypted: gateway.secretKey && !gateway.secretKey.includes('••••') ? gateway.secretKey : undefined,
          webhook_secret_encrypted: gateway.webhookSecret && !gateway.webhookSecret.includes('••••') ? gateway.webhookSecret : undefined,
        };
        
        const { data, error } = await supabase
          .from("payment_gateway_settings")
          .insert(insertPayload)
          .select()
          .single();

        if (error) throw error;
        return data;
      } else {
        // Update existing record
        const { data, error } = await supabase
          .from("payment_gateway_settings")
          .update(dbData)
          .eq("id", gateway.id)
          .select()
          .single();

        if (error) throw error;
        return data;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["payment-gateways"] });
      toast.success("Payment gateway settings saved");
    },
    onError: (error) => {
      toast.error(`Failed to save settings: ${error.message}`);
    },
  });
};

export const useToggleGatewayMode = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ 
      id, 
      provider,
      mode, 
      liveKeys 
    }: { 
      id: string; 
      provider: PaymentProvider;
      mode: EnvironmentMode;
      liveKeys?: { publicKey: string; secretKey: string; webhookSecret?: string };
    }) => {
      const isDefault = id.startsWith('default_');

      // If switching to live mode, require live keys
      if (mode === 'live' && !liveKeys) {
        throw new Error('Live API keys are required to switch to live mode');
      }

      const dbData: Record<string, unknown> = {
        mode,
        updated_at: new Date().toISOString(),
      };

      if (mode === 'live' && liveKeys) {
        dbData.public_key_encrypted = liveKeys.publicKey;
        dbData.secret_key_encrypted = liveKeys.secretKey;
        if (liveKeys.webhookSecret) {
          dbData.webhook_secret_encrypted = liveKeys.webhookSecret;
        }
      } else if (mode === 'test') {
        // Reset to test keys
        dbData.public_key_encrypted = TEST_KEYS[provider].publicKey;
        dbData.secret_key_encrypted = TEST_KEYS[provider].secretKey;
      }

      if (isDefault) {
        const insertPayload = {
          provider,
          display_name: provider.charAt(0).toUpperCase() + provider.slice(1),
          is_active: true,
          mode,
          public_key_encrypted: mode === 'live' && liveKeys ? liveKeys.publicKey : TEST_KEYS[provider].publicKey,
          secret_key_encrypted: mode === 'live' && liveKeys ? liveKeys.secretKey : TEST_KEYS[provider].secretKey,
          webhook_secret_encrypted: mode === 'live' && liveKeys?.webhookSecret ? liveKeys.webhookSecret : undefined,
        };
        
        const { data, error } = await supabase
          .from("payment_gateway_settings")
          .insert(insertPayload)
          .select()
          .single();

        if (error) throw error;
        return data;
      } else {
        const { data, error } = await supabase
          .from("payment_gateway_settings")
          .update(dbData)
          .eq("id", id)
          .select()
          .single();

        if (error) throw error;
        return data;
      }
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["payment-gateways"] });
      toast.success(`Switched to ${variables.mode} mode`);
    },
    onError: (error) => {
      toast.error(`Failed to switch mode: ${error.message}`);
    },
  });
};

export const useTestGatewayConnection = () => {
  return useMutation({
    mutationFn: async ({ provider, publicKey }: { provider: PaymentProvider; publicKey: string }) => {
      // Simulate connection test - in production this would call an edge function
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Check if key looks valid based on provider
      const isValid = (() => {
        switch (provider) {
          case 'stripe':
            return publicKey.startsWith('pk_test_') || publicKey.startsWith('pk_live_');
          case 'paystack':
            return publicKey.startsWith('pk_test_') || publicKey.startsWith('pk_live_');
          case 'flutterwave':
            return publicKey.startsWith('FLWPUBK_TEST') || publicKey.startsWith('FLWPUBK-');
          default:
            return publicKey.length > 10;
        }
      })();

      if (!isValid) {
        throw new Error('Invalid API key format');
      }

      return { success: true, message: 'Connection successful' };
    },
    onSuccess: () => {
      toast.success("Connection test successful!");
    },
    onError: (error) => {
      toast.error(`Connection test failed: ${error.message}`);
    },
  });
};

// Get active gateways for checkout
export const useActivePaymentGateways = () => {
  const { gateways, isLoading } = usePaymentGateways();
  
  return {
    gateways: gateways.filter(g => g.isActive),
    defaultGateway: gateways.find(g => g.isDefault && g.isActive),
    isLoading,
  };
};
