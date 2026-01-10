import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    // Get the authorization header
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      throw new Error('Missing authorization header');
    }

    // Verify user
    const token = authHeader.replace('Bearer ', '');
    const { data: { user }, error: authError } = await supabase.auth.getUser(token);
    
    if (authError || !user) {
      throw new Error('Unauthorized');
    }

    const body = await req.json();
    const { 
      name, 
      plan, 
      domain_id, 
      region = 'us-east',
      plan_type = 'shared'
    } = body;

    console.log(`[Provision Hosting] Creating hosting account for user ${user.id}`);

    // Plan configurations
    const planConfigs: Record<string, { storage: number; bandwidth: number; databases: number; emails: number }> = {
      starter: { storage: 10, bandwidth: 100, databases: 1, emails: 5 },
      pro: { storage: 50, bandwidth: 500, databases: 5, emails: 25 },
      business: { storage: 100, bandwidth: 1000, databases: 10, emails: 50 },
      enterprise: { storage: 500, bandwidth: 5000, databases: 50, emails: 100 },
    };

    const config = planConfigs[plan] || planConfigs.starter;

    // Generate a unique IP address (mock)
    const ipAddress = `10.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}`;

    // Create hosting account in database
    const { data: hostingAccount, error: hostingError } = await supabase
      .from('hosting_accounts')
      .insert({
        user_id: user.id,
        name: name,
        plan: plan,
        plan_type: plan_type,
        domain_id: domain_id || null,
        region: region,
        status: 'provisioning',
        ip_address: ipAddress,
        storage_limit_gb: config.storage,
        storage_used_gb: 0,
        bandwidth_limit_gb: config.bandwidth,
        bandwidth_used_gb: 0,
        databases_limit: config.databases,
        databases_used: 0,
        email_accounts_limit: config.emails,
        email_accounts_used: 0,
        ssl_enabled: true,
      })
      .select()
      .single();

    if (hostingError) {
      console.error('[Provision Hosting] Database error:', hostingError);
      throw new Error('Failed to create hosting account');
    }

    console.log(`[Provision Hosting] Created hosting account: ${hostingAccount.id}`);

    // Simulate panel provisioning (in production, call actual panel API)
    // For now, we'll just update status after a brief delay simulation
    
    // Update status to active
    const { error: updateError } = await supabase
      .from('hosting_accounts')
      .update({ status: 'active' })
      .eq('id', hostingAccount.id);

    if (updateError) {
      console.error('[Provision Hosting] Status update error:', updateError);
    }

    // Create notification
    await supabase.from('notifications').insert({
      user_id: user.id,
      type: 'hosting',
      title: 'Hosting Account Created',
      message: `Your ${plan} hosting account "${name}" is now active.`,
      action_url: '/dashboard/hosting',
    });

    // Log audit event
    await supabase.from('audit_logs').insert({
      user_id: user.id,
      action: 'hosting.create',
      resource_type: 'hosting_account',
      resource_id: hostingAccount.id,
      details: { plan, region, name },
    });

    return new Response(JSON.stringify({
      success: true,
      hosting_account: { ...hostingAccount, status: 'active' },
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    });

  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    console.error('[Provision Hosting] Error:', error);
    return new Response(JSON.stringify({ success: false, error: message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 400,
    });
  }
});
