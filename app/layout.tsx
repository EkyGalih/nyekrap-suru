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
    default: "DND Computer",
    template: "%s | DND Computer",
  },
  description:
    "Spesialis pembuatan sistem custom, API (Drama, Anime, Comic), dan lisensi software resmi. Solusi teknologi tepat guna untuk bisnis Anda.",

  applicationName: "DND Computer",

  icons: {
    icon: "/favicon.ico",
  },

  metadataBase: new URL("http://mytools.web.id"),

  openGraph: {
    title: "DND Computer",
    description:
      "Spesialis pembuatan sistem custom, API (Drama, Anime, Comic), dan lisensi software resmi. Solusi teknologi tepat guna untuk bisnis Anda.",
    url: "https://mytools.web.id",
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