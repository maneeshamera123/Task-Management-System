import { userRepo } from "@/repositories/user.repo";
import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function POST(req: Request) {
    try {
        const cookieStore = await cookies();
        const refreshToken = cookieStore.get("refreshToken")?.value;

        if (refreshToken) {
            await userRepo.deleteRefreshToken(refreshToken);
        }

        // Clear cookies
        cookieStore.delete("refreshToken");
        cookieStore.delete("auth-token");

        return NextResponse.json({ message: "Logged out successfully" });
    } catch (error) {
        console.error("Logout error:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}
