"use client";
import { useState, useRef, useCallback, useEffect } from "react";

const S = `
  @import url('https://fonts.googleapis.com/css2?family=Fraunces:ital,wght@0,300;0,500;0,700;1,300;1,500;1,700&family=Outfit:wght@300;400;500;600&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  :root {
    --sage: #5a8a6a;
    --sage-light: #7aaa8a;
    --sage-dim: rgba(90,138,106,0.1);
    --sage-border: rgba(90,138,106,0.2);
    --sky: #4a90b8;
    --sky-dim: rgba(74,144,184,0.1);
    --sky-border: rgba(74,144,184,0.22);
    --bg: #f7f8f5;
    --bg2: #eef1ea;
    --white: #ffffff;
    --surface: rgba(255,255,255,0.8);
    --text: #1e2820;
    --text-mid: #4a5c4e;
    --text-muted: #8a9e8e;
    --text-faint: #b8c8bc;
    --radius: 16px;
    --radius-sm: 10px;
    --shadow: 0 2px 16px rgba(30,40,32,0.07);
    --shadow-md: 0 6px 28px rgba(30,40,32,0.1);
  }

  body {
    font-family: 'Outfit', sans-serif;
    background: var(--bg);
    color: var(--text);
    min-height: 100vh;
    -webkit-font-smoothing: antialiased;
  }

  /* ─── NAV ─── */
  .nav {
    display: flex; align-items: center; justify-content: space-between;
    padding: 1.2rem 2.5rem;
    position: fixed; top: 0; left: 0; right: 0; z-index: 100;
    transition: all 0.35s;
  }
  .nav.scrolled {
    background: rgba(247,248,245,0.92);
    border-bottom: 1px solid var(--sage-border);
    backdrop-filter: blur(16px);
    box-shadow: 0 1px 12px rgba(30,40,32,0.06);
  }
  .nav-logo {
    font-family: 'Fraunces', serif;
    font-size: 1.3rem; font-weight: 700; letter-spacing: -0.02em;
    color: var(--sage);
    display: flex; align-items: center; gap: 0.5rem;
  }
  .nav-logo em { font-style: italic; font-weight: 300; color: var(--sage-light); }
  .nav-right { display: flex; align-items: center; gap: 0.75rem; }
  .nav-back {
    background: none; border: none; cursor: pointer;
    font-family: 'Outfit', sans-serif; font-size: 0.84rem;
    color: var(--text-muted); padding: 0.4rem 0.75rem;
    border-radius: var(--radius-sm); transition: all 0.18s;
  }
  .nav-back:hover { color: var(--text); background: var(--bg2); }
  .nav-cta {
    font-size: 0.78rem; font-weight: 600; letter-spacing: 0.06em;
    color: #b06a3a;
    background: rgba(176,106,58,0.1); border: 1.5px solid rgba(176,106,58,0.25);
    border-radius: 2rem; padding: 0.35rem 1rem;
    cursor: pointer; transition: all 0.18s; font-family: 'Outfit', sans-serif;
  }
  .nav-cta:hover { background: rgba(176,106,58,0.18); }

  /* ─── SPLASH ─── */
  .splash {
    min-height: 100vh;
    display: flex; flex-direction: column; align-items: center; justify-content: center;
    text-align: center; padding: 2rem 1.5rem; position: relative;
    overflow: hidden;
  }

  .blob {
    position: absolute; border-radius: 50%; pointer-events: none; z-index: 0;
    filter: blur(60px);
  }
  .blob-1 { width: 500px; height: 500px; background: rgba(90,138,106,0.12); top: -100px; left: -150px; }
  .blob-2 { width: 400px; height: 400px; background: rgba(74,144,184,0.1); bottom: -80px; right: -100px; }
  .blob-3 { width: 300px; height: 300px; background: rgba(90,138,106,0.07); top: 40%; right: 5%; }

  .splash-hero {
    position: relative; z-index: 1;
    display: flex; flex-direction: column; align-items: center;
    max-width: 560px; margin: 0 auto 3rem;
  }

  .eyebrow {
    display: inline-flex; align-items: center; gap: 0.4rem;
    font-size: 0.72rem; font-weight: 600; letter-spacing: 0.14em; text-transform: uppercase;
    color: var(--sage); background: var(--sage-dim); border: 1.5px solid var(--sage-border);
    border-radius: 2rem; padding: 0.35rem 1rem; margin-bottom: 1.8rem;
    opacity: 0; animation: fadeUp 0.6s 0.2s ease forwards;
  }

  .splash-headline {
    font-family: 'Fraunces', serif;
    font-size: clamp(2.6rem, 6vw, 4.4rem);
    font-weight: 700; line-height: 1.1; color: var(--text);
    margin-bottom: 1.4rem;
    opacity: 0; animation: fadeUp 0.7s 0.4s ease forwards;
    transform: translateY(14px);
  }
  .splash-headline em { font-style: italic; font-weight: 300; color: var(--sage); }

  .splash-sub {
    font-size: 1.05rem; font-weight: 300; line-height: 1.7;
    color: var(--text-mid); max-width: 360px; margin: 0 auto 1.8rem;
    opacity: 0; animation: fadeUp 0.7s 0.62s ease forwards;
    transform: translateY(14px);
  }

  .trust-row {
    display: flex; justify-content: center; gap: 1.8rem; flex-wrap: wrap;
    opacity: 0; animation: fadeUp 0.6s 0.9s ease forwards;
  }
  .trust-item {
    display: flex; align-items: center; gap: 0.4rem;
    font-size: 0.74rem; color: var(--text-muted); font-weight: 400;
  }

  .choice-section {
    position: relative; z-index: 1;
    width: 100%; max-width: 980px;
    opacity: 0; animation: fadeUp 0.7s 0.85s ease forwards;
    transform: translateY(14px);
  }

  .choice-row {
    display: flex; gap: 0.75rem; justify-content: center; flex-wrap: wrap;
    max-width: 980px; margin: 0 auto 1.6rem;
  }

  .choice-card {
    flex: 1; min-width: 200px; max-width: 225px;
    background: var(--white); border: 1.5px solid var(--sage-border);
    border-radius: var(--radius); padding: 1.4rem 1.2rem;
    cursor: pointer; text-align: left;
    transition: all 0.25s; box-shadow: var(--shadow);
    position: relative; overflow: hidden;
  }
  .choice-card::before {
    content: '';
    position: absolute; top: 0; left: 0; right: 0; height: 3px;
    background: linear-gradient(90deg, var(--sage), var(--sky));
    opacity: 0; transition: opacity 0.25s;
  }
  .choice-card:hover { border-color: var(--sage); transform: translateY(-4px); box-shadow: var(--shadow-md); }
  .choice-card:hover::before { opacity: 1; }

  .choice-item-price {
    position: absolute; top: 0.85rem; right: 0.85rem;
    font-family: 'Fraunces', serif; font-size: 1rem; font-weight: 700;
    color: #b06a3a; background: rgba(176,106,58,0.1);
    border: 1.5px solid rgba(176,106,58,0.25);
    border-radius: 2rem; padding: 0.15rem 0.65rem;
  }

  .choice-icon { width: 40px; height: 40px; margin-bottom: 0.85rem; display: block; }
  .choice-icon svg { width: 100%; height: 100%; }
  .choice-title { font-size: 1rem; font-weight: 600; color: var(--text); margin-bottom: 0.4rem; }
  .choice-desc { font-size: 0.82rem; font-weight: 300; color: var(--text-mid); line-height: 1.55; }
  .choice-tag {
    display: inline-block; margin-top: 0.9rem;
    font-size: 0.67rem; font-weight: 600; letter-spacing: 0.09em; text-transform: uppercase;
    color: var(--sage); background: var(--sage-dim); border: 1.5px solid var(--sage-border);
    border-radius: 2rem; padding: 0.18rem 0.65rem;
  }

  .splash-incl {
    display: inline-flex; align-items: center; gap: 0.7rem;
    background: var(--white); border: 1.5px solid var(--sage-border);
    border-radius: 2rem; padding: 0.65rem 1.4rem;
    font-size: 0.84rem; font-weight: 500; color: var(--text-mid);
    box-shadow: var(--shadow);
    opacity: 0; animation: fadeUp 0.6s 1.1s ease forwards;
  }
  .splash-incl strong { color: var(--sage); font-weight: 600; }

  /* ─── GUIDED ─── */
  .guided-screen {
    min-height: 100vh; padding: 7rem 1.5rem 5rem;
    max-width: 560px; margin: 0 auto;
    display: flex; align-items: flex-start; justify-content: center;
    animation: fadeUp 0.45s ease both;
  }

  .guided-card {
    width: 100%;
    background: var(--white); border: 1.5px solid #e0e8e2;
    border-radius: var(--radius); padding: 2.2rem 2rem;
    box-shadow: var(--shadow-md);
  }

  .guided-progress {
    height: 4px; background: var(--bg2);
    border-radius: 2px; margin-bottom: 2rem; overflow: hidden;
  }
  .guided-progress-bar {
    height: 100%; background: var(--sage);
    border-radius: 2px; transition: width 0.4s ease;
  }

  .guided-step-label {
    font-size: 0.7rem; font-weight: 600; letter-spacing: 0.12em; text-transform: uppercase;
    color: var(--text-muted); margin-bottom: 0.65rem;
  }

  .guided-q {
    font-family: 'Fraunces', serif;
    font-size: clamp(1.4rem, 3vw, 1.9rem);
    font-weight: 700; line-height: 1.2; color: var(--text);
    margin-bottom: 0.5rem;
  }
  .guided-q em { font-style: italic; font-weight: 300; color: var(--sage); }
  .guided-hint { font-size: 0.84rem; color: var(--text-muted); font-weight: 300; margin-bottom: 1.6rem; line-height: 1.5; }

  .guided-opts {
    display: flex; flex-wrap: wrap; gap: 0.5rem; margin-bottom: 1.2rem;
  }

  .guided-opt {
    background: var(--white); border: 1.5px solid #d4ddd6;
    border-radius: 2rem; padding: 0.48rem 1.1rem;
    font-size: 0.84rem; font-weight: 400; color: var(--text-mid);
    cursor: pointer; transition: all 0.17s; white-space: nowrap;
    box-shadow: 0 1px 4px rgba(30,40,32,0.05);
    font-family: 'Outfit', sans-serif;
  }
  .guided-opt:hover { border-color: var(--sage); color: var(--sage); background: var(--sage-dim); }
  .guided-opt.selected { background: var(--sage-dim); border-color: var(--sage); color: var(--sage); font-weight: 500; }

  .guided-input-row { display: flex; flex-direction: column; gap: 0.75rem; }

  .guided-input {
    width: 100%;
    background: var(--bg); border: 1.5px solid #d4ddd6;
    border-radius: var(--radius-sm); color: var(--text);
    font-family: 'Outfit', sans-serif; font-size: 0.95rem; font-weight: 400;
    padding: 0.88rem 1.1rem; outline: none; transition: border-color 0.2s, box-shadow 0.2s;
  }
  .guided-input::placeholder { color: var(--text-faint); }
  .guided-input:focus { border-color: var(--sage); box-shadow: 0 0 0 3px rgba(90,138,106,0.1); background: var(--white); }

  .guided-next {
    background: var(--sage); color: white;
    border: none; border-radius: var(--radius-sm);
    padding: 0.82rem 1.8rem;
    font-family: 'Outfit', sans-serif; font-size: 0.88rem; font-weight: 600;
    letter-spacing: 0.02em; cursor: pointer; transition: all 0.2s;
    display: flex; align-items: center; justify-content: center; gap: 0.5rem;
    box-shadow: 0 3px 12px rgba(90,138,106,0.28); width: 100%;
  }
  .guided-next:hover:not(:disabled) { background: var(--sage-light); transform: translateY(-1px); }
  .guided-next:disabled { opacity: 0.38; cursor: not-allowed; transform: none; box-shadow: none; }

  .guided-back-row { margin-top: 1.2rem; display: flex; justify-content: flex-start; }
  .guided-back-btn {
    background: none; border: none; cursor: pointer;
    font-family: 'Outfit', sans-serif; font-size: 0.84rem; color: var(--text-muted);
    padding: 0.4rem 0; transition: color 0.15s;
  }
  .guided-back-btn:hover { color: var(--text); }

  /* ─── FORM / JUMP / SCRATCH SCREENS ─── */
  .form-screen {
    min-height: 100vh; padding: 7rem 1.5rem 5rem;
    max-width: 620px; margin: 0 auto;
    animation: fadeUp 0.45s ease both;
  }

  .form-card {
    background: var(--white); border: 1.5px solid #e0e8e2;
    border-radius: var(--radius); padding: 2.4rem 2.2rem;
    box-shadow: var(--shadow-md);
  }

  .form-eyebrow {
    font-size: 0.7rem; font-weight: 600; letter-spacing: 0.12em; text-transform: uppercase;
    color: var(--sage); margin-bottom: 0.5rem;
  }

  .form-title {
    font-family: 'Fraunces', serif;
    font-size: 2rem; font-weight: 700; color: var(--text); margin-bottom: 0.3rem;
  }
  .form-title em { font-style: italic; font-weight: 300; color: var(--sage); }
  .form-sub { font-size: 0.88rem; color: var(--text-muted); font-weight: 300; margin-bottom: 1.8rem; }

  .form-context-pill {
    display: inline-flex; align-items: center; gap: 0.5rem;
    background: var(--sage-dim); border: 1.5px solid var(--sage-border);
    border-radius: 2rem; padding: 0.42rem 1rem;
    font-size: 0.78rem; color: var(--sage); font-weight: 400; margin-bottom: 1.6rem;
  }
  .form-context-pill strong { font-weight: 600; }

  .form-group { margin-bottom: 1.1rem; }
  .form-label {
    display: block; font-size: 0.78rem; font-weight: 500; color: var(--text-mid);
    margin-bottom: 0.4rem;
  }
  .form-optional { font-weight: 300; color: var(--text-faint); }

  .payment-notice {
    display: flex; align-items: flex-start; gap: 0.5rem;
    background: rgba(74,144,184,0.07); border: 1.5px solid rgba(74,144,184,0.2);
    border-radius: var(--radius-sm); padding: 0.75rem 1rem;
    font-size: 0.78rem; color: var(--text-mid); font-weight: 300; line-height: 1.5;
    margin-bottom: 1.2rem;
  }
  .payment-notice svg { flex-shrink: 0; margin-top: 1px; }

  .form-input {
    width: 100%; background: var(--bg);
    border: 1.5px solid #d8e2da; border-radius: var(--radius-sm);
    color: var(--text); font-family: 'Outfit', sans-serif;
    font-size: 0.9rem; font-weight: 400; padding: 0.82rem 1rem;
    outline: none; transition: border-color 0.2s, box-shadow 0.2s;
  }
  .form-input::placeholder { color: var(--text-faint); }
  .form-input:focus { border-color: var(--sage); box-shadow: 0 0 0 3px rgba(90,138,106,0.09); background: var(--white); }

  .form-textarea {
    width: 100%; background: var(--bg);
    border: 1.5px solid #d8e2da; border-radius: var(--radius-sm);
    color: var(--text); font-family: 'Outfit', sans-serif;
    font-size: 0.9rem; font-weight: 400; padding: 0.82rem 1rem;
    outline: none; resize: vertical; line-height: 1.65;
    transition: border-color 0.2s, box-shadow 0.2s;
  }
  .form-textarea::placeholder { color: var(--text-faint); }
  .form-textarea:focus { border-color: var(--sage); box-shadow: 0 0 0 3px rgba(90,138,106,0.09); background: var(--white); }

  /* ─── RESUME TABS ─── */
  .resume-tabs {
    display: flex; gap: 0; margin-bottom: 1.1rem;
    background: var(--bg2); border-radius: var(--radius-sm);
    padding: 3px; width: fit-content; border: 1.5px solid #e0e8e2;
  }
  .resume-tab {
    background: none; border: none; cursor: pointer;
    font-family: 'Outfit', sans-serif; font-size: 0.78rem; font-weight: 500;
    letter-spacing: 0.05em; color: var(--text-muted);
    padding: 0.45rem 1.1rem; border-radius: 8px; transition: all 0.18s;
  }
  .resume-tab.active { background: var(--white); color: var(--sage); font-weight: 600; box-shadow: 0 1px 4px rgba(30,40,32,0.08); }

  /* ─── UPLOAD ZONE ─── */
  .upload-zone {
    border: 2px dashed #ccd8ce; border-radius: var(--radius-sm);
    padding: 2.4rem 1.5rem; text-align: center; cursor: pointer;
    transition: all 0.22s; background: var(--bg);
    min-height: 160px; display: flex; align-items: center; justify-content: center;
  }
  .upload-zone:hover { border-color: var(--sage); background: var(--sage-dim); }

  .upload-prompt { display: flex; flex-direction: column; align-items: center; gap: 0.45rem; }
  .upload-text { font-size: 0.9rem; font-weight: 500; color: var(--text); }
  .upload-link { color: var(--sage); text-decoration: underline; }
  .upload-hint { font-size: 0.78rem; color: var(--text-muted); font-weight: 300; }

  .upload-done {
    display: flex; align-items: center; gap: 0.65rem;
    background: var(--sage-dim); border: 1.5px solid var(--sage-border);
    border-radius: var(--radius-sm); padding: 0.75rem 1rem; width: 100%;
  }
  .upload-done span { flex: 1; font-size: 0.86rem; color: var(--text); overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
  .upload-clear {
    background: none; border: none; cursor: pointer; color: var(--text-faint);
    font-size: 0.9rem; padding: 0.15rem 0.3rem; border-radius: 4px; transition: color 0.15s; flex-shrink: 0;
  }
  .upload-clear:hover { color: #d45a5a; }

  /* ─── ERROR / SUBMIT ─── */
  .error-msg {
    margin-top: 0.85rem; background: #fff0f0; border: 1.5px solid #f5c0c0;
    border-radius: var(--radius-sm); padding: 0.75rem 1rem; color: #c04040;
    font-size: 0.83rem; margin-bottom: 0.5rem;
  }

  .submit-btn {
    width: 100%; background: var(--sage); color: white;
    border: none; border-radius: var(--radius-sm);
    padding: 1rem 2rem; margin-top: 1.2rem;
    font-family: 'Outfit', sans-serif; font-size: 0.95rem; font-weight: 600;
    letter-spacing: 0.02em; cursor: pointer; transition: all 0.22s;
    display: flex; align-items: center; justify-content: center; gap: 0.6rem;
    box-shadow: 0 3px 14px rgba(90,138,106,0.3);
  }
  .submit-btn:hover:not(:disabled) { background: var(--sage-light); transform: translateY(-1px); box-shadow: 0 6px 22px rgba(90,138,106,0.35); }
  .submit-btn:disabled { opacity: 0.4; cursor: not-allowed; transform: none; box-shadow: none; }
  .submit-btn.human-btn { background: #b06a3a; box-shadow: 0 3px 14px rgba(176,106,58,0.3); }
  .submit-btn.human-btn:hover:not(:disabled) { background: #c47a4a; box-shadow: 0 6px 22px rgba(176,106,58,0.35); }

  /* ─── SCRATCH-SPECIFIC ─── */
  .scratch-section-label {
    font-size: 0.7rem; font-weight: 600; letter-spacing: 0.13em; text-transform: uppercase;
    color: #7a6abf; margin: 1.5rem 0 0.75rem;
    display: flex; align-items: center; gap: 0.4rem;
  }
  .scratch-section-label::after { content: ''; flex: 1; height: 1px; background: rgba(122,106,191,0.2); }

  .scratch-job-block {
    background: var(--bg); border: 1.5px solid #e0e8e2;
    border-radius: var(--radius-sm); padding: 1.1rem 1.2rem;
    margin-bottom: 0.75rem; position: relative;
  }
  .scratch-job-header {
    display: flex; align-items: center; justify-content: space-between;
    margin-bottom: 0.8rem;
  }
  .scratch-job-num {
    font-size: 0.72rem; font-weight: 600; letter-spacing: 0.09em; text-transform: uppercase;
    color: #7a6abf;
  }
  .scratch-remove {
    background: none; border: none; cursor: pointer;
    font-family: 'Outfit', sans-serif; font-size: 0.78rem; color: var(--text-faint);
    padding: 0.2rem 0.5rem; border-radius: 4px; transition: color 0.15s;
  }
  .scratch-remove:hover { color: #d45a5a; }

  .add-role-btn {
    background: none; border: 1.5px dashed rgba(122,106,191,0.35);
    border-radius: var(--radius-sm); color: #7a6abf;
    font-family: 'Outfit', sans-serif; font-size: 0.82rem; font-weight: 500;
    padding: 0.7rem 1rem; cursor: pointer; width: 100%;
    transition: all 0.18s; display: flex; align-items: center; justify-content: center; gap: 0.4rem;
    margin-bottom: 0.5rem;
  }
  .add-role-btn:hover { background: rgba(122,106,191,0.06); border-color: #7a6abf; }

  /* ─── HUMAN REVIEW ─── */
  .human-features {
    display: flex; flex-direction: column; gap: 0.55rem;
    background: rgba(176,106,58,0.06); border: 1.5px solid rgba(176,106,58,0.18);
    border-radius: var(--radius-sm); padding: 1.1rem 1.2rem; margin-bottom: 1.6rem;
  }
  .human-feature {
    display: flex; align-items: center; gap: 0.55rem;
    font-size: 0.86rem; color: var(--text-mid); font-weight: 400;
  }

  .human-confirm {
    margin-top: 1.2rem; text-align: center; padding: 1.5rem;
    background: var(--sage-dim); border: 1.5px solid var(--sage-border);
    border-radius: var(--radius-sm);
    animation: fadeUp 0.4s ease both;
  }
  .human-confirm-icon {
    width: 52px; height: 52px; border-radius: 50%;
    background: white; border: 2px solid var(--sage-border);
    display: flex; align-items: center; justify-content: center;
    margin: 0 auto 0.85rem;
  }
  .human-confirm-title {
    font-family: 'Fraunces', serif; font-size: 1.3rem; font-weight: 700;
    color: var(--text); margin-bottom: 0.3rem;
  }
  .human-confirm-sub {
    font-size: 0.84rem; color: var(--text-mid); font-weight: 300; line-height: 1.65;
  }
  .human-confirm-sub strong { font-weight: 500; color: var(--text); }

  /* ─── SPINNER ─── */
  .spinner {
    width: 15px; height: 15px;
    border: 2px solid rgba(255,255,255,0.35); border-top-color: white;
    border-radius: 50%; animation: spin 0.65s linear infinite; flex-shrink: 0;
  }
  @keyframes spin { to { transform: rotate(360deg); } }

  /* ─── RESULTS ─── */
  .results-screen {
    min-height: 100vh; padding: 7rem 1.5rem 5rem;
    max-width: 860px; margin: 0 auto;
    animation: fadeUp 0.55s 0.1s ease both;
  }

  .results-inner { max-width: 720px; margin: 0 auto; }

  .results-header {
    display: flex; align-items: center; justify-content: space-between;
    margin-bottom: 1.4rem; flex-wrap: wrap; gap: 0.75rem;
  }

  .results-label {
    font-size: 0.7rem; font-weight: 600; letter-spacing: 0.13em; text-transform: uppercase;
    color: var(--sage);
  }

  .dl-btn {
    background: var(--sage); color: white;
    border: none; border-radius: var(--radius-sm);
    padding: 0.7rem 1.3rem;
    font-family: 'Outfit', sans-serif; font-size: 0.84rem; font-weight: 600;
    cursor: pointer; transition: all 0.2s;
    display: flex; align-items: center; gap: 0.5rem;
    box-shadow: 0 3px 14px rgba(90,138,106,0.28); white-space: nowrap;
  }
  .dl-btn:hover { background: var(--sage-light); transform: translateY(-1px); }

  .dl-btn-sm {
    background: transparent; border: 1.5px solid var(--sage-border);
    color: var(--sage); border-radius: var(--radius-sm);
    padding: 0.38rem 0.9rem;
    font-family: 'Outfit', sans-serif; font-size: 0.75rem; font-weight: 500;
    cursor: pointer; transition: all 0.2s;
    display: flex; align-items: center; gap: 0.35rem; white-space: nowrap;
  }
  .dl-btn-sm:hover { background: var(--sage-dim); border-color: var(--sage); }

  /* ─── RESUME DOC ─── */
  .resume-doc {
    background: white; border: 1.5px solid #e0e8e2;
    border-radius: var(--radius); padding: 2.8rem 3rem;
    font-family: 'Georgia', serif; color: #1a1a1a;
    font-size: 0.88rem; line-height: 1.55;
    box-shadow: var(--shadow-md); margin-bottom: 1.2rem;
  }
  .r-name {
    font-size: 1.7rem; font-weight: 700; color: #1a1a1a;
    letter-spacing: -0.01em; margin-bottom: 0.25rem;
    font-family: 'Outfit', sans-serif;
  }
  .r-contact {
    font-size: 0.78rem; color: #666; margin-bottom: 1.4rem;
    font-family: 'Outfit', sans-serif; font-weight: 300;
    padding-bottom: 1rem; border-bottom: 1px solid #f0f0f0;
  }
  .r-section { margin-bottom: 0.5rem; }
  .r-section-title {
    font-size: 0.68rem; font-weight: 700; letter-spacing: 0.14em;
    text-transform: uppercase; color: var(--sage);
    border-bottom: 1.5px solid #e0e8e2; padding-bottom: 0.3rem;
    margin-bottom: 0.85rem; margin-top: 1.4rem;
    font-family: 'Outfit', sans-serif;
  }
  .r-summary { color: #333; line-height: 1.65; margin-bottom: 0.5rem; }
  .r-exp { margin-bottom: 1.1rem; }
  .r-exp-header {
    display: flex; justify-content: space-between; align-items: baseline;
    flex-wrap: wrap; gap: 0.3rem; margin-bottom: 0.4rem;
  }
  .r-exp-left { display: flex; align-items: baseline; gap: 0; flex-wrap: wrap; }
  .r-job-title { font-weight: 700; font-size: 0.92rem; font-family: 'Outfit', sans-serif; color: #1a1a1a; }
  .r-company { font-size: 0.85rem; color: #555; font-family: 'Outfit', sans-serif; }
  .r-dates { font-size: 0.78rem; color: #888; font-family: 'Outfit', sans-serif; font-weight: 300; flex-shrink: 0; }
  .r-bullets { list-style: none; margin: 0; padding: 0; display: flex; flex-direction: column; gap: 0.3rem; }
  .r-bullets li { padding-left: 1rem; position: relative; color: #333; font-size: 0.85rem; }
  .r-bullets li::before { content: '·'; position: absolute; left: 0; color: var(--sage); font-weight: 700; font-size: 1rem; top: -0.05rem; }

  /* ─── EXPERT NOTE ─── */
  .expert-note {
    background: var(--white); border: 1.5px solid #e0e8e2;
    border-left: 3px solid var(--sage);
    border-radius: var(--radius); padding: 1.2rem 1.5rem;
    margin-bottom: 1rem; box-shadow: var(--shadow);
  }
  .expert-note-label {
    display: flex; align-items: center; gap: 0.4rem;
    font-size: 0.67rem; font-weight: 600; letter-spacing: 0.13em; text-transform: uppercase;
    color: var(--sage); margin-bottom: 0.6rem;
  }
  .expert-note-text {
    font-size: 0.89rem; color: var(--text-mid); line-height: 1.7; font-weight: 300;
  }

  /* ─── COVER LETTER ─── */
  .cover-letter-cta {
    background: var(--white); border: 1.5px dashed var(--sage-border);
    border-radius: var(--radius); padding: 1.8rem;
    text-align: center; margin-top: 1rem; margin-bottom: 1rem;
  }
  .cover-letter-cta-title {
    font-family: 'Fraunces', serif; font-size: 1.1rem; font-weight: 700;
    color: var(--text); margin-bottom: 0.3rem;
  }
  .cover-letter-cta-title em { font-style: italic; font-weight: 300; color: var(--sky); }
  .cover-letter-cta-sub { font-size: 0.82rem; color: var(--text-muted); font-weight: 300; margin-bottom: 1.1rem; }
  .cover-letter-btn {
    background: var(--sky); color: white; border: none;
    border-radius: var(--radius-sm); padding: 0.78rem 1.6rem;
    font-family: 'Outfit', sans-serif; font-size: 0.88rem; font-weight: 600;
    cursor: pointer; transition: all 0.2s;
    display: inline-flex; align-items: center; gap: 0.5rem;
    box-shadow: 0 3px 14px rgba(74,144,184,0.28);
  }
  .cover-letter-btn:hover:not(:disabled) { background: #5aa0c8; transform: translateY(-1px); }
  .cover-letter-btn:disabled { opacity: 0.5; cursor: not-allowed; transform: none; }
  .cover-letter-free-tag {
    font-size: 0.68rem; font-weight: 600; letter-spacing: 0.08em; text-transform: uppercase;
    color: var(--sage); background: var(--sage-dim); border: 1.5px solid var(--sage-border);
    border-radius: 2rem; padding: 0.15rem 0.6rem;
  }

  .cover-letter-wrap {
    margin-top: 1rem; margin-bottom: 1rem;
    border: 1.5px solid #e0e8e2; border-radius: var(--radius);
    overflow: hidden; box-shadow: var(--shadow);
  }
  .cover-letter-header {
    display: flex; align-items: center; justify-content: space-between;
    padding: 0.85rem 1.2rem;
    background: var(--bg2); border-bottom: 1.5px solid #e0e8e2;
  }
  .cover-letter-label {
    font-size: 0.72rem; font-weight: 600; letter-spacing: 0.12em;
    text-transform: uppercase; color: var(--sky);
    display: flex; align-items: center; gap: 0.4rem;
  }
  .cover-letter-label::before { content: ''; width: 6px; height: 6px; border-radius: 50%; background: var(--sky); display: inline-block; }
  .cover-letter-doc {
    background: white; padding: 2.8rem 3rem;
    font-family: 'Georgia', serif; color: #1a1a1a;
    font-size: 0.88rem; line-height: 1.75; white-space: pre-wrap;
  }

  /* ─── RESET BTN ─── */
  .reset-btn {
    background: transparent; border: 1.5px solid #d4ddd6;
    color: var(--text-muted); border-radius: var(--radius-sm);
    padding: 0.65rem 1.3rem; font-family: 'Outfit', sans-serif; font-size: 0.82rem;
    cursor: pointer; transition: all 0.2s; margin-top: 1rem; display: inline-block;
  }
  .reset-btn:hover { border-color: var(--sage); color: var(--sage); background: var(--sage-dim); }

  /* ─── TADA / CONFETTI ─── */
  .tada-overlay {
    position: fixed; inset: 0; z-index: 200;
    display: flex; flex-direction: column; align-items: center; justify-content: center;
    background: var(--bg);
    animation: tadaOut 0.5s 2.4s ease forwards;
  }
  @keyframes tadaOut { to { opacity: 0; pointer-events: none; } }

  .tada-msg { text-align: center; animation: fadeUp 0.5s 0.3s ease both; }
  .tada-icon {
    width: 72px; height: 72px; border-radius: 50%;
    background: var(--sage-dim); border: 2px solid var(--sage-border);
    display: flex; align-items: center; justify-content: center;
    margin: 0 auto 1.1rem;
    animation: ringPop 0.55s 0.1s cubic-bezier(0.34,1.56,0.64,1) both;
  }
  @keyframes ringPop { from { transform: scale(0); opacity: 0; } to { transform: scale(1); opacity: 1; } }
  .tada-title {
    font-family: 'Fraunces', serif; font-size: 1.6rem; font-weight: 700;
    color: var(--text); margin-bottom: 0.3rem;
  }
  .tada-sub { font-size: 0.88rem; color: var(--text-muted); font-weight: 300; }

  .confetti-piece {
    position: fixed; border-radius: 2px;
    animation: confettiFall linear both;
  }
  @keyframes confettiFall {
    0% { transform: translateY(-20px) rotate(0deg); opacity: 1; }
    100% { transform: translateY(110vh) rotate(720deg); opacity: 0; }
  }

  /* ─── RETURNING BANNER ─── */
  .returning-banner {
    position: fixed; bottom: 1.5rem; left: 50%; transform: translateX(-50%);
    z-index: 50; display: flex; align-items: center; gap: 1rem;
    background: var(--white); border: 1.5px solid var(--sage-border);
    border-radius: var(--radius); padding: 1rem 1.4rem;
    box-shadow: 0 8px 32px rgba(30,40,32,0.14);
    animation: fadeUp 0.5s ease both;
    max-width: 520px; width: calc(100% - 3rem);
  }
  .returning-icon {
    width: 38px; height: 38px; border-radius: 50%; flex-shrink: 0;
    background: var(--sage-dim); border: 1.5px solid var(--sage-border);
    display: flex; align-items: center; justify-content: center;
  }
  .returning-text { flex: 1; min-width: 0; }
  .returning-title { font-size: 0.88rem; font-weight: 600; color: var(--text); margin-bottom: 0.15rem; }
  .returning-sub { font-size: 0.76rem; color: var(--text-muted); font-weight: 300; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
  .returning-btns { display: flex; gap: 0.5rem; flex-shrink: 0; }
  .returning-view {
    background: var(--sage); color: white; border: none;
    border-radius: var(--radius-sm); padding: 0.5rem 1rem;
    font-family: 'Outfit', sans-serif; font-size: 0.78rem; font-weight: 600;
    cursor: pointer; transition: all 0.18s; white-space: nowrap;
  }
  .returning-view:hover { background: var(--sage-light); }
  .returning-dismiss {
    background: none; border: 1.5px solid #d4ddd6; color: var(--text-muted);
    border-radius: var(--radius-sm); padding: 0.5rem 0.8rem;
    font-family: 'Outfit', sans-serif; font-size: 0.78rem;
    cursor: pointer; transition: all 0.18s; white-space: nowrap;
  }
  .returning-dismiss:hover { border-color: var(--sage); color: var(--sage); }

  /* ─── BEFORE & AFTER ─── */
  .ba-section {
    background: var(--bg2); border-top: 1.5px solid #e4ede6;
    padding: 5rem 1.5rem 6rem;
  }
  .ba-inner { max-width: 960px; margin: 0 auto; }
  .ba-eyebrow {
    font-size: 0.7rem; font-weight: 600; letter-spacing: 0.15em; text-transform: uppercase;
    color: var(--sage); margin-bottom: 0.6rem; text-align: center;
  }
  .ba-headline {
    font-family: 'Fraunces', serif; font-size: 2.2rem; font-weight: 700;
    color: var(--text); text-align: center; margin-bottom: 0.5rem; line-height: 1.2;
  }
  .ba-headline em { font-style: italic; font-weight: 300; color: var(--sage); }
  .ba-sub { font-size: 0.88rem; color: var(--text-muted); text-align: center; font-weight: 300; margin-bottom: 2rem; }

  .ba-tabs { display: flex; gap: 0.5rem; justify-content: center; margin-bottom: 2rem; }
  .ba-tab {
    background: none; border: 1.5px solid #d4ddd6; border-radius: 2rem;
    padding: 0.45rem 1.1rem; font-family: 'Outfit', sans-serif;
    font-size: 0.78rem; font-weight: 500; color: var(--text-muted);
    cursor: pointer; transition: all 0.2s;
  }
  .ba-tab:hover { border-color: var(--sage); color: var(--sage); }
  .ba-tab.active { background: var(--sage); border-color: var(--sage); color: white; }

  .ba-grid {
    display: grid; grid-template-columns: 1fr 1fr; gap: 1.5rem;
    margin-bottom: 2.5rem; align-items: start;
  }
  .ba-col { display: flex; flex-direction: column; gap: 0.6rem; }
  .ba-col-label {
    font-size: 0.7rem; font-weight: 700; letter-spacing: 0.12em; text-transform: uppercase;
    padding: 0.4rem 0.9rem; border-radius: 2rem; display: inline-block; align-self: flex-start;
  }
  .ba-col-label.before { background: #fce8e8; color: #c05050; border: 1.5px solid #f0c0c0; }
  .ba-col-label.after { background: var(--sage-dim); color: var(--sage); border: 1.5px solid var(--sage-border); }

  .ba-doc {
    background: white; border: 1.5px solid #e4ede6;
    border-radius: var(--radius); padding: 1.8rem 2rem;
    font-family: 'Georgia', serif; font-size: 0.78rem;
    line-height: 1.65; color: #2a2a2a;
    box-shadow: var(--shadow);
  }
  .after-doc { border-color: var(--sage-border); box-shadow: 0 4px 20px rgba(90,138,106,0.1); }
  .ba-name { font-family: 'Fraunces', serif; font-size: 1.1rem; font-weight: 700; color: var(--text); margin-bottom: 0.2rem; }
  .ba-contact { font-size: 0.72rem; color: var(--text-muted); font-family: 'Outfit', sans-serif; margin-bottom: 0.9rem; padding-bottom: 0.8rem; border-bottom: 1px solid #e8ede8; }
  .ba-obj { font-size: 0.76rem; color: #777; font-family: 'Outfit', sans-serif; font-weight: 300; margin: 0 0 0.6rem; font-style: italic; line-height: 1.6; }
  .ba-summary-block { font-size: 0.77rem; color: #444; line-height: 1.7; margin-bottom: 1rem; font-family: 'Outfit', sans-serif; font-weight: 300; font-style: italic; }
  .ba-section-title { font-family: 'Outfit', sans-serif; font-size: 0.65rem; font-weight: 700; letter-spacing: 0.12em; text-transform: uppercase; color: #bbb; margin: 1rem 0 0.4rem; padding-top: 0.8rem; border-top: 1px solid #f0f0f0; }
  .after-title { color: var(--sage); border-top-color: rgba(90,138,106,0.15); }
  .ba-job-header { display: flex; justify-content: space-between; align-items: baseline; gap: 0.5rem; margin-bottom: 0.3rem; flex-wrap: wrap; }
  .ba-job-title { font-family: 'Outfit', sans-serif; font-size: 0.76rem; font-weight: 600; color: var(--text); }
  .ba-job-dates { font-family: 'Outfit', sans-serif; font-size: 0.7rem; color: var(--text-muted); font-weight: 300; white-space: nowrap; }
  .ba-bullets { margin: 0 0 0.6rem 1rem; padding: 0; }
  .ba-bullets li { font-size: 0.74rem; color: #666; margin-bottom: 0.28rem; line-height: 1.55; }
  .ba-highlight { color: var(--sage) !important; font-weight: 600; }

  .ba-cta-row {
    display: flex; align-items: center; justify-content: center;
    gap: 1.5rem; flex-wrap: wrap; text-align: center;
  }
  .ba-cta-btn {
    background: var(--sage); color: white; border: none;
    border-radius: var(--radius-sm); padding: 0.82rem 1.6rem;
    font-family: 'Outfit', sans-serif; font-size: 0.88rem; font-weight: 600;
    cursor: pointer; transition: all 0.2s; display: flex; align-items: center; gap: 0.5rem;
    box-shadow: 0 3px 14px rgba(90,138,106,0.28);
  }
  .ba-cta-btn:hover { background: var(--sage-light); transform: translateY(-1px); }

  /* ─── REVIEWS TICKER ─── */
  .ticker-section {
    background: var(--white);
    border-top: 1.5px solid var(--sage-border);
    border-bottom: 1.5px solid var(--sage-border);
    padding: 1.8rem 0;
    overflow: hidden;
    position: relative;
  }
  .ticker-section::before, .ticker-section::after {
    content: ''; position: absolute; top: 0; bottom: 0; width: 80px; z-index: 2;
    pointer-events: none;
  }
  .ticker-section::before { left: 0; background: linear-gradient(90deg, var(--white), transparent); }
  .ticker-section::after  { right: 0; background: linear-gradient(-90deg, var(--white), transparent); }

  .ticker-label {
    text-align: center;
    font-size: 0.68rem; font-weight: 600; letter-spacing: 0.14em; text-transform: uppercase;
    color: var(--text-muted); margin-bottom: 1.2rem;
    display: flex; align-items: center; justify-content: center; gap: 0.6rem;
  }
  .ticker-label::before, .ticker-label::after {
    content: ''; flex: 1; max-width: 80px; height: 1px; background: var(--sage-border);
  }

  .ticker-track-wrap { overflow: hidden; }
  .ticker-track {
    display: flex; gap: 1rem;
    animation: tickerScroll 40s linear infinite;
    width: max-content;
  }
  .ticker-track:hover { animation-play-state: paused; }

  @keyframes tickerScroll {
    0%   { transform: translateX(0); }
    100% { transform: translateX(-50%); }
  }

  .ticker-card {
    background: var(--bg); border: 1.5px solid #e4ede6;
    border-radius: var(--radius); padding: 1.1rem 1.4rem;
    min-width: 280px; max-width: 280px;
    flex-shrink: 0; box-shadow: var(--shadow);
  }
  .ticker-stars {
    display: flex; gap: 2px; margin-bottom: 0.55rem;
    color: #f0b429; font-size: 0.85rem;
  }
  .ticker-quote {
    font-size: 0.84rem; color: var(--text-mid); font-weight: 300; line-height: 1.6;
    margin-bottom: 0.65rem; font-style: italic;
  }
  .ticker-author {
    display: flex; align-items: center; gap: 0.5rem;
  }
  .ticker-avatar {
    width: 26px; height: 26px; border-radius: 50%;
    background: var(--sage-dim); border: 1.5px solid var(--sage-border);
    display: flex; align-items: center; justify-content: center;
    font-size: 0.7rem; font-weight: 600; color: var(--sage); flex-shrink: 0;
  }
  .ticker-name { font-size: 0.78rem; font-weight: 500; color: var(--text); }
  .ticker-role { font-size: 0.72rem; color: var(--text-muted); font-weight: 300; }

  .ticker-placeholder {
    display: flex; align-items: center; justify-content: center;
    gap: 0.5rem; padding: 0.6rem 0 0;
    font-size: 0.75rem; color: var(--text-faint); font-weight: 300;
    font-style: italic;
  }

  /* ─── FLOW STRIP ─── */
  .flow-strip {
    display: flex; align-items: center; justify-content: center;
    gap: 0.5rem; flex-wrap: wrap; margin-top: 2rem;
    background: var(--white); border: 1.5px solid var(--sage-border);
    border-radius: var(--radius); padding: 1rem 1.5rem;
    box-shadow: var(--shadow);
    opacity: 0; animation: fadeUp 0.6s 1.1s ease forwards;
  }
  .flow-step {
    display: flex; align-items: center; gap: 0.7rem;
  }
  .flow-step-num {
    width: 26px; height: 26px; border-radius: 50%; border: 1.5px solid;
    display: flex; align-items: center; justify-content: center;
    font-size: 0.72rem; font-weight: 700; flex-shrink: 0;
    font-family: 'Fraunces', serif;
  }
  .flow-step-body { display: flex; flex-direction: column; gap: 0.1rem; }
  .flow-step-title {
    font-size: 0.84rem; font-weight: 600; color: var(--text);
    display: flex; align-items: center; gap: 0.4rem;
  }
  .flow-step-sub { font-size: 0.74rem; color: var(--text-muted); font-weight: 300; }
  .flow-arrow { color: var(--text-faint); flex-shrink: 0; }
  .flow-free-tag {
    font-size: 0.62rem; font-weight: 700; letter-spacing: 0.08em; text-transform: uppercase;
    color: var(--sage); background: var(--sage-dim); border: 1.5px solid var(--sage-border);
    border-radius: 2rem; padding: 0.1rem 0.45rem;
  }

  @keyframes fadeUp {
    from { opacity: 0; transform: translateY(12px); }
    to { opacity: 1; transform: translateY(0); }
  }

  /* ─── PRINT ─── */
  @media print {
    body * { visibility: hidden !important; }
    .resume-doc, .resume-doc * { visibility: visible !important; }
    .resume-doc {
      position: fixed; top: 0; left: 0; right: 0;
      padding: 2cm 2.2cm; font-size: 10pt; line-height: 1.5;
      box-shadow: none !important; border: none !important;
    }
    .r-name { font-size: 18pt; }
    .r-section-title { font-size: 7.5pt; }
  }

  /* ─── RESPONSIVE ─── */
  @media (max-width: 780px) {
    .nav { padding: 1rem 1.2rem; }
    .choice-card { min-width: calc(50% - 0.5rem); max-width: calc(50% - 0.5rem); }
    .form-card { padding: 1.8rem 1.4rem; }
    .resume-doc { padding: 2rem 1.6rem; }
    .cover-letter-doc { padding: 2rem 1.6rem; }
  }
  @media (max-width: 580px) {
    .choice-card { min-width: 100%; max-width: 100%; }
    .ba-grid { grid-template-columns: 1fr; }
    .ba-headline { font-size: 1.6rem; }
  }
`;

// ── data ──────────────────────────────────────────────────────────────────────
const GUIDED_STEPS = [
  {
    id: "field", q: "What field are you working in?",
    hint: "Pick one or type your own — this shapes the entire review.",
    type: "chips+text", placeholder: "e.g. Biotech, Education, Real Estate…",
    options: ["Technology","Finance","Marketing","Healthcare","Design / Creative","Operations","Sales","Legal","Engineering","Product Management","Other"],
  },
  {
    id: "role", q: "What role are you going for?",
    hint: "Be as specific as you like — seniority and company type matter.",
    type: "text", placeholder: "e.g. Senior Product Manager at a Series B startup",
  },
  {
    id: "experience", q: "How many years of experience do you have?",
    hint: "Helps us benchmark your resume against where you are in your career.",
    type: "chips", options: ["0–1 years","2–4 years","5–8 years","9–14 years","15+ years"],
  },
  {
    id: "struggle", q: "What do you feel is holding your resume back?",
    hint: "Select everything that feels true — we'll focus there.",
    type: "chips_multi",
    options: ["Not getting interviews","Looks generic / plain","Career gaps","Switching industries","Undersells my achievements","Too long / cluttered","Weak ATS keywords","Not sure — full review please"],
  },
  {
    id: "goalUrl", q: "Got a specific job posting in mind?",
    hint: "Paste the URL and we'll match your resume directly against it.",
    type: "url", placeholder: "https://linkedin.com/jobs/view/…", optional: true,
  },
];

// ── helpers ───────────────────────────────────────────────────────────────────
function parseReview(text) {
  const clean = text.replace(/^```json\s*/i,"").replace(/^```\s*/i,"").replace(/```\s*$/i,"").trim();
  try {
    const data = JSON.parse(clean);
    return { ok: true, note: data.note || "", resume: data.resume || {}, raw: text };
  } catch(e) {
    const match = clean.match(/\{[\s\S]+\}/);
    if (match) {
      try { const data = JSON.parse(match[0]); return { ok: true, note: data.note || "", resume: data.resume || {}, raw: text }; } catch(e2) {}
    }
    return { ok: false, note: "", resume: {}, raw: text };
  }
}

const SYSTEM_RULES = `You are an expert professional resume writer and career strategist. Your job is to rewrite resumes so candidates get interviews. You have a strict set of standards — follow every rule below without exception.

REWRITING RULES:

1. STRONGEST ACHIEVEMENT LEADS — within every role, the most impressive bullet always comes first, followed by supporting bullets in descending order of impact.

2. NUMBERS ONLY IF PROVIDED — never invent or estimate figures. Only use numbers explicitly present in the original resume.

3. NO EM DASHES IN BULLETS — never use — in bullet points. Restructure the sentence instead. Em dashes can trip ATS systems.

4. COMPETITIONS AND AWARDS IN THEIR OWN SECTION — never fold them into experience roles.

5. ALWAYS ADD A PROFESSIONAL SUMMARY — especially for graduates and low-experience candidates. 2-3 sentences max.

6. EDUCATION PLACEMENT IS CONTEXTUAL — candidate has strong work experience: education goes at the bottom. Low experience, top university, or specialist/graduate degree: education near the top. When in doubt, experience leads.

7. NO OBJECTIVE STATEMENTS — always replace with a professional summary that adds value.

8. BULLETS ARE PUNCHY — one clear idea per bullet. No long compound sentences. No filler.

9. STRICT REVERSE CHRONOLOGICAL ORDER — newest role first, oldest last. Dates must match the original document exactly. Timeline always overrides impact when ordering roles.

10. OVERLAPPING ROLES ORDERED BY END DATE — if two roles overlap, the one that ends latest comes first.

11. SUMMARY LAST LINE MUST ADD VALUE — never end the summary with "seeking a role" or any variation of stating the obvious. Every sentence must earn its place.

12. PACKAGE NUMBERS FOR MAXIMUM IMPACT — reframe weekly figures as monthly totals where honest. Lead with the percentage or achievement, then land on the larger cumulative number. Math must always be accurate.

13. MANAGEMENT LANGUAGE IS FIRM — use "supervised", "directed", "oversaw", "held accountable". Never "regularly assigned duties" or "helped manage".

14. REMOVE SINGLE-DAY EXPERIENCES — one-day shadowing or intern-for-a-day entries clutter the resume without adding credibility. Remove them.

15. WRITE OUT "MORE THAN" NOT "+" — write "more than 50 clients" not "50+ clients". Cleaner for ATS and readability.

16. INTERN-LEVEL WORK GETS ELEVATED LANGUAGE — find the most impressive honest framing for junior roles. Focus on scope, process, and responsibility. Never fabricate outcomes.

17. MATH MUST BE ACCURATE — always verify arithmetic when packaging or reframing numbers. Never inflate.

18. CUMULATIVE FIGURES ARE FAIR GAME — daily or weekly numbers can be rolled into monthly or tenure totals if the math is honest and the framing is clear.

19. SPARSE INTERN BULLETS — when internship bullets are thin, focus on scope and process rather than outcomes. Do not fabricate results.

20. NO FILLER LANGUAGE — never use: "responsible for", "assisted with", "aided", "helped to", "worked on", "participated in". Find the active, specific version of what they actually did.

21. SKILLS SECTION IS CONDITIONAL — only include a skills section if the candidate has hard, verifiable skills: coding languages, technical certifications, specialist software, or foreign languages. For business, marketing, sales, or general professional resumes, remove the skills section entirely. Subjective skills like "Microsoft Office", "communication", "teamwork", or "leadership" add no value and should never appear.`;

const JSON_FORMAT = `Respond ONLY with a valid JSON object. No markdown fences, no explanation, just raw JSON:

{
  "note": "One single warm, confident sentence telling the candidate their resume is ready and what you focused on. No grade, no score, no critique.",
  "resume": {
    "name": "Candidate Full Name",
    "contact": "email@example.com | (555) 000-0000 | City, State | linkedin.com/in/handle",
    "summary": "3 sentence professional summary — specific to their target role, written to impress a hiring manager in that field",
    "experience": [
      {
        "title": "Job Title",
        "company": "Company Name",
        "dates": "Jan 2021 – Present",
        "bullets": ["Led [specific initiative], resulting in [quantified outcome]","Built [specific thing] that [specific impact]"]
      }
    ],
    "education": [{ "degree": "Bachelor of Science in Computer Science", "school": "University Name", "dates": "2015 – 2019" }],
    "skills": ["Skill 1","Skill 2","Skill 3"]
  }
}`;

function buildPrompt(answers, pastedText, hasFile) {
  const ctx = [
    answers.field && `Industry/Field: ${answers.field}`,
    answers.role && `Target Role: ${answers.role}`,
    answers.experience && `Experience Level: ${answers.experience}`,
    answers.struggle?.length && `Candidate concerns: ${answers.struggle.join(", ")}`,
    answers.goalUrl && `Job Posting URL: ${answers.goalUrl}`,
  ].filter(Boolean).join("\n");

  return `${ctx ? "Target Context:\n" + ctx + "\n\n" : ""}Take the original resume${hasFile ? " (attached)" : ""} and produce a completely rewritten, job-ready version. Apply every rule from your system prompt without exception. Keep the candidate's actual experience — do not invent roles or companies.${!hasFile ? "\n\nOriginal Resume:\n" + pastedText : ""}

${JSON_FORMAT}`;
}

function buildScratchPrompt(d) {
  const jobs = d.jobs.map((j, i) =>
    `Role ${i+1}: ${j.title} at ${j.company} (${j.dates})\nNotes: ${j.notes || "not provided"}`
  ).join("\n\n");

  return `Build a polished resume from scratch using only the basic details below.

Name: ${d.name}
Contact: ${d.email || ""} | ${d.phone || ""} | ${d.location || ""}
Target Role: ${d.targetRole || "not specified"}
${d.jobUrl ? "Job Posting URL: " + d.jobUrl : ""}

Work History (rough notes):
${jobs}

Education: ${typeof d.education === "string" ? d.education : d.education?.map(e => e.degree + " at " + e.school + " (" + e.dates + ")").join(", ")}
Skills: ${d.skills || "none listed"}
${d.extra ? "Additional context: " + d.extra : ""}

${JSON_FORMAT}`;
}

// ── component ─────────────────────────────────────────────────────────────────
export default function App() {
  const [screen, setScreen] = useState("splash");
  const [scrolled, setScrolled] = useState(false);
  const [savedSession, setSavedSession] = useState(null);
  const [showReturning, setShowReturning] = useState(false);
  const [baExample, setBaExample] = useState(0);

  // guided flow
  const [guidedStep, setGuidedStep] = useState(0);
  const [guidedAnswers, setGuidedAnswers] = useState({});
  const [guidedCurrent, setGuidedCurrent] = useState("");

  // form state
  const [pastedText, setPastedText] = useState("");
  const [uploadedFile, setUploadedFile] = useState(null);
  const [jobTitle, setJobTitle] = useState("");
  const [jobUrl, setJobUrl] = useState("");
  const [resumeTab, setResumeTab] = useState("paste");

  // scratch state
  const [scratchData, setScratchData] = useState({
    name: "", email: "", phone: "", location: "",
    targetRole: "", jobUrl: "", education: "", skills: "", extra: "",
    jobs: [{ title: "", company: "", dates: "", notes: "" }],
  });

  // human review
  const [humanData, setHumanData] = useState({ name: "", email: "", resume: "", context: "" });
  const [humanSubmitted, setHumanSubmitted] = useState(false);

  // results
  const [loading, setLoading] = useState(false);
  const [loadingMsg, setLoadingMsg] = useState("Analysing…");
  const [error, setError] = useState(null);
  const [result, setResult] = useState(null);
  const [showTada, setShowTada] = useState(false);
  const [confetti, setConfetti] = useState([]);
  const [coverLetter, setCoverLetter] = useState(null);
  const [coverLoading, setCoverLoading] = useState(false);

  // job matching removed for launch

  const fileInputRef = useRef();

  // ── effects ──
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    try {
      const saved = JSON.parse(localStorage.getItem("shortlisted:last_session") || "null");
      if (saved?.result?.resume?.name) { setSavedSession(saved); setShowReturning(true); }
    } catch(e) {}
  }, []);

  // Restore state after returning from Stripe payment
  useEffect(() => {
    try {
      const urlParams = new URLSearchParams(window.location.search);
      const sessionId = urlParams.get("session_id");
      if (!sessionId) return;

      // Clear the session_id from the URL cleanly
      window.history.replaceState({}, "", "/");

      const pending = JSON.parse(localStorage.getItem("shortlisted:pending") || "null");
      if (!pending) return;
      localStorage.removeItem("shortlisted:pending");

      // Mark as paid
      localStorage.setItem("shortlisted:paid", JSON.stringify({
        type: pending.productType, paidAt: new Date().toISOString(), sessionId,
      }));

      // Restore all form state
      if (pending.pastedText) setPastedText(pending.pastedText);
      if (pending.jobTitle) setJobTitle(pending.jobTitle);
      if (pending.jobUrl) setJobUrl(pending.jobUrl);
      if (pending.guidedAnswers) setGuidedAnswers(pending.guidedAnswers);
      if (pending.scratchData) setScratchData(pending.scratchData);
      if (pending.resumeTab) setResumeTab(pending.resumeTab);

      // Navigate to the right screen and auto-submit after a short delay
      if (pending.productType === "human") {
        // For human review — send email and redirect to confirmation page
        if (pending.humanData) {
          fetch("/api/send-review-email", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ humanData: pending.humanData, sessionId }),
          }).catch(e => console.error("Email error:", e));
        }
        window.location.href = "/confirmed";
      } else if (pending.productType === "scratch") {
        setScreen("scratch");
        setTimeout(() => {
          document.getElementById("auto-submit-scratch")?.click();
        }, 400);
      } else {
        setScreen(pending.screen || "form");
        setTimeout(() => {
          document.getElementById("auto-submit-rewrite")?.click();
        }, 400);
      }
    } catch(e) { console.error("Restore error:", e); }
  }, []);

  // ── helpers ──
  const triggerTada = () => {
    const colors = ["#5a8a6a","#4a90b8","#a8d5b5","#7aaa8a","#b8d4e8","#c9e8d0","#f0a070","#ffd580"];
    const pieces = Array.from({length: 55}, (_, i) => ({
      id: i, x: Math.random() * 100, color: colors[Math.floor(Math.random() * colors.length)],
      speed: 1.8 + Math.random() * 1.4, delay: Math.random() * 0.8,
      size: 5 + Math.random() * 6,
    }));
    setConfetti(pieces); setShowTada(true);
    setTimeout(() => setShowTada(false), 2900);
  };

  const saveSession = (parsed, context) => {
    try {
      localStorage.setItem("shortlisted:last_session", JSON.stringify({
        result: parsed, savedAt: new Date().toISOString(), context,
      }));
    } catch(e) {}
  };

  const reset = () => {
    setScreen("splash"); setResult(null); setError(null); setLoading(false);
    setShowTada(false); setConfetti([]);
    setCoverLetter(null); setCoverLoading(false);
    setSavedSession(null); setShowReturning(false);
    setPastedText(""); setUploadedFile(null); setJobTitle(""); setJobUrl("");
    setGuidedAnswers({}); setGuidedStep(0); setGuidedCurrent("");
    setHumanData({ name: "", email: "", resume: "", context: "" });
    setHumanSubmitted(false);
    setScratchData({ name:"",email:"",phone:"",location:"",targetRole:"",jobUrl:"",education:"",skills:"",extra:"",jobs:[{title:"",company:"",dates:"",notes:""}] });
    if (fileInputRef.current) fileInputRef.current.value = "";
    try { localStorage.removeItem("shortlisted:last_session"); } catch(e) {}
  };

  // ── guided flow ──
  const currentStep = GUIDED_STEPS[guidedStep];

  const canAdvance = () => {
    if (!currentStep) return false;
    if (currentStep.optional) return true;
    const val = guidedAnswers[currentStep.id];
    if (currentStep.type === "chips_multi") return val?.length > 0;
    if (currentStep.type === "chips") return !!val;
    return !!(val || guidedCurrent?.trim());
  };

  const advanceGuided = () => {
    const updated = { ...guidedAnswers };
    if (["text","url","chips+text"].includes(currentStep.type) && guidedCurrent.trim()) {
      updated[currentStep.id] = guidedCurrent.trim();
      setGuidedAnswers(updated);
    }
    if (guidedStep < GUIDED_STEPS.length - 1) {
      setGuidedStep(s => s + 1); setGuidedCurrent("");
    } else {
      if (updated.role) setJobTitle(updated.role);
      if (updated.goalUrl) setJobUrl(updated.goalUrl);
      setScreen("form");
    }
  };

  const selectChip = (id, val, multi) => {
    setGuidedAnswers(a => {
      if (multi) {
        const cur = a[id] || [];
        return { ...a, [id]: cur.includes(val) ? cur.filter(x => x !== val) : [...cur, val] };
      }
      return { ...a, [id]: val };
    });
  };

  // ── file handling ──
  const handleFile = useCallback((file) => {
    if (!file) return;
    if (!file.name.match(/\.(pdf|docx?|txt)$/i)) { setError("Please upload a PDF, Word (.docx), or plain text file."); return; }
    setError(null); setUploadedFile(file);
  }, []);

  // ── payment gate ──
  // Checks if user has already paid this session, otherwise redirects to Stripe.
  // productType: "rewrite" | "scratch" | "human"
  const checkoutAndProceed = async (productType, proceedFn) => {
    try {
      const paid = JSON.parse(localStorage.getItem("shortlisted:paid") || "null");
      // If paid within the last 2 hours for this product type, skip checkout
      if (paid?.type === productType && paid?.paidAt) {
        const age = Date.now() - new Date(paid.paidAt).getTime();
        if (age < 2 * 60 * 60 * 1000) { proceedFn(); return; }
      }
    } catch(e) {}

    // Save all current form state so we can restore it after payment redirect
    try {
      localStorage.setItem("shortlisted:pending", JSON.stringify({
        productType,
        screen,
        pastedText,
        jobTitle,
        jobUrl,
        guidedAnswers,
        scratchData,
        resumeTab,
        humanData,
      }));
    } catch(e) {}

    // Not paid — create a Stripe checkout session and redirect
    try {
      setLoading(true);
      const res = await fetch("/api/stripe/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type: productType }),
      });
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      } else {
        setError("Could not start checkout. Please try again.");
        setLoading(false);
      }
    } catch(e) {
      setError("Could not connect to payment system. Please try again.");
      setLoading(false);
    }
  };

  // ── API calls ──
  const handleSubmit = async () => {
    setError(null);
    const hasFile = resumeTab === "upload" && !!uploadedFile;
    const hasText = resumeTab === "paste" && pastedText.trim().length > 60;
    if (!hasFile && !hasText) { setError(resumeTab === "upload" ? "Please upload your resume file." : "Please paste your resume text (at least a few lines)."); return; }
    setLoading(true); setLoadingMsg("Analysing…");

    const merged = { ...guidedAnswers, role: guidedAnswers.role || jobTitle || undefined, goalUrl: guidedAnswers.goalUrl || jobUrl || undefined };
    const prompt = buildPrompt(merged, pastedText, hasFile);

    try {
      let messages;
      if (hasFile) {
        setLoadingMsg("Reading file…");
        const base64 = await new Promise((res, rej) => {
          const r = new FileReader();
          r.onload = e => res(e.target.result.split(",")[1]);
          r.onerror = () => rej(new Error("Could not read file"));
          r.readAsDataURL(uploadedFile);
        });
        setLoadingMsg("Analysing…");
        const content = [];
        if (uploadedFile.name.endsWith(".pdf")) {
          content.push({ type: "document", source: { type: "base64", media_type: "application/pdf", data: base64 } });
        } else {
          let d = ""; try { d = atob(base64); } catch(e) {}
          content.push({ type: "text", text: "Resume:\n" + d });
        }
        content.push({ type: "text", text: prompt });
        messages = [{ role: "user", content }];
      } else {
        messages = [{ role: "user", content: prompt }];
      }

      const res = await fetch("/api/anthropic", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ model: "claude-sonnet-4-20250514", max_tokens: 2500, system: SYSTEM_RULES, messages }),
      });
      const data = await res.json();
      if (data.error) throw new Error(data.error.message);
      const text = data.content?.map(b => b.text || "").join("") || "";
      const parsed = parseReview(text);
      setResult(parsed); setScreen("results");
      setTimeout(triggerTada, 100);
      saveSession(parsed, { field: merged.field, role: merged.role, jobUrl: merged.goalUrl });
    } catch(e) {
      setError(e.message || "Something went wrong. Please try again.");
    } finally { setLoading(false); }
  };

  const handleScratchSubmit = async () => {
    setError(null);
    if (!scratchData.name.trim() || !scratchData.jobs[0].title.trim()) {
      setError("Please fill in at least your name and one job title."); return;
    }
    setLoading(true); setLoadingMsg("Building your resume…");
    try {
      const prompt = buildScratchPrompt(scratchData);
      const res = await fetch("/api/anthropic", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ model: "claude-sonnet-4-20250514", max_tokens: 2500, system: SYSTEM_RULES, messages: [{ role: "user", content: prompt }] }),
      });
      const data = await res.json();
      if (data.error) throw new Error(data.error.message);
      const text = data.content?.map(b => b.text || "").join("") || "";
      const parsed = parseReview(text);
      setResult(parsed); setScreen("results");
      setTimeout(triggerTada, 100);
      saveSession(parsed, { role: scratchData.targetRole, jobUrl: scratchData.jobUrl });
    } catch(e) {
      setError(e.message || "Something went wrong. Please try again.");
    } finally { setLoading(false); }
  };

  const handleHumanSubmit = async () => {
    setHumanSubmitted(true);
  };

  const generateCoverLetter = async () => {
    if (!result?.resume) return;
    setCoverLoading(true);
    const r = result.resume;
    const role = guidedAnswers.role || jobTitle || scratchData.targetRole || "the role";
    const jobUrlUsed = guidedAnswers.goalUrl || jobUrl || scratchData.jobUrl || "";

    const prompt = `Using the resume details below, write a tailored, compelling cover letter.

Candidate: ${r.name}
Target Role: ${role}
${jobUrlUsed ? "Job Posting URL: " + jobUrlUsed : ""}

Resume Summary: ${r.summary || ""}
Most Recent Role: ${r.experience?.[0]?.title || ""} at ${r.experience?.[0]?.company || ""}
Key Achievement: ${r.experience?.[0]?.bullets?.[0] || ""}

Write a 3-paragraph cover letter:
- Paragraph 1: Strong opening — who they are, what role they want, why they're excited
- Paragraph 2: Their strongest 2-3 achievements, tied directly to what the role needs
- Paragraph 3: Brief closing — confident, not desperate, clear call to action

Tone: professional, warm, specific — never generic. No "I am writing to apply for" openings.
Format: plain text, no headers, no placeholders like [Company Name] — use the actual details.
Length: 250-320 words.

Respond with ONLY the cover letter text, nothing else.`;

    try {
      const res = await fetch("/api/anthropic", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514", max_tokens: 800,
          system: "You are an expert cover letter writer. Write cover letters that are specific, warm, and compelling. Never use generic phrases. Always tie achievements directly to the role.",
          messages: [{ role: "user", content: prompt }],
        }),
      });
      const data = await res.json();
      if (data.error) throw new Error(data.error.message);
      setCoverLetter((data.content?.map(b => b.text || "").join("") || "").trim());
    } catch(e) {
      setCoverLetter("Something went wrong generating your cover letter. Please try again.");
    } finally { setCoverLoading(false); }
  };

  // ── before/after data ──
  const BA = [
    {
      label: "Marketing · Entry level",
      name: "Sarah Mitchell",
      contact: "s.mitchell@email.com · New York, NY",
      before: {
        obj: "Looking for a marketing role where I can use my skills and grow within a company.",
        jobs: [
          { title: "Sales Associate", co: "Fashion Retailer", dates: "Mar 2021 – Apr 2023",
            bullets: ["Responsible for assisting customers and helping them find products","Worked on achieving sales targets set by management","Helped maintain product knowledge by keeping up with new trends","Assisted with organising inventory in the stockroom","Was awarded top salesperson at some point during employment"] },
          { title: "Marketing Intern", co: "Retail Brand", dates: "Jun 2023 – Aug 2023",
            bullets: ["Helped the team with social media and various marketing tasks","Aided the PR department with media kits and press releases","Assisted with the planning and execution of a promotional event","Developed and edited printed reports and presentations"] },
          { title: "Retail Assistant", co: "Boutique Store", dates: "Sep 2019 – Feb 2021",
            bullets: ["Helped customers with purchases and general enquiries","Assisted with window displays and store visual merchandising","Participated in training new staff members"] },
        ],
        edu: "B.S. Business Administration · State University · May 2019",
        skills: "Microsoft Office, communication, teamwork, leadership, social media, customer service, time management",
      },
      after: {
        summary: "Marketing and sales professional with 4 years of experience in retail sales, event promotion, and brand communications. Proven track record of exceeding sales targets and building lasting client relationships. Skilled at executing cross-functional campaigns from concept through to delivery.",
        jobs: [
          { title: "Marketing Intern", co: "Retail Brand", dates: "Jun 2023 – Aug 2023",
            bullets: ["Co-led a team to plan and execute a large-scale promotional event, managing logistics from concept through to delivery","Produced media kits and press releases, supporting the full PR cycle from initial pitch to publication","Designed and distributed event collateral across print and digital channels","Authored all reports and presentations submitted to senior stakeholders for approval"],
            highlight: 0 },
          { title: "Sales Associate", co: "Fashion Retailer", dates: "Mar 2021 – Apr 2023",
            bullets: ["Earned top salesperson recognition store-wide, consistently outperforming daily sales targets","Built a loyal repeat client base through genuine product expertise and personalised service","Maintained current knowledge of seasonal trends to deliver confident, high-quality recommendations","Organised and catalogued stockroom inventory, improving team efficiency and reducing search time"],
            highlight: 0 },
          { title: "Retail Assistant", co: "Boutique Store", dates: "Sep 2019 – Feb 2021",
            bullets: ["Oversaw training of new employees to ensure brand guidelines and sales expectations were met","Designed and executed weekly window displays aligned with current advertising campaigns","Managed supplier communication to coordinate merchandise orders and meet sales demand"],
            highlight: null },
        ],
        edu: "B.S. Business Administration · State University · 2019",
      },
    },
    {
      label: "Business · Mid level",
      name: "James Carver",
      contact: "j.carver@email.com · Chicago, IL",
      before: {
        obj: "Seeking a business or operations role where I can apply my experience and contribute to a growing team.",
        jobs: [
          { title: "Assistant Manager", co: "Retail Store", dates: "Jan 2020 – Oct 2022",
            bullets: ["Responsible for helping manage a team of employees on a regular basis","Worked on hitting weekly sales targets and handling cash","Assisted with opening and closing procedures and general store operations","Helped with inventory management and product ordering","Participated in hiring and onboarding of new staff"] },
          { title: "Marketing Intern", co: "Local Agency", dates: "Jun 2020 – Aug 2020",
            bullets: ["Participated in client meetings and assisted with various tasks","Helped create marketing materials for campaigns","Worked on social media content for clients","Assisted with admin and general office duties"] },
          { title: "Customer Service Rep", co: "Call Centre", dates: "Apr 2018 – Dec 2019",
            bullets: ["Responsible for answering customer calls and resolving issues","Helped maintain customer records and data entry","Worked with team members to meet daily call quotas"] },
        ],
        edu: "B.B.A. Marketing · City University · Jun 2018",
        skills: "Microsoft Office, teamwork, communication, leadership, problem solving, customer service",
      },
      after: {
        summary: "Operations and business professional with experience leading retail teams, managing high-volume transactions, and driving consistent revenue performance. Known for holding teams accountable and streamlining day-to-day operations in fast-paced environments.",
        jobs: [
          { title: "Assistant Manager", co: "Retail Store", dates: "Jan 2020 – Oct 2022",
            bullets: ["Exceeded monthly sales quota by 10%, consistently driving more than $10,000 in revenue each month","Supervised a team of 6 employees, directing daily responsibilities and holding staff accountable to performance standards","Oversaw all opening and closing procedures including cash reconciliation and inventory management","Led hiring and onboarding for new team members, reducing ramp-up time through structured training"],
            highlight: 0 },
          { title: "Marketing Intern", co: "Local Agency", dates: "Jun 2020 – Aug 2020",
            bullets: ["Developed and scheduled social media content across 4 client accounts, improving posting consistency","Contributed to campaign materials presented to clients at monthly strategy sessions","Supported account managers in preparing client-facing reports and performance summaries"],
            highlight: null },
          { title: "Customer Service Representative", co: "Call Centre", dates: "Apr 2018 – Dec 2019",
            bullets: ["Resolved inbound customer enquiries with a focus on first-call resolution and satisfaction","Maintained accurate customer records across CRM systems to support team reporting","Consistently met daily call targets, contributing to team-wide performance benchmarks"],
            highlight: null },
        ],
        edu: "B.B.A. Marketing · City University · Jun 2018",
      },
    },
  ];

  const ex = BA[baExample];

  // ── render ────────────────────────────────────────────────────────────────
  return (
    <>
      <style>{S}</style>

      {/* NAV */}
      <nav className={"nav" + (scrolled ? " scrolled" : "")}>
        <div className="nav-logo" onClick={reset} style={{cursor:"pointer"}}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#5a8a6a" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
            <polyline points="14 2 14 8 20 8"/>
            <line x1="16" y1="13" x2="8" y2="13"/>
            <line x1="16" y1="17" x2="8" y2="17"/>
          </svg>
          Shortlisted
        </div>
        <div className="nav-right">
          {screen !== "splash" && <button className="nav-back" onClick={reset}>← Back</button>}
          <button className="nav-cta" onClick={() => setScreen("human")}>Human review · $30</button>
        </div>
      </nav>

      {/* RETURNING BANNER */}
      {showReturning && savedSession && screen === "splash" && (
        <div className="returning-banner">
          <div className="returning-icon">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#5a8a6a" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
              <polyline points="14 2 14 8 20 8"/>
              <line x1="16" y1="13" x2="8" y2="13"/>
              <line x1="16" y1="17" x2="8" y2="17"/>
            </svg>
          </div>
          <div className="returning-text">
            <div className="returning-title">{"Welcome back" + (savedSession.result?.resume?.name ? ", " + savedSession.result.resume.name.split(" ")[0] : "") + "!"}</div>
            <div className="returning-sub">
              Your last resume is saved
              {savedSession.context?.role ? " · " + savedSession.context.role : ""}
              {savedSession.savedAt ? " · " + new Date(savedSession.savedAt).toLocaleDateString("en-US",{month:"short",day:"numeric"}) : ""}
            </div>
          </div>
          <div className="returning-btns">
            <button className="returning-view" onClick={() => { setResult(savedSession.result); setScreen("results"); setShowReturning(false); }}>View resume</button>
            <button className="returning-dismiss" onClick={() => setShowReturning(false)}>Dismiss</button>
          </div>
        </div>
      )}

      {/* SPLASH */}
      {screen === "splash" && (
        <div className="splash">
          <div className="blob blob-1" /><div className="blob blob-2" /><div className="blob blob-3" />

          <div className="splash-hero">
            <div className="eyebrow">Don't just apply. Stand out.</div>
            <h1 className="splash-headline">Your resume,<br/><em>shortlisted.</em></h1>
            <p className="splash-sub">Get your resume rewritten and a tailored cover letter — in minutes.</p>
            <div className="trust-row">
              <div className="trust-item">
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#8a9e8e" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
                Private &amp; secure
              </div>
              <div className="trust-item">
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#8a9e8e" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>
                Tailored to your role
              </div>
              <div className="trust-item">
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#8a9e8e" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                ATS-aware
              </div>
            </div>
          </div>

          <div className="choice-section">
            <div className="choice-row">
              <div className="choice-card" onClick={() => setScreen("guided")}>
                <span className="choice-item-price" style={{color:"var(--sage)",background:"var(--sage-dim)",borderColor:"var(--sage-border)"}}>$5</span>
                <span className="choice-icon">
                  <svg viewBox="0 0 40 40" fill="none"><path d="M8 32V16l12-8 12 8v16" stroke="#5a8a6a" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/><rect x="14" y="22" width="12" height="10" rx="1" stroke="#5a8a6a" strokeWidth="1.5"/><circle cx="20" cy="13" r="3" stroke="#5a8a6a" strokeWidth="1.5"/></svg>
                </span>
                <div className="choice-title">I have a resume</div>
                <div className="choice-desc">Answer a few quick questions so we can personalise your rewrite, then upload or paste your resume.</div>
                <span className="choice-tag">Most personalised</span>
              </div>

              <div className="choice-card" onClick={() => setScreen("jump")}>
                <span className="choice-item-price" style={{color:"var(--sky)",background:"var(--sky-dim)",borderColor:"var(--sky-border)"}}>$5</span>
                <span className="choice-icon">
                  <svg viewBox="0 0 40 40" fill="none"><path d="M20 8v24M8 20l12-12 12 12" stroke="#4a90b8" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
                </span>
                <div className="choice-title">Jump straight in</div>
                <div className="choice-desc">Upload or paste your resume and we'll get to work immediately. Fast, simple, effective.</div>
                <span className="choice-tag" style={{color:"#4a90b8",background:"rgba(74,144,184,0.1)",borderColor:"rgba(74,144,184,0.25)"}}>Fastest</span>
              </div>

              <div className="choice-card" onClick={() => setScreen("scratch")}>
                <span className="choice-item-price" style={{color:"#7a6abf",background:"rgba(122,106,191,0.1)",borderColor:"rgba(122,106,191,0.25)"}}>$10</span>
                <span className="choice-icon">
                  <svg viewBox="0 0 40 40" fill="none"><rect x="8" y="6" width="24" height="28" rx="2" stroke="#7a6abf" strokeWidth="1.5"/><line x1="13" y1="14" x2="27" y2="14" stroke="#7a6abf" strokeWidth="1.5" strokeLinecap="round"/><line x1="13" y1="19" x2="27" y2="19" stroke="#7a6abf" strokeWidth="1.5" strokeLinecap="round"/><line x1="13" y1="24" x2="21" y2="24" stroke="#7a6abf" strokeWidth="1.5" strokeLinecap="round"/></svg>
                </span>
                <div className="choice-title">I don't have a resume</div>
                <div className="choice-desc">Tell us about your experience in your own words — rough notes are fine — and we'll build a polished resume from scratch.</div>
                <span className="choice-tag" style={{color:"#7a6abf",background:"rgba(122,106,191,0.1)",borderColor:"rgba(122,106,191,0.25)"}}>Build from scratch</span>
              </div>

              <div className="choice-card" onClick={() => setScreen("human")}>
                <span className="choice-item-price">$30</span>
                <span className="choice-icon">
                  <svg viewBox="0 0 40 40" fill="none"><circle cx="20" cy="14" r="6" stroke="#b06a3a" strokeWidth="1.5"/><path d="M8 34c0-6.627 5.373-12 12-12s12 5.373 12 12" stroke="#b06a3a" strokeWidth="1.5" strokeLinecap="round"/><path d="M28 18l2 2 4-4" stroke="#b06a3a" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
                </span>
                <div className="choice-title">Human review</div>
                <div className="choice-desc">Get your resume reviewed and rewritten by one of our expert career coaches. Personal, thorough, and back within 48 hours.</div>
                <span className="choice-tag" style={{color:"#b06a3a",background:"rgba(176,106,58,0.1)",borderColor:"rgba(176,106,58,0.25)"}}>HR expert · 48hr turnaround</span>
              </div>
            </div>

            <div className="flow-strip">
              <div className="flow-step">
                <div className="flow-step-num" style={{background:"var(--sage-dim)",borderColor:"var(--sage-border)",color:"var(--sage)"}}>1</div>
                <div className="flow-step-body">
                  <div className="flow-step-title">Rewrite your resume</div>
                  <div className="flow-step-sub">Tailored, ATS-ready, interview-worthy</div>
                </div>
              </div>
              <div className="flow-arrow">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--text-faint)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
              </div>
              <div className="flow-step">
                <div className="flow-step-num" style={{background:"rgba(74,144,184,0.08)",borderColor:"rgba(74,144,184,0.2)",color:"#4a90b8"}}>2</div>
                <div className="flow-step-body">
                  <div className="flow-step-title">Get a cover letter <span className="flow-free-tag">Free</span></div>
                  <div className="flow-step-sub">Tailored to the role, ready to send</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* BEFORE & AFTER */}
      {screen === "splash" && (
        <div className="ba-section">
          <div className="ba-inner">
            <div className="ba-eyebrow">Real results</div>
            <div className="ba-headline">See what <em>Shortlisted</em> actually does</div>
            <div className="ba-sub">The same resume, before and after. No touching up, no cherry picking.</div>

            <div className="ba-tabs">
              <button className={"ba-tab" + (baExample===0?" active":"")} onClick={()=>setBaExample(0)}>Marketing · Entry level</button>
              <button className={"ba-tab" + (baExample===1?" active":"")} onClick={()=>setBaExample(1)}>Business · Mid level</button>
            </div>

            <div className="ba-grid">
              <div className="ba-col">
                <div className="ba-col-label before">Before</div>
                <div className="ba-doc">
                  <div className="ba-name">{ex.name}</div>
                  <div className="ba-contact">{ex.contact}</div>
                  <div className="ba-section-title">Objective</div>
                  <p className="ba-obj">{ex.before.obj}</p>
                  <div className="ba-section-title">Experience</div>
                  {ex.before.jobs.map((job, i) => (
                    <div key={i}>
                      <div className="ba-job-header">
                        <span className="ba-job-title">{job.title} · {job.co}</span>
                        <span className="ba-job-dates">{job.dates}</span>
                      </div>
                      <ul className="ba-bullets">
                        {job.bullets.map((b, j) => <li key={j}>{b}</li>)}
                      </ul>
                    </div>
                  ))}
                  <div className="ba-section-title">Education</div>
                  <p className="ba-obj">{ex.before.edu}</p>
                  <div className="ba-section-title">Skills</div>
                  <p className="ba-obj">{ex.before.skills}</p>
                </div>
              </div>

              <div className="ba-col">
                <div className="ba-col-label after">After</div>
                <div className="ba-doc after-doc">
                  <div className="ba-name">{ex.name}</div>
                  <div className="ba-contact">{ex.contact}</div>
                  <p className="ba-summary-block">{ex.after.summary}</p>
                  <div className="ba-section-title after-title">Experience</div>
                  {ex.after.jobs.map((job, i) => (
                    <div key={i}>
                      <div className="ba-job-header">
                        <span className="ba-job-title">{job.title} · {job.co}</span>
                        <span className="ba-job-dates">{job.dates}</span>
                      </div>
                      <ul className="ba-bullets">
                        {job.bullets.map((b, j) => (
                          <li key={j} className={job.highlight === j ? "ba-highlight" : ""}>{b}</li>
                        ))}
                      </ul>
                    </div>
                  ))}
                  <div className="ba-section-title after-title">Education</div>
                  <p className="ba-obj">{ex.after.edu}</p>
                </div>
              </div>
            </div>

            <div className="ba-cta-row">
              <button className="ba-cta-btn" onClick={() => { window.scrollTo({top:0,behavior:"smooth"}); }}>
                Your resume could look like this
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 15l-6-6-6 6"/></svg>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* REVIEWS TICKER */}
      {screen === "splash" && (
        <div className="ticker-section">
          <div className="ticker-label">What people are saying</div>
          <div className="ticker-track-wrap">
            <div className="ticker-track">
              {[
                { quote: "I'd been applying for months with no callbacks. Two days after using Shortlisted, I had three interview requests.", name: "Sarah M.", role: "Marketing Manager", init: "SM" },
                { quote: "The before and after was genuinely shocking. I didn't realise how much filler language I was using.", name: "James K.", role: "Operations Lead", init: "JK" },
                { quote: "Worth every penny. Got the job I wanted within a week of rewriting my resume.", name: "Priya T.", role: "Product Designer", init: "PT" },
                { quote: "The cover letter it wrote was better than anything I could have come up with. Felt personal, not generic.", name: "Tom R.", role: "Software Engineer", init: "TR" },
                { quote: "Used the 'build from scratch' option. Couldn't believe how professional it looked from just rough notes.", name: "Aisha B.", role: "Recent Graduate", init: "AB" },
                { quote: "Finally got past the ATS filters I'd been hitting. My recruiter said my resume stood out immediately.", name: "Daniel F.", role: "Finance Analyst", init: "DF" },
                { quote: "I was sceptical at first but the rewrite was genuinely impressive. Got my dream job.", name: "Mei L.", role: "UX Researcher", init: "ML" },
              ].concat([
                { quote: "I'd been applying for months with no callbacks. Two days after using Shortlisted, I had three interview requests.", name: "Sarah M.", role: "Marketing Manager", init: "SM" },
                { quote: "The before and after was genuinely shocking. I didn't realise how much filler language I was using.", name: "James K.", role: "Operations Lead", init: "JK" },
                { quote: "Worth every penny. Got the job I wanted within a week of rewriting my resume.", name: "Priya T.", role: "Product Designer", init: "PT" },
                { quote: "The cover letter it wrote was better than anything I could have come up with. Felt personal, not generic.", name: "Tom R.", role: "Software Engineer", init: "TR" },
                { quote: "Used the 'build from scratch' option. Couldn't believe how professional it looked from just rough notes.", name: "Aisha B.", role: "Recent Graduate", init: "AB" },
                { quote: "Finally got past the ATS filters I'd been hitting. My recruiter said my resume stood out immediately.", name: "Daniel F.", role: "Finance Analyst", init: "DF" },
                { quote: "I was sceptical at first but the rewrite was genuinely impressive. Got my dream job.", name: "Mei L.", role: "UX Researcher", init: "ML" },
              ]).map((r, i) => (
                <div key={i} className="ticker-card">
                  <div className="ticker-stars">★★★★★</div>
                  <div className="ticker-quote">"{r.quote}"</div>
                  <div className="ticker-author">
                    <div className="ticker-avatar">{r.init}</div>
                    <div>
                      <div className="ticker-name">{r.name}</div>
                      <div className="ticker-role">{r.role}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="ticker-placeholder">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
            Placeholder reviews — replace with real ones as they come in
          </div>
        </div>
      )}

      {/* GUIDED */}
      {screen === "guided" && currentStep && (
        <div className="guided-screen">
          <div className="guided-card">
            <div className="guided-progress">
              <div className="guided-progress-bar" style={{width: ((guidedStep+1)/GUIDED_STEPS.length*100) + "%"}} />
            </div>
            <div className="guided-step-label">Step {guidedStep+1} of {GUIDED_STEPS.length}</div>
            <div className="guided-q">{currentStep.q}</div>
            <div className="guided-hint">{currentStep.hint}</div>

            {currentStep.type === "chips" && (
              <div className="guided-opts">
                {currentStep.options.map(opt => (
                  <button key={opt} className={"guided-opt" + (guidedAnswers[currentStep.id]===opt?" selected":"")}
                    onClick={() => { selectChip(currentStep.id, opt, false); setTimeout(advanceGuided, 200); }}>
                    {opt}
                  </button>
                ))}
              </div>
            )}

            {currentStep.type === "chips_multi" && (
              <div>
                <div className="guided-opts">
                  {currentStep.options.map(opt => (
                    <button key={opt} className={"guided-opt" + ((guidedAnswers[currentStep.id]||[]).includes(opt)?" selected":"")}
                      onClick={() => selectChip(currentStep.id, opt, true)}>
                      {opt}
                    </button>
                  ))}
                </div>
                <button className="guided-next" onClick={advanceGuided} disabled={!canAdvance()}>Continue</button>
              </div>
            )}

            {currentStep.type === "chips+text" && (
              <div>
                <div className="guided-opts">
                  {currentStep.options.map(opt => (
                    <button key={opt} className={"guided-opt" + (guidedAnswers[currentStep.id]===opt?" selected":"")}
                      onClick={() => { selectChip(currentStep.id, opt, false); if (opt !== "Other") setTimeout(advanceGuided, 200); }}>
                      {opt}
                    </button>
                  ))}
                </div>
                {guidedAnswers[currentStep.id] === "Other" && (
                  <div className="guided-input-row">
                    <input className="guided-input" placeholder={currentStep.placeholder} value={guidedCurrent}
                      onChange={e => setGuidedCurrent(e.target.value)}
                      onKeyDown={e => e.key === "Enter" && canAdvance() && advanceGuided()} autoFocus />
                    <button className="guided-next" onClick={advanceGuided} disabled={!canAdvance()}>Continue</button>
                  </div>
                )}
              </div>
            )}

            {currentStep.type === "text" && (
              <div className="guided-input-row">
                <input className="guided-input" placeholder={currentStep.placeholder} value={guidedCurrent}
                  onChange={e => setGuidedCurrent(e.target.value)}
                  onKeyDown={e => e.key === "Enter" && canAdvance() && advanceGuided()} autoFocus />
                <button className="guided-next" onClick={advanceGuided} disabled={!canAdvance()}>Continue</button>
              </div>
            )}

            {currentStep.type === "url" && (
              <>
                <div className="guided-input-row">
                  <input className="guided-input" placeholder={currentStep.placeholder} value={guidedCurrent}
                    onChange={e => setGuidedCurrent(e.target.value)}
                    onKeyDown={e => e.key === "Enter" && advanceGuided()} autoFocus />
                  <button className="guided-next" onClick={advanceGuided}>
                    Continue
                  </button>
                </div>
                {currentStep.optional && (
                  <div style={{textAlign:"right",marginTop:"0.5rem"}}>
                    <button onClick={advanceGuided} style={{background:"none",border:"none",cursor:"pointer",fontSize:"0.78rem",color:"var(--text-muted)",fontFamily:"'Outfit',sans-serif",padding:"0"}}>
                      Skip this step →
                    </button>
                  </div>
                )}
              </>
            )}

            <div className="guided-back-row">
              <button className="guided-back-btn" onClick={() => { if (guidedStep===0) setScreen("splash"); else { setGuidedStep(s=>s-1); setGuidedCurrent(""); } }}>← Back</button>
            </div>
          </div>
        </div>
      )}

      {/* FORM (after guided) */}
      {screen === "form" && (
        <div className="form-screen">
          <div className="form-card">
            <div className="form-eyebrow">Almost there</div>
            <h2 className="form-title">Upload your resume</h2>
            <p className="form-sub">Now let's get your resume so we can rewrite it</p>

            {(jobTitle || guidedAnswers.role) && (
              <div className="form-context-pill">
                Tailoring for: <strong>{guidedAnswers.role || jobTitle}</strong>
                {guidedAnswers.field ? " · " + guidedAnswers.field : ""}
              </div>
            )}

            <div className="resume-tabs">
              <button className={"resume-tab" + (resumeTab==="paste"?" active":"")} onClick={()=>setResumeTab("paste")}>Paste text</button>
              <button className={"resume-tab" + (resumeTab==="upload"?" active":"")} onClick={()=>setResumeTab("upload")}>Upload file</button>
            </div>

            {resumeTab === "paste" && (
              <div className="form-group">
                <textarea className="form-textarea" rows={14} placeholder="Paste your full resume here..." value={pastedText} onChange={e=>setPastedText(e.target.value)} />
              </div>
            )}

            {resumeTab === "upload" && (
              <div className="form-group">
                <div className="upload-zone" onClick={() => fileInputRef.current?.click()}
                  onDragOver={e=>{e.preventDefault();}}
                  onDrop={e=>{e.preventDefault();handleFile(e.dataTransfer.files[0]);}}>
                  <input ref={fileInputRef} type="file" accept=".pdf,.doc,.docx,.txt" style={{display:"none"}}
                    onChange={e=>handleFile(e.target.files[0])} />
                  {uploadedFile ? (
                    <div className="upload-done">
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#5a8a6a" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                      <span>{uploadedFile.name}</span>
                      <button className="upload-clear" onClick={e=>{e.stopPropagation();setUploadedFile(null);}}>✕</button>
                    </div>
                  ) : (
                    <div className="upload-prompt">
                      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#b8c8bc" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
                      <span className="upload-text">Drop your resume here, or <span className="upload-link">browse</span></span>
                      <span className="upload-hint">PDF, Word or plain text</span>
                    </div>
                  )}
                </div>
              </div>
            )}

            {error && <div className="error-msg">{error}</div>}

            <div className="payment-notice">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#4a90b8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
              You'll be taken to a secure payment page before your rewrite. After paying, you'll be brought back to a fresh form — so have your resume handy to paste or upload again.
            </div>

            <button className="submit-btn" onClick={() => checkoutAndProceed("rewrite", handleSubmit)} disabled={loading}>
              {loading ? <><div className="spinner"/>{loadingMsg}</> : "Rewrite my resume · $5"}
            </button>
            <button id="auto-submit-rewrite" style={{display:"none"}} onClick={handleSubmit} />
          </div>
        </div>
      )}

      {/* JUMP STRAIGHT IN */}
      {screen === "jump" && (
        <div className="form-screen">
          <div className="form-card">
            <div className="form-eyebrow">Quick rewrite</div>
            <h2 className="form-title">Upload your resume</h2>
            <p className="form-sub">A job-ready resume, tailored and rewritten for you</p>

            <div className="form-group">
              <label className="form-label">Target job title <span className="form-optional">(optional)</span></label>
              <input className="form-input" placeholder="e.g. Marketing Manager" value={jobTitle} onChange={e=>setJobTitle(e.target.value)} />
            </div>
            <div className="form-group">
              <label className="form-label">Job posting URL <span className="form-optional">(optional)</span></label>
              <input className="form-input" placeholder="https://..." value={jobUrl} onChange={e=>setJobUrl(e.target.value)} />
            </div>

            <div className="resume-tabs">
              <button className={"resume-tab"+(resumeTab==="paste"?" active":"")} onClick={()=>setResumeTab("paste")}>Paste text</button>
              <button className={"resume-tab"+(resumeTab==="upload"?" active":"")} onClick={()=>setResumeTab("upload")}>Upload file</button>
            </div>

            {resumeTab === "paste" && (
              <div className="form-group">
                <textarea className="form-textarea" rows={12} placeholder="Paste your full resume here..." value={pastedText} onChange={e=>setPastedText(e.target.value)} />
              </div>
            )}

            {resumeTab === "upload" && (
              <div className="form-group">
                <div className="upload-zone" onClick={() => fileInputRef.current?.click()}
                  onDragOver={e=>{e.preventDefault();}}
                  onDrop={e=>{e.preventDefault();handleFile(e.dataTransfer.files[0]);}}>
                  <input ref={fileInputRef} type="file" accept=".pdf,.doc,.docx,.txt" style={{display:"none"}}
                    onChange={e=>handleFile(e.target.files[0])} />
                  {uploadedFile ? (
                    <div className="upload-done">
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#5a8a6a" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                      <span>{uploadedFile.name}</span>
                      <button className="upload-clear" onClick={e=>{e.stopPropagation();setUploadedFile(null);}}>✕</button>
                    </div>
                  ) : (
                    <div className="upload-prompt">
                      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#b8c8bc" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
                      <span className="upload-text">Drop your resume here, or <span className="upload-link">browse</span></span>
                      <span className="upload-hint">PDF, Word or plain text</span>
                    </div>
                  )}
                </div>
              </div>
            )}

            {error && <div className="error-msg">{error}</div>}
            <div className="payment-notice">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#4a90b8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
              You'll be taken to a secure payment page before your rewrite. After paying, you'll be brought back to a fresh form — so have your resume handy to paste or upload again.
            </div>
            <button className="submit-btn" onClick={() => checkoutAndProceed("rewrite", handleSubmit)} disabled={loading}>
              {loading ? <><div className="spinner"/>{loadingMsg}</> : "Rewrite my resume · $5"}
            </button>
          </div>
        </div>
      )}

      {/* SCRATCH */}
      {screen === "scratch" && (
        <div className="form-screen">
          <div className="form-card">
            <div className="form-eyebrow">Build from scratch</div>
            <h2 className="form-title">Tell us about yourself</h2>
            <p className="form-sub">Rough notes are fine — we'll turn them into a polished resume</p>

            <div className="form-group">
              <label className="form-label">Full name</label>
              <input className="form-input" placeholder="Your name" value={scratchData.name} onChange={e=>setScratchData(s=>({...s,name:e.target.value}))} />
            </div>
            <div className="form-group">
              <label className="form-label">Email <span className="form-optional">(optional)</span></label>
              <input className="form-input" placeholder="email@example.com" value={scratchData.email} onChange={e=>setScratchData(s=>({...s,email:e.target.value}))} />
            </div>
            <div className="form-group">
              <label className="form-label">Location <span className="form-optional">(optional)</span></label>
              <input className="form-input" placeholder="City, State" value={scratchData.location} onChange={e=>setScratchData(s=>({...s,location:e.target.value}))} />
            </div>
            <div className="form-group">
              <label className="form-label">Target role</label>
              <input className="form-input" placeholder="e.g. Marketing Manager" value={scratchData.targetRole} onChange={e=>setScratchData(s=>({...s,targetRole:e.target.value}))} />
            </div>
            <div className="form-group">
              <label className="form-label">Job posting URL <span className="form-optional">(optional)</span></label>
              <input className="form-input" placeholder="https://..." value={scratchData.jobUrl} onChange={e=>setScratchData(s=>({...s,jobUrl:e.target.value}))} />
            </div>

            <div className="scratch-section-label">Work history</div>
            {scratchData.jobs.map((job, i) => (
              <div key={i} className="scratch-job-block">
                <div className="scratch-job-header">
                  <span className="scratch-job-num">Role {i+1}</span>
                  {i > 0 && <button className="scratch-remove" onClick={() => setScratchData(s=>({...s,jobs:s.jobs.filter((_,j)=>j!==i)}))}>Remove</button>}
                </div>
                <div className="form-group">
                  <input className="form-input" placeholder="Job title" value={job.title} onChange={e=>{ const j=[...scratchData.jobs]; j[i]={...j[i],title:e.target.value}; setScratchData(s=>({...s,jobs:j})); }} />
                </div>
                <div className="form-group">
                  <input className="form-input" placeholder="Company name" value={job.company} onChange={e=>{ const j=[...scratchData.jobs]; j[i]={...j[i],company:e.target.value}; setScratchData(s=>({...s,jobs:j})); }} />
                </div>
                <div className="form-group">
                  <input className="form-input" placeholder="Dates (e.g. Jun 2021 – Aug 2023)" value={job.dates} onChange={e=>{ const j=[...scratchData.jobs]; j[i]={...j[i],dates:e.target.value}; setScratchData(s=>({...s,jobs:j})); }} />
                </div>
                <div className="form-group">
                  <textarea className="form-textarea" rows={4} placeholder="What did you do? Any numbers, wins, responsibilities — rough notes are fine" value={job.notes} onChange={e=>{ const j=[...scratchData.jobs]; j[i]={...j[i],notes:e.target.value}; setScratchData(s=>({...s,jobs:j})); }} />
                </div>
              </div>
            ))}
            <button className="add-role-btn" onClick={() => setScratchData(s=>({...s,jobs:[...s.jobs,{title:"",company:"",dates:"",notes:""}]}))}>+ Add another role</button>

            <div className="scratch-section-label">Education</div>
            <div className="form-group">
              <textarea className="form-textarea" rows={3} placeholder="e.g. B.S. Marketing, State University, 2021" value={scratchData.education} onChange={e=>setScratchData(s=>({...s,education:e.target.value}))} />
            </div>
            <div className="form-group">
              <label className="form-label">Skills <span className="form-optional">(hard skills only — coding, languages, specialist software)</span></label>
              <input className="form-input" placeholder="e.g. Python, Salesforce, Spanish" value={scratchData.skills} onChange={e=>setScratchData(s=>({...s,skills:e.target.value}))} />
            </div>
            <div className="form-group">
              <label className="form-label">Anything else we should know? <span className="form-optional">(optional)</span></label>
              <textarea className="form-textarea" rows={3} placeholder="Awards, publications, context about your career..." value={scratchData.extra} onChange={e=>setScratchData(s=>({...s,extra:e.target.value}))} />
            </div>

            {error && <div className="error-msg">{error}</div>}
            <div className="payment-notice">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#4a90b8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
              You'll be taken to a secure payment page before we build your resume. After paying, you'll be brought back to a fresh form — your notes will need to be re-entered.
            </div>
            <button className="submit-btn" onClick={() => checkoutAndProceed("scratch", handleScratchSubmit)} disabled={loading || !scratchData.name.trim() || !scratchData.jobs[0].title.trim()}>
              {loading ? <><div className="spinner"/>{loadingMsg}</> : "Build my resume · $10"}
            </button>
            <button id="auto-submit-scratch" style={{display:"none"}} onClick={handleScratchSubmit} />
          </div>
        </div>
      )}

      {/* HUMAN */}
      {screen === "human" && (
        <div className="form-screen">
          <div className="form-card">
            <div className="form-eyebrow">Expert review · $30</div>
            <h2 className="form-title">Human review &amp; rewrite</h2>
            <p className="form-sub">A real person — not just AI — will read, rewrite, and return your resume within 48 hours.</p>
            <div className="human-features">
              <div className="human-feature"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#b06a3a" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>Personal review by an experienced HR professional</div>
              <div className="human-feature"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#b06a3a" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>Full rewrite with strategic feedback</div>
              <div className="human-feature"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#b06a3a" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>ATS optimisation included</div>
              <div className="human-feature"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#b06a3a" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>Delivered within 48 hours</div>
              <div className="human-feature"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#b06a3a" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>One free revision round</div>
            </div>
            <div className="form-group">
              <label className="form-label">Full name</label>
              <input className="form-input" placeholder="Your name" value={humanData.name} onChange={e=>setHumanData(h=>({...h,name:e.target.value}))} />
            </div>
            <div className="form-group">
              <label className="form-label">Email address</label>
              <input className="form-input" type="email" placeholder="Where should we send your rewritten resume?" value={humanData.email} onChange={e=>setHumanData(h=>({...h,email:e.target.value}))} />
            </div>
            <div className="form-group">
              <label className="form-label">Your resume</label>
              <textarea className="form-textarea" rows={12} placeholder="Paste your current resume here..." value={humanData.resume} onChange={e=>setHumanData(h=>({...h,resume:e.target.value}))} />
            </div>
            <div className="form-group">
              <label className="form-label">Anything we should know? <span className="form-optional">(optional)</span></label>
              <textarea className="form-textarea" rows={3} placeholder="Target role, industries, concerns, gaps..." value={humanData.context} onChange={e=>setHumanData(h=>({...h,context:e.target.value}))} />
            </div>
            <button className="submit-btn human-btn" onClick={() => checkoutAndProceed("human", handleHumanSubmit)}
              disabled={humanSubmitted || !humanData.name.trim() || !humanData.email.trim() || !humanData.resume.trim()}>
              {humanSubmitted ? "Request received!" : "Submit for review · $30"}
            </button>
            {humanSubmitted && (
              <div className="human-confirm">
                <div className="human-confirm-icon">
                  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#5a8a6a" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                </div>
                <div className="human-confirm-title">You're all set, {humanData.name.split(" ")[0]}!</div>
                <div className="human-confirm-sub">We've received your resume. One of our career coaches will have your rewrite ready within 48 hours and send it to <strong>{humanData.email}</strong>.</div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* RESULTS */}
      {screen === "results" && result && (
        <div className="results-screen">
          {showTada && (
            <div className="tada-overlay">
              {confetti.map(c => (
                <div key={c.id} className="confetti-piece" style={{left:c.x+"%",background:c.color,width:c.size+"px",height:(c.size*2.5)+"px",animationDuration:c.speed+"s",animationDelay:c.delay+"s"}} />
              ))}
              <div className="tada-msg">
                <div className="tada-icon">
                  <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="#5a8a6a" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                </div>
                <div className="tada-title">Your resume is ready</div>
                <div className="tada-sub">Rewritten, polished, and ready to send</div>
              </div>
            </div>
          )}

          <div className="results-inner">
            <div className="results-header">
              <div className="results-label">Your rewritten resume</div>
              <button className="dl-btn" onClick={() => window.print()}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
                Save as PDF
              </button>
            </div>

            <div className="resume-doc" id="resume-print">
              {result.resume.name && <div className="r-name">{result.resume.name}</div>}
              {result.resume.contact && <div className="r-contact">{result.resume.contact}</div>}
              {result.resume.summary && (
                <div className="r-section">
                  <div className="r-section-title">Professional Summary</div>
                  <p className="r-summary">{result.resume.summary}</p>
                </div>
              )}
              {result.resume.experience?.length > 0 && (
                <div className="r-section">
                  <div className="r-section-title">Experience</div>
                  {result.resume.experience.map((exp, i) => (
                    <div key={i} className="r-exp">
                      <div className="r-exp-header">
                        <div className="r-exp-left">
                          <span className="r-job-title">{exp.title}</span>
                          {exp.company && <span className="r-company"> · {exp.company}</span>}
                        </div>
                        {exp.dates && <span className="r-dates">{exp.dates}</span>}
                      </div>
                      {exp.bullets?.length > 0 && (
                        <ul className="r-bullets">
                          {exp.bullets.map((b, j) => <li key={j}>{b}</li>)}
                        </ul>
                      )}
                    </div>
                  ))}
                </div>
              )}
              {result.resume.education?.length > 0 && (
                <div className="r-section">
                  <div className="r-section-title">Education</div>
                  {result.resume.education.map((edu, i) => (
                    <div key={i} className="r-exp">
                      <div className="r-exp-header">
                        <div className="r-exp-left">
                          <span className="r-job-title">{edu.degree}</span>
                          {edu.school && <span className="r-company"> · {edu.school}</span>}
                        </div>
                        {edu.dates && <span className="r-dates">{edu.dates}</span>}
                      </div>
                    </div>
                  ))}
                </div>
              )}
              {result.resume.skills?.length > 0 && (
                <div className="r-section">
                  <div className="r-section-title">Skills</div>
                  <p className="r-summary">{result.resume.skills.join(", ")}</p>
                </div>
              )}
            </div>

            <div className="expert-note">
              <div className="expert-note-label">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
                From your expert
              </div>
              <p className="expert-note-text">{result.note}</p>
            </div>

            {!coverLetter ? (
              <div className="cover-letter-cta">
                <div className="cover-letter-cta-title">Need a cover letter too? <em>We've got you.</em></div>
                <div className="cover-letter-cta-sub">We'll write a tailored cover letter to match your new resume — specific to the role, ready to send.</div>
                <button className="cover-letter-btn" onClick={generateCoverLetter} disabled={coverLoading}>
                  {coverLoading ? (
                    <><div className="spinner" style={{borderColor:"rgba(255,255,255,0.3)",borderTopColor:"white"}} />Writing your cover letter...</>
                  ) : (
                    <>
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/>
                      </svg>
                      Generate cover letter
                      <span className="cover-letter-free-tag">Free</span>
                    </>
                  )}
                </button>
              </div>
            ) : (
              <div className="cover-letter-wrap">
                <div className="cover-letter-header">
                  <div className="cover-letter-label">Cover letter — ready to use</div>
                  <button className="dl-btn-sm" onClick={() => {
                    const el = document.getElementById("cover-print");
                    const w = window.open("", "_blank");
                    w.document.write("<html><body style=\"font-family:Georgia,serif;font-size:11pt;line-height:1.75;padding:2cm 2.5cm;color:#1a1a1a;white-space:pre-wrap;\">" + el.innerText + "</body></html>");
                    w.document.close(); w.print();
                  }}>
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                      <polyline points="7 10 12 15 17 10"/>
                      <line x1="12" y1="15" x2="12" y2="3"/>
                    </svg>
                    Save as PDF
                  </button>
                </div>
                <div className="cover-letter-doc" id="cover-print">{coverLetter}</div>
              </div>
            )}

            <button className="reset-btn" onClick={reset}>← Rewrite another resume</button>
          </div>
        </div>
      )}
    </>
  );
}
