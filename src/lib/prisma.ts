import { PrismaClient } from "@prisma/client"
import { PrismaPg } from "@prisma/adapter-pg"
import { Pool } from "pg"

const globalForPrisma = globalThis as unknown as {
    prisma?: PrismaClient
    pool?: Pool
}

// ✅ pakai DATABASE_URL (Vercel Postgres/Neon)
const connectionString = process.env.DATABASE_URL
if (!connectionString) {
    throw new Error("DATABASE_URL is missing")
}

// ✅ Pool global biar gak bikin koneksi kebanyakan pas dev hot reload
const pool =
    globalForPrisma.pool ??
    new Pool({
        connectionString,
        // Neon/Vercel biasanya butuh SSL
        ssl: { rejectUnauthorized: false },
    })

if (process.env.NODE_ENV !== "production") {
    globalForPrisma.pool = pool
}

const adapter = new PrismaPg(pool)

export const prisma =
    globalForPrisma.prisma ??
    new PrismaClient({
        adapter,
        log: ["error", "warn"],
    })

if (process.env.NODE_ENV !== "production") {
    globalForPrisma.prisma = prisma
}