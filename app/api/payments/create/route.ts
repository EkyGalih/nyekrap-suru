import { NextResponse } from "next/server"
import crypto from "crypto"
import { db } from "@/src/lib/db"

export async function POST(req: Request) {
    try {
        const { packageType, amount } = await req.json()

        // ======================
        // 1. Merchant Ref (invoice kita)
        // ======================
        const merchantRef =
            "INV-" + crypto.randomBytes(6).toString("hex").toUpperCase()

        // ======================
        // 2. Simpan order UNPAID
        // ======================
        await db.query(
            `INSERT INTO payment_orders
       (merchant_ref, package, amount, status)
       VALUES ($1,$2,$3,'UNPAID')`,
            [merchantRef, packageType, amount]
        )

        // ======================
        // 3. Midtrans Snap
        // ======================
        const midtransRes = await fetch(
            "https://app.sandbox.midtrans.com/snap/v1/transactions",
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization:
                        "Basic " +
                        Buffer.from(process.env.MIDTRANS_SERVER_KEY + ":").toString("base64"),
                },
                body: JSON.stringify({
                    transaction_details: {
                        order_id: merchantRef, // 🔥 PENTING: pakai merchant_ref
                        gross_amount: amount,
                    },
                    callbacks: {
                        finish: `${process.env.NEXT_PUBLIC_BASE_URL}/premium/success?merchant_ref=${merchantRef}`,
                    },
                }),
            }
        )

        const data = await midtransRes.json()

        if (!data.redirect_url) {
            return NextResponse.json({
                success: false,
                error: "Midtrans gagal membuat transaksi",
                raw: data,
            })
        }

        // ======================
        // 4. Simpan checkout_url
        // ======================
        await db.query(
            `UPDATE payment_orders
       SET checkout_url=$1
       WHERE merchant_ref=$2`,
            [data.redirect_url, merchantRef]
        )

        return NextResponse.json({
            success: true,
            redirect_url: data.redirect_url,
            merchant_ref: merchantRef,
        })
    } catch (err) {
        console.error("PAYMENT CREATE ERROR:", err)
        return NextResponse.json({
            success: false,
            error: "Server error",
        })
    }
}