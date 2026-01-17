import { serve } from "https://deno.land/std@0.190.0/http/server.ts";

const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface InviteRequest {
  email: string;
  adminCode: string;
  inviterName?: string;
}

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    if (!RESEND_API_KEY) {
      throw new Error("RESEND_API_KEY is not set in Edge Function secrets.");
    }

    const { email, adminCode, inviterName }: InviteRequest = await req.json();

    if (!email || !adminCode) {
      return new Response(
        JSON.stringify({ error: "Email and admin code are required" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${RESEND_API_KEY}`,
      },
      body: JSON.stringify({
        from: "DSArena Protocol <onboarding@resend.dev>",
        to: [email],
        subject: "Welcome to the DSArena Host Registry",
        html: `
          <div style="font-family: sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #1e293b; background-color: #030712; color: #f8fafc; border-radius: 12px;">
            <div style="text-align: center; margin-bottom: 30px;">
              <h1 style="color: #22d3ee; margin-bottom: 5px;">DSArena Host Console</h1>
              <p style="color: #64748b; font-size: 14px;">Neural Network Invitation Protocol Activated</p>
            </div>
            
            <p>Welcome, Host Node.</p>
            <p>${inviterName ? `<strong>${inviterName}</strong>` : "A system administrator"} has authorized you to manage and host examination sessions on the DSArena platform. Your unique protocol signature has been successfully synchronized with our neural registry.</p>
            
            <div style="background-color: #0f172a; border: 1px dashed #22d3ee; padding: 20px; text-align: center; border-radius: 8px; margin: 30px 0;">
              <p style="margin: 0; color: #64748b; font-size: 12px; text-transform: uppercase; letter-spacing: 0.1em;">Your Host Protocol Code</p>
              <h2 style="margin: 10px 0; color: #22d3ee; font-family: monospace; font-size: 28px; letter-spacing: 2px;">${adminCode}</h2>
            </div>
            
            <p>To begin hosting, log in to your dashboard and use this code to identify your registry node.</p>
            
            <div style="margin-top: 40px; border-top: 1px solid #1e293b; pt: 20px; font-size: 12px; color: #64748b; text-align: center;">
              <p>© 2026 DSArena Project. All rights reserved.</p>
              <p>Confidential information intended for authorized host nodes only.</p>
            </div>
          </div>
        `,
      }),
    });

    const responseData = await res.json();

    if (!res.ok) {
      throw new Error(responseData.message || "Failed to send invitation email");
    }

    return new Response(JSON.stringify({ success: true, data: responseData }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });
  } catch (error: any) {
    console.error("Invite Email Error:", error.message);
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
};

serve(handler);
