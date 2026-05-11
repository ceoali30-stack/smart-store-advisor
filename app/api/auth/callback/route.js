export async function GET(request) {
  const { searchParams } = new URL(request.url);

  const code = searchParams.get("code");

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
        code: code,
        redirect_uri:
          "https://smart-store-advisor.vercel.app/api/auth/callback",
      }),
    });

    const data = await response.json();

    return Response.json({
      success: true,
      token_response: data,
    });
  } catch (error) {
    return Response.json({
      success: false,
      error: error.message,
    });
  }
}
