import { ShieldCheck, Users, Target } from 'lucide-react';

export default function AboutPage() {
    return (
        <div className="pt-32 pb-20 px-6 max-w-4xl mx-auto">
            <h1 className="text-4xl font-bold text-white mb-6">Tentang Kami</h1>
            <p className="text-lg text-slate-400 leading-relaxed mb-10">
                DND Net hadir sebagai solusi internet terjangkau bagi masyarakat yang membutuhkan akses stabil tanpa harus terikat kontrak mahal.
                Kami membangun infrastruktur lokal untuk memastikan warga tetap terhubung dengan dunia digital.
            </p>

            <div className="grid md:grid-cols-3 gap-6">
                {[
                    { icon: <ShieldCheck className="text-indigo-400" />, title: "Terpercaya", desc: "Ribuan voucher terjual setiap bulannya." },
                    { icon: <Users className="text-indigo-400" />, title: "Komunitas", desc: "Dari warga, oleh warga, untuk warga." },
                    { icon: <Target className="text-indigo-400" />, title: "Fokus", desc: "Stabilitas sinyal adalah prioritas utama kami." },
                ].map((item, i) => (
                    <div key={i} className="bg-slate-900 p-6 rounded-xl border border-slate-800 text-center">
                        <div className="flex justify-center mb-4">{item.icon}</div>
                        <h3 className="text-white font-bold mb-2">{item.title}</h3>
                        <p className="text-xs text-slate-500">{item.desc}</p>
                    </div>
                ))}
            </div>
        </div>
    );
}