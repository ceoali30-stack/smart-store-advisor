import { createClient } from "@supabase/supabase-js";

function getSupabaseClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
  );
}

export async function GET(request) {
  try {
    const url = new URL(request.url);

    const params = Object.fromEntries(url.searchParams.entries());

    console.log("SALLA AUTHORIZE GET PARAMS:");
    console.log(JSON.stringify(params, null, 2));

    return new Response(
      `
      <!DOCTYPE html>
      <html lang="ar" dir="rtl">
        <head>
          <meta charset="UTF-8" />
          <title>Smart Store Advisor</title>
          <style>
            body {
              font-family: Arial, sans-serif;
              background: #f8fafc;
              color: #0f172a;
              display: flex;
              align-items: center;
              justify-content: center;
              height: 100vh;
              margin: 0;
            }
            .card {
              background: white;
              padding: 32px;
              border-radius: 16px;
              box-shadow: 0 10px 30px rgba(15, 23, 42, 0.08);
              max-width: 520px;
              text-align: center;
            }
            h1 {
              margin-bottom: 12px;
              font-size: 26px;
            }
            p {
              color: #475569;
              line-height: 1.8;
            }
          </style>
        </head>
        <body>
          <div class="card">
            <h1>تم ربط التطبيق بنجاح</h1>
            <p>
              تم استقبال طلب الربط من سلة. يمكنك الآن إغلاق هذه الصفحة والعودة إلى لوحة التحكم.
            </p>
          </div>
        </body>
      </html>
      `,
      {
        status: 200,
        headers: {
          "Content-Type": "text/html; charset=utf-8",
        },
      }
    );
  } catch (error) {
    console.error("AUTHORIZE GET ERROR:", error);

    return Response.json(
      {
        success: false,
        error: error.message,
      },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    const body = await request.json();

    console.log("SALLA WEBHOOK DATA:");
    console.log(JSON.stringify(body, null, 2));

    const supabase = getSupabaseClient();

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

    const { data: insertedMerchant, error } = await supabase
  .from("merchants")
  .insert({
    merchant_id: merchantId ? String(merchantId) : null,
    access_token: accessToken,
    refresh_token: refreshToken,
    expires_at: expiresAt,
  })
  .select()
  .single();

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
  inserted: insertedMerchant,
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
  }
}
