import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

export async function POST(request) {
  try {
    const body = await request.json();

    console.log("SALLA WEBHOOK DATA:", JSON.stringify(body, null, 2));

    const { data, error } = await supabase
      .from("merchants")
      .insert([
        {
          merchant_id: "test_merchant",
          access_token: "test_access_token",
          refresh_token: "test_refresh_token"
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

    return Response.json({
      success: true,
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
