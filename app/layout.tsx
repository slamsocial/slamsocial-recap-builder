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
  title: "SlamSocial Campaign Recap",
  description: "SlamSocial campaign recap.",
  openGraph: {
    title: "SlamSocial Campaign Recap",
    description: "SlamSocial campaign recap.",
    siteName: "SlamSocial Campaign Recap",
    images: ["/images/slamsocial-logo.png"],
  },
  twitter: {
    card: "summary_large_image",
    title: "SlamSocial Campaign Recap",
    description: "SlamSocial campaign recap.",
    images: ["/images/slamsocial-logo.png"],
  },
  icons: {
    icon: "/images/slamsocial-logo.png",
    shortcut: "/images/slamsocial-logo.png",
    apple: "/images/slamsocial-logo.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
