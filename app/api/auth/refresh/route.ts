import { userRepo } from "@/repositories/user.repo";
import { verifyRefreshToken, generateAccessToken } from "@/lib/utils/auth-utils";
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

        // Set new access token in cookie
        cookieStore.set("auth-token", accessToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
            path: "/",
            maxAge: 60 * 15,
        });

        return NextResponse.json({ message: "Token refreshed successfully" });
    } catch (error) {
        console.error("Refresh error:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}
