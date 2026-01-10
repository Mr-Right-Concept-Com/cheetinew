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
      subscription_id,
      line_items = [], // { description, quantity, unit_price }
      discount_code = null,
      tax_rate = 0, // Percentage
      currency = 'USD',
    } = body;

    console.log(`[Calculate Invoice] Creating invoice for user ${user.id}`);

    // Get subscription details if provided
    let subscriptionItems = [];
    if (subscription_id) {
      const { data: subscription } = await supabase
        .from('subscriptions')
        .select('*')
        .eq('id', subscription_id)
        .eq('user_id', user.id)
        .single();

      if (subscription) {
        subscriptionItems.push({
          description: subscription.plan_name,
          quantity: 1,
          unit_price: subscription.amount,
        });
      }
    }

    // Combine all line items
    const allItems = [...subscriptionItems, ...line_items];

    if (allItems.length === 0) {
      throw new Error('No items to invoice');
    }

    // Calculate subtotal
    const subtotal = allItems.reduce((sum, item) => {
      return sum + (item.quantity * item.unit_price);
    }, 0);

    // Apply discount if code provided
    let discountAmount = 0;
    if (discount_code) {
      // In production, look up discount code in database
      // For now, simulate 10% discount
      if (discount_code === 'SAVE10') {
        discountAmount = subtotal * 0.10;
      }
    }

    // Calculate tax
    const taxableAmount = subtotal - discountAmount;
    const taxAmount = taxableAmount * (tax_rate / 100);

    // Calculate total
    const total = taxableAmount + taxAmount;

    // Due date (30 days from now)
    const dueDate = new Date();
    dueDate.setDate(dueDate.getDate() + 30);

    // Create invoice
    const { data: invoice, error: invoiceError } = await supabase
      .from('invoices')
      .insert({
        user_id: user.id,
        subscription_id: subscription_id || null,
        status: 'draft',
        currency: currency,
        subtotal: subtotal,
        discount_amount: discountAmount,
        tax_rate: tax_rate,
        tax_amount: taxAmount,
        total: total,
        line_items: allItems,
        due_date: dueDate.toISOString(),
        notes: discount_code ? `Discount applied: ${discount_code}` : null,
      })
      .select()
      .single();

    if (invoiceError) {
      console.error('[Calculate Invoice] Database error:', invoiceError);
      throw new Error('Failed to create invoice');
    }

    console.log(`[Calculate Invoice] Created invoice: ${invoice.id}`);

    // Update status to pending (ready for payment)
    await supabase
      .from('invoices')
      .update({ status: 'pending' })
      .eq('id', invoice.id);

    // Create notification
    await supabase.from('notifications').insert({
      user_id: user.id,
      type: 'billing',
      title: 'New Invoice Generated',
      message: `Invoice #${invoice.invoice_number} for ${currency} ${total.toFixed(2)} is ready.`,
      action_url: '/dashboard/billing',
    });

    return new Response(JSON.stringify({
      success: true,
      invoice: {
        ...invoice,
        status: 'pending',
        subtotal,
        discount_amount: discountAmount,
        tax_amount: taxAmount,
        total,
      },
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    });

  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    console.error('[Calculate Invoice] Error:', error);
    return new Response(JSON.stringify({ success: false, error: message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 400,
    });
  }
});
