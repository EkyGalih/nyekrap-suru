import React from 'react';
import './globals.css';
import { Code2 } from 'lucide-react';
import Link from 'next/link';
import { Metadata } from 'next';

// --- SEO METADATA ---
export const metadata: Metadata = {
  title: 'DND Digital | Jasa Pembuatan Website Profesional di Lombok',
  description: 'Jasa pembuatan website landing page, toko online, dan sistem kustom murah di Mataram, Lombok. Cepat, aman, dan SEO friendly untuk UMKM & Personal Brand.',
  keywords: 'jasa pembuatan website lombok, bikin website mataram, jasa web design ntb, pembuatan toko online murah, dnd digital',
  authors: [{ name: 'DND Digital' }],
  openGraph: {
    title: 'DND Digital - Partner Pembuatan Website Terpercaya',
    description: 'Bikin website gak perlu ribet. Terima beres untuk landing page, portofolio, dan sistem kustom.',
    url: 'https://dnd-digital.com', // Ganti dengan domain Anda
    siteName: 'DND Digital',
    images: [
      {
        url: '/og-image.jpg', // Pastikan ada gambar di folder public
        width: 1200,
        height: 630,
      },
    ],
    locale: 'id_ID',
    type: 'website',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const WHATSAPP_LINK = "https://wa.me/6287700991538?text=Halo%20DND%20Digital,%20saya%20tertarik%20buat%20website";

  // --- JSON-LD (Schema.org) untuk SEO Lokal ---
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "ProfessionalService",
    "name": "DND Digital",
    "image": "https://dnd-digital.com/logo.png",
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "Terong Tawah, Labuapi",
      "addressLocality": "Lombok Barat",
      "addressRegion": "NTB",
      "addressCountry": "ID"
    },
    "url": "https://dnd-digital.com",
    "telephone": "+6287700991538",
    "priceRange": "Rp1.200.000 - Rp10.000.000"
  };

  return (
    <html lang="id" className="scroll-smooth" suppressHydrationWarning>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="bg-slate-950 text-slate-200 font-sans antialiased">
        <header>
          <nav className="fixed w-full z-50 bg-slate-950/80 backdrop-blur-xl border-b border-slate-900/50">
            <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
              <Link href="/" className="flex items-center gap-2 text-white font-black text-2xl tracking-tighter">
                <Code2 className="text-indigo-500 w-7 h-7" /> DND<span className="text-indigo-500">DIGITAL</span>
              </Link>
              
              <div className="hidden md:flex gap-8 text-xs uppercase tracking-widest font-bold">
                <Link href="/" className="hover:text-indigo-400 transition text-slate-400">Home</Link>
                <Link href="#services" className="hover:text-indigo-400 transition text-slate-400">Layanan</Link>
                <Link href="#pricing" className="hover:text-indigo-400 transition text-slate-400">Harga Paket</Link>
                <Link href="#kontak" className="hover:text-indigo-400 transition text-slate-400">Kontak</Link>
              </div>

              <a href={WHATSAPP_LINK} className="bg-white text-black hover:bg-indigo-500 hover:text-white px-5 py-2.5 rounded-full text-xs font-black uppercase transition-all duration-300">
                Konsultasi Gratis
              </a>
            </div>
          </nav>
        </header>

        <main>{children}</main>

        <footer className="py-20 px-6 border-t border-slate-900 bg-slate-950">
          <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12">
            <div className="col-span-1 md:col-span-2">
              <div className="flex items-center gap-2 text-white font-black text-2xl mb-6 tracking-tighter">
                <Code2 className="text-indigo-500" /> DND DIGITAL
              </div>
              <p className="text-slate-500 text-sm leading-relaxed max-w-sm">
                Solusi transformasi digital terpercaya di Lombok. Spesialis pembuatan website SEO-friendly untuk meningkatkan omzet bisnis Anda secara organik.
              </p>
            </div>
            <div>
              <h4 className="text-white font-bold mb-6 text-xs uppercase tracking-[0.2em]">Navigasi</h4>
              <nav className="flex flex-col space-y-4 text-slate-500 text-sm font-medium">
                <Link href="#pricing" className="hover:text-indigo-400">Harga Paket Web</Link>
                <Link href="#services" className="hover:text-indigo-400">Layanan Digital</Link>
                <Link href="/terms" className="hover:text-indigo-400">Terms & Conditions</Link>
              </nav>
            </div>
            <div>
              <h4 className="text-white font-bold mb-6 text-xs uppercase tracking-[0.2em]">Workshop</h4>
              <address className="text-slate-500 text-sm leading-6 not-italic">
                Terong Tawah, Labuapi<br />
                Lombok Barat, NTB<br />
                <span className="text-white font-bold underline">WA: 0877-0099-1538</span>
              </address>
            </div>
          </div>
          <div className="max-w-6xl mx-auto mt-20 pt-8 border-t border-slate-900/50 text-center text-slate-600 text-[10px] uppercase tracking-[0.3em] font-bold">
            &copy; {new Date().getFullYear()} DND DIGITAL AGENCY. ALL RIGHTS RESERVED.
          </div>
        </footer>
      </body>
    </html>
  );
}