"use client";
import { Suspense } from "react";
import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";

function SuccessInner() {
  const router = useRouter();
  const params = useSearchParams();

  useEffect(() => {
    const sessionId = params.get("session_id");
    const type = params.get("type") || "rewrite";
    if (sessionId) {
      localStorage.setItem("shortlisted:paid", JSON.stringify({ sessionId, type, paidAt: new Date().toISOString() }));
    }
    const t = setTimeout(() => router.push("/"), 1800);
    return () => clearTimeout(t);
  }, []);

  return (
    <div style={{minHeight:"100vh",display:"flex",alignItems:"center",justifyContent:"center",flexDirection:"column",gap:"1rem",fontFamily:"sans-serif",background:"#f7f8f5"}}>
      <div style={{width:56,height:56,borderRadius:"50%",background:"rgba(90,138,106,0.12)",border:"1.5px solid rgba(90,138,106,0.25)",display:"flex",alignItems:"center",justifyContent:"center"}}>
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#5a8a6a" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="20 6 9 17 4 12"/>
        </svg>
      </div>
      <p style={{fontSize:"1.1rem",color:"#1e2820",fontWeight:500}}>Payment confirmed — taking you back…</p>
    </div>
  );
}

export default function SuccessPage() {
  return (
    <Suspense>
      <SuccessInner />
    </Suspense>
  );
}
