export async function GET(request) {
  const { searchParams } = new URL(request.url);

  const code = searchParams.get("code");

  return Response.json({
    success: true,
    authorization_code: code,
  });
}
