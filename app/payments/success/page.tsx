"use client"

import { useEffect, useState } from "react"
import { CheckCircle2, Copy, Loader2, Wifi, ClipboardCheck } from "lucide-react"

export default function HotspotSuccessPage() {
    const [data, setData] = useState<any>(null)
    const [error, setError] = useState("")
    const [copied, setCopied] = useState(false)
    const [rechecking, setRechecking] = useState(false)

    useEffect(() => {
        const sp = new URLSearchParams(window.location.search)
        const merchantRef = sp.get("merchant_ref")

        if (!merchantRef) {
            setError("ID Pesanan (merchant_ref) tidak ditemukan")
            return
        }

        const iv = setInterval(async () => {
            try {
                const res = await fetch("/api/payments/status", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ merchant_ref: merchantRef })
                })

                const json = await res.json()

                if (!json.success) {
                    setError(json.error)
                    clearInterval(iv)
                    return
                }

                setData(json.data)

                // Stop polling jika voucher sudah terbit atau status final
                if (
                    json.data.token_issued ||
                    ["FAILED", "EXPIRED", "REFUND", "PAID"].includes(json.data.status)
                ) {
                    // Jika status sudah PAID tapi token belum muncul, tetap tunggu sebentar
                    if (json.data.token_issued) clearInterval(iv)
                }
            } catch {
                // Retry otomatis
            }
        }, 3000)

        return () => clearInterval(iv)
    }, [])

    const copyVoucher = () => {
        if (data?.token_issued) {
            navigator.clipboard.writeText(data.token_issued)
            setCopied(true)
            setTimeout(() => setCopied(false), 2000)
        }
    }

    if (error) {
        return (
            <div className="min-h-screen bg-zinc-950 flex items-center justify-center p-6">
                <div className="bg-red-500/10 border border-red-500/20 p-6 rounded-2xl text-red-500 text-center max-w-sm">
                    <p className="font-bold mb-2">Terjadi Kesalahan</p>
                    <p className="text-sm">{error}</p>
                </div>
            </div>
        )
    }

    const manualRecheck = async () => {
        if (!data?.merchant_ref) return

        setRechecking(true)
        setError("")

        try {
            const res = await fetch("/api/payments/recheck", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    merchant_ref: data.merchant_ref
                })
            })

            const json = await res.json()

            if (!json.success) {
                setError(json.error || "Gagal cek ulang pembayaran")
                return
            }

            // update data agar UI langsung refresh
            setData((prev: any) => ({
                ...prev,
                status: json.status || prev.status,
                token_issued: json.token || prev.token_issued
            }))

        } catch {
            setError("Tidak dapat menghubungi server recheck")
        } finally {
            setRechecking(false)
        }
    }

    return (
        <main className="min-h-screen bg-zinc-950 text-white flex items-center justify-center p-6">
            <div className="max-w-md w-full bg-zinc-900 border border-zinc-800 rounded-[2.5rem] p-8 text-center shadow-2xl">

                {!data && (
                    <div className="py-10">
                        <div className="relative mx-auto w-16 h-16 mb-6">
                            <Loader2 className="w-16 h-16 animate-spin text-indigo-500" />
                            <Wifi className="absolute inset-0 m-auto w-6 h-6 text-indigo-400" />
                        </div>
                        <h2 className="text-xl font-bold mb-2">Memproses Pembayaran</h2>
                        <p className="text-sm text-zinc-400">
                            Mohon tunggu, kami sedang memverifikasi transaksi Anda...
                        </p>
                    </div>
                )}

                {data && (
                    <>
                        <div className="mb-6">
                            <div className="bg-emerald-500/10 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4 border border-emerald-500/20">
                                <CheckCircle2 className="text-emerald-500" size={40} />
                            </div>
                            <h1 className="text-2xl font-black uppercase tracking-tight">
                                {data.status === "PAID" || data.token_issued ? "Pembayaran Berhasil!" : data.status}
                            </h1>
                            <p className="text-zinc-500 text-sm mt-1">Ref: {data.merchant_ref || "#INV-NET"}</p>
                        </div>

                        {!data.token_issued && (
                            <div className="mt-4 space-y-4">
                                <div className="bg-indigo-500/5 border border-indigo-500/10 rounded-2xl p-4">
                                    <p className="text-sm text-indigo-300">
                                        Sistem sedang mengaktifkan voucher Anda. <br />
                                        Halaman akan diperbarui otomatis.
                                    </p>
                                </div>

                                <button
                                    onClick={manualRecheck}
                                    disabled={rechecking}
                                    className="w-full py-3 rounded-xl border border-zinc-700 bg-zinc-900 hover:bg-zinc-800 text-sm font-bold transition disabled:opacity-50"
                                >
                                    {rechecking ? "Mengecek Ulang..." : "Cek Ulang Pembayaran"}
                                </button>
                            </div>
                        )}

                        {data.token_issued && (
                            <div className="mt-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                                <p className="text-[10px] uppercase tracking-[0.2em] text-zinc-500 font-bold mb-3">
                                    Kode Voucher Hotspot Anda
                                </p>

                                <div className="bg-zinc-950 border-2 border-dashed border-zinc-700 rounded-2xl p-6 relative group">
                                    <span className="font-mono text-3xl font-black tracking-[0.3em] text-indigo-400">
                                        {data.token_issued}
                                    </span>
                                </div>

                                <button
                                    onClick={copyVoucher}
                                    className={`mt-6 w-full py-4 rounded-2xl flex items-center justify-center gap-2 font-bold transition-all ${copied ? "bg-emerald-600" : "bg-indigo-600 hover:bg-indigo-500 active:scale-95"
                                        }`}
                                >
                                    {copied ? (
                                        <><ClipboardCheck size={18} /> Tersalin ke Clipboard</>
                                    ) : (
                                        <><Copy size={18} /> Salin Kode Voucher</>
                                    )}
                                </button>

                                <div className="mt-8 p-4 bg-zinc-800/50 rounded-xl text-left border border-zinc-700/50">
                                    <h4 className="text-xs font-bold text-zinc-300 mb-2 uppercase tracking-wide">Cara Menggunakan:</h4>
                                    <ol className="text-[11px] text-zinc-400 space-y-1.5 list-decimal list-inside">
                                        <li>Hubungkan perangkat ke WiFi <span className="text-indigo-400 font-bold">DND NET</span></li>
                                        <li>Tunggu halaman login muncul otomatis </li>
                                        <li>Masukkan Kode Voucher di atas </li>
                                        <li>Klik Login dan selamat berinternet!</li>
                                    </ol>
                                </div>

                                <p className="mt-6 text-[10px] text-zinc-500">
                                    Sesuai <a href="/terms" className="underline">Syarat & Ketentuan</a>, voucher yang sudah terbit tidak dapat dibatalkan atau diuangkan.
                                </p>
                            </div>
                        )}
                    </>
                )}

            </div>
        </main>
    )
}