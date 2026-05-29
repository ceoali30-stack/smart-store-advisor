import { cookies } from "next/headers";
import { verifyMerchantSession } from "../../../lib/session";

import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const cookieStore = await cookies();
const sessionCookie = cookieStore.get("merchant_session")?.value;
const merchantId = verifyMerchantSession(sessionCookie);

if (!merchantId) {
  return Response.json(
    { success: false, message: "Unauthorized" },
    { status: 401 }
  );
}

    const { data: merchant, error: merchantError } = await supabase
      .from("merchants")
      .select("merchant_id, access_token")
      .eq("merchant_id", merchantId)
      .single();

    if (merchantError || !merchant) {
      return Response.json(
        {
          success: false,
          message: "Merchant not found",
          error: merchantError
        },
        { status: 404 }
      );
    }

    const sallaResponse = await fetch("https://api.salla.dev/admin/v2/products", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${merchant.access_token}`,
        Accept: "application/json"
      }
    });

    const sallaData = await sallaResponse.json();

    if (!sallaResponse.ok) {
      return Response.json(
        {
          success: false,
          message: "Failed to fetch products from Salla",
          status: sallaResponse.status,
          error: sallaData
        },
        { status: 500 }
      );
    }

    const products = Array.isArray(sallaData.data) ? sallaData.data : [];

   const rows = products.map((product) => {
  const skuCostPrices = Array.isArray(product.skus)
    ? product.skus
        .map((sku) => Number(sku.cost_price || 0))
        .filter((value) => value > 0)
    : [];

  const costPrice =
    Number(product.cost_price || 0) > 0
      ? Number(product.cost_price)
      : skuCostPrices.length > 0
      ? skuCostPrices[0]
      : null;

  return {
    merchant_id: String(merchantId),
    salla_product_id: String(product.id),
    name: product.name || null,
    price: product.price?.amount || product.price || null,
    quantity: product.quantity || product.stock_quantity || null,
    status: product.status || null,
    cost_price: costPrice,
    raw_data: product,
  };
});

    if (rows.length === 0) {
      return Response.json({
        success: true,
        message: "No products found",
        count: 0
      });
    }

    const { data, error } = await supabase
      .from("products")
      .upsert(rows, {
        onConflict: "merchant_id,salla_product_id"
      })
      .select();

    if (error) {
      console.error("SUPABASE PRODUCTS UPSERT ERROR:", error);

      return Response.json(
        {
          success: false,
          message: "Supabase products upsert failed",
          error
        },
        { status: 500 }
      );
    }

    return Response.json({
      success: true,
      message: "Products synced successfully",
      count: data.length,
      products: data
    });
  } catch (error) {
    console.error("PRODUCT SYNC ERROR:", error);

    return Response.json(
      {
        success: false,
        message: "Unexpected server error",
        error: String(error)
      },
      { status: 500 }
    );
  }
}
