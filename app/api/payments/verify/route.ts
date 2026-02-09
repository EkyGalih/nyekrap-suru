import { db } from "@/src/lib/db"
import { NextResponse } from "next/server"

export async function POST(req: Request) {
    const { token, deviceId } = await req.json()

    if (!token || !deviceId) {
        return NextResponse.json({ premium: false })
    }

    const found = await db.query(`SELECT * FROM premium_tokens WHERE token=$1`, [token])
    if (found.rowCount === 0) return NextResponse.json({ premium: false })

    const data = found.rows[0]
    const expired = new Date(data.expires_at) < new Date()
    if (expired) return NextResponse.json({ premium: false, expires_at: data.expires_at })

    // pastikan device ini memang punya session aktif
    const sess = await db.query(
        `SELECT 1 FROM token_sessions WHERE token=$1 AND device_id=$2 LIMIT 1`,
        [token, deviceId]
    )
    if (sess.rowCount === 0) return NextResponse.json({ premium: false })

    // refresh last_active
    await db.query(
        `UPDATE token_sessions SET last_active=now() WHERE token=$1 AND device_id=$2`,
        [token, deviceId]
    )

    return NextResponse.json({ premium: true, expires_at: data.expires_at })
}