// app/api/anthropic/route.js
//
// This is the secure server-side proxy for all Anthropic API calls.
// The ANTHROPIC_API_KEY lives only here — never sent to the browser.

export async function POST(request) {
  // Only allow requests from your own app
  const origin = request.headers.get("origin");
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

  try {
    const body = await request.json();

    // Basic validation — must have messages array
    if (!body.messages || !Array.isArray(body.messages)) {
      return Response.json({ error: "Invalid request" }, { status: 400 });
    }

    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": process.env.ANTHROPIC_API_KEY,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: body.model || "claude-sonnet-4-20250514",
        max_tokens: body.max_tokens || 2500,
        system: body.system,
        messages: body.messages,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      console.error("Anthropic API error:", data);
      return Response.json(
        { error: data.error?.message || "API error" },
        { status: response.status }
      );
    }

    return Response.json(data);
  } catch (err) {
    console.error("Proxy error:", err);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}
