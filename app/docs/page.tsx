import Link from "next/link";

export default function Home() {
    return (
        <main className="min-h-screen flex items-center justify-center bg-zinc-50 dark:bg-black px-6">
            <div className="w-full max-w-2xl rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 p-10 shadow-sm">
                {/* TITLE */}
                <h1 className="text-3xl font-bold text-zinc-900 dark:text-white">
                    🌐 Nyekrap Suru API
                </h1>

                {/* DESCRIPTION */}
                <p className="mt-4 text-zinc-600 dark:text-zinc-400 leading-relaxed">
                    Project ini adalah REST API berbasis{" "}
                    <span className="font-semibold text-zinc-900 dark:text-white">
                        Next.js App Router
                    </span>{" "}
                    yang menyediakan data hasil scraping dari berbagai sumber hiburan seperti
                    drama, anime, komik, dan konten lainnya.
                </p>

                {/* MODULES */}
                <div className="mt-6 space-y-2 text-sm text-zinc-700 dark:text-zinc-300">
                    <p>🎬 Drama Korea & Drama China</p>
                    <p>🎥 Movie & Series</p>
                    <p>📺 Anime & Episode Terbaru</p>
                    <p>📚 Manga / Komik</p>
                    <p>🔍 Search & Filter berdasarkan genre</p>
                    <p>📄 Detail konten lengkap via endpoint</p>
                </div>

                {/* BUTTONS */}
                <div className="mt-8 flex flex-col sm:flex-row gap-4">
                    {/* Docs */}
                    <Link
                        href="/api/docs"
                        className="w-full sm:w-auto px-6 py-3 rounded-xl bg-black text-white dark:bg-white dark:text-black font-semibold text-center hover:opacity-90 transition"
                    >
                        📖 API Documentation
                    </Link>

                    {/* Example Endpoint */}
                    <Link
                        href="/api/drakorkita/homepage"
                        className="w-full sm:w-auto px-6 py-3 rounded-xl border border-zinc-300 dark:border-zinc-700 text-zinc-800 dark:text-zinc-200 font-semibold text-center hover:bg-zinc-100 dark:hover:bg-zinc-900 transition"
                    >
                        🚀 Try Example API
                    </Link>
                </div>

                {/* FOOTER */}
                <p className="mt-10 text-xs text-zinc-500 dark:text-zinc-600">
                    Modular scraping API — ready for Drama, Anime, Manga, and more.
                </p>
            </div>
        </main>
    );
}