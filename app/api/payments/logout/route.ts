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

    await db.query(
        `DELETE FROM token_sessions
     WHERE token=$1 AND device_id=$2`,
        [token, deviceId]
    )

    return NextResponse.json({
        success: true,
        message: "Logout berhasil, session dihapus",
    })
}