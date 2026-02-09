import { NextResponse } from "next/server"
import { db } from "@/src/lib/db"

export async function POST(req: Request) {
    const { token, deviceId } = await req.json()

    if (!token || !deviceId) {
        return NextResponse.json(
            { success: false, error: "Token & device wajib" },
            { status: 400 }
        )
    }

    // 1. Token valid?
    const result = await db.query(
        `SELECT * FROM premium_tokens WHERE token=$1`,
        [token]
    )

    if (result.rowCount === 0) {
        return NextResponse.json({
            success: false,
            error: "Token tidak ditemukan",
        })
    }

    const data = result.rows[0]

    // 2. Token expired?
    if (new Date(data.expires_at) < new Date()) {
        return NextResponse.json({
            success: false,
            error: "Token sudah expired",
        })
    }

    // 3. Hitung device aktif
    const sessionCount = await db.query(
        `SELECT COUNT(*) FROM token_sessions WHERE token=$1`,
        [token]
    )

    const activeDevices = Number(sessionCount.rows[0].count)

    if (activeDevices >= data.max_devices) {
        return NextResponse.json({
            success: false,
            error: "Token sudah dipakai di device lain (max 2)",
        })
    }

    // 4. Insert session device
    await db.query(
        `INSERT INTO token_sessions(token, device_id)
     VALUES ($1,$2)
     ON CONFLICT DO NOTHING`,
        [token, deviceId]
    )

    await db.query(
        `DELETE FROM token_sessions
   WHERE token=$1 AND last_active < NOW() - INTERVAL '7 days'`,
        [token]
    )

    return NextResponse.json({
        success: true,
        expires_at: data.expires_at,
    })
}