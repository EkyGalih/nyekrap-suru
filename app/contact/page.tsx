import React from 'react';
import { MessageCircle, MapPin, Mail, Phone, Send } from 'lucide-react';

export default function Contact() {
    const WHATSAPP_LINK = "https://wa.me/6287700991538?text=Halo%20DND%20Net,%20saya%20ingin%20tanya%20pemasangan%20baru";

    return (
        <div className="pt-32 pb-20 px-6 max-w-6xl mx-auto">
            <div className="text-center mb-16">
                <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">Hubungi Kami</h1>
                <p className="text-slate-400 max-w-2xl mx-auto">
                    Punya kendala jaringan atau ingin pasang baru di rumah? Tim kami siap membantu Anda secepat mungkin.
                </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8 mb-16">
                {/* Info Cards */}
                <div className="bg-slate-900/50 p-8 rounded-2xl border border-slate-800 text-center hover:border-indigo-500 transition-all">
                    <div className="bg-indigo-500/10 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4 text-indigo-400">
                        <Phone className="w-6 h-6" />
                    </div>
                    <h3 className="text-white font-bold mb-2">WhatsApp Support</h3>
                    <p className="text-slate-500 text-sm mb-4">Layanan aduan gangguan & teknisi.</p>
                    <a href={WHATSAPP_LINK} className="text-indigo-400 font-bold hover:underline">+62 877-0099-1538</a>
                </div>

                <div className="bg-slate-900/50 p-8 rounded-2xl border border-slate-800 text-center hover:border-indigo-500 transition-all">
                    <div className="bg-cyan-500/10 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4 text-cyan-400">
                        <MapPin className="w-6 h-6" />
                    </div>
                    <h3 className="text-white font-bold mb-2">Area Layanan</h3>
                    <p className="text-slate-500 text-sm">Cakupan Wilayah:</p>
                    <p className="text-cyan-400 font-medium">Labuapi, Terong Tawah & Gunung Sari, NTB</p>
                </div>

                <div className="bg-slate-900/50 p-8 rounded-2xl border border-slate-800 text-center hover:border-indigo-500 transition-all">
                    <div className="bg-emerald-500/10 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4 text-emerald-400">
                        <Mail className="w-6 h-6" />
                    </div>
                    <h3 className="text-white font-bold mb-2">Email Bisnis</h3>
                    <p className="text-slate-500 text-sm mb-4">Kerjasama atau penawaran ISP.</p>
                    <p className="text-emerald-400 font-medium font-mono text-sm">ekkygalih8@gmail.com</p>
                </div>
            </div>

            {/* Contact Form Section */}
            <div className="grid md:grid-cols-2 gap-12 bg-slate-900/30 p-8 md:p-12 rounded-3xl border border-slate-800">
                <div>
                    <h2 className="text-3xl font-bold text-white mb-6">Kirim Pesan</h2>
                    <p className="text-slate-400 mb-8">
                        Jika ada pertanyaan lebih lanjut mengenai paket bulanan atau kerjasama RT/RW Net, silakan isi formulir di samping.
                    </p>
                    <div className="space-y-4">
                        <div className="flex items-center gap-4 text-slate-300">
                            <MessageCircle className="text-indigo-500" />
                            <span>Respon rata-rata: &lt; 30 Menit</span>
                        </div>
                    </div>
                </div>

                <form className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <input
                            type="text"
                            placeholder="Nama Lengkap"
                            className="bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm focus:border-indigo-500 outline-none transition-all"
                        />
                        <input
                            type="text"
                            placeholder="No. WhatsApp"
                            className="bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm focus:border-indigo-500 outline-none transition-all"
                        />
                    </div>
                    <select className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm focus:border-indigo-500 outline-none transition-all text-slate-400">
                        <option>Pilih Keperluan</option>
                        <option>Pasang Baru</option>
                        <option>Gangguan Jaringan</option>
                        <option>Kerjasama Bisnis</option>
                    </select>
                    <textarea
                        placeholder="Pesan Anda..."
                        rows={4}
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm focus:border-indigo-500 outline-none transition-all"
                    ></textarea>
                    <button
                        type="button"
                        className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-4 rounded-xl flex items-center justify-center gap-2 transition-all shadow-lg shadow-indigo-500/20"
                    >
                        <Send className="w-4 h-4" /> Kirim Sekarang
                    </button>
                </form>
            </div>
        </div>
    );
}