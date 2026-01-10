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
      action = 'request', // 'request', 'approve', 'process'
      payout_id = null,
      amount = null,
      currency = 'USD',
      payout_method = 'bank_transfer',
      payout_details = {},
    } = body;

    console.log(`[Process Payout] ${action} payout for user ${user.id}`);

    // Verify user is a reseller
    const { data: role } = await supabase
      .from('user_roles')
      .select('role')
      .eq('user_id', user.id)
      .single();

    if (!role || (role.role !== 'reseller' && role.role !== 'admin')) {
      throw new Error('Only resellers can request payouts');
    }

    switch (action) {
      case 'request': {
        // Get pending commissions
        const { data: commissions, error: commError } = await supabase
          .from('reseller_commissions')
          .select('*')
          .eq('reseller_id', user.id)
          .eq('status', 'pending');

        const totalPending = commissions?.reduce((sum, c) => sum + c.amount, 0) || 0;

        if (!amount || amount <= 0) {
          throw new Error('Invalid payout amount');
        }

        if (amount > totalPending) {
          throw new Error(`Requested amount exceeds available balance: ${currency} ${totalPending.toFixed(2)}`);
        }

        // Create payout request
        const periodStart = new Date();
        periodStart.setDate(1); // First of current month
        const periodEnd = new Date();

        const { data: payout, error: payoutError } = await supabase
          .from('reseller_payouts')
          .insert({
            reseller_id: user.id,
            amount: amount,
            currency: currency,
            status: 'pending',
            payout_method: payout_method,
            payout_details: payout_details,
            period_start: periodStart.toISOString(),
            period_end: periodEnd.toISOString(),
          })
          .select()
          .single();

        if (payoutError) {
          console.error('[Process Payout] Database error:', payoutError);
          throw new Error('Failed to create payout request');
        }

        // Create notification
        await supabase.from('notifications').insert({
          user_id: user.id,
          type: 'billing',
          title: 'Payout Request Submitted',
          message: `Your payout request for ${currency} ${amount.toFixed(2)} has been submitted for review.`,
          action_url: '/reseller/payouts',
        });

        return new Response(JSON.stringify({
          success: true,
          payout,
          message: 'Payout request submitted successfully',
        }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }

      case 'approve': {
        // Admin only
        if (role.role !== 'admin') {
          throw new Error('Only admins can approve payouts');
        }

        if (!payout_id) {
          throw new Error('Payout ID required');
        }

        const { error: updateError } = await supabase
          .from('reseller_payouts')
          .update({ status: 'approved' })
          .eq('id', payout_id);

        if (updateError) {
          throw new Error('Failed to approve payout');
        }

        // Get payout details for notification
        const { data: payout } = await supabase
          .from('reseller_payouts')
          .select('*')
          .eq('id', payout_id)
          .single();

        if (payout) {
          await supabase.from('notifications').insert({
            user_id: payout.reseller_id,
            type: 'billing',
            title: 'Payout Approved',
            message: `Your payout request for ${payout.currency} ${payout.amount.toFixed(2)} has been approved and will be processed soon.`,
          });
        }

        return new Response(JSON.stringify({
          success: true,
          message: 'Payout approved',
        }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }

      case 'process': {
        // Admin only - actually process the payout
        if (role.role !== 'admin') {
          throw new Error('Only admins can process payouts');
        }

        if (!payout_id) {
          throw new Error('Payout ID required');
        }

        // Get payout details
        const { data: payout } = await supabase
          .from('reseller_payouts')
          .select('*')
          .eq('id', payout_id)
          .single();

        if (!payout || payout.status !== 'approved') {
          throw new Error('Payout not found or not approved');
        }

        // In production, initiate actual transfer via payment gateway
        // For now, simulate processing

        const { error: processError } = await supabase
          .from('reseller_payouts')
          .update({ 
            status: 'completed',
            processed_at: new Date().toISOString(),
          })
          .eq('id', payout_id);

        if (processError) {
          throw new Error('Failed to process payout');
        }

        // Mark related commissions as paid
        await supabase
          .from('reseller_commissions')
          .update({ status: 'paid', payout_id: payout_id })
          .eq('reseller_id', payout.reseller_id)
          .eq('status', 'pending');

        // Notify reseller
        await supabase.from('notifications').insert({
          user_id: payout.reseller_id,
          type: 'billing',
          title: 'Payout Completed',
          message: `Your payout of ${payout.currency} ${payout.amount.toFixed(2)} has been sent to your ${payout.payout_method}.`,
        });

        // Log audit event
        await supabase.from('audit_logs').insert({
          user_id: user.id,
          action: 'payout.process',
          resource_type: 'reseller_payout',
          resource_id: payout_id,
          details: { reseller_id: payout.reseller_id, amount: payout.amount, currency: payout.currency },
        });

        return new Response(JSON.stringify({
          success: true,
          message: 'Payout processed and sent',
        }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }

      default:
        throw new Error(`Unknown action: ${action}`);
    }

  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    console.error('[Process Payout] Error:', error);
    return new Response(JSON.stringify({ success: false, error: message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 400,
    });
  }
});
