import { userRepo } from "@/repositories/user.repo";
import { AuthService } from "@/lib/services/auth.service";
import { handleApiError } from "@/lib/utils/error-handler";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
    try {
        const refreshToken = await AuthService.getRefreshToken();

        if (refreshToken) {
            await userRepo.deleteRefreshToken(refreshToken);
        }

        // Clear cookies
        await AuthService.clearAuthCookies();

        return NextResponse.json({ message: "Logged out successfully" });
    } catch (error) {
        return handleApiError(error);
    }
}
