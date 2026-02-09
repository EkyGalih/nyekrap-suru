import { NextResponse } from "next/server"
import { db } from "@/src/lib/db"

export async function POST(req: Request) {
    const { merchant_ref } = await req.json()

    if (!merchant_ref) {
        return NextResponse.json({
            success: false,
            error: "merchant_ref wajib"
        })
    }

    const result = await db.query(
        `SELECT
        merchant_ref,
        status,
        token_issued,
        paid_at
     FROM payment_orders
     WHERE merchant_ref=$1`,
        [merchant_ref]
    )

    if (result.rowCount === 0) {
        return NextResponse.json({
            success: false,
            error: "Order tidak ditemukan"
        })
    }

    return NextResponse.json({
        success: true,
        data: result.rows[0]
    })
}