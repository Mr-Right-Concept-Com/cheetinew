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

    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      throw new Error('Missing authorization header');
    }

    const token = authHeader.replace('Bearer ', '');
    const { data: { user }, error: authError } = await supabase.auth.getUser(token);
    
    if (authError || !user) {
      throw new Error('Unauthorized');
    }

    const body = await req.json();
    const { 
      domain_name, 
      action = 'register', // 'register' or 'transfer'
      auth_code = null,
      auto_renew = true,
      privacy_enabled = true,
      years = 1,
    } = body;

    console.log(`[Provision Domain] ${action} domain ${domain_name} for user ${user.id}`);

    // Extract TLD
    const tld = domain_name.split('.').pop();

    // Calculate expiry date
    const expiryDate = new Date();
    expiryDate.setFullYear(expiryDate.getFullYear() + years);

    // Create domain record
    const { data: domain, error: domainError } = await supabase
      .from('domains')
      .insert({
        user_id: user.id,
        name: domain_name,
        tld: tld,
        status: action === 'transfer' ? 'pending_transfer' : 'pending',
        registrar: 'CheetiHost',
        registration_date: new Date().toISOString(),
        expiry_date: expiryDate.toISOString(),
        auto_renew: auto_renew,
        privacy_enabled: privacy_enabled,
        transfer_lock: true,
        auth_code: action === 'transfer' ? auth_code : null,
        nameservers: ['ns1.cheetihost.com', 'ns2.cheetihost.com'],
      })
      .select()
      .single();

    if (domainError) {
      console.error('[Provision Domain] Database error:', domainError);
      throw new Error('Failed to create domain record');
    }

    console.log(`[Provision Domain] Created domain record: ${domain.id}`);

    // Create default DNS records
    const defaultRecords = [
      { domain_id: domain.id, type: 'A', name: '@', value: '192.0.2.1', ttl: 3600, is_system: true },
      { domain_id: domain.id, type: 'A', name: 'www', value: '192.0.2.1', ttl: 3600, is_system: true },
      { domain_id: domain.id, type: 'MX', name: '@', value: 'mail.' + domain_name, ttl: 3600, priority: 10, is_system: true },
      { domain_id: domain.id, type: 'TXT', name: '@', value: 'v=spf1 include:_spf.cheetihost.com ~all', ttl: 3600, is_system: true },
    ];

    const { error: dnsError } = await supabase
      .from('dns_records')
      .insert(defaultRecords);

    if (dnsError) {
      console.error('[Provision Domain] DNS records error:', dnsError);
    }

    // Simulate domain registration/transfer (in production, call registrar API)
    // Update status to active
    const { error: updateError } = await supabase
      .from('domains')
      .update({ status: 'active' })
      .eq('id', domain.id);

    if (updateError) {
      console.error('[Provision Domain] Status update error:', updateError);
    }

    // Create notification
    await supabase.from('notifications').insert({
      user_id: user.id,
      type: 'domain',
      title: action === 'transfer' ? 'Domain Transfer Initiated' : 'Domain Registered',
      message: action === 'transfer' 
        ? `Transfer of ${domain_name} has been initiated.`
        : `Your domain ${domain_name} has been registered successfully.`,
      action_url: '/dashboard/domains',
    });

    // Log audit event
    await supabase.from('audit_logs').insert({
      user_id: user.id,
      action: `domain.${action}`,
      resource_type: 'domain',
      resource_id: domain.id,
      details: { domain_name, action, years },
    });

    return new Response(JSON.stringify({
      success: true,
      domain: { ...domain, status: 'active' },
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    });

  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    console.error('[Provision Domain] Error:', error);
    return new Response(JSON.stringify({ success: false, error: message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 400,
    });
  }
});
