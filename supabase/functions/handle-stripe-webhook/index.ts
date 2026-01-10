import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, stripe-signature',
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
    const signature = req.headers.get('stripe-signature');
    
    console.log('[Stripe Webhook] Received webhook event');

    // Parse the event (in production, verify signature with Stripe SDK)
    const event = JSON.parse(body);
    const eventType = event.type;
    const eventData = event.data?.object;

    console.log(`[Stripe Webhook] Event type: ${eventType}`);

    switch (eventType) {
      case 'checkout.session.completed': {
        const customerId = eventData.customer;
        const subscriptionId = eventData.subscription;
        const amountTotal = eventData.amount_total / 100;
        const userId = eventData.metadata?.user_id;

        if (userId && subscriptionId) {
          // Create subscription record
          const { error: subError } = await supabase.from('subscriptions').insert({
            user_id: userId,
            provider_subscription_id: subscriptionId,
            provider: 'stripe',
            status: 'active',
            amount: amountTotal,
            plan_name: eventData.metadata?.plan_name || 'Pro Plan',
            plan_type: eventData.metadata?.plan_type || 'hosting',
            current_period_start: new Date().toISOString(),
            current_period_end: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
          });

          if (subError) console.error('[Stripe Webhook] Subscription insert error:', subError);

          // Create transaction record
          const { error: txError } = await supabase.from('transactions').insert({
            user_id: userId,
            amount: amountTotal,
            currency: eventData.currency?.toUpperCase() || 'USD',
            status: 'completed',
            provider: 'stripe',
            provider_transaction_id: eventData.payment_intent,
            type: 'payment',
            description: `Subscription payment for ${eventData.metadata?.plan_name || 'Pro Plan'}`,
          });

          if (txError) console.error('[Stripe Webhook] Transaction insert error:', txError);

          // Create notification
          await supabase.from('notifications').insert({
            user_id: userId,
            type: 'billing',
            title: 'Payment Successful',
            message: `Your payment of $${amountTotal} has been processed successfully.`,
          });
        }
        break;
      }

      case 'customer.subscription.updated': {
        const subscriptionId = eventData.id;
        const status = eventData.status;

        const { error } = await supabase
          .from('subscriptions')
          .update({ 
            status,
            current_period_start: new Date(eventData.current_period_start * 1000).toISOString(),
            current_period_end: new Date(eventData.current_period_end * 1000).toISOString(),
            cancel_at_period_end: eventData.cancel_at_period_end,
          })
          .eq('provider_subscription_id', subscriptionId);

        if (error) console.error('[Stripe Webhook] Subscription update error:', error);
        break;
      }

      case 'customer.subscription.deleted': {
        const subscriptionId = eventData.id;

        const { data: sub } = await supabase
          .from('subscriptions')
          .select('user_id')
          .eq('provider_subscription_id', subscriptionId)
          .single();

        const { error } = await supabase
          .from('subscriptions')
          .update({ status: 'cancelled', cancelled_at: new Date().toISOString() })
          .eq('provider_subscription_id', subscriptionId);

        if (error) console.error('[Stripe Webhook] Subscription cancel error:', error);

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

      case 'invoice.payment_failed': {
        const customerId = eventData.customer;
        const subscriptionId = eventData.subscription;

        const { data: sub } = await supabase
          .from('subscriptions')
          .select('user_id')
          .eq('provider_subscription_id', subscriptionId)
          .single();

        if (sub?.user_id) {
          await supabase.from('notifications').insert({
            user_id: sub.user_id,
            type: 'billing',
            title: 'Payment Failed',
            message: 'Your payment could not be processed. Please update your payment method.',
            category: 'urgent',
          });

          // Update subscription status
          await supabase
            .from('subscriptions')
            .update({ status: 'past_due' })
            .eq('provider_subscription_id', subscriptionId);
        }
        break;
      }

      default:
        console.log(`[Stripe Webhook] Unhandled event type: ${eventType}`);
    }

    return new Response(JSON.stringify({ received: true }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    });

  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    console.error('[Stripe Webhook] Error:', error);
    return new Response(JSON.stringify({ error: message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 400,
    });
  }
});
