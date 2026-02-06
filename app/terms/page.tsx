export default function TermsPage() {
    const sections = [
        { title: "1. Layanan Hotspot", content: "Voucher bersifat sekali pakai dan durasi mulai dihitung sejak login pertama kali. Masa aktif tidak dapat dijeda." },
        { title: "2. Tanggung Jawab Pengguna", content: "Dilarang menggunakan jaringan untuk aktivitas ilegal (Hacking, Judi Online, Pornografi). Pelanggaran akan berakibat pada pemblokiran perangkat secara permanen." },
        { title: "3. Refund", content: "Voucher yang sudah dibeli dan kode sudah diterbitkan tidak dapat dibatalkan atau diuangkan kembali." },
        { title: "4. Gangguan Layanan", content: "DND Net berhak melakukan pemeliharaan jaringan secara berkala. Gangguan akibat faktor alam di luar kendali kami bukan tanggung jawab pengelola." }
    ];

    return (
        <div className="pt-32 pb-20 px-6 max-w-4xl mx-auto">
            <h1 className="text-4xl font-bold text-white mb-8 text-center text-indigo-400 font-mono">Terms & Conditions</h1>
            <div className="space-y-8 bg-slate-900/50 p-8 rounded-2xl border border-slate-800">
                {sections.map((s, i) => (
                    <div key={i}>
                        <h3 className="text-white font-bold mb-2">{s.title}</h3>
                        <p className="text-slate-400 text-sm leading-relaxed">{s.content}</p>
                    </div>
                ))}
            </div>
        </div>
    );
}