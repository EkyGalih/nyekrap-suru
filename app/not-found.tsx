import Link from "next/link";

export default function NotFound() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-zinc-50 dark:bg-black px-6">
      <div className="w-full max-w-xl rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 p-10 text-center shadow-sm">
        
        {/* ICON */}
        <div className="text-6xl mb-4">😵‍💫</div>

        {/* TITLE */}
        <h1 className="text-3xl font-bold text-zinc-900 dark:text-white">
          Halaman Tidak Ditemukan
        </h1>

        {/* DESCRIPTION */}
        <p className="mt-4 text-zinc-600 dark:text-zinc-400 leading-relaxed">
          Ups! Sepertinya kamu tersesat.  
          Halaman atau endpoint yang kamu cari tidak tersedia di{" "}
          <span className="font-semibold text-zinc-900 dark:text-white">
            Nyekrap Suru API
          </span>.
        </p>

        {/* BUTTONS */}
        <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
          {/* BACK HOME */}
          <Link
            href="/"
            className="px-6 py-3 rounded-xl bg-black text-white dark:bg-white dark:text-black font-semibold hover:opacity-90 transition"
          >
            🏠 Kembali ke Home
          </Link>

          {/* API DOCS */}
          <Link
            href="/api/docs"
            className="px-6 py-3 rounded-xl border border-zinc-300 dark:border-zinc-700 text-zinc-800 dark:text-zinc-200 font-semibold hover:bg-zinc-100 dark:hover:bg-zinc-900 transition"
          >
            📖 Lihat Dokumentasi API
          </Link>
        </div>

        {/* FOOTER */}
        <p className="mt-10 text-xs text-zinc-500 dark:text-zinc-600">
          Error 404 — Nyekrap Suru Scraping API
        </p>
      </div>
    </main>
  );
}