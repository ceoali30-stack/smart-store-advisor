import { cookies } from "next/headers";
import { verifyMerchantSession } from "../../../lib/session";

import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

export async function GET(request) {
  try {
    const cookieStore = await cookies();
const sessionCookie = cookieStore.get("merchant_session")?.value;
const merchantId = verifyMerchantSession(sessionCookie);

if (!merchantId) {
  return Response.json(
    {
      success: false,
      message: "Unauthorized"
    },
    { status: 401 }
  );
}

    const { data: products, error } = await supabase
      .from("products")
      .select("merchant_id, salla_product_id, name, price, quantity")
      .eq("merchant_id", merchantId);

    if (error) {
      console.error("DASHBOARD PRODUCTS FETCH ERROR:", error);

      return Response.json(
        {
          success: false,
          message: "Failed to fetch products from Supabase",
          error
        },
        { status: 500 }
      );
    }

    const totalProducts = products.length;

    const numericPrices = products
      .map((product) => Number(product.price))
      .filter((price) => !Number.isNaN(price));

    const averagePrice =
      numericPrices.length > 0
        ? numericPrices.reduce((sum, price) => sum + price, 0) / numericPrices.length
        : 0;

    const lowStockProducts = products.filter((product) => {
      const quantity = Number(product.quantity);
      return !Number.isNaN(quantity) && quantity <= 3;
    });

    const sortedByPrice = [...products]
      .filter((product) => !Number.isNaN(Number(product.price)))
      .sort((a, b) => Number(b.price) - Number(a.price));

    const highestPriceProduct = sortedByPrice[0] || null;
    const lowestPriceProduct = sortedByPrice[sortedByPrice.length - 1] || null;

return Response.json({
  success: true,
  merchant_id: merchantId,
  total_products: totalProducts,
  average_price: Number(averagePrice.toFixed(2)),
  low_stock_products_count: lowStockProducts.length,
  low_stock_products: lowStockProducts.map((product) => ({
    id: product.salla_product_id,
    name: product.name,
    price: Number(product.price),
    quantity: Number(product.quantity),
  })),
  highest_price_product: highestPriceProduct
    ? {
        name: highestPriceProduct.name,
        price: Number(highestPriceProduct.price),
      }
    : null,
  lowest_price_product: lowestPriceProduct
    ? {
        name: lowestPriceProduct.name,
        price: Number(lowestPriceProduct.price),
      }
         : null,
  });
} catch (error) {
  console.error("DASHBOARD API ERROR:", error);

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
