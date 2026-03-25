// app/layout.js
export const metadata = {
  title: "Shortlisted — Get your resume interview-ready",
  description:
    "Get your resume rewritten, matched to real jobs, and a cover letter — in minutes.",
  openGraph: {
    title: "Shortlisted",
    description: "Don't just apply. Stand out.",
    url: "https://shortlisted.com",
    siteName: "Shortlisted",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <script async src="https://www.googletagmanager.com/gtag/js?id=AW-18040929423"></script>
        <script dangerouslySetInnerHTML={{__html: `window.dataLayer = window.dataLayer || []; function gtag(){dataLayer.push(arguments);} gtag('js', new Date()); gtag('config', 'AW-18040929423');`}} />
      </head>
      <body>{children}</body>
    </html>
  );
}
