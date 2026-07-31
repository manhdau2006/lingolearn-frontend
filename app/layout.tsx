import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "LingoLens — Học từ vựng qua ống kính",
  description:
    "Chụp ảnh vật thể xung quanh và học ngay từ vựng kèm phiên âm, phát âm và dịch nghĩa.",
};

export const viewport = {
  themeColor: "#0a0a0a",
  userScalable: false,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full bg-neutral-950 antialiased`}
    >
      <body className="min-h-full flex flex-col bg-neutral-950">{children}</body>
    </html>
  );
}
