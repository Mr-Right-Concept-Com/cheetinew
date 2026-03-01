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

    // Get user's GitHub connection
    const supabaseAdmin = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

    const { data: connection, error: connError } = await supabaseAdmin
      .from("github_connections")
      .select("*")
      .eq("user_id", userId)
      .single();

    if (connError || !connection) {
      return new Response(
        JSON.stringify({ error: "No GitHub connection found" }),
        { status: 404, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const url = new URL(req.url);
    const action = url.searchParams.get("action") || "list";
    const accessToken = connection.access_token_encrypted;

    if (action === "list") {
      const page = parseInt(url.searchParams.get("page") || "1");
      const perPage = parseInt(url.searchParams.get("per_page") || "30");
      const sort = url.searchParams.get("sort") || "updated";

      const ghRes = await fetch(
        `https://api.github.com/user/repos?page=${page}&per_page=${perPage}&sort=${sort}&direction=desc`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            Accept: "application/vnd.github.v3+json",
          },
        }
      );

      if (!ghRes.ok) {
        const errText = await ghRes.text();
        return new Response(
          JSON.stringify({ error: `GitHub API error: ${ghRes.status}`, details: errText }),
          { status: ghRes.status, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      const repos = await ghRes.json();

      // Return simplified repo data
      const simplified = repos.map((r: any) => ({
        id: r.id,
        full_name: r.full_name,
        name: r.name,
        description: r.description,
        html_url: r.html_url,
        clone_url: r.clone_url,
        default_branch: r.default_branch,
        language: r.language,
        private: r.private,
        updated_at: r.updated_at,
        stargazers_count: r.stargazers_count,
      }));

      return new Response(JSON.stringify({ repos: simplified }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    if (action === "branches") {
      const repo = url.searchParams.get("repo");
      if (!repo) {
        return new Response(JSON.stringify({ error: "Missing repo parameter" }), {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      const ghRes = await fetch(`https://api.github.com/repos/${repo}/branches`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          Accept: "application/vnd.github.v3+json",
        },
      });

      const branches = await ghRes.json();

      return new Response(
        JSON.stringify({
          branches: branches.map((b: any) => ({
            name: b.name,
            sha: b.commit.sha,
          })),
        }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    return new Response(JSON.stringify({ error: "Invalid action" }), {
      status: 400,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
