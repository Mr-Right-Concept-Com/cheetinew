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
      name,
      type = 'general', // general, cpu, memory, storage
      size = 'small', // small, medium, large, xlarge
      region = 'us-east',
      os = 'ubuntu',
      os_version = '22.04',
      ssh_keys = [],
      backups_enabled = true,
    } = body;

    console.log(`[Provision VPS] Creating ${size} ${type} VPS for user ${user.id}`);

    // Size configurations
    const sizeConfigs: Record<string, { vcpu: number; ram: number; disk: number; monthly: number; hourly: number }> = {
      small: { vcpu: 2, ram: 4, disk: 80, monthly: 20, hourly: 0.03 },
      medium: { vcpu: 4, ram: 8, disk: 160, monthly: 40, hourly: 0.06 },
      large: { vcpu: 8, ram: 16, disk: 320, monthly: 80, hourly: 0.12 },
      xlarge: { vcpu: 16, ram: 32, disk: 640, monthly: 160, hourly: 0.24 },
    };

    const config = sizeConfigs[size] || sizeConfigs.small;

    // Region to datacenter mapping
    const datacenters: Record<string, string> = {
      'us-east': 'NYC1',
      'us-west': 'SFO1',
      'eu-west': 'LON1',
      'eu-central': 'FRA1',
      'asia': 'SGP1',
      'africa': 'LAG1',
    };

    // Generate IP addresses (mock)
    const ipv4 = `45.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}`;
    const ipv6 = `2001:db8:${Math.random().toString(16).substring(2, 6)}::1`;
    const privateIp = `10.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}`;

    // Generate hostname
    const hostname = `${name.toLowerCase().replace(/[^a-z0-9]/g, '-')}-${datacenters[region] || 'NYC1'}`;

    // Create cloud instance record
    const { data: instance, error: instanceError } = await supabase
      .from('cloud_instances')
      .insert({
        user_id: user.id,
        name: name,
        type: type,
        status: 'provisioning',
        vcpu: config.vcpu,
        ram_gb: config.ram,
        disk_gb: config.disk,
        disk_type: 'ssd',
        region: region,
        datacenter: datacenters[region] || 'NYC1',
        os: os,
        os_version: os_version,
        ip_address: ipv4,
        ipv6_address: ipv6,
        private_ip: privateIp,
        hostname: hostname,
        monthly_cost: config.monthly,
        hourly_cost: config.hourly,
        ssh_keys: ssh_keys,
        backups_enabled: backups_enabled,
        monitoring_enabled: true,
        cpu_usage: 0,
        ram_usage: 0,
        disk_usage: 0,
        network_in_gb: 0,
        network_out_gb: 0,
      })
      .select()
      .single();

    if (instanceError) {
      console.error('[Provision VPS] Database error:', instanceError);
      throw new Error('Failed to create cloud instance');
    }

    console.log(`[Provision VPS] Created instance: ${instance.id}`);

    // Simulate VPS provisioning (in production, call cloud provider API)
    // Update status to running
    const { error: updateError } = await supabase
      .from('cloud_instances')
      .update({ status: 'running' })
      .eq('id', instance.id);

    if (updateError) {
      console.error('[Provision VPS] Status update error:', updateError);
    }

    // Create notification
    await supabase.from('notifications').insert({
      user_id: user.id,
      type: 'cloud',
      title: 'Cloud VPS Deployed',
      message: `Your ${config.vcpu} vCPU / ${config.ram} GB RAM VPS "${name}" is now running.`,
      action_url: '/dashboard/cloud',
    });

    // Log audit event
    await supabase.from('audit_logs').insert({
      user_id: user.id,
      action: 'vps.create',
      resource_type: 'cloud_instance',
      resource_id: instance.id,
      details: { name, type, size, region, os },
    });

    return new Response(JSON.stringify({
      success: true,
      instance: { ...instance, status: 'running' },
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    });

  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    console.error('[Provision VPS] Error:', error);
    return new Response(JSON.stringify({ success: false, error: message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 400,
    });
  }
});
