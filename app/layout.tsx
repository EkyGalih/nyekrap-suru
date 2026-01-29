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
  title: {
    default: "Nyekrap Suru API",
    template: "%s | Nyekrap Suru",
  },
  description:
    "Platform REST API untuk scraping berbagai konten hiburan seperti drama, anime, manga, dan lainnya.",

  applicationName: "Nyekrap Suru",

  icons: {
    icon: "/favicon.ico",
  },

  metadataBase: new URL("http://localhost:3000"),

  openGraph: {
    title: "Nyekrap Suru API",
    description:
      "API scraping modular untuk drama Korea, drama China, anime, manga, dan konten lainnya.",
    url: "http://localhost:3000",
    siteName: "Nyekrap Suru",
    type: "website",
  },

  themeColor: "#000000",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-zinc-50 dark:bg-black`}
      >
        {children}
      </body>
    </html>
  );
}