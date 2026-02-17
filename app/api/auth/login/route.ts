import { userRepo } from "@/repositories/user.repo";
import { comparePassword, generateAccessToken, generateRefreshToken } from "@/src/lib/auth-utils";
import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function POST(req: Request) {
    try {
        const { email, password } = await req.json();

        if (!email || !password) {
            return NextResponse.json({ error: "Email and password are required" }, { status: 400 });
        }

        // Find user
        const user = await userRepo.findByEmail(email);

        if (!user || !(await comparePassword(password, user.passwordHash || ""))) {
            return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
        }

        // Generate tokens
        const accessToken = await generateAccessToken({ userId: user.id });
        const refreshToken = await generateRefreshToken({ userId: user.id });

        // Store refresh token in DB
        await userRepo.storeRefreshToken({
            userId: user.id,
            token: refreshToken,
            expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        });

        // Set refresh token in cookie
        const cookieStore = await cookies();
        cookieStore.set("refreshToken", refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
            path: "/",
            maxAge: 60 * 60 * 24 * 7,
        });

        return NextResponse.json({
            user: {
                id: user.id,
                email: user.email,
                name: user.name,
            },
            accessToken,
        });
    } catch (error) {
        console.error("Login error:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}
