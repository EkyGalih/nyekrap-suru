import { NextResponse } from "next/server"
import crypto from "crypto"
import { db } from "@/src/lib/db"

export async function POST(req: Request) {
    const body = await req.json()

    const {
        order_id,
        transaction_status,
        gross_amount,
        signature_key
    } = body

    // =========================
    // 1. VALIDASI SIGNATURE
    // =========================
    const serverKey = process.env.MIDTRANS_SERVER_KEY!
    const expectedSignature = crypto
        .createHash("sha512")
        .update(order_id + body.status_code + gross_amount + serverKey)
        .digest("hex")

    if (signature_key !== expectedSignature) {
        return NextResponse.json({ error: "Invalid signature" }, { status: 403 })
    }

    // =========================
    // 2. HANDLE STATUS
    // =========================
    if (transaction_status === "settlement") {
        const payment = await db.query(
            `SELECT * FROM payment_orders WHERE merchant_ref=$1`,
            [order_id]
        )

        if (payment.rowCount === 0) {
            return NextResponse.json({ error: "Order not found" })
        }

        if (payment.rows[0].status === "PAID") {
            return NextResponse.json({ ok: true }) // idempotent
        }

        // generate token premium
        const token =
            "ML-" + crypto.randomBytes(4).toString("hex").toUpperCase()

        await db.query(
            `UPDATE payment_orders
       SET status='PAID',
           token_issued=$1,
           paid_at=now()
       WHERE merchant_ref=$2`,
            [token, order_id]
        )
    }

    return NextResponse.json({ received: true })
}