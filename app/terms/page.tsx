'use client';
import React from 'react';
import { ShieldAlert, Scale, FileText, HelpCircle } from 'lucide-react';

export default function TermsPage() {
    const sections = [
        {
            title: "1. Kesepakatan Awal",
            content: "Dengan memulai proyek bersama DND Digital, Anda dianggap telah menyetujui bahwa semua komunikasi melalui WhatsApp atau Email resmi dianggap sebagai bukti kesepakatan yang sah terkait fitur dan biaya proyek."
        },
        {
            title: "2. Alur Pembayaran & DP",
            content: "Setiap proyek pembuatan website wajib menyertakan Down Payment (DP) sebesar 50% sebelum pengerjaan dimulai. Sisa pelunasan dilakukan setelah website selesai di-review (tahap staging) dan sebelum penyerahan akses penuh (Go Live)."
        },
        {
            title: "3. Kebijakan Revisi",
            content: "Kami memberikan jatah revisi sesuai paket yang dipilih (umumnya 2-3 kali). Revisi mencakup perubahan minor seperti teks, warna, atau posisi elemen. Penambahan fitur baru di luar kesepakatan awal akan dikenakan biaya tambahan."
        },
        {
            title: "4. Hak Cipta & Kepemilikan",
            content: "Setelah pelunasan, hak milik konten website sepenuhnya menjadi milik Anda. Namun, DND Digital berhak mencantumkan link 'Built by DND Digital' di footer website dan menggunakan tampilan website Anda sebagai portofolio pameran kami."
        },
        {
            title: "5. Konten & Materi Website",
            content: "Klien bertanggung jawab penuh atas keaslian teks, gambar, dan video yang diberikan. DND Digital tidak bertanggung jawab jika terjadi tuntutan hak cipta dari pihak ketiga atas materi yang disediakan oleh klien."
        },
        {
            title: "6. Hosting & Domain",
            content: "Untuk paket yang menyertakan gratis hosting/domain 1 tahun, tanggung jawab perpanjangan di tahun berikutnya ada pada klien. Kelalaian perpanjangan yang menyebabkan website mati atau domain hilang bukan merupakan tanggung jawab kami."
        },
        {
            title: "7. Pembatalan Proyek",
            content: "Jika proyek dibatalkan sepihak oleh klien di tengah pengerjaan, uang DP yang telah masuk tidak dapat dikembalikan dengan alasan apapun sebagai kompensasi waktu pengerjaan yang sudah berjalan."
        },
        {
            title: "8. Batasan Dukungan (Support)",
            content: "Dukungan teknis gratis (bug fixing) berlaku selama 3 bulan setelah proyek selesai. Dukungan ini tidak mencakup penambahan fitur baru atau kerusakan yang disebabkan oleh modifikasi kode yang dilakukan sendiri oleh klien."
        }
    ];

    return (
        <div className="pt-40 pb-24 px-6 max-w-4xl mx-auto selection:bg-indigo-500/30">
            {/* Header */}
            <div className="text-center mb-16">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-indigo-500/30 bg-indigo-500/5 text-indigo-400 text-[10px] font-bold uppercase tracking-widest mb-4">
                    <Scale className="w-3 h-3" /> Legal & Policy
                </div>
                <h1 className="text-4xl md:text-6xl font-black text-white mb-6 tracking-tighter uppercase italic">
                    Aturan <span className="text-indigo-500">Main.</span>
                </h1>
                <p className="text-slate-500 text-sm font-medium">
                    Terakhir diperbarui: 9 Maret 2026 • Versi 2.0 (DND Digital)
                </p>
            </div>

            {/* Content Container */}
            <div className="bg-slate-900/40 border border-slate-800 rounded-[2.5rem] p-8 md:p-16 shadow-2xl relative overflow-hidden">
                {/* Decorative background circle */}
                <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/5 blur-[100px] -z-10" />

                <div className="prose prose-invert max-w-none">
                    <p className="text-slate-400 text-base leading-relaxed mb-12 italic border-b border-slate-800 pb-10">
                        "Halo! Biar kerja sama kita enak dan gak ada salah paham di kemudian hari, tolong baca sebentar ya aturan main di DND Digital. Dengan memesan jasa kami, berarti kamu setuju dengan poin-poin di bawah ini."
                    </p>

                    <div className="grid gap-12">
                        {sections.map((s, i) => (
                            <div key={i} className="group relative">
                                <h3 className="text-white font-black mb-4 text-xl flex items-center gap-3 group-hover:text-indigo-400 transition-colors uppercase tracking-tight">
                                    <span className="text-indigo-500/30 text-2xl">0{i + 1}</span> 
                                    {s.title}
                                </h3>
                                <div className="pl-12">
                                    <p className="text-slate-400 text-sm md:text-base leading-relaxed font-medium">
                                        {s.content}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Contact Footer */}
                <div className="mt-20 pt-10 border-t border-slate-800 flex flex-col md:flex-row items-center justify-between gap-6 text-center md:text-left">
                    <div>
                        <h4 className="text-white font-bold mb-2 flex items-center justify-center md:justify-start gap-2">
                            <HelpCircle className="w-4 h-4 text-indigo-500" /> Ada pertanyaan?
                        </h4>
                        <p className="text-slate-500 text-sm">
                            Kalau ada poin yang kurang jelas, mending kita obrolin dulu di WhatsApp.
                        </p>
                    </div>
                    <a 
                        href="https://wa.me/6287700991538" 
                        className="bg-indigo-600 hover:bg-indigo-500 text-white px-8 py-3 rounded-2xl font-black text-xs uppercase tracking-widest transition-all"
                    >
                        Tanya Admin
                    </a>
                </div>
            </div>

            <div className="mt-12 text-center">
                <p className="text-slate-700 text-[10px] font-bold uppercase tracking-[0.4em]">
                    DND Digital Agency • Professional Web Development
                </p>
            </div>
        </div>
    );
}