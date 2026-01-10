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
      resource_type, // 'hosting' or 'cloud'
      resource_id,
      backup_type = 'full', // 'full', 'incremental', 'database', 'files'
      retention_days = 30,
      is_automatic = false,
    } = body;

    console.log(`[Create Backup] Creating ${backup_type} backup for ${resource_type} ${resource_id}`);

    // Verify resource ownership
    let resourceOwner = null;
    if (resource_type === 'hosting') {
      const { data } = await supabase
        .from('hosting_accounts')
        .select('user_id, name')
        .eq('id', resource_id)
        .single();
      resourceOwner = data;
    } else if (resource_type === 'cloud') {
      const { data } = await supabase
        .from('cloud_instances')
        .select('user_id, name')
        .eq('id', resource_id)
        .single();
      resourceOwner = data;
    }

    if (!resourceOwner || resourceOwner.user_id !== user.id) {
      throw new Error('Resource not found or access denied');
    }

    // Calculate expiry date
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + retention_days);

    // Generate backup name
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const backupName = `${resourceOwner.name}-${backup_type}-${timestamp}`;

    // Simulate backup size (random between 100MB and 5GB)
    const sizeMb = Math.floor(Math.random() * 5000) + 100;

    // Create backup record
    const { data: backup, error: backupError } = await supabase
      .from('backups')
      .insert({
        user_id: user.id,
        hosting_account_id: resource_type === 'hosting' ? resource_id : null,
        cloud_instance_id: resource_type === 'cloud' ? resource_id : null,
        name: backupName,
        type: backup_type,
        status: 'in_progress',
        size_mb: null,
        storage_provider: 's3',
        storage_path: `backups/${user.id}/${resource_id}/${backupName}.tar.gz`,
        retention_days: retention_days,
        is_automatic: is_automatic,
        expires_at: expiresAt.toISOString(),
      })
      .select()
      .single();

    if (backupError) {
      console.error('[Create Backup] Database error:', backupError);
      throw new Error('Failed to create backup record');
    }

    console.log(`[Create Backup] Created backup: ${backup.id}`);

    // Simulate backup process completion
    const { error: updateError } = await supabase
      .from('backups')
      .update({ 
        status: 'completed',
        size_mb: sizeMb,
        completed_at: new Date().toISOString(),
      })
      .eq('id', backup.id);

    if (updateError) {
      console.error('[Create Backup] Status update error:', updateError);
    }

    // Create notification
    await supabase.from('notifications').insert({
      user_id: user.id,
      type: 'backup',
      title: 'Backup Completed',
      message: `${backup_type} backup for ${resourceOwner.name} completed successfully (${(sizeMb / 1024).toFixed(2)} GB).`,
      action_url: '/dashboard/backups',
    });

    // Log audit event
    await supabase.from('audit_logs').insert({
      user_id: user.id,
      action: 'backup.create',
      resource_type: resource_type,
      resource_id: resource_id,
      details: { backup_id: backup.id, backup_type, size_mb: sizeMb },
    });

    return new Response(JSON.stringify({
      success: true,
      backup: { ...backup, status: 'completed', size_mb: sizeMb },
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    });

  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    console.error('[Create Backup] Error:', error);
    return new Response(JSON.stringify({ success: false, error: message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 400,
    });
  }
});
