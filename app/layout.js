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
      <body>{children}</body>
    </html>
  );
}
