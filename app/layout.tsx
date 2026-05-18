import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Jean AI — Employee Analyzer",
  description: "Jean AI Internal Agent System",
  viewport: "width=device-width, initial-scale=1",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="he" dir="rtl">
      <body className="min-h-screen">{children}</body>
    </html>
  );
}
