import React from 'react';
import {
  Code2, Terminal, ShieldCheck, Zap,
  MessageSquare, Layout, Database, Bot,
  ArrowRight, CheckCircle2
} from 'lucide-react';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'DND Computer Digital Solutions | Expert Web & Software Development',
  description: 'Spesialis pembuatan sistem custom, API (Drama, Anime, Comic), dan lisensi software resmi. Solusi teknologi tepat guna untuk bisnis Anda.',
  keywords: ['jasa pembuatan software', 'api scraper indonesia', 'jasa laravel filament', 'jasa nextjs', 'tamanto digital'],
};

const LandingPage = () => {
  const WHATSAPP_LINK = "https://wa.me/6287700991538?text=Halo%20DND Computer,%20saya%20tertarik%20dengan%20jasanya";

  const services = [
    {
      title: "Custom Software Development",
      desc: "Membangun sistem informasi (ERP, CRM, Dashboard) yang spesifik sesuai kebutuhan alur bisnis Anda. Bukan sekadar template.",
      icon: <Database className="w-8 h-8 text-cyan-400" />,
    },
    {
      title: "High-Performance Website",
      desc: "Website modern menggunakan Next.js dan Tailwind CSS. Cepat, SEO-friendly, dan responsif di semua perangkat.",
      icon: <Layout className="w-8 h-8 text-blue-400" />,
    },
    {
      title: "Eksklusif API Solutions",
      desc: "Penyedia API untuk konten Film, Drama, Anime, dan Komik dengan manajemen cache yang efisien.",
      icon: <Terminal className="w-8 h-8 text-purple-400" />,
    },
    {
      title: "Official Software License",
      desc: "Distribusi lisensi aplikasi resmi untuk menunjang produktivitas dan legalitas operasional bisnis Anda.",
      icon: <ShieldCheck className="w-8 h-8 text-emerald-400" />,
    },
  ];

  return (
    <div className="bg-slate-950 text-slate-200 min-h-screen font-sans selection:bg-cyan-500/30">

      {/* --- HERO SECTION --- */}
      <section className="relative pt-32 pb-20 px-6 overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-cyan-900/20 via-transparent to-transparent -z-10" />

        <div className="max-w-6xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-cyan-500/30 bg-cyan-500/10 text-cyan-400 text-sm mb-6 animate-fade-in">
            <Zap className="w-4 h-4" /> <span>Available for New Projects</span>
          </div>

          <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-white mb-8">
            Build Your Digital <br />
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-blue-500">
              Future with DND Computer
            </span>
          </h1>

          <p className="text-lg md:text-xl text-slate-400 max-w-3xl mx-auto mb-12 leading-relaxed">
            Kami membantu bisnis bertransformasi lewat software custom, optimasi website,
            dan penyediaan infrastruktur API yang handal. Fokus pada performa dan skalabilitas.
          </p>

          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <a href={WHATSAPP_LINK}
              className="flex items-center justify-center gap-2 bg-white text-slate-950 px-8 py-4 rounded-xl font-bold hover:bg-cyan-400 transition-all duration-300">
              <MessageSquare className="w-5 h-5" /> Konsultasi Gratis
            </a>
            <a href="/api/docs"
              className="flex items-center justify-center gap-2 border border-slate-700 bg-slate-900/50 px-8 py-4 rounded-xl font-bold hover:border-cyan-500 transition-all">
              <Code2 className="w-5 h-5" /> Lihat Dokumentasi API
            </a>
          </div>
        </div>
      </section>

      {/* --- SERVICES SECTION --- */}
      <section className="py-24 px-6 bg-slate-900/50">
        <div className="max-w-6xl mx-auto">
          <div className="mb-16">
            <h2 className="text-3xl font-bold text-white mb-4">Our Expertise</h2>
            <div className="h-1 w-20 bg-cyan-500 rounded-full" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {services.map((item, idx) => (
              <div key={idx} className="group p-8 rounded-2xl border border-slate-800 bg-slate-950 hover:border-cyan-500/50 transition-all">
                <div className="mb-6 p-3 bg-slate-900 w-fit rounded-lg group-hover:scale-110 transition-transform">
                  {item.icon}
                </div>
                <h3 className="text-xl font-bold text-white mb-3">{item.title}</h3>
                <p className="text-slate-400 leading-relaxed mb-6">{item.desc}</p>
                <div className="flex items-center gap-2 text-sm text-cyan-400 font-medium">
                  Learn more <ArrowRight className="w-4 h-4" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* --- WHY US SECTION (Content Enrichment) --- */}
      <section className="py-24 px-6">
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-16 items-center">
          <div>
            <h2 className="text-4xl font-bold text-white mb-6">Mengapa Memilih DND Computer?</h2>
            <p className="text-slate-400 mb-8 leading-relaxed">
              Kami tidak hanya sekadar koding. Kami memastikan setiap baris kode yang kami tulis
              memberikan nilai tambah bagi efisiensi bisnis Anda.
            </p>
            <ul className="space-y-4">
              {[
                "Source Code Bersih & Mudah Dirawat",
                "Teknologi Terbaru (Laravel 11, Next.js 14)",
                "Keamanan Data & Enkripsi API",
                "Dukungan Teknis & Maintenance Berkelanjutan"
              ].map((text, i) => (
                <li key={i} className="flex items-center gap-3 text-slate-300">
                  <CheckCircle2 className="w-5 h-5 text-cyan-500" /> {text}
                </li>
              ))}
            </ul>
          </div>
          <div className="bg-gradient-to-br from-cyan-900/40 to-blue-900/40 p-1 rounded-3xl">
            <div className="bg-slate-950 rounded-[22px] p-8 border border-white/5">
              <div className="space-y-6">
                <div className="flex items-center gap-4 border-b border-slate-800 pb-4">
                  <Bot className="text-cyan-400 w-10 h-10" />
                  <div>
                    <p className="text-white font-bold">Smart Scraping API</p>
                    <p className="text-xs text-slate-500">Ready-to-use endpoint</p>
                  </div>
                </div>
                <pre className="text-xs font-mono text-cyan-300 overflow-x-auto">
                  {`GET /api/v1/drama/search?q=DND Computer
{
  "status": "success",
  "data": {
    "title": "Professional Service",
    "delivery": "High Speed"
  }
}`}
                </pre>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* --- CTA SECTION --- */}
      <section className="py-20 px-6 border-t border-slate-900 text-center">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-white mb-6">Siap Memulai Proyek Anda?</h2>
          <p className="text-slate-400 mb-10">
            Diskusikan kebutuhan software atau integrasi API Anda sekarang.
            Gratis konsultasi teknis tanpa dipungut biaya.
          </p>
          <a href={WHATSAPP_LINK}
            className="inline-flex items-center gap-3 bg-cyan-600 hover:bg-cyan-500 text-white px-10 py-4 rounded-xl font-bold transition-all transform hover:scale-105 shadow-lg shadow-cyan-500/20">
            Hubungi via WhatsApp <MessageSquare className="w-5 h-5" />
          </a>
        </div>
      </section>

      <footer className="py-10 text-center text-slate-600 text-sm border-t border-slate-900">
        <p>&copy; {new Date().getFullYear()} DND Computer Digital. Built with Next.js & ❤️.</p>
      </footer>
    </div>
  );
};

export default LandingPage;