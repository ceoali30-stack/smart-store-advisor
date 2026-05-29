import { NextResponse } from "next/server";
import { createMerchantSession } from "../../../lib/session";

export async function GET(request) {
  const { searchParams } = new URL(request.url);

  const merchantId =
    searchParams.get("merchant_id") ||
    searchParams.get("merchant") ||
    searchParams.get("store_id") ||
    searchParams.get("store");

  if (!merchantId) {
    return NextResponse.redirect(new URL("/", request.url));
  }

const response = NextResponse.redirect(
  new URL(`/dashboard?merchant_id=${merchantId}`, request.url)
);
  
  response.cookies.set(
    "merchant_session",
    createMerchantSession(String(merchantId)),
    {
      path: "/",
      httpOnly: true,
      secure: true,
      sameSite: "none",
      maxAge: 60 * 60 * 24 * 30,
    }
  );

  return response;
}
