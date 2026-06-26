import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL ?? "https://recaps.slamsocial.biz"),
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
      <body>{children}</body>
    </html>
  );
}
