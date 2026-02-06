'use client';
import React, { useState } from 'react';
import {
  Wifi, Zap, ShieldCheck, Clock,
  Smartphone, Router, Activity,
  CheckCircle2, CreditCard, HelpCircle,
  Gamepad2,
  Tv,
  ArrowRight,
  X
} from 'lucide-react';
import { Metadata } from 'next';

const RTRWLandingPage = () => {
  const WHATSAPP_CLIENT_CARE = "https://wa.me/6287700991538?text=Halo%20DND%20Net,%20saya%20butuh%20bantuan%20teknisi";

  const [selectedPlan, setSelectedPlan] = useState<any>(null);
  const [isCheckout, setIsCheckout] = useState(false);

  const voucherPlans = [
    { id: 1, time: "2 Jam", price: 2000, speed: "5Mbps", icon: <Clock />, type: "Voucher", desc: "Cocok untuk cek email atau browsing santai." },
    { id: 2, time: "24 Jam", price: 5000, speed: "5Mbps", icon: <Zap />, type: "Voucher", desc: "Akses seharian penuh tanpa batas kuota." },
    { id: 3, time: "7 Hari", price: 25000, speed: "7Mbps", icon: <Activity />, type: "Voucher", desc: "Hemat untuk kebutuhan seminggu." },
    { id: 4, time: "30 Hari", price: 90000, speed: "10Mbps", icon: <Wifi />, type: "Voucher", desc: "Paket bulanan personal paling populer." },
    { id: 5, time: "Gamer Pro", price: 15000, speed: "15Mbps", icon: <Gamepad2 />, type: "Special", desc: "Prioritas trafik untuk ping lebih stabil (24 Jam)." },
    { id: 6, time: "Movie Night", price: 7000, speed: "20Mbps", icon: <Tv />, type: "Special", desc: "Bandwidth besar untuk streaming Netflix/YT (12 Jam)." },
  ];

  const monthlyPlans = [
    { name: "Home Basic", price: "Rp 150.000", features: ["Unlimited Tanpa FUP", "Free Instalasi", "Support 24/7", "Router Dipinjamkan"] },
    { name: "Home Pro", price: "Rp 250.000", features: ["Speed Up to 20Mbps", "Prioritas Jaringan", "Free Maintenance", "Public IP Dynamic"] },
  ];

  // Fungsi Checkout (Simulasi ke DOKU)
  const handlePayment = () => {
    alert(`Mengarahkan ke Gateway Pembayaran untuk paket ${selectedPlan.time}...`);
    // Di sini nanti panggil API integrasi DOKU-mu
  };

  if (isCheckout) return <CheckoutPage plan={selectedPlan} onBack={() => setIsCheckout(false)} onPay={handlePayment} />;

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

      {/* --- VOUCHER GRID --- */}
      <section className="py-10 px-6">
        <div className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {voucherPlans.map((v) => (
            <div key={v.id} className="group bg-slate-900 border border-slate-800 p-6 rounded-2xl hover:border-indigo-500 transition-all">
              <div className="flex justify-between items-start mb-4">
                <div className="p-3 bg-indigo-500/10 rounded-lg text-indigo-400">{v.icon}</div>
                {v.type === "Special" && <span className="text-[10px] bg-amber-500/20 text-amber-500 px-2 py-1 rounded-full font-bold uppercase">Special Access</span>}
              </div>
              <h3 className="text-xl font-bold text-white">{v.time}</h3>
              <p className="text-2xl font-mono text-indigo-400 font-bold mt-1">Rp {v.price.toLocaleString('id-ID')}</p>
              <div className="flex items-center gap-2 mt-4 text-sm text-slate-500">
                <CheckCircle2 className="w-4 h-4 text-emerald-500" /> Speed Up to {v.speed}
              </div>
              <button
                onClick={() => setSelectedPlan(v)}
                className="w-full mt-6 py-3 bg-indigo-600 hover:bg-indigo-500 rounded-xl font-bold flex items-center justify-center gap-2 transition-all">
                Detail Paket <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* --- MODAL DETAIL --- */}
      {selectedPlan && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-6 bg-slate-950/80 backdrop-blur-sm">
          <div className="bg-slate-900 border border-slate-800 w-full max-w-md rounded-3xl p-8 relative animate-in fade-in zoom-in duration-200">
            <button onClick={() => setSelectedPlan(null)} className="absolute top-4 right-4 p-2 hover:bg-slate-800 rounded-full"><X /></button>

            <div className="text-center mb-6">
              <div className="inline-block p-4 bg-indigo-500/10 rounded-2xl text-indigo-400 mb-4">{selectedPlan.icon}</div>
              <h2 className="text-3xl font-bold text-white">Paket {selectedPlan.time}</h2>
              <p className="text-slate-400 mt-2 text-sm">{selectedPlan.desc}</p>
            </div>

            <div className="space-y-4 border-t border-slate-800 pt-6">
              <div className="flex justify-between text-sm"><span className="text-slate-500">Kecepatan</span> <span className="text-white font-bold">{selectedPlan.speed}</span></div>
              <div className="flex justify-between text-sm"><span className="text-slate-500">Masa Aktif</span> <span className="text-white font-bold">{selectedPlan.time}</span></div>
              <div className="flex justify-between text-sm"><span className="text-slate-500">Jenis Jaringan</span> <span className="text-white font-bold">Shared Bandwidth</span></div>
              <div className="flex justify-between text-lg border-t border-slate-800 pt-4"><span className="text-white font-bold">Total Bayar</span> <span className="text-indigo-400 font-bold">Rp {selectedPlan.price.toLocaleString('id-ID')}</span></div>
            </div>

            <button
              onClick={() => setIsCheckout(true)}
              className="w-full mt-8 py-4 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl font-bold shadow-lg shadow-indigo-500/20 transition-all">
              Lanjutkan ke Pembayaran
            </button>
          </div>
        </div>
      )}

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
    </div>
  );
};

const CheckoutPage = ({ plan, onBack, onPay }: any) => {
  return (
    <div className="pt-32 pb-20 px-6 max-w-2xl mx-auto">
      <button onClick={onBack} className="text-slate-400 hover:text-white mb-8 flex items-center gap-2">
        <ArrowRight className="rotate-180 w-4 h-4" /> Kembali
      </button>

      <h1 className="text-3xl font-bold text-white mb-8">Checkout Pembayaran</h1>

      <div className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden mb-6">
        <div className="p-6 border-b border-slate-800 bg-indigo-500/5">
          <h3 className="font-bold text-white uppercase text-xs tracking-widest mb-1">Ringkasan Pesanan</h3>
          <div className="flex justify-between items-center">
            <span className="text-xl font-bold text-white">Voucher Internet {plan.time}</span>
            <span className="text-xl font-mono text-indigo-400 font-bold">Rp {plan.price.toLocaleString('id-ID')}</span>
          </div>
        </div>

        <div className="p-6 space-y-6">
          <div>
            <label className="block text-sm font-medium text-slate-400 mb-2">Nomor WhatsApp (Untuk kirim Kode Voucher)</label>
            <input type="tel" placeholder="0812xxxx" className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 outline-none focus:border-indigo-500 transition-all" />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-400 mb-4">Pilih Metode Pembayaran</label>
            <div className="grid grid-cols-1 gap-3">
              {['QRIS (Gopay, OVO, Dana)', 'Virtual Account (BCA, Mandiri, BNI)', 'Alfamart / Indomaret'].map((m) => (
                <label key={m} className="flex items-center justify-between p-4 bg-slate-950 border border-slate-800 rounded-xl cursor-pointer hover:border-indigo-500 transition-all group">
                  <span className="text-sm text-slate-300">{m}</span>
                  <input type="radio" name="payment" className="accent-indigo-500 w-4 h-4" />
                </label>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="bg-indigo-500/10 border border-indigo-500/20 p-4 rounded-xl mb-8 flex gap-3">
        <HelpCircle className="text-indigo-400 shrink-0" />
        <p className="text-xs text-indigo-300/80 leading-relaxed">
          Setelah pembayaran berhasil, kode voucher akan dikirim melalui WhatsApp dan muncul otomatis di halaman ini. Pastikan nomor WA aktif.
        </p>
      </div>

      <button
        onClick={onPay}
        className="w-full py-4 bg-indigo-600 hover:bg-indigo-500 text-white rounded-2xl font-bold text-lg shadow-xl shadow-indigo-500/20 transition-all">
        Bayar Sekarang
      </button>
    </div>
  );
};

export default RTRWLandingPage;