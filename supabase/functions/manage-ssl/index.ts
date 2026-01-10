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
      action, // 'install', 'renew', 'revoke'
      domain_id,
      certificate_type = 'letsencrypt', // 'letsencrypt', 'custom', 'wildcard'
      hosting_account_id = null,
    } = body;

    console.log(`[Manage SSL] ${action} SSL for domain ${domain_id}`);

    // Verify domain ownership
    const { data: domain, error: domainError } = await supabase
      .from('domains')
      .select('id, name, user_id')
      .eq('id', domain_id)
      .eq('user_id', user.id)
      .single();

    if (domainError || !domain) {
      throw new Error('Domain not found or access denied');
    }

    switch (action) {
      case 'install': {
        // Check for existing certificate
        const { data: existing } = await supabase
          .from('ssl_certificates')
          .select('id')
          .eq('domain_id', domain_id)
          .eq('status', 'active')
          .single();

        if (existing) {
          throw new Error('Active SSL certificate already exists for this domain');
        }

        // Calculate expiry (90 days for Let's Encrypt)
        const issuedAt = new Date();
        const expiresAt = new Date();
        expiresAt.setDate(expiresAt.getDate() + 90);

        // Create SSL certificate record
        const { data: cert, error: certError } = await supabase
          .from('ssl_certificates')
          .insert({
            domain_id: domain_id,
            hosting_account_id: hosting_account_id,
            type: certificate_type,
            status: 'issuing',
            issuer: certificate_type === 'letsencrypt' ? "Let's Encrypt" : 'Custom CA',
            issued_at: issuedAt.toISOString(),
            expires_at: expiresAt.toISOString(),
            auto_renew: true,
          })
          .select()
          .single();

        if (certError) {
          console.error('[Manage SSL] Certificate insert error:', certError);
          throw new Error('Failed to create SSL certificate record');
        }

        // Simulate certificate issuance
        await supabase
          .from('ssl_certificates')
          .update({ status: 'active' })
          .eq('id', cert.id);

        // Update hosting account SSL status
        if (hosting_account_id) {
          await supabase
            .from('hosting_accounts')
            .update({ ssl_enabled: true })
            .eq('id', hosting_account_id);
        }

        // Create notification
        await supabase.from('notifications').insert({
          user_id: user.id,
          type: 'security',
          title: 'SSL Certificate Installed',
          message: `SSL certificate for ${domain.name} has been installed successfully.`,
        });

        return new Response(JSON.stringify({
          success: true,
          certificate: { ...cert, status: 'active' },
        }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }

      case 'renew': {
        const { data: cert, error: certError } = await supabase
          .from('ssl_certificates')
          .select('*')
          .eq('domain_id', domain_id)
          .eq('status', 'active')
          .single();

        if (certError || !cert) {
          throw new Error('No active SSL certificate found for this domain');
        }

        // Extend expiry
        const newExpiry = new Date();
        newExpiry.setDate(newExpiry.getDate() + 90);

        const { error: updateError } = await supabase
          .from('ssl_certificates')
          .update({ 
            expires_at: newExpiry.toISOString(),
            issued_at: new Date().toISOString(),
          })
          .eq('id', cert.id);

        if (updateError) {
          throw new Error('Failed to renew SSL certificate');
        }

        await supabase.from('notifications').insert({
          user_id: user.id,
          type: 'security',
          title: 'SSL Certificate Renewed',
          message: `SSL certificate for ${domain.name} has been renewed.`,
        });

        return new Response(JSON.stringify({
          success: true,
          message: 'SSL certificate renewed successfully',
        }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }

      case 'revoke': {
        const { error: revokeError } = await supabase
          .from('ssl_certificates')
          .update({ status: 'revoked' })
          .eq('domain_id', domain_id)
          .eq('status', 'active');

        if (revokeError) {
          throw new Error('Failed to revoke SSL certificate');
        }

        await supabase.from('notifications').insert({
          user_id: user.id,
          type: 'security',
          title: 'SSL Certificate Revoked',
          message: `SSL certificate for ${domain.name} has been revoked.`,
        });

        return new Response(JSON.stringify({
          success: true,
          message: 'SSL certificate revoked',
        }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }

      default:
        throw new Error(`Unknown action: ${action}`);
    }

  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    console.error('[Manage SSL] Error:', error);
    return new Response(JSON.stringify({ success: false, error: message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 400,
    });
  }
});
