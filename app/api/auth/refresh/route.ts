import { userRepo } from "@/repositories/user.repo";
import { verifyRefreshToken, generateAccessToken } from "@/lib/utils/auth-utils";
import { AuthService } from "@/lib/services/auth.service";
import { handleApiError, AuthError } from "@/lib/utils/error-handler";
import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function POST(req: Request) {
    try {
        const refreshToken = await AuthService.getRefreshToken();

        if (!refreshToken) {
            throw new AuthError("Refresh token missing");
        }

        // Verify token
        const payload = await verifyRefreshToken(refreshToken);
        if (!payload) {
            throw new AuthError("Invalid refresh token");
        }

        // Check DB for token
        const dbToken = await userRepo.findRefreshToken(refreshToken);

        if (!dbToken) {
            throw new AuthError("Token expired or revoked");
        }

        // Generate new access token
        const accessToken = await generateAccessToken({ userId: payload.userId });

        // Set new access token in cookie
        const cookieStore = await cookies();
        cookieStore.set("auth-token", accessToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
            path: "/",
            maxAge: 60 * 15,
        });

        return NextResponse.json({ message: "Token refreshed successfully" });
    } catch (error) {
        return handleApiError(error);
    }
}
