import { createClient } from "@supabase/supabase-js";
import { createMerchantSession } from "../../../lib/session";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get("code");

  if (!code) {
    return Response.json(
      { success: false, message: "Authorization code is missing" },
      { status: 400 }
    );
  }

  try {
    const response = await fetch("https://accounts.salla.sa/oauth2/token", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        client_id: process.env.SALLA_CLIENT_ID,
        client_secret: process.env.SALLA_CLIENT_SECRET,
        grant_type: "authorization_code",
        code,
        redirect_uri:
          "https://smart-store-advisor.vercel.app/api/auth/callback",
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      return Response.json(
        {
          success: false,
          message: "Failed to get access token from Salla",
          token_response: data,
        },
        { status: response.status }
      );
    }

    const accessToken = data.access_token;
    const refreshToken = data.refresh_token;
    const expiresIn = data.expires_in;

    if (!accessToken) {
      return Response.json(
        {
          success: false,
          message: "Salla did not return access_token",
          token_response: data,
        },
        { status: 400 }
      );
    }

    const merchantResponse = await fetch("https://api.salla.dev/admin/v2/store/info", {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        Accept: "application/json",
      },
    });

    const merchantData = await merchantResponse.json();

    if (!merchantResponse.ok) {
      return Response.json(
        {
          success: false,
          message: "Failed to get merchant info from Salla",
          store_response: merchantData,
        },
        { status: merchantResponse.status }
      );
    }

    const merchantId =
      merchantData?.data?.id ||
      merchantData?.data?.merchant?.id ||
      merchantData?.id ||
      null;

    const storeName =
      merchantData?.data?.name ||
      merchantData?.data?.store_name ||
      merchantData?.data?.merchant?.name ||
      null;

    if (!merchantId) {
      return Response.json(
        {
          success: false,
          message: "Could not detect merchant_id from Salla store info",
          store_response: merchantData,
        },
        { status: 400 }
      );
    }

    const expiresAt = expiresIn
      ? new Date(Date.now() + Number(expiresIn) * 1000).toISOString()
      : null;

    const { error: upsertError } = await supabase.from("merchants").upsert(
      {
        merchant_id: String(merchantId),
        store_name: storeName,
        access_token: accessToken,
        refresh_token: refreshToken,
        token_expires_at: expiresAt,
        updated_at: new Date().toISOString(),
      },
      { onConflict: "merchant_id" }
    );

    if (upsertError) {
      return Response.json(
        {
          success: false,
          message: "Failed to save merchant token in Supabase",
          error: upsertError,
        },
        { status: 500 }
      );
    }

  const sessionValue = createMerchantSession(String(merchantId));
    
const redirectResponse = Response.redirect(
  "https://smart-store-advisor.vercel.app/dashboard"
);

redirectResponse.headers.append(
  "Set-Cookie",
  `merchant_session=${sessionValue}; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=2592000`
);

return redirectResponse;
    
  } catch (error) {
    return Response.json(
      {
        success: false,
        message: "Unexpected callback error",
        error: String(error),
      },
      { status: 500 }
    );
  }
}
