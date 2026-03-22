export async function POST(request) {
  try {
    const { humanData, sessionId } = await request.json();
    if (!humanData?.name || !humanData?.email || !humanData?.resume) {
      return Response.json({ error: "Missing required fields" }, { status: 400 });
    }
    const emailBody = `New Human Review Request\n========================\nStripe Session: ${sessionId || "unknown"}\n\nCustomer Name: ${humanData.name}\nCustomer Email: ${humanData.email}\n\nResume:\n-------\n${humanData.resume}\n\n${humanData.context ? "Additional Context:\n-------\n" + humanData.context : "No additional context provided."}`.trim();
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { "Content-Type": "application/json", "Authorization": `Bearer ${process.env.RESEND_API_KEY}` },
      body: JSON.stringify({ from: "Shortlisted <onboarding@resend.dev>", to: ["resumegetshortlisted.co@gmail.com"], subject: `New Human Review Request — ${humanData.name}`, text: emailBody }),
    });
    const data = await res.json();
    if (!res.ok) { console.error("Resend error:", data); return Response.json({ error: "Failed to send email" }, { status: 500 }); }
    return Response.json({ success: true });
  } catch (err) {
    console.error("Email route error:", err);
    return Response.json({ error: err.message }, { status: 500 });
  }
}
