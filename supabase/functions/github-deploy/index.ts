import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const authHeader = req.headers.get("Authorization");
    if (!authHeader?.startsWith("Bearer ")) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_ANON_KEY")!,
      { global: { headers: { Authorization: authHeader } } }
    );

    const { data: claims, error: claimsError } = await supabase.auth.getClaims(
      authHeader.replace("Bearer ", "")
    );
    if (claimsError || !claims?.claims) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const userId = claims.claims.sub as string;

    const body = await req.json();
    const { repo_full_name, repo_url, branch, hosting_account_id, environment } = body;

    if (!repo_full_name || !repo_url) {
      return new Response(JSON.stringify({ error: "Missing required fields" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const supabaseAdmin = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

    // Get GitHub connection
    const { data: connection } = await supabaseAdmin
      .from("github_connections")
      .select("id, access_token_encrypted")
      .eq("user_id", userId)
      .single();

    if (!connection) {
      return new Response(JSON.stringify({ error: "No GitHub connection" }), {
        status: 404,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Get latest commit
    const accessToken = connection.access_token_encrypted;
    const commitRes = await fetch(
      `https://api.github.com/repos/${repo_full_name}/commits/${branch || "main"}`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          Accept: "application/vnd.github.v3+json",
        },
      }
    );

    let commitSha = null;
    let commitMessage = null;
    if (commitRes.ok) {
      const commitData = await commitRes.json();
      commitSha = commitData.sha?.substring(0, 7);
      commitMessage = commitData.commit?.message?.substring(0, 200);
    }

    // Create deployment record
    const { data: deployment, error: deployError } = await supabaseAdmin
      .from("deployments")
      .insert({
        user_id: userId,
        github_connection_id: connection.id,
        hosting_account_id: hosting_account_id || null,
        repo_full_name,
        repo_url,
        branch: branch || "main",
        commit_sha: commitSha,
        commit_message: commitMessage,
        status: "pending",
        environment: environment || "production",
        triggered_by: "manual",
        started_at: new Date().toISOString(),
      })
      .select()
      .single();

    if (deployError) {
      return new Response(JSON.stringify({ error: deployError.message }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Simulate build process (in production, this would trigger a real build pipeline)
    // Update status to building after a brief delay
    setTimeout(async () => {
      await supabaseAdmin
        .from("deployments")
        .update({
          status: "building",
          build_log: "Installing dependencies...\nnpm install\nBuilding project...\nnpm run build\n",
        })
        .eq("id", deployment.id);

      // Simulate completion after build
      setTimeout(async () => {
        const deployUrl = `https://${repo_full_name.replace("/", "-")}.cheetihost.app`;
        await supabaseAdmin
          .from("deployments")
          .update({
            status: "completed",
            deploy_url: deployUrl,
            completed_at: new Date().toISOString(),
            duration_seconds: Math.floor(Math.random() * 60) + 30,
            build_log:
              "Installing dependencies...\nnpm install\n✓ 1247 packages installed\nBuilding project...\nnpm run build\n✓ Build completed successfully\nDeploying to edge network...\n✓ Deployed to 42 regions\n",
          })
          .eq("id", deployment.id);
      }, 15000);
    }, 3000);

    return new Response(
      JSON.stringify({
        success: true,
        deployment: {
          id: deployment.id,
          status: deployment.status,
          repo_full_name: deployment.repo_full_name,
          branch: deployment.branch,
          commit_sha: commitSha,
        },
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
