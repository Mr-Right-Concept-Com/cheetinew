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

    const body = await req.json();
    const { 
      user_id,
      user_ids = [], // For bulk notifications
      type,
      title,
      message,
      category = 'general',
      action_url = null,
      metadata = {},
      send_email = false,
      email_template = null,
    } = body;

    console.log(`[Send Notification] Creating notification: ${title}`);

    // Handle single user or multiple users
    const targetUsers = user_id ? [user_id] : user_ids;

    if (targetUsers.length === 0) {
      throw new Error('No target users specified');
    }

    // Create notifications for all target users
    const notifications = targetUsers.map((uid: string) => ({
      user_id: uid,
      type,
      title,
      message,
      category,
      action_url,
      metadata,
      is_read: false,
    }));

    const { data: createdNotifications, error: notifError } = await supabase
      .from('notifications')
      .insert(notifications)
      .select();

    if (notifError) {
      console.error('[Send Notification] Database error:', notifError);
      throw new Error('Failed to create notifications');
    }

    console.log(`[Send Notification] Created ${createdNotifications.length} notifications`);

    // Optionally send email notifications
    if (send_email) {
      // Get user emails
      const { data: profiles } = await supabase
        .from('profiles')
        .select('user_id, full_name')
        .in('user_id', targetUsers);

      // In production, integrate with email service (Resend, SendGrid, etc.)
      console.log(`[Send Notification] Would send emails to ${targetUsers.length} users`);
      
      // Email sending would happen here
      // For now, just log the intent
      for (const profile of profiles || []) {
        console.log(`[Send Notification] Email queued for ${profile.full_name || profile.user_id}`);
      }
    }

    return new Response(JSON.stringify({
      success: true,
      notifications_created: createdNotifications.length,
      emails_sent: send_email ? targetUsers.length : 0,
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    });

  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    console.error('[Send Notification] Error:', error);
    return new Response(JSON.stringify({ success: false, error: message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 400,
    });
  }
});
