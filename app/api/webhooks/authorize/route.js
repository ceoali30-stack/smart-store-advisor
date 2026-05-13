import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

export async function POST(request) {
  try {
    const body = await request.json();

    console.log("SALLA WEBHOOK DATA:", JSON.stringify(body, null, 2));

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
      body.data?.token?.access_token ||
      null;

    const refreshToken =
      body.refresh_token ||
      body.data?.refresh_token ||
      body.token?.refresh_token ||
      body.data?.token?.refresh_token ||
      null;

    const { data, error } = await supabase
      .from("merchants")
      .insert([
        {
          merchant_id: merchantId ? String(merchantId) : null,
          access_token: accessToken,
          refresh_token: refreshToken
        }
      ])
      .select();

    if (error) {
      console.error("SUPABASE INSERT ERROR:", error);

      return Response.json(
        {
          success: false,
          message: "Supabase insert failed",
          error
        },
        { status: 500 }
      );
    }

    console.log("SUPABASE INSERT SUCCESS:", data);

    return Response.json({
      success: true,
      received: body,
      inserted: data
    });
  } catch (error) {
    console.error("WEBHOOK ERROR:", error);

    return Response.json(
      {
        success: false,
        error: error.message
      },
      { status: 500 }
    );
  }
}
