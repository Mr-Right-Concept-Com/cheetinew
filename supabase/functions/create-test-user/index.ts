// Test-only utility: creates a confirmed user with a known password and a given role.
// SECURITY: This function is gated by a TEST_USER_SECRET env var.
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-test-secret",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });
  try {
    const expected = Deno.env.get("TEST_USER_SECRET") ?? "cheeti-qa-2026-rotate-me";
    const secret = req.headers.get("x-test-secret");
    if (!secret || secret !== expected) {
      return new Response(JSON.stringify({ error: "forbidden" }), { status: 403, headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }
    const { email, password, role = "user", full_name = "QA User" } = await req.json();
    if (!email || !password) return new Response(JSON.stringify({ error: "email and password required" }), { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } });

    const admin = createClient(Deno.env.get("SUPABASE_URL")!, Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!);

    // Try to find existing
    const { data: list } = await admin.auth.admin.listUsers();
    let user = list?.users?.find((u) => u.email === email);
    if (!user) {
      const { data, error } = await admin.auth.admin.createUser({
        email, password, email_confirm: true, user_metadata: { full_name },
      });
      if (error) throw error;
      user = data.user!;
    } else {
      await admin.auth.admin.updateUserById(user.id, { password, email_confirm: true });
    }

    // Ensure role
    await admin.from("user_roles").delete().eq("user_id", user.id);
    await admin.from("user_roles").insert({ user_id: user.id, role });

    return new Response(JSON.stringify({ ok: true, user_id: user.id, email: user.email, role }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    return new Response(JSON.stringify({ error: (e as Error).message }), { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } });
  }
});
