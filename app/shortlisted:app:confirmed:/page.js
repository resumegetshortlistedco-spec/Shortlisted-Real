"use client";
import { Suspense } from "react";
import { useEffect } from "react";
import { useSearchParams } from "next/navigation";

function ConfirmedInner() {
  const params = useSearchParams();

  useEffect(() => {
    const sessionId = params.get("session_id");
    if (sessionId) {
      window.history.replaceState({}, "", "/confirmed");

      // Retrieve saved humanData and send email
      try {
        const pending = JSON.parse(localStorage.getItem("shortlisted:pending") || "null");
        if (pending?.humanData) {
          fetch("/api/send-review-email", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ humanData: pending.humanData, sessionId }),
          }).catch(e => console.error("Email error:", e));
          localStorage.removeItem("shortlisted:pending");
        }

        // Mark as paid
        localStorage.setItem("shortlisted:paid", JSON.stringify({
          type: "human", paidAt: new Date().toISOString(), sessionId,
        }));
      } catch(e) {}
    }
  }, []);

  return (
    <div style={{
      minHeight: "100vh", background: "#f7f8f5",
      fontFamily: "'Outfit', sans-serif",
      display: "flex", alignItems: "center", justifyContent: "center",
      padding: "2rem",
    }}>
      <link href="https://fonts.googleapis.com/css2?family=Fraunces:wght@300;500;700&family=Outfit:wght@300;400;500;600&display=swap" rel="stylesheet" />
      <div style={{
        maxWidth: 560, width: "100%", background: "white",
        borderRadius: 20, padding: "3rem 2.5rem", textAlign: "center",
        boxShadow: "0 4px 24px rgba(30,40,32,0.08)",
        border: "1.5px solid rgba(176,106,58,0.15)",
      }}>
        <div style={{
          width: 64, height: 64, borderRadius: "50%",
          background: "rgba(176,106,58,0.1)", border: "1.5px solid rgba(176,106,58,0.25)",
          display: "flex", alignItems: "center", justifyContent: "center",
          margin: "0 auto 1.5rem",
        }}>
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none"
            stroke="#b06a3a" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="20 6 9 17 4 12"/>
          </svg>
        </div>

        <div style={{
          fontFamily: "'Fraunces', serif", fontSize: "1.8rem",
          fontWeight: 700, color: "#1e2820", marginBottom: "0.75rem", lineHeight: 1.2,
        }}>
          You're all set!
        </div>

        <p style={{
          fontSize: "1rem", color: "#4a5c4e", fontWeight: 300,
          lineHeight: 1.7, marginBottom: "2rem",
        }}>
          We've received your resume and payment. One of our career coaches will personally review and rewrite it within <strong style={{fontWeight: 600, color: "#b06a3a"}}>48 hours</strong> and send it directly to your email.
        </p>

        <div style={{
          background: "rgba(176,106,58,0.06)", border: "1.5px solid rgba(176,106,58,0.18)",
          borderRadius: 12, padding: "1.2rem 1.5rem", marginBottom: "2rem", textAlign: "left",
        }}>
          <div style={{fontSize: "0.72rem", fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: "#b06a3a", marginBottom: "0.8rem"}}>What happens next</div>
          {[
            "Our career coach reviews your resume and goals",
            "Full rewrite with strategic improvements",
            "ATS optimisation to get past filters",
            "Delivered to your inbox within 48 hours",
            "One free revision round included",
          ].map((step, i) => (
            <div key={i} style={{display: "flex", alignItems: "flex-start", gap: "0.6rem", marginBottom: "0.5rem"}}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#b06a3a" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{flexShrink: 0, marginTop: 2}}>
                <polyline points="20 6 9 17 4 12"/>
              </svg>
              <span style={{fontSize: "0.86rem", color: "#4a5c4e", fontWeight: 300, lineHeight: 1.5}}>{step}</span>
            </div>
          ))}
        </div>

        <p style={{fontSize: "0.82rem", color: "#8a9e8e", fontWeight: 300, marginBottom: "1.5rem"}}>
          Questions? Email us at <a href="mailto:resumegetshortlisted.co@gmail.com" style={{color: "#b06a3a", textDecoration: "none"}}>resumegetshortlisted.co@gmail.com</a>
        </p>

        <a href="/" style={{
          display: "inline-block", padding: "0.75rem 2rem",
          background: "none", border: "1.5px solid #d8e2da",
          borderRadius: 12, color: "#8a9e8e", fontSize: "0.86rem",
          fontFamily: "'Outfit', sans-serif", textDecoration: "none",
          cursor: "pointer",
        }}>← Back to Shortlisted</a>
      </div>
    </div>
  );
}

export default function ConfirmedPage() {
  return (
    <Suspense>
      <ConfirmedInner />
    </Suspense>
  );
}
