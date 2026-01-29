import { NextRequest } from "next/server";

export function validateApiKey(req: NextRequest): boolean {
    const apiKey = req.headers.get("x-api-key");

    if (!apiKey) return false;

    return apiKey === process.env.API_KEY;
}