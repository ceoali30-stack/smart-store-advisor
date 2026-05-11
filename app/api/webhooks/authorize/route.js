export async function POST(request) {
  const body = await request.json();

  console.log("Salla Authorization Event:", body);

  return Response.json({
    success: true,
    received: true,
  });
}
