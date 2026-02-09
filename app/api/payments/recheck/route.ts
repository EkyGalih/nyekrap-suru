import { NextResponse } from "next/server"
import crypto from "crypto"
import { db } from "@/src/lib/db"

export async function POST(req: Request) {
    try {
        const { merchant_ref } = await req.json()

        if (!merchant_ref) {
            return NextResponse.json({
                success: false,
                error: "merchant_ref wajib"
            })
        }

        // ======================
        // 1. Ambil order
        // ======================
        const found = await db.query(
            `SELECT * FROM payment_orders WHERE merchant_ref=$1`,
            [merchant_ref]
        )

        if (found.rowCount === 0) {
            return NextResponse.json({
                success: false,
                error: "Pesanan tidak ditemukan"
            })
        }

        const order = found.rows[0]

        // ======================
        // 2. Kalau sudah ada token → STOP
        // ======================
        if (order.token_issued) {
            return NextResponse.json({
                success: true,
                status: "PAID",
                token: order.token_issued
            })
        }

        // ======================
        // 3. Rate limit recheck
        // ======================
        if (order.recheck_count >= 5) {
            return NextResponse.json({
                success: false,
                error: "Batas cek ulang tercapai. Hubungi admin."
            })
        }

        if (order.last_recheck_at) {
            const diff = Date.now() - new Date(order.last_recheck_at).getTime()
            if (diff < 15_000) {
                return NextResponse.json({
                    success: false,
                    error: "Tunggu 15 detik sebelum cek ulang"
                })
            }
        }

        // ======================
        // 4. Cek ke Midtrans
        // ======================
        const midtransRes = await fetch(
            `https://api.sandbox.midtrans.com/v2/${merchant_ref}/status`,
            {
                headers: {
                    Authorization:
                        "Basic " +
                        Buffer.from(process.env.MIDTRANS_SERVER_KEY + ":").toString("base64"),
                },
            }
        )

        const midtrans = await midtransRes.json()

        // update recheck counter
        await db.query(
            `UPDATE payment_orders
             SET recheck_count = recheck_count + 1,
                 last_recheck_at = now()
             WHERE merchant_ref=$1`,
            [merchant_ref]
        )

        // ======================
        // 5. Kalau BELUM PAID
        // ======================
        if (midtrans.transaction_status !== "settlement") {
            return NextResponse.json({
                success: true,
                status: midtrans.transaction_status
            })
        }

        // ======================
        // 6. Generate token (1x)
        // ======================
        const token =
            "VC-" + crypto.randomBytes(4).toString("hex").toUpperCase()

        await db.query(
            `UPDATE payment_orders
             SET status='PAID',
                 token_issued=$1,
                 paid_at=now()
             WHERE merchant_ref=$2 AND token_issued IS NULL`,
            [token, merchant_ref]
        )

        return NextResponse.json({
            success: true,
            status: "PAID",
            token
        })

    } catch (err) {
        console.error("RECHECK ERROR:", err)
        return NextResponse.json({
            success: false,
            error: "Server error recheck"
        })
    }
}