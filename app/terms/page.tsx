import React from 'react';

export default function TermsPage() {
    const sections = [
        {
            title: "1. Syarat Penggunaan (Conditions of Use)",
            content: "Layanan DND COMPUTER ditawarkan kepada Anda dengan syarat Anda menerima semua syarat, ketentuan, dan pemberitahuan yang tercantum di sini tanpa pengecualian. Penggunaan Situs ini merupakan persetujuan Anda terhadap seluruh ketentuan tersebut[cite: 13, 15, 76]."
        },
        {
            title: "2. Pendaftaran Akun (Sign Up)",
            content: "Anda bertanggung jawab penuh atas kerahasiaan username dan password serta segala aktivitas yang terjadi di bawah akun Anda. Anda wajib memberikan informasi yang akurat dan terkini saat melakukan registrasi[cite: 29, 93]. Penyalahgunaan atau pemalsuan identitas dapat mengakibatkan pemutusan layanan secara sepihak[cite: 34, 98]."
        },
        {
            title: "3. Ketentuan Layanan & Voucher",
            content: "Voucher internet bersifat sekali pakai dan durasi masa aktif dihitung sejak aktivasi pertama kali dilakukan. Kami berhak melakukan penyesuaian harga atau membatalkan pesanan jika terjadi kesalahan harga pada sistem[cite: 19, 21, 136]."
        },
        {
            title: "4. Lisensi & Hak Kekayaan Intelektual",
            content: "DND COMPUTER memberikan hak non-eksklusif dan non-transferabel bagi Anda untuk menggunakan platform layanan hanya untuk keperluan internal selama masa perjanjian[cite: 139, 140]. Anda dilarang melakukan modifikasi, dekompilasi, atau reverse engineer terhadap komponen perangkat lunak yang disediakan[cite: 141]."
        },
        {
            title: "5. Kebijakan Pengembalian (Returns & Refund)",
            content: "Voucher digital yang kodenya telah diterbitkan tidak dapat dibatalkan atau diuangkan kembali[cite: 48]. Untuk produk fisik atau jasa teknisi, keluhan harus diajukan dalam waktu maksimal 7 hari sejak tanggal diterima dalam kondisi asli[cite: 45, 46]. Biaya pengiriman dan penanganan tidak dapat dikembalikan[cite: 49]."
        },
        {
            title: "6. Batasan Tanggung Jawab (Disclaimer)",
            content: "Kami tidak bertanggung jawab atas kerugian pihak ketiga yang timbul akibat akses atau penggunaan layanan oleh Anda[cite: 55, 109]. Kami tidak menjamin bahwa informasi pada situs selalu akurat, terkini, atau bebas dari kesalahan teknis[cite: 57, 112]."
        },
        {
            title: "7. Pemutusan Layanan (Termination)",
            content: "DND COMPUTER berhak menghentikan layanan segera jika Anda melanggar kewajiban dalam perjanjian ini, terlibat dalam aktivitas ilegal, atau membahayakan integritas platform layanan kami[cite: 162, 163]."
        },
        {
            title: "8. Hukum yang Berlaku",
            content: "Syarat dan Ketentuan ini diatur dan tunduk pada hukum yang berlaku di negara Republik Indonesia[cite: 64, 116, 190]."
        }
    ];

    return (
        <div className="pt-32 pb-20 px-6 max-w-4xl mx-auto selection:bg-indigo-500/30">
            <div className="text-center mb-12">
                <h1 className="text-4xl font-bold text-white mb-4 font-mono text-indigo-400">Terms & Conditions</h1>
                <p className="text-slate-500 text-sm italic">Terakhir diperbarui: 6 Februari 2026</p>
            </div>

            <div className="space-y-8 bg-slate-900/50 p-8 md:p-12 rounded-3xl border border-slate-800 shadow-2xl">
                <p className="text-slate-300 text-sm leading-relaxed border-b border-slate-800 pb-6 mb-6">
                    Harap baca syarat dan ketentuan ini dengan teliti. Dengan terus menggunakan layanan DND COMPUTER, Anda dianggap setuju untuk terikat oleh modifikasi, perubahan, atau pembaruan di masa mendatang tanpa pemberitahuan sebelumnya[cite: 15, 22, 137].
                </p>

                {sections.map((s, i) => (
                    <div key={i} className="group">
                        <h3 className="text-white font-bold mb-3 text-lg flex items-center gap-2 group-hover:text-indigo-400 transition-colors">
                            <span className="text-indigo-500/50">#</span> {s.title}
                        </h3>
                        <p className="text-slate-400 text-sm leading-relaxed pl-6 border-l-2 border-slate-800 group-hover:border-indigo-500/50 transition-all">
                            {s.content}
                        </p>
                    </div>
                ))}

                <div className="mt-12 pt-8 border-t border-slate-800">
                    <h4 className="text-white font-bold mb-4">Pertanyaan & Umpan Balik</h4>
                    <p className="text-slate-400 text-sm mb-4">
                        Kami menerima pertanyaan, komentar, dan kekhawatiran Anda mengenai privasi atau informasi apa pun yang dikumpulkan[cite: 66, 118].
                    </p>
                    <p className="text-slate-400 text-sm">
                        Silakan kirimkan masukan Anda melalui halaman <a href="/contact" className="text-indigo-400 hover:underline">Hubungi Kami</a>[cite: 67, 193].
                    </p>
                </div>
            </div>

            <div className="mt-8 text-center text-slate-600 text-xs uppercase tracking-widest">
                DND COMPUTER is a brand by UD DND Computer.
            </div>
        </div>
    );
}