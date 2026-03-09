'use client';
import React from 'react';
import {
  Rocket, Globe, ShoppingBag, LayoutDashboard,
  CheckCircle2, ArrowRight, MessageSquare, Star,
  Zap, ShieldCheck, TrendingUp, Users, HeartHandshake,
  Coffee, Laptop, Smartphone
} from 'lucide-react';

const WebAgencyLanding = () => {
  const WHATSAPP_LINK = "https://wa.me/6287700991538?text=Halo%20DND%20Digital,%20mau%20tanya-tanya%20buat%20website%20dong";

  const packages = [
    {
      name: "Lite Landing",
      icon: <Rocket className="w-6 h-6 text-orange-400" />,
      price: "500.000",
      target: "Pas buat jualan 1 produk atau promo jasa",
      features: [
        "1 Halaman (To the point)",
        "Copywriting yang bikin orang 'klik'",
        "Tombol WA langsung ke HP-mu",
        "Tampilan Mobile (HP) cakep",
        "Exclude Domain & Hosting (.com/.id)"
      ],
      color: "border-slate-800"
    },
    {
      name: "Personal Brand",
      icon: <Globe className="w-6 h-6 text-blue-400" />,
      price: "1.250.000",
      target: "Cocok buat portofolio atau jasa profesional",
      features: [
        "Hingga 5 Halaman (Home, Bio, Layanan, dll)",
        "Email Bisnis (halo@namamu.com)",
        "Galeri hasil kerja / Testimoni",
        "Bisa muncul di Google (SEO Dasar)",
        "Exclude Domain & Hosting"
      ],
      color: "border-slate-800"
    },
    {
      name: "Toko Online",
      icon: <ShoppingBag className="w-6 h-6 text-emerald-400" />,
      price: "2.500.000",
      target: "Jualan otomatis, tinggal tunggu notif WA",
      features: [
        "Sistem Keranjang Belanja",
        "Hitung Ongkir (JNE, J&T, dll) Otomatis",
        "Bayar pakai QRIS / Transfer Bank",
        "Notifikasi Order via WhatsApp",
        "Include Hosting & Domain (Sesuai Kebutuhan)"
      ],
      color: "border-indigo-500 shadow-2xl shadow-indigo-500/10",
      popular: true
    },
    {
      name: "Custom System",
      icon: <LayoutDashboard className="w-6 h-6 text-purple-400" />,
      price: "3.500.000",
      target: "Otomasi & Digitalisasi Alur Bisnis",
      features: [
        "Panel Admin (Pengelolaan Data)",
        "Dashboard Monitoring Real-time",
        "Sistem Database Terintegrasi",
        "Fitur Kustom (Keinginan kamu)",
        "Include Infrastruktur Hosting & Domain Kustom"
      ],
      color: "border-slate-800"
    },
    {
      name: "Rawat Website",
      icon: <HeartHandshake className="w-6 h-6 text-pink-400" />,
      price: "100.000",
      target: "Gak mau ribet urus teknis tiap bulan",
      features: [
        "Update konten/gambar dari kamu",
        "Backup rutin (Biar gak ilang)",
        "Update sistem keamanan",
        "Tanya jawab / Konsultasi santai",
        "Bantu bayar tagihan domain tahunan"
      ],
      color: "border-slate-800"
    }
  ];

  return (
    <div className="bg-slate-950 text-slate-200 min-h-screen selection:bg-indigo-500/30">

      {/* --- HERO SECTION --- */}
      <section className="relative pt-32 pb-20 px-6 overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-indigo-900/20 via-transparent to-transparent -z-10" />

        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-indigo-500/20 bg-indigo-500/5 text-indigo-400 text-[10px] font-bold uppercase tracking-widest mb-8">
            <Coffee className="w-3 h-3" /> Partner Digitalmu
          </div>

          <h1 className="text-4xl md:text-6xl font-black tracking-tighter text-white mb-6 leading-[1.1] uppercase text-balance">
            Jasa Bikin Website <br />
            <span className="text-indigo-500">Gak Pake Ribet.</span>
          </h1>

          <p className="text-lg text-slate-400 max-w-xl mx-auto mb-10 font-medium leading-relaxed">
            Fokus aja ke hobi atau bisnismu, urusan teknis biar aku yang beresin. Website rapi, kenceng, dan bikin kamu makin profesional.
          </p>

          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <a href="#pricing" className="bg-indigo-600 hover:bg-indigo-500 text-white px-8 py-4 rounded-2xl font-bold transition-all flex items-center justify-center gap-2">
              Pilih Paket <ArrowRight size={18} />
            </a>
            <a href={WHATSAPP_LINK} className="border border-slate-800 bg-slate-900/50 hover:bg-slate-800 text-white px-8 py-4 rounded-2xl font-bold transition-all flex items-center justify-center gap-2">
              <MessageSquare size={18} /> Tanya-tanya Dulu
            </a>
          </div>
        </div>
      </section>

      {/* --- REALISTIC VALUE (Yang Dicari Individu) --- */}
      <section className="py-20 px-6 border-y border-slate-900/50 bg-slate-900/20" id="services">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-12">
          {[
            {
              icon: <Laptop />,
              label: "Terima Beres",
              sub: "Gak ngerti hosting/domain? Gak masalah. Dari beli nama sampai web online, aku yang urus semuanya."
            },
            {
              icon: <Smartphone />,
              label: "Cakep di HP",
              sub: "Kebanyakan orang buka web lewat HP. Web buatanmu bakal lanjay dan nyaman dilihat di layar kecil."
            },
            {
              icon: <CheckCircle2 />,
              label: "Support Personal",
              sub: "Bingung cara pakenya? Langsung chat WA aja. Gak pake sistem tiket yang lama, langsung sat-set."
            },
          ].map((v, i) => (
            <div key={i} className="flex gap-5">
              <div className="text-indigo-500 shrink-0">{v.icon}</div>
              <div>
                <h4 className="font-bold text-white mb-2">{v.label}</h4>
                <p className="text-sm text-slate-500 leading-relaxed">{v.sub}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* --- PRICING SECTION --- */}
      <section id="pricing" className="py-24 px-6">
        <div className="max-w-3xl mx-auto text-center mb-16">
          <h2 className="text-4xl font-black text-white mb-4 uppercase tracking-tighter italic">Harga Jujur</h2>
          <p className="text-slate-500 text-sm font-medium uppercase tracking-widest">Pilih yang paling cocok buat kebutuhanmu saat ini</p>
        </div>

        <div className="max-w-[1400px] mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          {packages.map((pkg, i) => (
            <div key={i} className={`relative flex flex-col p-6 rounded-3xl bg-slate-900/40 border transition-all hover:border-slate-700 ${pkg.color}`}>
              {pkg.popular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-indigo-500 text-white text-[9px] font-black px-3 py-1 rounded-full uppercase tracking-widest">
                  Paling Banyak Dipilih
                </div>
              )}

              <div className="mb-6">{pkg.icon}</div>
              <h3 className="text-lg font-black text-white leading-tight mb-2 uppercase tracking-tight">{pkg.name}</h3>
              <p className="text-[11px] text-slate-500 mb-6 leading-relaxed h-10 italic">{pkg.target}</p>

              <div className="mb-6">
                <div className="flex items-baseline gap-1">
                  <span className="text-[10px] text-slate-500 font-bold uppercase">Mulai</span>
                  <span className="text-xs text-indigo-400 font-bold">Rp</span>
                  <span className="text-2xl font-black text-white tracking-tighter">{pkg.price}</span>
                </div>
              </div>

              <div className="space-y-3 mb-8 flex-grow">
                {pkg.features.map((feat, j) => (
                  <div key={j} className="flex items-start gap-2 text-[11px]">
                    <CheckCircle2 className="w-3.5 h-3.5 text-indigo-500 shrink-0 mt-0.5" />
                    <span className="text-slate-400 leading-snug">{feat}</span>
                  </div>
                ))}
              </div>

              <a
                href={WHATSAPP_LINK}
                className={`w-full py-3 rounded-xl font-bold text-[10px] uppercase tracking-widest transition-all text-center ${pkg.popular ? 'bg-indigo-600 text-white' : 'bg-slate-800 text-slate-300'}`}
              >
                Gas, Pilih Ini
              </a>
            </div>
          ))}
        </div>
      </section>

      {/* --- PERSONAL CTA --- */}
      <section id='kontak' className="py-24 px-6">
        <div className="max-w-5xl mx-auto rounded-[3rem] bg-slate-900 border border-slate-800 p-10 md:p-16 text-center shadow-2xl">
          <h2 className="text-3xl md:text-5xl font-black text-white mb-6 tracking-tighter uppercase italic">Mau bikin yang beda?</h2>
          <p className="text-slate-400 text-lg max-w-xl mx-auto mb-10">
            Punya ide website yang nggak ada di paket atas? Santai, kita obrolin aja dulu sambil ngopi online via WhatsApp.
          </p>
          <a href={WHATSAPP_LINK} className="bg-white text-black px-10 py-4 rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-indigo-500 hover:text-white transition-all inline-flex items-center gap-3">
            Chat WhatsApp Sekarang <MessageSquare size={18} />
          </a>
        </div>
      </section>

      <footer className="py-10 text-center border-t border-slate-900">
        <p className="text-slate-600 text-[10px] font-bold uppercase tracking-widest">
          &copy; {new Date().getFullYear()} DND Digital • Build for you with Love.
        </p>
      </footer>

    </div>
  );
};

export default WebAgencyLanding;