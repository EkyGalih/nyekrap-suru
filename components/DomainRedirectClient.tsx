"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { RefreshCw, ArrowRight } from 'lucide-react';

interface Props {
    newDomain: string;
    oldDomain: string;
    delay: number;
}

export default function DomainRedirectClient({ newDomain, oldDomain, delay }: Props) {
    const router = useRouter();
    const [timeLeft, setTimeLeft] = useState(delay);

    useEffect(() => {
        // Lapis 2: Countdown visual dan pengalihan via JS
        const timer = setInterval(() => {
            setTimeLeft((prev) => {
                if (prev <= 1) {
                    clearInterval(timer);
                    window.location.href = `https://${newDomain}`; // Redirect paksa
                }
                return prev - 1;
            });
        }, 1000);

        return () => clearInterval(timer);
    }, [newDomain]);

    return (
        <div className="relative flex min-h-screen flex-col items-center justify-center bg-[#fafafa] p-6 text-zinc-800 overflow-hidden">
            {/* Background Decor */}
            <div className="absolute inset-0 z-0 opacity-40 pointer-events-none">
                <div className="bg-indigo-400/20 w-[500px] h-[500px] absolute -top-20 -left-20 rounded-full blur-[120px]" />
                <div className="bg-purple-400/20 w-[500px] h-[500px] absolute -bottom-20 -right-20 rounded-full blur-[120px]" />
            </div>

            <div className="relative z-10 w-full max-w-xl rounded-[3rem] border border-white bg-white/80 p-10 shadow-[0_40px_80px_-15px_rgba(0,0,0,0.05)] backdrop-blur-xl text-center">

                <div className="mb-8 flex justify-center">
                    <div className="relative">
                        <div className="absolute inset-0 bg-indigo-500 blur-2xl opacity-20 animate-pulse" />
                        <div className="relative p-5 bg-white rounded-3xl shadow-sm border border-zinc-50">
                            <RefreshCw className="h-10 w-10 text-indigo-600 animate-spin-slow" />
                        </div>
                    </div>
                </div>

                <h1 className="mb-4 text-4xl md:text-5xl font-black tracking-tighter text-zinc-900 italic uppercase leading-none">
                    Kami Telah <br /> <span className="text-indigo-600">Pindah Rumah</span>
                </h1>

                <p className="mb-10 text-zinc-500 font-medium text-sm md:text-base px-4">
                    Domain <span className="text-zinc-800 font-bold">{oldDomain}</span> sudah tidak digunakan.
                    Anda akan dialihkan secara otomatis.
                </p>

                {/* New Domain Box */}
                <div className="mb-10 p-1 bg-gradient-to-r from-indigo-100 to-purple-100 rounded-[2rem]">
                    <div className="bg-white rounded-[1.8rem] py-6 shadow-inner border border-white">
                        <span className="block text-[10px] font-black text-zinc-300 uppercase tracking-[0.3em] mb-2">New Address</span>
                        <span className="font-black text-2xl md:text-3xl text-zinc-900">{newDomain}</span>
                    </div>
                </div>

                {/* Progress & Button */}
                <div className="space-y-6">
                    <Link
                        href={`https://${newDomain}`}
                        className="group inline-flex items-center justify-center w-full rounded-2xl bg-zinc-900 px-8 py-5 text-white font-bold text-sm uppercase tracking-widest transition-all hover:bg-indigo-600 hover:shadow-2xl hover:shadow-indigo-200 active:scale-[0.98]"
                    >
                        Lanjutkan Sekarang
                        <ArrowRight className="ml-3 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                    </Link>

                    <div className="flex flex-col items-center gap-2">
                        <div className="w-full max-w-[200px] h-1 bg-zinc-100 rounded-full overflow-hidden">
                            <div
                                className="h-full bg-indigo-600 transition-all duration-1000 ease-linear"
                                style={{ width: `${(timeLeft / delay) * 100}%` }}
                            />
                        </div>
                        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400">
                            Mengarahkan dalam <span className="text-indigo-600 inline-block w-4">{timeLeft}</span> detik
                        </p>
                    </div>
                </div>
            </div>

            <style jsx global>{`
        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .animate-spin-slow {
          animation: spin-slow 12s linear infinite;
        }
      `}</style>
        </div>
    );
}