export async function POST(request) {
  try {
    const body = await request.json();

    console.log("SALLA WEBHOOK DATA:");
    console.log(JSON.stringify(body, null, 2));

    return Response.json({
      success: true,
      received: body,
    });
  } catch (error) {
    console.error("WEBHOOK ERROR:", error);

    return Response.json({
      success: false,
      error: error.message,
    });
  }
}
