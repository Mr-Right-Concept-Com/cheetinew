import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-paystack-signature',
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
    const signature = req.headers.get('x-paystack-signature');
    
    console.log('[Paystack Webhook] Received webhook event');

    const event = JSON.parse(body);
    const eventType = event.event;
    const eventData = event.data;

    console.log(`[Paystack Webhook] Event type: ${eventType}`);

    switch (eventType) {
      case 'charge.success': {
        const reference = eventData.reference;
        const amount = eventData.amount / 100;
        const currency = eventData.currency;
        const userId = eventData.metadata?.user_id;

        if (userId) {
          // Create transaction record
          const { error: txError } = await supabase.from('transactions').insert({
            user_id: userId,
            amount: amount,
            currency: currency,
            status: 'completed',
            provider: 'paystack',
            provider_transaction_id: reference,
            type: 'payment',
            description: eventData.metadata?.description || 'Payment via Paystack',
          });

          if (txError) console.error('[Paystack Webhook] Transaction insert error:', txError);

          await supabase.from('notifications').insert({
            user_id: userId,
            type: 'billing',
            title: 'Payment Successful',
            message: `Your payment of ${currency} ${amount} has been processed.`,
          });
        }
        break;
      }

      case 'subscription.create': {
        const subscriptionCode = eventData.subscription_code;
        const planCode = eventData.plan?.plan_code;
        const amount = eventData.amount / 100;
        const userId = eventData.customer?.metadata?.user_id;

        if (userId) {
          const { error: subError } = await supabase.from('subscriptions').insert({
            user_id: userId,
            provider_subscription_id: subscriptionCode,
            provider: 'paystack',
            status: 'active',
            amount: amount,
            plan_name: eventData.plan?.name || 'Subscription',
            plan_type: 'hosting',
            interval: eventData.plan?.interval || 'monthly',
            current_period_start: new Date().toISOString(),
            current_period_end: new Date(eventData.next_payment_date).toISOString(),
          });

          if (subError) console.error('[Paystack Webhook] Subscription insert error:', subError);
        }
        break;
      }

      case 'subscription.disable': {
        const subscriptionCode = eventData.subscription_code;

        const { data: sub } = await supabase
          .from('subscriptions')
          .select('user_id')
          .eq('provider_subscription_id', subscriptionCode)
          .single();

        await supabase
          .from('subscriptions')
          .update({ status: 'cancelled', cancelled_at: new Date().toISOString() })
          .eq('provider_subscription_id', subscriptionCode);

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
        const subscriptionCode = eventData.subscription?.subscription_code;

        if (subscriptionCode) {
          const { data: sub } = await supabase
            .from('subscriptions')
            .select('user_id')
            .eq('provider_subscription_id', subscriptionCode)
            .single();

          if (sub?.user_id) {
            await supabase.from('notifications').insert({
              user_id: sub.user_id,
              type: 'billing',
              title: 'Payment Failed',
              message: 'Your subscription payment failed. Please update your payment method.',
              category: 'urgent',
            });
          }
        }
        break;
      }

      default:
        console.log(`[Paystack Webhook] Unhandled event: ${eventType}`);
    }

    return new Response(JSON.stringify({ received: true }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    });

  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    console.error('[Paystack Webhook] Error:', error);
    return new Response(JSON.stringify({ error: message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 400,
    });
  }
});
