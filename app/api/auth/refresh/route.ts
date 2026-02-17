import { userRepo } from "@/repositories/user.repo";
import { verifyRefreshToken, generateAccessToken } from "@/src/lib/auth-utils";
import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function POST(req: Request) {
    try {
        const cookieStore = await cookies();
        const refreshToken = cookieStore.get("refreshToken")?.value;

        if (!refreshToken) {
            return NextResponse.json({ error: "Refresh token missing" }, { status: 401 });
        }

        // Verify token
        const payload = await verifyRefreshToken(refreshToken);
        if (!payload) {
            return NextResponse.json({ error: "Invalid refresh token" }, { status: 401 });
        }

        // Check DB for token
        const dbToken = await userRepo.findRefreshToken(refreshToken);

        if (!dbToken) {
            return NextResponse.json({ error: "Token expired or revoked" }, { status: 401 });
        }

        // Generate new access token
        const accessToken = await generateAccessToken({ userId: payload.userId });

        return NextResponse.json({ accessToken });
    } catch (error) {
        console.error("Refresh error:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}
