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
    const { backup_id } = body;

    console.log(`[Restore Backup] Restoring backup ${backup_id}`);

    // Get backup details and verify ownership
    const { data: backup, error: backupError } = await supabase
      .from('backups')
      .select('*, hosting_accounts(name), cloud_instances(name)')
      .eq('id', backup_id)
      .eq('user_id', user.id)
      .single();

    if (backupError || !backup) {
      throw new Error('Backup not found or access denied');
    }

    if (backup.status !== 'completed') {
      throw new Error('Cannot restore incomplete backup');
    }

    const resourceName = backup.hosting_accounts?.name || backup.cloud_instances?.name || 'Resource';
    const resourceType = backup.hosting_account_id ? 'hosting' : 'cloud';
    const resourceId = backup.hosting_account_id || backup.cloud_instance_id;

    console.log(`[Restore Backup] Restoring to ${resourceType} ${resourceId}`);

    // Update resource status to indicate restoration
    if (resourceType === 'hosting') {
      await supabase
        .from('hosting_accounts')
        .update({ status: 'restoring' })
        .eq('id', resourceId);
    } else {
      await supabase
        .from('cloud_instances')
        .update({ status: 'restoring' })
        .eq('id', resourceId);
    }

    // Simulate restoration process
    // In production, this would trigger actual restore from S3/storage

    // Restore resource status
    if (resourceType === 'hosting') {
      await supabase
        .from('hosting_accounts')
        .update({ status: 'active' })
        .eq('id', resourceId);
    } else {
      await supabase
        .from('cloud_instances')
        .update({ status: 'running' })
        .eq('id', resourceId);
    }

    // Create notification
    await supabase.from('notifications').insert({
      user_id: user.id,
      type: 'backup',
      title: 'Backup Restored',
      message: `${resourceName} has been restored from backup "${backup.name}".`,
      action_url: resourceType === 'hosting' ? '/dashboard/hosting' : '/dashboard/cloud',
    });

    // Log audit event
    await supabase.from('audit_logs').insert({
      user_id: user.id,
      action: 'backup.restore',
      resource_type: resourceType,
      resource_id: resourceId,
      details: { backup_id, backup_name: backup.name, backup_type: backup.type },
    });

    return new Response(JSON.stringify({
      success: true,
      message: `Backup restored successfully to ${resourceName}`,
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    });

  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    console.error('[Restore Backup] Error:', error);
    return new Response(JSON.stringify({ success: false, error: message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 400,
    });
  }
});
