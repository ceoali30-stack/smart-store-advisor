import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

export async function POST(request) {
  try {
    const body = await request.json();

    console.log("SALLA WEBHOOK DATA:");
    console.log(JSON.stringify(body, null, 2));

    const merchantId =
      body.merchant ||
      body.merchant_id ||
      body.data?.merchant ||
      body.data?.merchant_id ||
      null;

    const accessToken =
      body.access_token ||
      body.data?.access_token ||
      body.token?.access_token ||
      null;

    const refreshToken =
      body.refresh_token ||
      body.data?.refresh_token ||
      body.token?.refresh_token ||
      null;

    const expiresAt =
      body.expires_at ||
      body.data?.expires_at ||
      null;

    console.log("PARSED DATA:", {
      merchantId,
      accessToken,
      refreshToken,
      expiresAt,
    });

    const { data, error } = await supabase
      .from("merchants")
      .upsert(
        {
          merchant_id: merchantId ? String(merchantId) : null,
          access_token: accessToken,
          refresh_token: refreshToken,
          expires_at: expiresAt,
        },
        {
          onConflict: "merchant_id",
        }
      )
      .select();

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

    console.log("SUPABASE INSERT SUCCESS:", data);

    return Response.json({
      success: true,
      received: body,
      saved: data,
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

export async function GET() {
  return Response.json({
    success: true,
    message: "Authorize webhook is working",
  });
}
