import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Demi Intro",
  description: "A visual personal introduction site for Demi."
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
