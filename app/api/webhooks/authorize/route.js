import { createClient } from "@supabase/supabase-js";

export async function POST(request) {
  try {
    const body = await request.json();

    console.log("SALLA WEBHOOK DATA:");
    console.log(JSON.stringify(body, null, 2));

    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.SUPABASE_SERVICE_ROLE_KEY
    );

    const data = body?.data || body;

    const merchantId =
      data?.merchant ||
      data?.merchant_id ||
      data?.store_id ||
      data?.store?.id ||
      body?.merchant ||
      body?.merchant_id ||
      null;

    const accessToken =
      data?.access_token ||
      data?.token?.access_token ||
      body?.access_token ||
      body?.token?.access_token ||
      null;

    const refreshToken =
      data?.refresh_token ||
      data?.token?.refresh_token ||
      body?.refresh_token ||
      body?.token?.refresh_token ||
      null;

    const expiresAtRaw =
      data?.expires_at ||
      data?.expires ||
      data?.token?.expires_at ||
      body?.expires_at ||
      body?.expires ||
      body?.token?.expires_at ||
      null;

    const expiresAt = expiresAtRaw
      ? new Date(expiresAtRaw).toISOString()
      : null;

    const { error } = await supabase.from("merchants").upsert(
      {
        merchant_id: merchantId ? String(merchantId) : null,
        access_token: accessToken,
        refresh_token: refreshToken,
        expires_at: expiresAt,
      },
      {
        onConflict: "merchant_id",
      }
    );

    if (error) {
      console.error("SUPABASE INSERT ERROR:", error);

      return Response.json(
        {
          success: false,
          error: error.message,
        },
        { status: 500 }
      );
    }

    return Response.json({
      success: true,
      saved: true,
      merchant_id: merchantId,
    });
  } catch (error) {
    console.error("WEBHOOK ERROR:", error);

    return Response.json(
      {
        success: false,
        error: error.message,
      },
      { status: 500 }
    );
  }
}
