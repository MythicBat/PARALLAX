import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "PARALLAX",
  description: "See what happens before you decide.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}