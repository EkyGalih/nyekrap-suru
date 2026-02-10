"use client";

import dynamic from "next/dynamic";
import "swagger-ui-react/swagger-ui.css";

const SwaggerUI = dynamic(() => import("swagger-ui-react"), {
    ssr: false,
    loading: () => <div className="p-10 text-center">Memuat Dokumentasi API...</div>
});

export default function ApiDocs() {
    return (
        // Tambahkan padding top (pt-24) agar tidak tertutup navbar fixed
        // Gunakan bg-white atau sesuaikan tema karena Swagger UI aslinya bertema terang
        <div className="pt-24 min-h-screen bg-white">
            <style jsx global>{`
                /* Menghindari tabrakan warna teks slate-200 dari layout */
                .swagger-ui {
                    color: #3b4151 !important;
                }
                .swagger-ui .info .title, 
                .swagger-ui .opblock-tag,
                .swagger-ui section.models h4 {
                    color: #3b4151 !important;
                }
                /* Pastikan tombol "Try it out" terlihat jelas */
                .swagger-ui .btn {
                    color: #3b4151 !important;
                }
            `}</style>

            <SwaggerUI
                url="/api/swagger"
                docExpansion="none"
            />
        </div>
    );
}