import type { Metadata } from "next";
import { Inter, Playfair_Display, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter", display: "swap" });
const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
  display: "swap",
});
const mono = JetBrains_Mono({ subsets: ["latin"], variable: "--font-mono", display: "swap" });

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "https://shoaibramani.com"),
  title: {
    default: "Shoaib Ramani — Corporate Development & Strategic Finance",
    template: "%s — Shoaib Ramani",
  },
  description:
    "Corporate Development & Strategic Finance Analyst — M&A, FP&A, and deal architecture. Based in Woburn, MA.",
  openGraph: {
    type: "website",
    title: "Shoaib Ramani — Corporate Development & Strategic Finance",
    description:
      "Corporate Development & Strategic Finance Analyst — M&A, FP&A, and deal architecture.",
    siteName: "Shoaib Ramani",
  },
  twitter: {
    card: "summary_large_image",
    title: "Shoaib Ramani — Corporate Development & Strategic Finance",
  },
  alternates: { canonical: "/" },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${inter.variable} ${playfair.variable} ${mono.variable}`}>
      <body>{children}</body>
    </html>
  );
}
