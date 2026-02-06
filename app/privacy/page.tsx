export default function PrivacyPage() {
    return (
        <div className="pt-32 pb-20 px-6 max-w-4xl mx-auto">
            <h1 className="text-4xl font-bold text-white mb-6">Kebijakan Privasi</h1>
            <div className="prose prose-invert max-w-none text-slate-400 space-y-6">
                <p>
                    Privasi Anda adalah prioritas kami. Halaman ini menjelaskan bagaimana DND Net mengelola data Anda.
                </p>
                <section>
                    <h2 className="text-xl font-bold text-white">Data yang Kami Kumpulkan</h2>
                    <p className="text-sm italic">Nomor WhatsApp, Alamat MAC Perangkat, dan Riwayat Transaksi Pembayaran.</p>
                </section>
                <section>
                    <h2 className="text-xl font-bold text-white">Keamanan Pembayaran</h2>
                    <p className="text-sm">
                        Semua transaksi pembayaran diproses melalui gateway **DOKU**. Kami tidak menyimpan informasi sensitif seperti nomor kartu atau PIN pengguna di server kami.
                    </p>
                </section>
                <p className="text-xs text-slate-500 mt-10">Terakhir diperbarui: 6 Februari 2026</p>
            </div>
        </div>
    );
}