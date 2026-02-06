import React from 'react';
import {
  Wifi, Zap, ShieldCheck, Clock,
  Smartphone, Router, Activity,
  CheckCircle2, CreditCard, HelpCircle
} from 'lucide-react';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'DND Net | Solusi Internet RT/RW Cepat & Terpercaya',
  description: 'Layanan internet murah untuk warga. Beli voucher otomatis 24 jam, langganan bulanan, dan jasa teknisi jaringan profesional.',
};

const RTRWLandingPage = () => {
  const WHATSAPP_CLIENT_CARE = "https://wa.me/6287700991538?text=Halo%20DND%20Net,%20saya%20butuh%20bantuan%20teknisi";

  const voucherPlans = [
    { time: "2 Jam", price: "Rp 2.000", speed: "Up to 5Mbps", icon: <Clock className="w-5 h-5" /> },
    { time: "24 Jam", price: "Rp 5.000", speed: "Up to 5Mbps", icon: <Zap className="w-5 h-5" /> },
    { time: "7 Hari", price: "Rp 25.000", speed: "Up to 7Mbps", icon: <Activity className="w-5 h-5" /> },
  ];

  const monthlyPlans = [
    { name: "Home Basic", price: "Rp 150.000", features: ["Unlimited Tanpa FUP", "Free Instalasi", "Support 24/7", "Router Dipinjamkan"] },
    { name: "Home Pro", price: "Rp 250.000", features: ["Speed Up to 20Mbps", "Prioritas Jaringan", "Free Maintenance", "Public IP Dynamic"] },
  ];

  return (
    <div className="bg-slate-950 text-slate-200 min-h-screen font-sans selection:bg-indigo-500/30">

      {/* --- HERO SECTION --- */}
      <section className="relative pt-32 pb-20 px-6">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-indigo-900/20 via-transparent to-transparent -z-10" />

        <div className="max-w-6xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-indigo-500/30 bg-indigo-500/10 text-indigo-400 text-sm mb-6 animate-bounce">
            <Wifi className="w-4 h-4" /> <span>Sinyal Kuat, Harga Hemat</span>
          </div>

          <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-white mb-8">
            Internet Tanpa Batas <br />
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-cyan-400">
              Untuk Warga Digital
            </span>
          </h1>

          <p className="text-lg text-slate-400 max-w-2xl mx-auto mb-10">
            Nikmati koneksi internet stabil dengan sistem pembayaran otomatis.
            Beli voucher kapan saja, langsung aktif detik itu juga.
          </p>

          <div className="flex flex-wrap justify-center gap-4">
            <button className="bg-indigo-600 hover:bg-indigo-500 text-white px-8 py-4 rounded-xl font-bold transition-all flex items-center gap-2">
              <CreditCard className="w-5 h-5" /> Beli Voucher Otomatis
            </button>
            <a href="#langganan" className="border border-slate-700 bg-slate-900/50 px-8 py-4 rounded-xl font-bold hover:border-indigo-500 transition-all">
              Daftar Bulanan
            </a>
          </div>
        </div>
      </section>

      {/* --- VOUCHER SECTION --- */}
      <section className="py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-white mb-10 text-center">Pilihan Voucher Hotspot</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {voucherPlans.map((v, i) => (
              <div key={i} className="bg-slate-900 border border-slate-800 p-6 rounded-2xl hover:border-indigo-500 transition-all text-center">
                <div className="bg-indigo-500/10 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4 text-indigo-400">
                  {v.icon}
                </div>
                <h3 className="text-2xl font-bold text-white">{v.time}</h3>
                <p className="text-indigo-400 font-mono text-xl my-2">{v.price}</p>
                <p className="text-sm text-slate-500 mb-6">{v.speed}</p>
                <button className="w-full py-3 bg-slate-800 hover:bg-indigo-600 rounded-lg font-semibold transition-colors">
                  Pilih Paket
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* --- SERVICES (Jasa Pasang & Perbaikan) --- */}
      <section className="py-24 px-6 bg-slate-900/30 border-y border-slate-900">
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-4xl font-bold text-white mb-6">Layanan Teknisi Profesional</h2>
            <p className="text-slate-400 mb-8 leading-relaxed">
              Bukan hanya voucher, kami menyediakan solusi infrastruktur jaringan di rumah atau kos-kosan Anda.
            </p>
            <div className="space-y-6">
              <div className="flex gap-4">
                <div className="bg-cyan-500/20 p-3 rounded-lg h-fit"><Router className="text-cyan-400" /></div>
                <div>
                  <h4 className="text-white font-bold">Pasang Baru (ISP)</h4>
                  <p className="text-sm text-slate-400">Instalasi kabel fiber optic/wireless dengan perangkat standar industri.</p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="bg-emerald-500/20 p-3 rounded-lg h-fit"><ShieldCheck className="text-emerald-400" /></div>
                <div>
                  <h4 className="text-white font-bold">Perbaikan Jaringan</h4>
                  <p className="text-sm text-slate-400">Optimasi WiFi lemot, setting ulang router, atau perapihan kabel.</p>
                </div>
              </div>
            </div>
          </div>
          <div id="langganan" className="bg-gradient-to-br from-indigo-600 to-blue-700 p-8 rounded-3xl shadow-2xl">
            <h3 className="text-2xl font-bold text-white mb-6">Paket Bulanan (Rumahan)</h3>
            <div className="space-y-4">
              {monthlyPlans.map((p, i) => (
                <div key={i} className="bg-white/10 backdrop-blur-md p-5 rounded-xl border border-white/10">
                  <div className="flex justify-between items-center mb-4">
                    <span className="font-bold text-lg">{p.name}</span>
                    <span className="text-white font-mono">{p.price}<small>/bln</small></span>
                  </div>
                  <ul className="text-sm space-y-2">
                    {p.features.map((f, j) => (
                      <li key={j} className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-400" /> {f}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* --- FOOTER & LINKS --- */}
      <footer className="py-20 px-6 border-t border-slate-900">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-10">
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center gap-2 text-white font-bold text-2xl mb-4">
              <Wifi className="text-indigo-500" /> DND NET
            </div>
            <p className="text-slate-500 max-w-sm">
              Memberdayakan ekonomi warga melalui konektivitas digital yang stabil dan terjangkau.
            </p>
          </div>
          <div>
            <h4 className="text-white font-bold mb-4">Perusahaan</h4>
            <ul className="text-slate-400 space-y-2 text-sm">
              <li><a href="/about" className="hover:text-indigo-400">Tentang Kami</a></li>
              <li><a href="/terms" className="hover:text-indigo-400">Syarat & Ketentuan</a></li>
              <li><a href="/privacy" className="hover:text-indigo-400">Kebijakan Privasi</a></li>
            </ul>
          </div>
          <div>
            <h4 className="text-white font-bold mb-4">Bantuan</h4>
            <ul className="text-slate-400 space-y-2 text-sm">
              <li><a href={WHATSAPP_CLIENT_CARE} className="hover:text-indigo-400">Hubungi Teknisi</a></li>
              <li><a href="#" className="hover:text-indigo-400">Cara Bayar</a></li>
              <li><a href="#" className="hover:text-indigo-400">Cek Status Jaringan</a></li>
            </ul>
          </div>
        </div>
        <div className="max-w-6xl mx-auto mt-16 pt-8 border-t border-slate-900 text-center text-slate-600 text-xs">
          <p>&copy; {new Date().getFullYear()} DND Net (DND Computer Group). All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default RTRWLandingPage;