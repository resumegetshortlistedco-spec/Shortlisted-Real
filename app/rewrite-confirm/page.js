"use client";
import { Suspense } from "react";
import { useEffect, useState, useRef } from "react";
import { useSearchParams } from "next/navigation";

function RewriteInner() {
  const params = useSearchParams();
  const [pastedText, setPastedText] = useState("");
  const [uploadedFile, setUploadedFile] = useState(null);
  const [resumeTab, setResumeTab] = useState("paste");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [result, setResult] = useState(null);
  const [coverLetter, setCoverLetter] = useState(null);
  const [coverLoading, setCoverLoading] = useState(false);
  const fileInputRef = useRef();
  const type = params.get("type") || "rewrite";

  useEffect(() => {
    const sessionId = params.get("session_id");
    if (sessionId) {
      localStorage.setItem("shortlisted:paid", JSON.stringify({
        sessionId, type, paidAt: new Date().toISOString()
      }));
      window.history.replaceState({}, "", "/rewrite-confirm");
    }
  }, []);

  const handleFile = (file) => {
    if (!file) return;
    if (!file.name.match(/\.(pdf|docx?|txt)$/i)) { setError("Please upload a PDF, Word, or plain text file."); return; }
    setError(null); setUploadedFile(file);
  };

  const handleSubmit = async () => {
    setError(null);
    const hasFile = resumeTab === "upload" && !!uploadedFile;
    const hasText = resumeTab === "paste" && pastedText.trim().length > 60;
    if (!hasFile && !hasText) { setError(resumeTab === "upload" ? "Please upload your resume." : "Please paste your resume (at least a few lines)."); return; }
    setLoading(true);
    try {
      let messages;
      if (hasFile) {
        const base64 = await new Promise((res, rej) => {
          const r = new FileReader();
          r.onload = e => res(e.target.result.split(",")[1]);
          r.onerror = () => rej(new Error("Could not read file"));
          r.readAsDataURL(uploadedFile);
        });
        const content = [];
        if (uploadedFile.name.endsWith(".pdf")) {
          content.push({ type: "document", source: { type: "base64", media_type: "application/pdf", data: base64 } });
        } else {
          let d = ""; try { d = atob(base64); } catch(e) {}
          content.push({ type: "text", text: "Resume:\n" + d });
        }
        content.push({ type: "text", text: 'Rewrite this resume professionally. Return only valid JSON: {"note": "one sentence expert tip", "resume": {"name": "", "contact": "", "summary": "", "experience": [{"title": "", "company": "", "dates": "", "bullets": []}], "education": [{"degree": "", "school": "", "dates": ""}], "skills": []}}' });
        messages = [{ role: "user", content }];
      } else {
        messages = [{ role: "user", content: 'Rewrite this resume professionally.\n\nResume:\n' + pastedText + '\n\nReturn only valid JSON: {"note": "one sentence expert tip", "resume": {"name": "", "contact": "", "summary": "", "experience": [{"title": "", "company": "", "dates": "", "bullets": []}], "education": [{"degree": "", "school": "", "dates": ""}], "skills": []}}' }];
      }
      const res = await fetch("/api/anthropic", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ model: "claude-sonnet-4-20250514", max_tokens: 2500, messages }),
      });
      const data = await res.json();
      if (data.error) throw new Error(data.error.message);
      const text = (data.content?.map(b => b.text || "").join("") || "").trim();
      const clean = text.replace(/^```json\s*/i,"").replace(/^```\s*/i,"").replace(/```\s*$/i,"").trim();
      const parsed = JSON.parse(clean);
      setResult(parsed);
    } catch(e) {
      setError("Something went wrong. Please try again.");
    } finally { setLoading(false); }
  };

  const generateCoverLetter = async () => {
    if (!result?.resume) return;
    setCoverLoading(true);
    const r = result.resume;
    try {
      const res = await fetch("/api/anthropic", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514", max_tokens: 800,
          system: "You are an expert cover letter writer.",
          messages: [{ role: "user", content: "Write a compelling 3-paragraph cover letter for " + r.name + " applying for " + (r.experience?.[0]?.title || "a role") + ". Use their experience: " + r.summary + ". Return only the cover letter text." }],
        }),
      });
      const data = await res.json();
      setCoverLetter((data.content?.map(b => b.text || "").join("") || "").trim());
    } catch(e) {
      setCoverLetter("Something went wrong. Please try again.");
    } finally { setCoverLoading(false); }
  };

  const s = {
    page: { minHeight: "100vh", background: "#f7f8f5", fontFamily: "'Outfit', sans-serif", padding: "5rem 1.5rem 3rem" },
    card: { maxWidth: 680, margin: "0 auto", background: "white", borderRadius: 16, padding: "2.5rem", boxShadow: "0 4px 24px rgba(30,40,32,0.08)", border: "1.5px solid rgba(90,138,106,0.15)" },
    badge: { display: "inline-flex", alignItems: "center", gap: 6, background: "rgba(90,138,106,0.1)", border: "1.5px solid rgba(90,138,106,0.2)", borderRadius: "2rem", padding: "0.35rem 1rem", fontSize: "0.72rem", fontWeight: 600, letterSpacing: "0.12em", textTransform: "uppercase", color: "#5a8a6a", marginBottom: "1.2rem" },
    title: { fontFamily: "'Fraunces', serif", fontSize: "2rem", fontWeight: 700, color: "#1e2820", marginBottom: "0.5rem" },
    sub: { fontSize: "0.9rem", color: "#8a9e8e", fontWeight: 300, marginBottom: "2rem", lineHeight: 1.6 },
    tabs: { display: "flex", gap: 4, background: "#f0f4f0", borderRadius: 10, padding: 4, marginBottom: "1.5rem" },
    tab: (active) => ({ flex: 1, padding: "0.55rem", borderRadius: 8, border: "none", cursor: "pointer", fontFamily: "'Outfit', sans-serif", fontSize: "0.84rem", fontWeight: active ? 600 : 400, background: active ? "white" : "transparent", color: active ? "#1e2820" : "#8a9e8e", boxShadow: active ? "0 1px 4px rgba(0,0,0,0.08)" : "none", transition: "all 0.2s" }),
    textarea: { width: "100%", minHeight: 220, padding: "1rem", border: "1.5px solid #d8e2da", borderRadius: 10, fontFamily: "'Outfit', sans-serif", fontSize: "0.88rem", color: "#1e2820", background: "#f7f8f5", resize: "vertical", outline: "none", lineHeight: 1.6 },
    uploadZone: { border: "2px dashed #c8d8cc", borderRadius: 12, padding: "2rem", textAlign: "center", cursor: "pointer", background: "#f7f8f5", color: "#8a9e8e", fontSize: "0.86rem" },
    btn: { width: "100%", padding: "0.9rem", background: "#5a8a6a", color: "white", border: "none", borderRadius: 12, fontFamily: "'Outfit', sans-serif", fontSize: "0.95rem", fontWeight: 600, cursor: "pointer", marginTop: "1.2rem", display: "flex", alignItems: "center", justifyContent: "center", gap: 8 },
    error: { background: "rgba(220,50,50,0.07)", border: "1.5px solid rgba(220,50,50,0.2)", borderRadius: 8, padding: "0.75rem 1rem", color: "#c03030", fontSize: "0.84rem", marginBottom: "1rem" },
    resumeDoc: { fontFamily: "Georgia, serif", fontSize: "0.9rem", lineHeight: 1.7, color: "#1a1a1a", padding: "2rem", border: "1.5px solid #e0e8e2", borderRadius: 12, background: "white", marginTop: "1.5rem" },
    sectionTitle: { fontSize: "0.65rem", fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase", color: "#5a8a6a", borderBottom: "1.5px solid #e0e8e2", paddingBottom: "0.3rem", marginBottom: "0.8rem", marginTop: "1.2rem" },
    expertNote: { background: "rgba(90,138,106,0.06)", border: "1.5px solid rgba(90,138,106,0.18)", borderRadius: 10, padding: "1rem 1.2rem", marginTop: "1.2rem", fontSize: "0.84rem", color: "#4a5c4e", fontWeight: 300, lineHeight: 1.6 },
    coverBtn: { width: "100%", padding: "0.85rem", background: "#4a90b8", color: "white", border: "none", borderRadius: 12, fontFamily: "'Outfit', sans-serif", fontSize: "0.92rem", fontWeight: 600, cursor: "pointer", marginTop: "1.2rem", display: "flex", alignItems: "center", justifyContent: "center", gap: 8 },
    resetBtn: { display: "block", textAlign: "center", marginTop: "1.5rem", color: "#8a9e8e", fontSize: "0.84rem", cursor: "pointer", background: "none", border: "none", fontFamily: "'Outfit', sans-serif", textDecoration: "underline" },
  };

  return (
    <div style={s.page}>
      <link href="https://fonts.googleapis.com/css2?family=Fraunces:wght@300;500;700&family=Outfit:wght@300;400;500;600&display=swap" rel="stylesheet" />
      <div style={s.card}>
        {!result ? (
          <>
            <div style={s.badge}>Payment confirmed</div>
            <div style={s.title}>You are all set</div>
            <div style={s.sub}>Paste or upload your resume below and we will get to work. Your rewrite will be ready in about 30 seconds.</div>
            <div style={s.tabs}>
              <button style={s.tab(resumeTab==="paste")} onClick={() => setResumeTab("paste")}>Paste text</button>
              <button style={s.tab(resumeTab==="upload")} onClick={() => setResumeTab("upload")}>Upload file</button>
            </div>
            {resumeTab === "paste" && (
              <textarea style={s.textarea} placeholder="Paste your current resume here..." value={pastedText} onChange={e => setPastedText(e.target.value)} />
            )}
            {resumeTab === "upload" && (
              <div style={s.uploadZone} onClick={() => fileInputRef.current?.click()}>
                <input ref={fileInputRef} type="file" accept=".pdf,.doc,.docx,.txt" style={{display:"none"}} onChange={e => handleFile(e.target.files?.[0])} />
                {uploadedFile ? (
                  <div style={{color:"#5a8a6a", fontWeight:500}}>Done: {uploadedFile.name}</div>
                ) : (
                  <>
                    <div style={{marginBottom:6}}>Drop your resume here, or click to browse</div>
                    <div style={{fontSize:"0.78rem"}}>PDF, Word or plain text</div>
                  </>
                )}
              </div>
            )}
            {error && <div style={s.error}>{error}</div>}
            <button style={s.btn} onClick={handleSubmit} disabled={loading}>
              {loading ? "Rewriting your resume..." : "Rewrite my resume"}
            </button>
          </>
        ) : (
          <>
            <div style={s.badge}>Your rewritten resume</div>
            <div style={s.resumeDoc}>
              {result.resume?.name && <div style={{fontSize:"1.4rem", fontWeight:700, marginBottom:4}}>{result.resume.name}</div>}
              {result.resume?.contact && <div style={{fontSize:"0.82rem", color:"#666", marginBottom:"1rem"}}>{result.resume.contact}</div>}
              {result.resume?.summary && (<><div style={s.sectionTitle}>Professional Summary</div><p style={{margin:0}}>{result.resume.summary}</p></>)}
              {result.resume?.experience?.length > 0 && (
                <><div style={s.sectionTitle}>Experience</div>
                {result.resume.experience.map((exp, i) => (
                  <div key={i} style={{marginBottom:"1rem"}}>
                    <div style={{display:"flex", justifyContent:"space-between", flexWrap:"wrap"}}>
                      <span style={{fontWeight:600}}>{exp.title}{exp.company && <span style={{fontWeight:400}}> at {exp.company}</span>}</span>
                      {exp.dates && <span style={{fontSize:"0.82rem", color:"#888"}}>{exp.dates}</span>}
                    </div>
                    {exp.bullets?.length > 0 && <ul style={{margin:"0.4rem 0 0 1.2rem", padding:0}}>{exp.bullets.map((b,j) => <li key={j} style={{marginBottom:3}}>{b}</li>)}</ul>}
                  </div>
                ))}</>
              )}
              {result.resume?.education?.length > 0 && (
                <><div style={s.sectionTitle}>Education</div>
                {result.resume.education.map((edu, i) => (
                  <div key={i} style={{marginBottom:4}}>
                    <span style={{fontWeight:600}}>{edu.degree}{edu.school && <span style={{fontWeight:400}}> at {edu.school}</span>}</span>
                    {edu.dates && <span style={{fontSize:"0.82rem", color:"#888", marginLeft:8}}>{edu.dates}</span>}
                  </div>
                ))}</>
              )}
              {result.resume?.skills?.length > 0 && (<><div style={s.sectionTitle}>Skills</div><p style={{margin:0}}>{result.resume.skills.join(", ")}</p></>)}
            </div>
            {result.note && <div style={s.expertNote}><strong style={{color:"#5a8a6a"}}>Expert note:</strong> {result.note}</div>}
            <button style={{...s.btn, background:"white", color:"#1e2820", border:"1.5px solid #d8e2da", marginTop:"1rem"}} onClick={() => window.print()}>Save as PDF</button>
            {!coverLetter ? (
              <button style={s.coverBtn} onClick={generateCoverLetter} disabled={coverLoading}>
                {coverLoading ? "Writing your cover letter..." : "Generate free cover letter"}
              </button>
            ) : (
              <div style={{marginTop:"1.5rem"}}>
                <div style={s.sectionTitle}>Cover letter</div>
                <div style={{...s.resumeDoc, whiteSpace:"pre-wrap", fontSize:"0.88rem"}}>{coverLetter}</div>
              </div>
            )}
            <button style={s.resetBtn} onClick={() => window.location.href = "/"}>Back to home</button>
          </>
        )}
      </div>
    </div>
  );
}

export default function RewritePage() {
  return (
    <Suspense>
      <RewriteInner />
    </Suspense>
  );
}
