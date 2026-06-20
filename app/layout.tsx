import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Rekal",
  description: "Private topic-based note collector.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body className="bg-page">{children}</body>
    </html>
  );
}
