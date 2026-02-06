import React from 'react';
import './globals.css';
import { Wifi } from 'lucide-react';
import Link from 'next/link';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const WHATSAPP_LINK = "https://wa.me/6287700991538";

  return (
    <html lang="id" className="scroll-smooth" suppressHydrationWarning>
      <body className="bg-slate-950 text-slate-200 font-sans">
        {/* NAVBAR */}
        <nav className="fixed w-full z-50 bg-slate-950/80 backdrop-blur-md border-b border-slate-900">
          <div className="max-w-6xl mx-auto px-6 py-4 flex justify-between items-center">
            <Link href="/" className="flex items-center gap-2 text-white font-bold text-xl">
              <Wifi className="text-indigo-500 w-6 h-6" /> DND COMPUTER
            </Link>
            <div className="hidden md:flex gap-8 text-sm font-medium">
              <Link href="/" className="hover:text-indigo-400 transition">Beranda</Link>
              <Link href="/about" className="hover:text-indigo-400 transition">Tentang</Link>
              <Link href="/contact" className="hover:text-indigo-400 transition">Kontak</Link>
            </div>
            <a href={WHATSAPP_LINK} className="bg-indigo-600 hover:bg-indigo-500 px-4 py-2 rounded-lg text-sm font-bold transition">
              Bantuan
            </a>
          </div>
        </nav>

        <main>{children}</main>

        {/* FOOTER */}
        <footer className="py-16 px-6 border-t border-slate-900 bg-slate-950">
          <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-12">
            <div>
              <div className="flex items-center gap-2 text-white font-bold text-xl mb-4">
                <Wifi className="text-indigo-500" /> DND COMPUTER
              </div>
              <p className="text-slate-500 text-sm leading-relaxed">
                Penyedia layanan RT/RW Net berkualitas di wilayah NTB.
                Koneksi stabil, harga merakyat, pelayanan teknisi 24/7.
              </p>
            </div>
            <div>
              <h4 className="text-white font-bold mb-4 text-sm uppercase tracking-widest">Legalitas</h4>
              <ul className="text-slate-500 space-y-2 text-sm">
                <li><Link href="/terms" className="hover:text-indigo-400">Syarat & Ketentuan</Link></li>
                <li><Link href="/privacy" className="hover:text-indigo-400">Kebijakan Privasi</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-bold mb-4 text-sm uppercase tracking-widest">Kontak</h4>
              <p className="text-slate-500 text-sm">Terong Tawah, Labuapi & Gunung Sari, NTB</p>
              <p className="text-slate-500 text-sm">WhatsApp: +62 877-0099-1538</p>
            </div>
          </div>
          <div className="max-w-6xl mx-auto mt-12 pt-8 border-t border-slate-900 text-center text-slate-600 text-xs">
            &copy; {new Date().getFullYear()} DND COMPUTER. Powered by DND Computer.
          </div>
        </footer>
      </body>
    </html>
  );
}