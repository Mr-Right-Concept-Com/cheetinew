import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, verif-hash',
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

    const body = await req.text();
    const verifHash = req.headers.get('verif-hash');
    
    console.log('[Flutterwave Webhook] Received webhook event');

    const event = JSON.parse(body);
    const eventType = event.event;
    const eventData = event.data;

    console.log(`[Flutterwave Webhook] Event type: ${eventType}`);

    switch (eventType) {
      case 'charge.completed': {
        const txRef = eventData.tx_ref;
        const amount = eventData.amount;
        const currency = eventData.currency;
        const status = eventData.status;
        const userId = eventData.meta?.user_id;

        if (status === 'successful' && userId) {
          // Create transaction record
          const { error: txError } = await supabase.from('transactions').insert({
            user_id: userId,
            amount: amount,
            currency: currency,
            status: 'completed',
            provider: 'flutterwave',
            provider_transaction_id: txRef,
            type: 'payment',
            description: eventData.meta?.description || 'Payment via Flutterwave',
            payment_method: eventData.payment_type,
          });

          if (txError) console.error('[Flutterwave Webhook] Transaction insert error:', txError);

          await supabase.from('notifications').insert({
            user_id: userId,
            type: 'billing',
            title: 'Payment Successful',
            message: `Your payment of ${currency} ${amount} has been processed.`,
          });

          // If this is a subscription payment
          if (eventData.meta?.subscription_id) {
            await supabase
              .from('subscriptions')
              .update({ 
                status: 'active',
                current_period_end: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
              })
              .eq('id', eventData.meta.subscription_id);
          }
        }
        break;
      }

      case 'transfer.completed': {
        // Handle reseller payout completion
        const payoutId = eventData.meta?.payout_id;
        
        if (payoutId) {
          await supabase
            .from('reseller_payouts')
            .update({ 
              status: 'completed', 
              processed_at: new Date().toISOString(),
            })
            .eq('id', payoutId);

          const { data: payout } = await supabase
            .from('reseller_payouts')
            .select('reseller_id, amount, currency')
            .eq('id', payoutId)
            .single();

          if (payout) {
            await supabase.from('notifications').insert({
              user_id: payout.reseller_id,
              type: 'billing',
              title: 'Payout Completed',
              message: `Your payout of ${payout.currency} ${payout.amount} has been sent.`,
            });
          }
        }
        break;
      }

      case 'subscription.cancelled': {
        const subscriptionId = eventData.id;

        const { data: sub } = await supabase
          .from('subscriptions')
          .select('user_id')
          .eq('provider_subscription_id', String(subscriptionId))
          .single();

        await supabase
          .from('subscriptions')
          .update({ status: 'cancelled', cancelled_at: new Date().toISOString() })
          .eq('provider_subscription_id', String(subscriptionId));

        if (sub?.user_id) {
          await supabase.from('notifications').insert({
            user_id: sub.user_id,
            type: 'billing',
            title: 'Subscription Cancelled',
            message: 'Your subscription has been cancelled.',
          });
        }
        break;
      }

      default:
        console.log(`[Flutterwave Webhook] Unhandled event: ${eventType}`);
    }

    return new Response(JSON.stringify({ status: 'success' }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    });

  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    console.error('[Flutterwave Webhook] Error:', error);
    return new Response(JSON.stringify({ error: message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 400,
    });
  }
});
